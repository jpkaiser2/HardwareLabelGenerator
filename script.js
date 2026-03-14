import { getDefaultSizeForStandard, getFastenerData } from './fastener-data.js';
import { renderScrewSVG } from './renderers/screwRenderer.js';
import { renderNutSVG } from './renderers/nutRenderer.js';
import { renderWasherSVG } from './renderers/washerRenderer.js';

const form = document.getElementById('labelForm');
const titleEl = document.getElementById('previewTitle');
const subtitleEl = document.getElementById('previewSubtitle');
const metaEl = document.getElementById('previewMeta');
const locationEl = document.getElementById('previewLocation');
const labelVisual = document.getElementById('labelVisual');
const printBtn = document.getElementById('printBtn');
const conditionalGroups = Array.from(document.querySelectorAll('.config-group[data-types]'));
const standardSelect = document.getElementById('standard');
const sizeSelect = document.getElementById('size');

const sizeLabel = document.getElementById('sizeLabel');
const lengthLabel = document.getElementById('lengthLabel');
const pitchLabel = document.getElementById('pitchLabel');

const HEAD_LABELS = {
  pan: 'Pan Head',
  socketCap: 'Socket Cap',
  flat: 'Flat Head',
  hex: 'Hex Head'
};

const DRIVE_LABELS = {
  phillips: 'Phillips',
  hex: 'Hex',
  torx: 'Torx',
  slotted: 'Slotted'
};

const END_TYPE_LABELS = {
  pointed: 'Pointed End',
  flat: 'Flat End'
};

function formatNumber(value, decimals = 2) {
  return Number(value).toFixed(decimals).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function mmToInches(mmValue) {
  return mmValue / 25.4;
}

function inchesToMm(inchValue) {
  return inchValue * 25.4;
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function getDataForCurrentStandard() {
  const standard = getValue('standard') || 'metric';
  return getFastenerData(standard);
}

function getSizeData(standard, size) {
  const dataSet = getFastenerData(standard);
  const fallback = getDefaultSizeForStandard(standard);
  return dataSet[size] || dataSet[fallback];
}

function populateSizeOptions() {
  const standard = getValue('standard') || 'metric';
  const dataSet = getDataForCurrentStandard();
  const current = sizeSelect.value;
  const defaultSize = getDefaultSizeForStandard(standard);
  const selected = dataSet[current] ? current : defaultSize;

  sizeSelect.innerHTML = Object.keys(dataSet)
    .map((sizeKey) => `<option value="${sizeKey}">${sizeKey}</option>`)
    .join('');

  sizeSelect.value = selected;
}

function updateStandardLabels() {
  const standard = getValue('standard') || 'metric';
  const pitchInput = document.getElementById('pitch');

  sizeLabel.textContent = standard === 'sae' ? 'SAE Size' : 'Metric Size';
  lengthLabel.textContent = standard === 'sae' ? 'Length (in)' : 'Length (mm)';
  pitchLabel.textContent = standard === 'sae' ? 'Threads Per Inch (TPI)' : 'Pitch (mm)';

  if (pitchInput) {
    pitchInput.step = standard === 'sae' ? '1' : '0.05';
  }
}

function getCurrentPart() {
  const standard = getValue('standard') || 'metric';
  const type = getValue('type') || 'screw';
  const size = getValue('size') || getDefaultSizeForStandard(standard);
  const sizeData = getSizeData(standard, size);
  const nutDefaults = sizeData.nut;
  const washerDefaults = sizeData.washer;
  const threadInput = Number(getValue('pitch'))
    || (standard === 'sae' ? (sizeData.threadPerInch || Math.round(25.4 / sizeData.coarsePitch)) : sizeData.coarsePitch);

  const pitch = standard === 'sae'
    ? 25.4 / Math.max(threadInput, 1)
    : threadInput;

  const lengthInput = Number(getValue('length')) || (standard === 'sae' ? 0.5 : 12);
  const lengthMm = standard === 'sae' ? inchesToMm(lengthInput) : lengthInput;

  return {
    standard,
    type,
    size,
    diameter: sizeData.diameter,
    length: lengthMm,
    lengthDisplay: lengthInput,
    lengthUnit: standard === 'sae' ? 'in' : 'mm',
    pitch,
    threadValue: threadInput,
    head: getValue('head') || 'pan',
    drive: getValue('drive') || 'phillips',
    endType: getValue('endType') || 'pointed',
    material: getValue('material'),
    finish: getValue('finish'),
    location: getValue('location'),
    vendor: getValue('vendor'),
    sku: getValue('sku'),
    widthAcrossFlats: Number(getValue('nutWidthAcrossFlats')) || nutDefaults.widthAcrossFlats,
    nutThickness: Number(getValue('nutThickness')) || nutDefaults.thickness,
    innerDiameter: Number(getValue('washerID')) || washerDefaults.innerDiameter,
    outerDiameter: Number(getValue('washerOD')) || washerDefaults.outerDiameter,
    washerThickness: Number(getValue('washerThickness')) || washerDefaults.thickness
  };
}

function syncTypeSpecificDefaults({ resetLength = false } = {}) {
  const standard = getValue('standard') || 'metric';
  const size = getValue('size') || getDefaultSizeForStandard(standard);
  const sizeData = getSizeData(standard, size);

  const pitchInput = document.getElementById('pitch');
  if (pitchInput) {
    pitchInput.value = standard === 'sae'
      ? (sizeData.threadPerInch || Math.round(25.4 / sizeData.coarsePitch))
      : sizeData.coarsePitch;
  }

  const lengthInput = document.getElementById('length');
  if (lengthInput && resetLength) {
    lengthInput.value = standard === 'sae' ? 0.5 : 12;
  }

  const nutWidthInput = document.getElementById('nutWidthAcrossFlats');
  const nutThicknessInput = document.getElementById('nutThickness');
  if (nutWidthInput) {
    nutWidthInput.value = sizeData.nut.widthAcrossFlats;
  }
  if (nutThicknessInput) {
    nutThicknessInput.value = sizeData.nut.thickness;
  }

  const washerIdInput = document.getElementById('washerID');
  const washerOdInput = document.getElementById('washerOD');
  const washerThicknessInput = document.getElementById('washerThickness');
  if (washerIdInput) {
    washerIdInput.value = sizeData.washer.innerDiameter;
  }
  if (washerOdInput) {
    washerOdInput.value = sizeData.washer.outerDiameter;
  }
  if (washerThicknessInput) {
    washerThicknessInput.value = sizeData.washer.thickness;
  }
}

function updateFormOptions() {
  const selectedType = getValue('type') || 'screw';

  conditionalGroups.forEach((group) => {
    const allowedTypes = group.dataset.types
      .split(',')
      .map((type) => type.trim())
      .filter(Boolean);

    const visible = allowedTypes.includes(selectedType);
    group.classList.toggle('is-hidden', !visible);

    group.querySelectorAll('input, select, textarea, button').forEach((control) => {
      control.disabled = !visible;
    });
  });
}

// Main SVG dispatch function requested in spec.
function renderFastenerSVG(part) {
  switch (part.type) {
    case 'screw':
      return renderScrewSVG(part);
    case 'nut':
      return renderNutSVG(part);
    case 'washer':
      return renderWasherSVG(part);
    default:
      return renderScrewSVG(part);
  }
}

function renderTitle(part) {
  if (part.type === 'screw') {
    return `${part.size} × ${formatNumber(part.lengthDisplay, 2)}${part.lengthUnit}`;
  }

  const standardLabel = part.standard === 'sae' ? 'SAE' : 'Metric';
  return `${standardLabel} ${part.size} ${part.type.charAt(0).toUpperCase()}${part.type.slice(1)}`;
}

function renderSubtitle(part) {
  if (part.type === 'screw') {
    const head = HEAD_LABELS[part.head] || 'Head';
    const drive = DRIVE_LABELS[part.drive] || 'Drive';
    const endType = END_TYPE_LABELS[part.endType] || 'Pointed End';
    return `${head} • ${drive} • ${endType}`;
  }

  return part.type === 'nut' ? 'Hex Nut' : 'Flat Washer';
}

function updatePreview() {
  const part = getCurrentPart();
  let detailLine = `${formatNumber(part.pitch, 3)}mm pitch • ⌀${part.diameter.toFixed(1)}mm`;

  if (part.standard === 'sae') {
    detailLine = `${formatNumber(part.threadValue, 0)} TPI • ⌀${formatNumber(mmToInches(part.diameter), 3)}in`;
  }

  if (part.type === 'nut') {
    detailLine = `${part.widthAcrossFlats}mm A/F • ${part.nutThickness}mm thick`;
    if (part.standard === 'sae') {
      detailLine = `${formatNumber(mmToInches(part.widthAcrossFlats), 3)}in A/F • ${formatNumber(mmToInches(part.nutThickness), 3)}in thick`;
    }
  }

  if (part.type === 'washer') {
    detailLine = `${part.innerDiameter}mm ID • ${part.outerDiameter}mm OD • ${part.washerThickness}mm thick`;
    if (part.standard === 'sae') {
      detailLine = `${formatNumber(mmToInches(part.innerDiameter), 3)}in ID • ${formatNumber(mmToInches(part.outerDiameter), 3)}in OD • ${formatNumber(mmToInches(part.washerThickness), 3)}in thick`;
    }
  }

  const metaLines = [detailLine];

  if (part.material || part.finish) {
    metaLines.push(part.material && part.finish
      ? `${part.material} • ${part.finish}`
      : (part.material || part.finish));
  }

  if (part.vendor) {
    metaLines.push(`Vendor: ${part.vendor}`);
  }

  if (part.sku) {
    metaLines.push(`SKU: ${part.sku}`);
  }

  titleEl.textContent = renderTitle(part);
  subtitleEl.textContent = renderSubtitle(part);
  metaEl.innerHTML = metaLines.join('<br>');

  if (part.location) {
    locationEl.textContent = part.location;
    locationEl.classList.remove('is-hidden');
  } else {
    locationEl.textContent = '';
    locationEl.classList.add('is-hidden');
  }

  labelVisual.innerHTML = renderFastenerSVG(part);
}

form.addEventListener('input', () => {
  updateFormOptions();
  updatePreview();
});

form.addEventListener('change', (event) => {
  if (event.target.id === 'standard') {
    populateSizeOptions();
    updateStandardLabels();
    syncTypeSpecificDefaults({ resetLength: true });
  }

  if (event.target.id === 'size') {
    syncTypeSpecificDefaults();
  }

  updateFormOptions();
  updatePreview();
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    populateSizeOptions();
    updateStandardLabels();
    syncTypeSpecificDefaults();
    updateFormOptions();
    updatePreview();
  }, 0);
});

printBtn.addEventListener('click', () => window.print());

populateSizeOptions();
updateStandardLabels();
syncTypeSpecificDefaults();
updateFormOptions();
updatePreview();
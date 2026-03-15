import { getDefaultSizeForStandard, getFastenerData } from './fastener-data.js';
import { renderScrewSVG } from './renderers/screwRenderer.js';
import { renderNutSVG } from './renderers/nutRenderer.js';
import { renderWasherSVG } from './renderers/washerRenderer.js';

const AVERY_TEMPLATES = {
  single: {
    id: 'single',
    label: 'Single Label',
    columns: 1,
    rows: 1,
    labelWidth: 4,
    labelHeight: 2.25,
    colGap: 0,
    rowGap: 0
  },
  '5160': {
    id: '5160',
    label: 'Avery 5160',
    columns: 3,
    rows: 10,
    labelWidth: 2.625,
    labelHeight: 1,
    colGap: 0.125,
    rowGap: 0
  },
  '5163': {
    id: '5163',
    label: 'Avery 5163',
    columns: 2,
    rows: 5,
    labelWidth: 4,
    labelHeight: 2,
    colGap: 0.125,
    rowGap: 0
  }
};

const form = document.getElementById('labelForm');
const printBtn = document.getElementById('printBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const addLabelBtn = document.getElementById('addLabelBtn');
const duplicateLabelBtn = document.getElementById('duplicateLabelBtn');
const removeLabelBtn = document.getElementById('removeLabelBtn');
const labelPicker = document.getElementById('labelPicker');
const conditionalGroups = Array.from(document.querySelectorAll('.config-group[data-types]'));

const standardSelect = document.getElementById('standard');
const sizeSelect = document.getElementById('size');
const templateSelect = document.getElementById('averyTemplate');
const labelQuantityInput = document.getElementById('labelQuantity');

const sizeLabel = document.getElementById('sizeLabel');
const lengthLabel = document.getElementById('lengthLabel');
const pitchLabel = document.getElementById('pitchLabel');

const sheetPreview = document.getElementById('sheetPreview');
const sheetNotice = document.getElementById('sheetNotice');

let labelConfigs = [];
let activeLabelIndex = 0;

const HEAD_LABELS = {
  pan: 'Pan Head',
  socketCap: 'Socket Cap',
  fillister: 'Fillister Head',
  flat: 'Flat Head',
  flat82: '82° Flat Head',
  hex: 'Hex Head',
  hexWasher: 'Hex Washer Head',
  oval: 'Oval Head',
  round: 'Round Head',
  roundWasher: 'Round Washer Head',
  trim: 'Trim Head',
  wafer: 'Wafer Head'
};

const DRIVE_LABELS = {
  phillips: 'Phillips',
  hex: 'Hex',
  torx: 'Torx',
  securityTorx: 'Security Torx',
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

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function getChecked(id) {
  return Boolean(document.getElementById(id)?.checked);
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
    quantity: Math.max(1, Number(getValue('labelQuantity')) || 1),
    isLockNut: getChecked('nutLock'),
    widthAcrossFlats: Number(getValue('nutWidthAcrossFlats')) || nutDefaults.widthAcrossFlats,
    nutThickness: Number(getValue('nutThickness')) || nutDefaults.thickness,
    innerDiameter: Number(getValue('washerID')) || washerDefaults.innerDiameter,
    outerDiameter: Number(getValue('washerOD')) || washerDefaults.outerDiameter,
    washerThickness: Number(getValue('washerThickness')) || washerDefaults.thickness
  };
}

function applyPartToForm(part) {
  standardSelect.value = part.standard || 'metric';
  populateSizeOptions();
  updateStandardLabels();

  const setField = (id, value) => {
    const element = document.getElementById(id);
    if (element && value !== undefined && value !== null) {
      element.value = value;
    }
  };

  setField('type', part.type || 'screw');
  setField('size', part.size || getDefaultSizeForStandard(standardSelect.value));
  setField('length', part.lengthDisplay || 12);
  setField('pitch', part.standard === 'sae' ? (part.threadValue || 20) : (part.pitch || 0.7));
  setField('head', part.head || 'pan');
  setField('drive', part.drive || 'phillips');
  setField('endType', part.endType || 'pointed');
  setField('material', part.material || '');
  setField('finish', part.finish || '');
  setField('location', part.location || '');
  setField('vendor', part.vendor || '');
  setField('sku', part.sku || '');
  setField('labelQuantity', part.quantity || 1);
  const nutLockInput = document.getElementById('nutLock');
  if (nutLockInput) {
    nutLockInput.checked = Boolean(part.isLockNut);
  }
  setField('nutWidthAcrossFlats', part.widthAcrossFlats);
  setField('nutThickness', part.nutThickness);
  setField('washerID', part.innerDiameter);
  setField('washerOD', part.outerDiameter);
  setField('washerThickness', part.washerThickness);

  updateFormOptions();
}

function storeActiveLabel() {
  if (!labelConfigs[activeLabelIndex]) {
    return;
  }

  labelConfigs[activeLabelIndex] = getCurrentPart();
}

function refreshLabelPicker() {
  const previous = activeLabelIndex;
  labelPicker.innerHTML = labelConfigs
    .map((label, index) => {
      const name = `${index + 1}: ${renderTitle(label)} ×${label.quantity}`;
      return `<option value="${index}">${escapeHtml(name)}</option>`;
    })
    .join('');

  activeLabelIndex = Math.min(previous, labelConfigs.length - 1);
  labelPicker.value = String(activeLabelIndex);

  removeLabelBtn.disabled = labelConfigs.length <= 1;
}

function getSheetSettings() {
  const templateId = templateSelect.value || 'single';
  const template = AVERY_TEMPLATES[templateId] || AVERY_TEMPLATES.single;
  const capacity = template.columns * template.rows;
  const totalLabelCount = labelConfigs.reduce((sum, label) => sum + Math.max(1, Number(label.quantity) || 1), 0);
  const pageCount = Math.max(1, Math.ceil(totalLabelCount / capacity));

  return {
    template,
    totalLabelCount,
    capacity,
    pageCount
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

function renderFastenerSVG(part) {
  switch (part.type) {
    case 'screw':
      return renderScrewSVG(part, 'side');
    case 'nut':
      return renderNutSVG(part, 'top');
    case 'washer':
      return renderWasherSVG(part, 'top');
    default:
      return renderScrewSVG(part, 'side');
  }
}

function renderFastenerViews(part) {
  switch (part.type) {
    case 'screw':
      return [renderScrewSVG(part, 'side'), renderScrewSVG(part, 'top')];
    case 'nut':
      return [renderNutSVG(part, 'top')];
    case 'washer':
      return [renderWasherSVG(part, 'top')];
    default:
      return [renderScrewSVG(part, 'side'), renderScrewSVG(part, 'top')];
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

  if (part.type === 'nut') {
    return part.isLockNut ? 'Hex Lock Nut' : 'Hex Nut';
  }

  return 'Flat Washer';
}

function buildMetaLines(part) {
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

  if (part.type === 'nut' && part.isLockNut) {
    metaLines.push('Locking insert');
  }

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

  return metaLines;
}

function renderLabelMarkup(part, compact = false) {
  const title = escapeHtml(renderTitle(part));
  const subtitle = escapeHtml(renderSubtitle(part));
  const metaLines = buildMetaLines(part);
  if (compact && part.location) {
    metaLines.push(`Loc: ${part.location}`);
  }
  const meta = metaLines.map((line) => escapeHtml(line)).join('<br>');
  const views = renderFastenerViews(part);
  const viewsMarkup = views
    .map((viewSvg) => `<div class="label-view"><div class="label-view-svg">${viewSvg}</div></div>`)
    .join('');
  const locationMarkup = !compact && part.location
    ? `<div class="label-location">${escapeHtml(part.location)}</div>`
    : '';

  return `
    <section class="label${compact ? ' label--compact' : ''}">
      <div class="label-main">
        <div>
          <div class="label-title">${title}</div>
          <div class="label-subtitle">${subtitle}</div>
          <div class="label-meta">${meta}</div>
        </div>
        ${locationMarkup}
      </div>
      <div class="label-visuals${views.length === 1 ? ' label-visuals--single' : ''}" aria-hidden="true">
        ${viewsMarkup}
      </div>
    </section>
  `;
}

function updateSheetNotice(totalCount, capacity, pageCount, templateLabel) {
  sheetNotice.textContent = `${templateLabel} preview • ${totalCount} label${totalCount === 1 ? '' : 's'} across ${pageCount} page${pageCount === 1 ? '' : 's'} (${capacity} per page)`;
}

function updatePreview() {
  storeActiveLabel();
  const { template, totalLabelCount, capacity, pageCount } = getSheetSettings();
  const compact = template.labelHeight <= 1.2;

  printBtn.textContent = totalLabelCount > 1 ? 'Print Labels' : 'Print Label';

  const expandedLabels = [];
  for (const label of labelConfigs) {
    const quantity = Math.max(1, Number(label.quantity) || 1);
    for (let index = 0; index < quantity; index += 1) {
      expandedLabels.push(label);
    }
  }

  const pageMarkup = Array.from({ length: pageCount }, (_, pageIndex) => {
    const start = pageIndex * capacity;
    const end = start + capacity;
    const labelsForPage = expandedLabels.slice(start, end);
    const labelsMarkup = labelsForPage.map((label) => renderLabelMarkup(label, compact)).join('');

    return `
      <div class="sheet-page">
        <div class="sheet-page-title no-print">Page ${pageIndex + 1} of ${pageCount}</div>
        <div
          class="label-sheet-grid"
          style="--cols:${template.columns}; --label-width:${template.labelWidth}in; --label-height:${template.labelHeight}in; --col-gap:${template.colGap}in; --row-gap:${template.rowGap}in;"
          data-template="${template.id}"
        >
          ${labelsMarkup}
        </div>
      </div>
    `;
  }).join('');

  sheetPreview.innerHTML = pageMarkup;

  refreshLabelPicker();
  updateSheetNotice(totalLabelCount, capacity, pageCount, template.label);
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportCurrentConfig() {
  storeActiveLabel();
  const sheet = getSheetSettings();
  const payload = {
    activeLabelIndex,
    labels: labelConfigs,
    sheet: {
      template: sheet.template.id,
      totalLabelCount: sheet.totalLabelCount,
      capacity: sheet.capacity,
      pageCount: sheet.pageCount
    },
    exportedAt: new Date().toISOString()
  };

  const part = labelConfigs[activeLabelIndex] || getCurrentPart();
  const safeName = `${part.standard}-${part.type}-${part.size}-label-config`.replace(/[^a-z0-9\-_.]/gi, '_').toLowerCase();
  downloadTextFile(`${safeName}.json`, `${JSON.stringify(payload, null, 2)}\n`, 'application/json');
}

form.addEventListener('input', (event) => {
  if (event.target.id === 'labelPicker') {
    return;
  }

  storeActiveLabel();
  updateFormOptions();
  updatePreview();
});

form.addEventListener('change', (event) => {
  if (event.target.id === 'labelPicker') {
    return;
  }

  storeActiveLabel();

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

labelPicker.addEventListener('change', () => {
  storeActiveLabel();
  activeLabelIndex = Number(labelPicker.value) || 0;
  const nextLabel = labelConfigs[activeLabelIndex];
  if (nextLabel) {
    applyPartToForm(nextLabel);
  }
  updatePreview();
});

addLabelBtn.addEventListener('click', () => {
  storeActiveLabel();
  const newLabel = { ...labelConfigs[activeLabelIndex], quantity: 1 };
  labelConfigs.push(newLabel);
  activeLabelIndex = labelConfigs.length - 1;
  applyPartToForm(newLabel);
  updatePreview();
});

duplicateLabelBtn.addEventListener('click', () => {
  storeActiveLabel();
  const copy = { ...labelConfigs[activeLabelIndex] };
  labelConfigs.push(copy);
  activeLabelIndex = labelConfigs.length - 1;
  applyPartToForm(copy);
  updatePreview();
});

removeLabelBtn.addEventListener('click', () => {
  if (labelConfigs.length <= 1) {
    return;
  }

  labelConfigs.splice(activeLabelIndex, 1);
  activeLabelIndex = Math.max(0, activeLabelIndex - 1);
  applyPartToForm(labelConfigs[activeLabelIndex]);
  updatePreview();
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    populateSizeOptions();
    updateStandardLabels();
    syncTypeSpecificDefaults();
    updateFormOptions();
    labelConfigs = [getCurrentPart()];
    activeLabelIndex = 0;
    updatePreview();
  }, 0);
});

printBtn.addEventListener('click', () => window.print());
exportJsonBtn.addEventListener('click', exportCurrentConfig);

populateSizeOptions();
updateStandardLabels();
syncTypeSpecificDefaults();
updateFormOptions();
labelConfigs = [getCurrentPart()];
activeLabelIndex = 0;
updatePreview();

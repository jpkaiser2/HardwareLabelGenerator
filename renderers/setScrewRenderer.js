import { getFastenerData, getDefaultSizeForStandard } from '../fastener-data.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function renderDriveSymbol(drive, cx, y, width) {
  const half = width / 2;

  switch (drive) {
    case 'phillips':
      return `
        <line x1="${cx - half}" y1="${y}" x2="${cx + half}" y2="${y}" stroke="#111" stroke-width="2" />
        <line x1="${cx}" y1="${y - half}" x2="${cx}" y2="${y + half}" stroke="#111" stroke-width="2" />
      `;
    case 'hex': {
      const r = width * 0.45;
      const points = Array.from({ length: 6 }, (_, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI) / 3;
        return `${(cx + r * Math.cos(angle)).toFixed(2)},${(y + r * Math.sin(angle)).toFixed(2)}`;
      }).join(' ');
      return `<polygon points="${points}" fill="none" stroke="#111" stroke-width="2" />`;
    }
    case 'torx': {
      const outer = width * 0.46;
      const inner = width * 0.22;
      const points = Array.from({ length: 12 }, (_, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI) / 6;
        const radius = index % 2 === 0 ? outer : inner;
        return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(y + radius * Math.sin(angle)).toFixed(2)}`;
      }).join(' ');
      return `<polygon points="${points}" fill="none" stroke="#111" stroke-width="2" />`;
    }
    case 'securityTorx': {
      const outer = width * 0.52;
      const inner = width * 0.29;
      const points = Array.from({ length: 12 }, (_, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI) / 6;
        const radius = index % 2 === 0 ? outer : inner;
        return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(y + radius * Math.sin(angle)).toFixed(2)}`;
      }).join(' ');
      const pinRadius = Math.max(1.8, width * 0.13);
      return `
        <polygon points="${points}" fill="none" stroke="#111" stroke-width="2" />
        <circle cx="${cx}" cy="${y}" r="${pinRadius}" fill="#fff" stroke="#111" stroke-width="1.8" />
      `;
    }
    case 'slotted':
      return `<line x1="${cx - half}" y1="${y}" x2="${cx + half}" y2="${y}" stroke="#111" stroke-width="2" />`;
    default:
      return '';
  }
}

function renderSetScrewTip(pointStyle, centerX, shaftBottomY, shaftWidth, tipHeight) {
  switch (pointStyle) {
    case 'flat':
      return `<rect x="${centerX - shaftWidth / 2}" y="${shaftBottomY}" width="${shaftWidth}" height="6" fill="#fff" stroke="#111" stroke-width="2" />`;
    case 'cone':
      return `<polygon points="${centerX - shaftWidth / 2},${shaftBottomY} ${centerX + shaftWidth / 2},${shaftBottomY} ${centerX},${shaftBottomY + tipHeight}" fill="#fff" stroke="#111" stroke-width="2" />`;
    case 'dog': {
      const dogWidth = shaftWidth * 0.58;
      const dogX = centerX - dogWidth / 2;
      const dogHeight = Math.max(8, tipHeight * 0.62);
      return `<rect x="${dogX}" y="${shaftBottomY}" width="${dogWidth}" height="${dogHeight}" fill="#fff" stroke="#111" stroke-width="2" />`;
    }
    case 'cup':
    default: {
      const cupRadius = Math.max(3, shaftWidth * 0.25);
      return `
        <rect x="${centerX - shaftWidth / 2}" y="${shaftBottomY}" width="${shaftWidth}" height="6" fill="#fff" stroke="#111" stroke-width="2" />
        <path d="M ${centerX - shaftWidth * 0.28} ${shaftBottomY + 6} Q ${centerX} ${shaftBottomY + 6 + cupRadius} ${centerX + shaftWidth * 0.28} ${shaftBottomY + 6}" fill="none" stroke="#111" stroke-width="1.8" />
      `;
    }
  }
}

export function renderSetScrewSVG(part, view = 'side') {
  const dataSet = getFastenerData(part.standard);
  const fallbackSize = getDefaultSizeForStandard(part.standard);
  const sizeData = dataSet[part.size] || dataSet[fallbackSize];
  const diameter = Number(part.diameter) || sizeData.diameter;
  const length = Number(part.length) || 8;
  const pitch = Number(part.pitch) || sizeData.coarsePitch;
  const pointStyle = part.endType || 'cup';

  const centerX = 60;

  if (view === 'top') {
    const centerY = 80;
    const radius = clamp(diameter * 6.4, 13, 26);
    const driveMarkup = renderDriveSymbol(part.drive, centerX, centerY, clamp(radius * 1.1, 14, 26));

    return `
      <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Set screw top view">
        <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#fff" stroke="#111" stroke-width="2" />
        ${driveMarkup}
      </svg>
    `;
  }

  const shaftTopY = 24;
  const shaftWidth = clamp(diameter * 2.15, 7, 18);
  const shaftHeight = clamp(length * 5.2, 40, 106);
  const shaftBottomY = shaftTopY + shaftHeight;
  const tipHeight = clamp(diameter * 2.5, 10, 16);
  const pitchPx = clamp((pitch / sizeData.coarsePitch) * 8, 5, 11);

  let threadLines = '';
  for (let y = shaftTopY + 3; y < shaftBottomY - 3; y += pitchPx) {
    threadLines += `<line x1="${centerX - shaftWidth / 2}" y1="${y}" x2="${centerX + shaftWidth / 2}" y2="${y + 3}" stroke="#111" stroke-width="1" />`;
  }

  const pointMarkup = renderSetScrewTip(pointStyle, centerX, shaftBottomY, shaftWidth, tipHeight);

  return `
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Set screw side view">
      <rect x="${centerX - shaftWidth / 2}" y="${shaftTopY}" width="${shaftWidth}" height="${shaftHeight}" fill="#fff" stroke="#111" stroke-width="2" />
      ${threadLines}
      ${pointMarkup}
    </svg>
  `;
}

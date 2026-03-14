import { getFastenerData, getDefaultSizeForStandard } from '../fastener-data.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function toTitleCase(value) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

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
      const points = Array.from({ length: 10 }, (_, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI) / 5;
        const radius = index % 2 === 0 ? outer : inner;
        return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(y + radius * Math.sin(angle)).toFixed(2)}`;
      }).join(' ');
      return `<polygon points="${points}" fill="none" stroke="#111" stroke-width="2" />`;
    }
    case 'slotted':
      return `<line x1="${cx - half}" y1="${y}" x2="${cx + half}" y2="${y}" stroke="#111" stroke-width="2" />`;
    default:
      return '';
  }
}

function getHeadGeometry(headType, centerX, headTopY, shaftWidth) {
  const headBottomY = 34;
  const yMid = (headTopY + headBottomY) / 2;

  switch (headType) {
    case 'socketCap':
      return {
        headMarkup: `<rect x="${centerX - shaftWidth * 1.12}" y="${headTopY}" width="${shaftWidth * 2.24}" height="${headBottomY - headTopY}" fill="#fff" stroke="#111" stroke-width="2" />`,
        driveY: yMid
      };
    case 'flat':
      return {
        headMarkup: `<polygon points="${centerX - shaftWidth * 1.2},${headBottomY} ${centerX + shaftWidth * 1.2},${headBottomY} ${centerX},${headTopY}" fill="#fff" stroke="#111" stroke-width="2" />`,
        driveY: yMid + 1
      };
    case 'hex': {
      const r = shaftWidth * 1.25;
      const hexPoints = Array.from({ length: 6 }, (_, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI) / 3;
        return `${(centerX + r * Math.cos(angle)).toFixed(2)},${(yMid + r * Math.sin(angle)).toFixed(2)}`;
      }).join(' ');
      return {
        headMarkup: `<polygon points="${hexPoints}" fill="#fff" stroke="#111" stroke-width="2" />`,
        driveY: yMid
      };
    }
    case 'pan':
    default:
      return {
        headMarkup: `<rect x="${centerX - shaftWidth * 1.3}" y="${headTopY}" width="${shaftWidth * 2.6}" height="${headBottomY - headTopY}" rx="10" fill="#fff" stroke="#111" stroke-width="2" />`,
        driveY: yMid
      };
  }
}

export function renderScrewSVG(part) {
  const dataSet = getFastenerData(part.standard);
  const fallbackSize = getDefaultSizeForStandard(part.standard);
  const sizeData = dataSet[part.size] || dataSet[fallbackSize];
  const headData = sizeData.heads[part.head] || sizeData.heads.pan;
  const diameter = Number(part.diameter) || sizeData.diameter;
  const length = Number(part.length) || 12;
  const pitch = Number(part.pitch) || sizeData.coarsePitch;
  const endType = part.endType || 'pointed';

  const centerX = 60;
  const shaftTopY = 34;
  const shaftWidth = clamp(diameter * 2.1, 7, 20);
  const shaftHeight = clamp(length * 4.4, 38, 98);
  const shaftBottomY = shaftTopY + shaftHeight;
  const tipHeight = clamp(diameter * 3.2, 12, 20);
  const tipBottomY = shaftBottomY + tipHeight;

  const headHeightPx = clamp(headData.headHeight * 6, 10, 26);
  const headTopY = clamp(34 - headHeightPx, 8, 24);
  const { headMarkup, driveY } = getHeadGeometry(part.head, centerX, headTopY, shaftWidth);

  const pitchPx = clamp((pitch / sizeData.coarsePitch) * 8, 5, 11);
  let threadLines = '';

  for (let y = shaftTopY + 4; y < shaftBottomY - 4; y += pitchPx) {
    threadLines += `<line x1="${centerX - shaftWidth / 2}" y1="${y}" x2="${centerX + shaftWidth / 2}" y2="${y + 3}" stroke="#111" stroke-width="1" />`;
  }

  const driveSymbol = renderDriveSymbol(part.drive, centerX, driveY, clamp(shaftWidth * 1.25, 9, 16));
  const headLabel = toTitleCase(part.head || 'pan');
  const driveLabel = toTitleCase(part.drive || 'phillips');
  const endLabel = toTitleCase(endType);

  const endMarkup = endType === 'flat'
    ? `<rect x="${centerX - shaftWidth / 2}" y="${shaftBottomY}" width="${shaftWidth}" height="6" fill="#fff" stroke="#111" stroke-width="2" />`
    : `<polygon points="${centerX - shaftWidth / 2},${shaftBottomY} ${centerX + shaftWidth / 2},${shaftBottomY} ${centerX},${tipBottomY}" fill="#fff" stroke="#111" stroke-width="2" />`;

  return `
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${headLabel} ${driveLabel} ${endLabel} screw diagram">
      ${headMarkup}
      ${driveSymbol}
      <rect x="${centerX - shaftWidth / 2}" y="${shaftTopY}" width="${shaftWidth}" height="${shaftHeight}" fill="#fff" stroke="#111" stroke-width="2" />
      ${threadLines}
      ${endMarkup}
    </svg>
  `;
}

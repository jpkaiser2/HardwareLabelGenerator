import { getFastenerData, getDefaultSizeForStandard } from '../fastener-data.js';

export function renderWasherSVG(part, view = 'top') {
  const dataSet = getFastenerData(part.standard);
  const fallbackSize = getDefaultSizeForStandard(part.standard);
  const sizeData = dataSet[part.size] || dataSet[fallbackSize];
  const innerDiameter = Number(part.innerDiameter) || sizeData.washer.innerDiameter;
  const outerDiameter = Number(part.outerDiameter) || sizeData.washer.outerDiameter;
  const thickness = Number(part.washerThickness) || sizeData.washer.thickness;

  const centerX = 60;
  const centerY = 80;
  const outerRadius = Math.max(20, Math.min(45, (outerDiameter / 2) * 6));
  const innerRadius = Math.max(7, Math.min(22, (innerDiameter / 2) * 6));

  if (view === 'side') {
    const bodyWidth = Math.max(44, Math.min(100, outerDiameter * 6.2));
    const bodyHeight = Math.max(6, Math.min(16, thickness * 6));
    const bodyX = centerX - bodyWidth / 2;
    const bodyY = centerY - bodyHeight / 2;
    const slotWidth = Math.max(8, Math.min(28, innerDiameter * 2.8));

    return `
      <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Washer side view">
        <rect x="${bodyX}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" fill="#fff" stroke="#111" stroke-width="2" />
        <line x1="${centerX - slotWidth / 2}" y1="${centerY}" x2="${centerX + slotWidth / 2}" y2="${centerY}" stroke="#111" stroke-width="2" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Washer top view">
      <circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" fill="#fff" stroke="#111" stroke-width="2" />
      <circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" fill="#fff" stroke="#111" stroke-width="2" />
    </svg>
  `;
}

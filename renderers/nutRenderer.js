import { getFastenerData, getDefaultSizeForStandard } from '../fastener-data.js';

export function renderNutSVG(part, view = 'top') {
  const dataSet = getFastenerData(part.standard);
  const fallbackSize = getDefaultSizeForStandard(part.standard);
  const sizeData = dataSet[part.size] || dataSet[fallbackSize];
  const widthAcrossFlats = Number(part.widthAcrossFlats) || sizeData.nut.widthAcrossFlats;
  const holeDiameter = Number(part.diameter) || sizeData.diameter;
  const nutThickness = Number(part.nutThickness) || sizeData.nut.thickness;

  const centerX = 60;
  const centerY = 80;
  const radius = Math.max(20, Math.min(42, widthAcrossFlats * 3.2));
  const holeToHeadRatio = Math.max(0.34, Math.min(0.48, (holeDiameter / widthAcrossFlats) * 0.72));
  const holeRadius = radius * holeToHeadRatio;
  const isLockNut = Boolean(part.isLockNut);

  const points = Array.from({ length: 6 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / 3;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  if (view === 'side') {
    const bodyWidth = Math.max(44, Math.min(98, widthAcrossFlats * 10.5));
    const bodyHeight = Math.max(12, Math.min(28, nutThickness * 4.4));
    const bodyX = centerX - bodyWidth / 2;
    const bodyY = centerY - bodyHeight / 2;
    const holeSlotWidth = Math.max(8, Math.min(24, holeDiameter * 2.2));

    return `
      <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hex nut side view">
        <rect x="${bodyX}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" fill="#fff" stroke="#111" stroke-width="2" />
        <line x1="${centerX - holeSlotWidth / 2}" y1="${centerY}" x2="${centerX + holeSlotWidth / 2}" y2="${centerY}" stroke="#111" stroke-width="2" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hex nut top view">
      <polygon points="${points}" fill="#fff" stroke="#111" stroke-width="2" />
      <circle cx="${centerX}" cy="${centerY}" r="${holeRadius}" fill="#fff" stroke="#111" stroke-width="2" />
      ${isLockNut ? `<circle cx="${centerX}" cy="${centerY}" r="${Math.max(3, holeRadius * 0.62)}" fill="none" stroke="#111" stroke-width="1.6" />` : ''}
    </svg>
  `;
}

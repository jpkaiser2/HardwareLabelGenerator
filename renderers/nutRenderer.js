import { getFastenerData, getDefaultSizeForStandard } from '../fastener-data.js';

export function renderNutSVG(part) {
  const dataSet = getFastenerData(part.standard);
  const fallbackSize = getDefaultSizeForStandard(part.standard);
  const sizeData = dataSet[part.size] || dataSet[fallbackSize];
  const widthAcrossFlats = Number(part.widthAcrossFlats) || sizeData.nut.widthAcrossFlats;
  const holeDiameter = Number(part.diameter) || sizeData.diameter;

  const centerX = 60;
  const centerY = 80;
  const radius = Math.max(20, Math.min(42, widthAcrossFlats * 3.2));
  const holeRadius = Math.max(8, Math.min(20, (holeDiameter / 2) * 3.2));

  const points = Array.from({ length: 6 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / 3;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  return `
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hex nut diagram">
      <polygon points="${points}" fill="#fff" stroke="#111" stroke-width="2" />
      <circle cx="${centerX}" cy="${centerY}" r="${holeRadius}" fill="#fff" stroke="#111" stroke-width="2" />
    </svg>
  `;
}

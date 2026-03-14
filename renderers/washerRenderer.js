import { getFastenerData, getDefaultSizeForStandard } from '../fastener-data.js';

export function renderWasherSVG(part) {
  const dataSet = getFastenerData(part.standard);
  const fallbackSize = getDefaultSizeForStandard(part.standard);
  const sizeData = dataSet[part.size] || dataSet[fallbackSize];
  const innerDiameter = Number(part.innerDiameter) || sizeData.washer.innerDiameter;
  const outerDiameter = Number(part.outerDiameter) || sizeData.washer.outerDiameter;

  const centerX = 60;
  const centerY = 80;
  const outerRadius = Math.max(20, Math.min(45, (outerDiameter / 2) * 6));
  const innerRadius = Math.max(7, Math.min(22, (innerDiameter / 2) * 6));

  return `
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Washer diagram">
      <circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" fill="#fff" stroke="#111" stroke-width="2" />
      <circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" fill="#fff" stroke="#111" stroke-width="2" />
    </svg>
  `;
}

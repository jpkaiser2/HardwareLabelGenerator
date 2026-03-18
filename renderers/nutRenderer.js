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
  const nutStyle = ['hex', 'lock', 'wing', 'keps'].includes(part.nutStyle)
    ? part.nutStyle
    : (isLockNut ? 'lock' : 'hex');

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

    if (nutStyle === 'wing') {
      const wingWidth = Math.max(9, bodyWidth * 0.18);
      const wingHeight = Math.max(9, bodyHeight * 1.05);
      const wingCornerRadius = Math.max(2, Math.min(6, wingHeight * 0.22));
      const leftWingX = bodyX - wingWidth * 0.58;
      const leftWingY = centerY - wingHeight / 2;
      const rightWingX = bodyX + bodyWidth - wingWidth * 0.42;
      const rightWingY = centerY - wingHeight / 2;

      return `
        <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wing nut side view">
          <rect x="${bodyX}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" rx="4" fill="#fff" stroke="#111" stroke-width="2" />
          <rect x="${leftWingX}" y="${leftWingY}" width="${wingWidth}" height="${wingHeight}" rx="${wingCornerRadius}" ry="${wingCornerRadius}" fill="#fff" stroke="#111" stroke-width="2" />
          <rect x="${rightWingX}" y="${rightWingY}" width="${wingWidth}" height="${wingHeight}" rx="${wingCornerRadius}" ry="${wingCornerRadius}" fill="#fff" stroke="#111" stroke-width="2" />
          <line x1="${centerX - holeSlotWidth / 2}" y1="${centerY}" x2="${centerX + holeSlotWidth / 2}" y2="${centerY}" stroke="#111" stroke-width="2" />
        </svg>
      `;
    }

    if (nutStyle === 'keps') {
      const washerHeight = Math.max(3, bodyHeight * 0.26);

      return `
        <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Keps nut side view">
          <rect x="${bodyX}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" fill="#fff" stroke="#111" stroke-width="2" />
          <rect x="${bodyX + 3}" y="${bodyY + bodyHeight - washerHeight}" width="${Math.max(10, bodyWidth - 6)}" height="${washerHeight}" fill="none" stroke="#111" stroke-width="1.6" stroke-dasharray="2 2" />
          <line x1="${centerX - holeSlotWidth / 2}" y1="${centerY}" x2="${centerX + holeSlotWidth / 2}" y2="${centerY}" stroke="#111" stroke-width="2" />
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${nutStyle === 'lock' ? 'Hex lock nut' : 'Hex nut'} side view">
        <rect x="${bodyX}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" fill="#fff" stroke="#111" stroke-width="2" />
        <line x1="${centerX - holeSlotWidth / 2}" y1="${centerY}" x2="${centerX + holeSlotWidth / 2}" y2="${centerY}" stroke="#111" stroke-width="2" />
      </svg>
    `;
  }

  if (nutStyle === 'wing') {
    const bodyRadius = Math.max(12, Math.min(22, radius * 0.45));
    const bodyDiameter = bodyRadius * 2;
    const wingWidth = Math.max(10, Math.min(22, bodyDiameter * 0.52));
    const wingHeight = Math.max(14, Math.min(30, bodyDiameter * 0.96));
    const wingCornerRadius = Math.max(2, Math.min(7, wingHeight * 0.22));
    const wingOffset = bodyRadius * 1.05;
    const leftWingX = centerX - wingOffset - wingWidth;
    const leftWingY = centerY - wingHeight / 2;
    const rightWingX = centerX + wingOffset;
    const rightWingY = centerY - wingHeight / 2;

    return `
      <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wing nut top view">
        <rect x="${leftWingX}" y="${leftWingY}" width="${wingWidth}" height="${wingHeight}" rx="${wingCornerRadius}" ry="${wingCornerRadius}" fill="#fff" stroke="#111" stroke-width="2" />
        <rect x="${rightWingX}" y="${rightWingY}" width="${wingWidth}" height="${wingHeight}" rx="${wingCornerRadius}" ry="${wingCornerRadius}" fill="#fff" stroke="#111" stroke-width="2" />
        <circle cx="${centerX}" cy="${centerY}" r="${bodyRadius}" fill="#fff" stroke="#111" stroke-width="2" />
        <circle cx="${centerX}" cy="${centerY}" r="${holeRadius}" fill="#fff" stroke="#111" stroke-width="2" />
      </svg>
    `;
  }

  if (nutStyle === 'keps') {
    const washerRadius = Math.max(holeRadius + 5, Math.min(radius * 0.92, holeRadius * 1.9));

    return `
      <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Keps nut top view">
        <polygon points="${points}" fill="#fff" stroke="#111" stroke-width="2" />
        <circle cx="${centerX}" cy="${centerY}" r="${washerRadius}" fill="none" stroke="#111" stroke-width="1.8" stroke-dasharray="2 2" />
        <circle cx="${centerX}" cy="${centerY}" r="${holeRadius}" fill="#fff" stroke="#111" stroke-width="2" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${nutStyle === 'lock' ? 'Hex lock nut' : 'Hex nut'} top view">
      <polygon points="${points}" fill="#fff" stroke="#111" stroke-width="2" />
      <circle cx="${centerX}" cy="${centerY}" r="${holeRadius}" fill="#fff" stroke="#111" stroke-width="2" />
      ${nutStyle === 'lock' ? `<circle cx="${centerX}" cy="${centerY}" r="${Math.max(3, holeRadius * 0.62)}" fill="none" stroke="#111" stroke-width="1.6" />` : ''}
    </svg>
  `;
}

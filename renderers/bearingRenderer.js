export function renderBearingSVG(part, view = 'top') {
  const innerDiameter = Math.max(1, Number(part.bearingInnerDiameter) || 8);
  const outerDiameter = Math.max(innerDiameter + 2, Number(part.bearingOuterDiameter) || 22);
  const width = Math.max(1, Number(part.bearingWidth) || 7);
  const sealType = part.bearingSeal || 'open';

  const centerX = 60;
  const centerY = 80;

  const outerRadius = Math.max(20, Math.min(45, (outerDiameter / 2) * 3.6));
  const innerRadius = Math.max(8, Math.min(24, (innerDiameter / 2) * 3.9));
  const raceMidRadius = (outerRadius + innerRadius) / 2;

  const radialThickness = Math.max(outerRadius - innerRadius, 6);
  const ballRadius = Math.max(1.7, Math.min(4.2, radialThickness * 0.19));
  const ballCount = Math.max(8, Math.min(16, Math.round((outerDiameter / Math.max(width, 1)) + 6)));

  const ballsMarkup = Array.from({ length: ballCount }, (_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / ballCount;
    const x = centerX + raceMidRadius * Math.cos(angle);
    const y = centerY + raceMidRadius * Math.sin(angle);
    return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${ballRadius.toFixed(2)}" fill="#fff" stroke="#111" stroke-width="1.2" />`;
  }).join('');

  const sealInset = Math.max(1.5, radialThickness * 0.2);
  const shieldInset = Math.max(1.1, radialThickness * 0.15);

  let sealMarkup = '';
  if (sealType === 'sealed') {
    sealMarkup = `
      <circle cx="${centerX}" cy="${centerY}" r="${(outerRadius - sealInset).toFixed(2)}" fill="none" stroke="#111" stroke-width="1.6" />
      <circle cx="${centerX}" cy="${centerY}" r="${(innerRadius + sealInset).toFixed(2)}" fill="none" stroke="#111" stroke-width="1.6" />
    `;
  } else if (sealType === 'shielded') {
    sealMarkup = `
      <circle cx="${centerX}" cy="${centerY}" r="${(outerRadius - shieldInset).toFixed(2)}" fill="none" stroke="#111" stroke-width="1.2" />
      <circle cx="${centerX}" cy="${centerY}" r="${(innerRadius + shieldInset).toFixed(2)}" fill="none" stroke="#111" stroke-width="1.2" />
    `;
  }

  if (view === 'side') {
    const bodyWidth = Math.max(42, Math.min(98, width * 10));
    const bodyHeight = Math.max(12, Math.min(34, radialThickness * 1.2));
    const bodyX = centerX - bodyWidth / 2;
    const bodyY = centerY - bodyHeight / 2;

    return `
      <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bearing side view">
        <rect x="${bodyX.toFixed(2)}" y="${bodyY.toFixed(2)}" width="${bodyWidth.toFixed(2)}" height="${bodyHeight.toFixed(2)}" fill="#fff" stroke="#111" stroke-width="2" />
        <line x1="${(bodyX + bodyWidth * 0.2).toFixed(2)}" y1="${centerY.toFixed(2)}" x2="${(bodyX + bodyWidth * 0.8).toFixed(2)}" y2="${centerY.toFixed(2)}" stroke="#111" stroke-width="1.6" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bearing top view">
      <circle cx="${centerX}" cy="${centerY}" r="${outerRadius.toFixed(2)}" fill="#fff" stroke="#111" stroke-width="2" />
      <circle cx="${centerX}" cy="${centerY}" r="${innerRadius.toFixed(2)}" fill="#fff" stroke="#111" stroke-width="2" />
      ${ballsMarkup}
      ${sealMarkup}
    </svg>
  `;
}

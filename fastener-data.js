// Metric fastener dimensions used by renderer modules.
// Values are realistic approximations in millimeters.
export const metricFastenerData = {
  M2: {
    diameter: 2,
    coarsePitch: 0.4,
    heads: {
      pan: { headDiameter: 3.8, headHeight: 1.5 },
      socketCap: { headDiameter: 3.8, headHeight: 2.0 },
      flat: { headDiameter: 4.2, headHeight: 1.1 },
      hex: { headDiameter: 4.0, headHeight: 1.4 }
    },
    nut: { widthAcrossFlats: 4.0, thickness: 1.6 },
    washer: { innerDiameter: 2.2, outerDiameter: 5.0, thickness: 0.3 }
  },
  'M2.5': {
    diameter: 2.5,
    coarsePitch: 0.45,
    heads: {
      pan: { headDiameter: 4.7, headHeight: 1.8 },
      socketCap: { headDiameter: 4.5, headHeight: 2.5 },
      flat: { headDiameter: 5.0, headHeight: 1.4 },
      hex: { headDiameter: 5.0, headHeight: 1.8 }
    },
    nut: { widthAcrossFlats: 5.0, thickness: 2.0 },
    washer: { innerDiameter: 2.7, outerDiameter: 6.0, thickness: 0.5 }
  },
  M3: {
    diameter: 3,
    coarsePitch: 0.5,
    heads: {
      pan: { headDiameter: 5.6, headHeight: 2.4 },
      socketCap: { headDiameter: 5.5, headHeight: 3.0 },
      flat: { headDiameter: 6.0, headHeight: 1.7 },
      hex: { headDiameter: 5.5, headHeight: 2.0 }
    },
    nut: { widthAcrossFlats: 5.5, thickness: 2.4 },
    washer: { innerDiameter: 3.2, outerDiameter: 7.0, thickness: 0.5 }
  },
  M4: {
    diameter: 4,
    coarsePitch: 0.7,
    heads: {
      pan: { headDiameter: 7.8, headHeight: 3.1 },
      socketCap: { headDiameter: 7.0, headHeight: 4.0 },
      flat: { headDiameter: 8.2, headHeight: 2.3 },
      hex: { headDiameter: 7.0, headHeight: 2.8 }
    },
    nut: { widthAcrossFlats: 7.0, thickness: 3.2 },
    washer: { innerDiameter: 4.3, outerDiameter: 9.0, thickness: 0.8 }
  },
  M5: {
    diameter: 5,
    coarsePitch: 0.8,
    heads: {
      pan: { headDiameter: 9.5, headHeight: 3.8 },
      socketCap: { headDiameter: 8.5, headHeight: 5.0 },
      flat: { headDiameter: 10.0, headHeight: 2.8 },
      hex: { headDiameter: 8.0, headHeight: 3.5 }
    },
    nut: { widthAcrossFlats: 8.0, thickness: 4.0 },
    washer: { innerDiameter: 5.3, outerDiameter: 10.0, thickness: 1.0 }
  },
  M6: {
    diameter: 6,
    coarsePitch: 1.0,
    heads: {
      pan: { headDiameter: 11.0, headHeight: 4.6 },
      socketCap: { headDiameter: 10.0, headHeight: 6.0 },
      flat: { headDiameter: 12.0, headHeight: 3.3 },
      hex: { headDiameter: 10.0, headHeight: 4.2 }
    },
    nut: { widthAcrossFlats: 10.0, thickness: 5.0 },
    washer: { innerDiameter: 6.4, outerDiameter: 12.5, thickness: 1.6 }
  },
  M8: {
    diameter: 8,
    coarsePitch: 1.25,
    heads: {
      pan: { headDiameter: 14.0, headHeight: 6.0 },
      socketCap: { headDiameter: 13.0, headHeight: 8.0 },
      flat: { headDiameter: 16.0, headHeight: 4.4 },
      hex: { headDiameter: 13.0, headHeight: 5.3 }
    },
    nut: { widthAcrossFlats: 13.0, thickness: 6.5 },
    washer: { innerDiameter: 8.4, outerDiameter: 17.0, thickness: 1.6 }
  }
};

// SAE/Unified sizes represented with realistic approximate dimensions.
// Diameters and dimensions are stored in millimeters for renderer consistency.
export const saeFastenerData = {
  '#4-40': {
    diameter: 2.84,
    coarsePitch: 0.635,
    threadPerInch: 40,
    heads: {
      pan: { headDiameter: 5.0, headHeight: 1.8 },
      socketCap: { headDiameter: 4.8, headHeight: 2.5 },
      flat: { headDiameter: 5.5, headHeight: 1.5 },
      hex: { headDiameter: 4.8, headHeight: 1.9 }
    },
    nut: { widthAcrossFlats: 6.35, thickness: 2.4 },
    washer: { innerDiameter: 3.2, outerDiameter: 7.9, thickness: 0.8 }
  },
  '#6-32': {
    diameter: 3.51,
    coarsePitch: 0.7938,
    threadPerInch: 32,
    heads: {
      pan: { headDiameter: 6.5, headHeight: 2.2 },
      socketCap: { headDiameter: 6.0, headHeight: 3.2 },
      flat: { headDiameter: 7.0, headHeight: 1.9 },
      hex: { headDiameter: 5.6, headHeight: 2.3 }
    },
    nut: { widthAcrossFlats: 7.94, thickness: 2.8 },
    washer: { innerDiameter: 3.9, outerDiameter: 9.5, thickness: 0.8 }
  },
  '#8-32': {
    diameter: 4.17,
    coarsePitch: 0.7938,
    threadPerInch: 32,
    heads: {
      pan: { headDiameter: 7.4, headHeight: 2.6 },
      socketCap: { headDiameter: 7.0, headHeight: 4.0 },
      flat: { headDiameter: 8.2, headHeight: 2.2 },
      hex: { headDiameter: 6.35, headHeight: 2.7 }
    },
    nut: { widthAcrossFlats: 8.73, thickness: 3.2 },
    washer: { innerDiameter: 4.5, outerDiameter: 10.7, thickness: 1.0 }
  },
  '#10-24': {
    diameter: 4.83,
    coarsePitch: 1.058,
    threadPerInch: 24,
    heads: {
      pan: { headDiameter: 8.6, headHeight: 3.0 },
      socketCap: { headDiameter: 8.0, headHeight: 4.8 },
      flat: { headDiameter: 9.4, headHeight: 2.6 },
      hex: { headDiameter: 7.94, headHeight: 3.1 }
    },
    nut: { widthAcrossFlats: 9.53, thickness: 4.0 },
    washer: { innerDiameter: 5.3, outerDiameter: 12.7, thickness: 1.2 }
  },
  '1/4-20': {
    diameter: 6.35,
    coarsePitch: 1.27,
    threadPerInch: 20,
    heads: {
      pan: { headDiameter: 11.4, headHeight: 4.2 },
      socketCap: { headDiameter: 10.5, headHeight: 6.3 },
      flat: { headDiameter: 12.5, headHeight: 3.4 },
      hex: { headDiameter: 10.0, headHeight: 4.4 }
    },
    nut: { widthAcrossFlats: 11.11, thickness: 5.2 },
    washer: { innerDiameter: 6.9, outerDiameter: 18.0, thickness: 1.6 }
  },
  '5/16-18': {
    diameter: 7.94,
    coarsePitch: 1.411,
    threadPerInch: 18,
    heads: {
      pan: { headDiameter: 14.0, headHeight: 5.1 },
      socketCap: { headDiameter: 13.0, headHeight: 7.8 },
      flat: { headDiameter: 15.5, headHeight: 4.2 },
      hex: { headDiameter: 13.0, headHeight: 5.4 }
    },
    nut: { widthAcrossFlats: 12.7, thickness: 6.4 },
    washer: { innerDiameter: 8.7, outerDiameter: 22.0, thickness: 2.0 }
  }
};

export const fastenerDataByStandard = {
  metric: metricFastenerData,
  sae: saeFastenerData
};

export function getFastenerData(standard = 'metric') {
  return fastenerDataByStandard[standard] || metricFastenerData;
}

export function getDefaultSizeForStandard(standard = 'metric') {
  const defaults = {
    metric: 'M4',
    sae: '#8-32'
  };
  return defaults[standard] || 'M4';
}

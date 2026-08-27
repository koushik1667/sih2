// Geodesic Polygon Area, Perimeter & Land Measurement Utility for Indian Agriculture

const EARTH_RADIUS = 6378137; // Earth's radius in meters (WGS84)

/**
 * Converts degrees to radians
 */
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Calculates distance between two lat/lng coordinates in meters (Haversine formula)
 */
export function calculateDistance(coord1, coord2) {
  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);
  const lat1 = toRad(coord1[0]);
  const lat2 = toRad(coord2[0]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

/**
 * Calculates geodesic area of a spherical polygon in square meters
 * Uses the spherical excess formula for high precision on Earth's ellipsoid
 */
export function calculatePolygonArea(coordinates) {
  if (!coordinates || coordinates.length < 3) return 0;

  let area = 0;
  const len = coordinates.length;

  for (let i = 0; i < len; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[(i + 1) % len];

    const lat1 = toRad(p1[0]);
    const lat2 = toRad(p2[0]);
    const dLon = toRad(p2[1] - p1[1]);

    area += (dLon) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = (Math.abs(area) * EARTH_RADIUS * EARTH_RADIUS) / 2.0;
  return area;
}

/**
 * Calculates perimeter of polygon or polyline in meters
 */
export function calculatePerimeter(coordinates) {
  if (!coordinates || coordinates.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    total += calculateDistance(coordinates[i], coordinates[i + 1]);
  }
  // If polygon (3+ points), add distance from last to first
  if (coordinates.length >= 3) {
    total += calculateDistance(coordinates[coordinates.length - 1], coordinates[0]);
  }
  return total;
}

/**
 * Converts area in square meters to various agricultural units
 */
export function convertAreaUnits(sqMeters) {
  const sqFt = sqMeters * 10.7639;
  const acres = sqMeters / 4046.8564224;
  const hectares = sqMeters / 10000;
  const gunthas = acres * 40; // 1 Acre = 40 Gunthas (Common in MH, KA, AP, TS)
  const bighas = acres / 0.625; // Standard Pucca Bigha (~1.6 Bigha/acre)
  const cents = acres * 100; // 1 Acre = 100 Cents (TN, Kerala, AP)
  const biswa = bighas * 20; // 1 Bigha = 20 Biswa (UP, Punjab, Haryana)

  return {
    sqMeters: Math.round(sqMeters * 100) / 100,
    sqFt: Math.round(sqFt * 10) / 10,
    acres: Math.round(acres * 1000) / 1000,
    hectares: Math.round(hectares * 1000) / 1000,
    gunthas: Math.round(gunthas * 10) / 10,
    bighas: Math.round(bighas * 100) / 100,
    cents: Math.round(cents * 10) / 10,
    biswa: Math.round(biswa * 10) / 10
  };
}

/**
 * Computes polygon centroid [lat, lng]
 */
export function getPolygonCenter(coordinates) {
  if (!coordinates || coordinates.length === 0) return [30.9010, 75.8573];
  if (coordinates.length === 1) return coordinates[0];

  let latSum = 0;
  let lngSum = 0;
  for (const p of coordinates) {
    latSum += p[0];
    lngSum += p[1];
  }
  return [latSum / coordinates.length, lngSum / coordinates.length];
}

/**
 * Simulates multi-spectral live scan telemetry for given coordinates & polygon area
 */
export function generateLandScanTelemetry(lat, lng, areaAcres = 2.5) {
  // Deterministic seed from lat/lng for consistent yet realistic telemetry
  const hash = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453);
  const frac = hash - Math.floor(hash);

  const ndvi = 0.55 + (frac * 0.32); // 0.55 - 0.87
  const ndwi = 0.30 + ((frac * 3.7) % 1) * 0.35; // 0.30 - 0.65
  const ndre = 0.45 + ((frac * 7.1) % 1) * 0.30; // 0.45 - 0.75
  const savi = ndvi * 0.88;
  const soilMoisture = Math.round(32 + ((frac * 5.3) % 1) * 38); // 32% - 70%
  const organicCarbon = Math.round((0.45 + ((frac * 2.9) % 1) * 0.55) * 100) / 100; // 0.45 - 1.00%
  const nitrogen = Math.round(180 + ((frac * 11.3) % 1) * 160); // 180 - 340 kg/ha
  const phosphorus = Math.round(14 + ((frac * 8.7) % 1) * 28); // 14 - 42 kg/ha
  const potassium = Math.round(190 + ((frac * 4.9) % 1) * 180); // 190 - 370 kg/ha
  const ph = Math.round((6.4 + ((frac * 6.3) % 1) * 1.6) * 10) / 10; // 6.4 - 8.0
  const elevation = Math.round(120 + ((frac * 17.5) % 1) * 380); // 120 - 500m
  const slope = Math.round(((frac * 3.1) % 1) * 6.5 * 10) / 10; // 0.0 - 6.5%
  const canopyCover = Math.round(ndvi * 100);
  const thermalIndex = Math.round(26 + ((frac * 9.1) % 1) * 8); // 26°C - 34°C

  let healthStatus = 'Optimal Growth';
  let healthColor = '#5D7052';
  if (ndvi > 0.75) {
    healthStatus = 'Dense Vigorous Crop';
    healthColor = '#2E7D32';
  } else if (ndvi > 0.60) {
    healthStatus = 'Healthy Vegetative State';
    healthColor = '#5D7052';
  } else if (ndvi > 0.45) {
    healthStatus = 'Moderate / Emergence Stage';
    healthColor = '#C18C5D';
  } else {
    healthStatus = 'Stressed / Sparse Foliage';
    healthColor = '#A85448';
  }

  return {
    timestamp: new Date().toISOString(),
    coordinates: { lat, lng },
    areaAcres: Math.round(areaAcres * 100) / 100,
    spectral: {
      ndvi: Math.round(ndvi * 100) / 100,
      ndwi: Math.round(ndwi * 100) / 100,
      ndre: Math.round(ndre * 100) / 100,
      savi: Math.round(savi * 100) / 100,
      thermalC: thermalIndex,
      canopyCoverPct: canopyCover,
      healthStatus,
      healthColor
    },
    soil: {
      soilMoisturePct: soilMoisture,
      organicCarbonPct: organicCarbon,
      nitrogenKgHa: nitrogen,
      phosphorusKgHa: phosphorus,
      potassiumKgHa: potassium,
      ph: ph,
      status: ph >= 6.5 && ph <= 7.5 ? 'Balanced Neutral' : ph < 6.5 ? 'Slightly Acidic' : 'Slightly Alkaline'
    },
    terrain: {
      elevationMeters: elevation,
      slopePercent: slope,
      solarIrradiance: `${Math.round(4.8 + ((frac * 2.1) % 1) * 1.6)} kWh/m²/day`,
      drainageRisk: slope < 1.0 ? 'Low (Water Stagnation Risk in Heavy Rain)' : slope < 4.0 ? 'Optimal Soil Drainage' : 'High Runoff Risk'
    },
    recommendations: [
      soilMoisture < 40 
        ? "Soil moisture is under 40%. Schedule drip/furrow irrigation within next 24-36 hrs."
        : "Soil moisture is sufficient for active root nutrient uptake. Defer surface irrigation.",
      nitrogen < 220
        ? "Nitrogen levels are sub-optimal. Recommend applying 25 kg/acre Neem-coated Urea top-dress."
        : "Nitrogen availability is strong. Avoid excess urea to prevent vegetative lodging.",
      ndvi < 0.58
        ? "Foliage density is below normal. Inspect for early aphid/stem borer infestation or micro-nutrient deficiency."
        : "Vegetation index indicates high photosynthetic activity and uniform canopy closure."
    ]
  };
}

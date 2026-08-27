/**
 * AgriSphere Unified Analysis History & Audit Logger Service
 * Stores, indexes, and retrieves all analyses across all application modules
 */

const HISTORY_STORAGE_KEY = 'agrisphere_universal_analysis_history';

// Default initial demo history entries so user sees a rich audit ledger immediately
const DEFAULT_INITIAL_HISTORY = [
  {
    id: "hist-1740645600001",
    timestamp: "2026-02-27T08:30:00.000Z",
    type: "satellite",
    title: "GeoSR-AI Super-Resolution • Madamanuru Parcel (AP)",
    location: "Madamanuru, Nellore (Andhra Pradesh)",
    coordinates: { lat: 14.25658, lon: 79.85595 },
    summary: "Super-resolved 2.50m GSD satellite imagery analysis using EDSR neural architecture (16x spatial scaling).",
    metrics: [
      { label: "Acreage", value: "8.849 Acres" },
      { label: "Mean NDVI", value: "0.78 (Vigorous)" },
      { label: "Model", value: "EDSR (PSNR 35.12 dB)" },
      { label: "Bioavailability", value: "44.2%" }
    ],
    status: "Completed",
    tags: ["Satellite SRM", "NDVI Biomass", "2.5m GSD"],
    details: {
      crop: "Paddy (MTU-1010)",
      recommended_crop: "Black Gram / Groundnut",
      est_profit: "₹45,000 / Acre"
    }
  },
  {
    id: "hist-1740645600002",
    timestamp: "2026-02-27T07:15:00.000Z",
    type: "land_measure",
    title: "Geodesic Land Measurement • East Field Plot",
    location: "Warangal District (Telangana)",
    coordinates: { lat: 17.9780, lon: 79.5940 },
    summary: "4-vertex geodesic ellipsoidal polygon scanner measurement with cadastral telemetry overlay.",
    metrics: [
      { label: "Calculated Area", value: "5.420 Acres" },
      { label: "Perimeter", value: "680 Meters" },
      { label: "Sq. Footage", value: "236,095 sq.ft" },
      { label: "Canopy Density", value: "76%" }
    ],
    status: "Verified",
    tags: ["Land Scanner", "Geodesic Area", "GIS"],
    details: {
      points_count: 4,
      elevation: "280m",
      crop: "Cotton"
    }
  },
  {
    id: "hist-1740645600003",
    timestamp: "2026-02-26T16:45:00.000Z",
    type: "soil_precision",
    title: "Soil Health Card & 3-Season NPK Depletion Simulation",
    location: "Ludhiana Farm Basin (Punjab)",
    coordinates: { lat: 30.9010, lon: 75.8573 },
    summary: "Evaluated NPK drawdowns comparing continuous wheat mono-cropping vs legume crop rotation.",
    metrics: [
      { label: "Soil Health Score", value: "78 / 100" },
      { label: "Net Profit / Ac", value: "₹28,000" },
      { label: "Mono Loss Risk", value: "-₹4,500" },
      { label: "Rotation Gain", value: "+₹11,200" }
    ],
    status: "Calculated",
    tags: ["Soil NPK", "Crop Economics", "3-Season ROI"],
    details: {
      nitrogen: "165 kg/ha",
      phosphorus: "24 kg/ha",
      potassium: "140 kg/ha",
      ph: 6.8,
      recommended_rotation: "Chickpea (Gram) + 42 kg/ha N-Fixation"
    }
  },
  {
    id: "hist-1740645600004",
    timestamp: "2026-02-26T11:20:00.000Z",
    type: "weather",
    title: "IMD Doppler Radar & 24h Optimal Spray Window",
    location: "Kolhapur Agro-Zone (Maharashtra)",
    coordinates: { lat: 16.7050, lon: 74.2433 },
    summary: "Microclimate precipitation risk scan and pesticide/herbicide spraying feasibility evaluation.",
    metrics: [
      { label: "Air Temperature", value: "28.4°C" },
      { label: "Relative Humidity", value: "54%" },
      { label: "Wind Velocity", value: "8.2 km/h" },
      { label: "Spray Window", value: "06:00 - 10:00 AM (Ideal)" }
    ],
    status: "Active Window",
    tags: ["Weather Radar", "Spray Window", "Precipitation"],
    details: {
      spray_status: "Highly Favorable",
      uv_index: 6.2,
      evapotranspiration: "4.8 mm/day"
    }
  },
  {
    id: "hist-1740645600005",
    timestamp: "2026-02-25T14:10:00.000Z",
    type: "ai_advisor",
    title: "Krishi Mitra AI Voice Advisory • Yellowing Leaves in Paddy",
    location: "Guntur District (Andhra Pradesh)",
    coordinates: { lat: 16.3067, lon: 80.4365 },
    summary: "Voice query diagnosed Zinc deficiency (Khaira disease) vs Nitrogen yellowing in coastal paddy soil.",
    metrics: [
      { label: "Topic", value: "Crop Nutrition / Deficiency" },
      { label: "Language", value: "Telugu (తెలుగు)" },
      { label: "ICAR Guideline", value: "Zinc Sulphate Foliar Spray" },
      { label: "Confidence", value: "98.2%" }
    ],
    status: "Answered",
    tags: ["AI Voice Agent", "Pest & Nutrition", "Krishi Mitra"],
    details: {
      dosage: "Zinc Sulphate 0.5% (5g/L) + Urea 1%",
      citation: "ICAR-IIRR Rice Advisory Protocol 2026"
    }
  }
];

class AnalysisHistoryService {
  constructor() {
    this.history = this.loadHistory();
    this.listeners = new Set();
  }

  loadHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}
    return [...DEFAULT_INITIAL_HISTORY];
  }

  saveHistory() {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
      this.notifyListeners();
    } catch (_) {}
  }

  notifyListeners() {
    this.listeners.forEach(fn => {
      try { fn([...this.history]); } catch (_) {}
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener([...this.history]);
    return () => this.listeners.delete(listener);
  }

  getAll() {
    return [...this.history];
  }

  getByType(type) {
    if (!type || type === 'all') return [...this.history];
    return this.history.filter(h => h.type === type);
  }

  addEntry({ type, title, location, coordinates, summary, metrics = [], details = {}, tags = [], status = "Completed" }) {
    const newEntry = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      title: title || `${type.toUpperCase()} Analysis`,
      location: location || "Field Plot, India",
      coordinates: coordinates || { lat: 14.25658, lon: 79.85595 },
      summary: summary || "Automated agronomic calculation completed.",
      metrics,
      details,
      tags,
      status
    };

    // Prepend to start of history
    this.history = [newEntry, ...this.history.slice(0, 99)]; // retain last 100 entries
    this.saveHistory();
    return newEntry;
  }

  deleteEntry(id) {
    this.history = this.history.filter(h => h.id !== id);
    this.saveHistory();
  }

  clearAll() {
    this.history = [];
    this.saveHistory();
  }

  exportAsJSON() {
    return JSON.stringify(this.history, null, 2);
  }
}

export const historyService = new AnalysisHistoryService();

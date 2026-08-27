import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Maximize2,
  Minimize2,
  Layers,
  Crosshair,
  Trash2,
  RotateCcw,
  Sparkles,
  Play,
  Save,
  Check,
  Search,
  Compass,
  Radio,
  FileText,
  Copy,
  Info,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Droplets,
  Activity,
  Sun,
  Mountain,
  Share2,
  Download,
  Eye,
  EyeOff,
  Navigation,
  Globe,
  Tag,
  X,
  Satellite
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  calculatePolygonArea, 
  calculatePerimeter, 
  convertAreaUnits, 
  getPolygonCenter,
  generateLandScanTelemetry,
  calculateDistance 
} from '../utils/geoMeasurement';
import { 
  reverseGeocode, 
  getAgroClimaticZone, 
  searchLocations,
  INDIAN_AGRICULTURAL_PLACES 
} from '../services/geoService';

// Custom Map Marker Icons using Leaflet divIcon for crisp aesthetics
const createPinIcon = (number, color = '#5D7052') => {
  return L.divIcon({
    className: 'custom-land-pin',
    html: `
      <div style="
        background: ${color};
        color: #FEFEFA;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 11px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid #FEFEFA;
      ">
        ${number}
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

const createSearchPinIcon = () => {
  return L.divIcon({
    className: 'custom-search-pin',
    html: `
      <div style="
        background: #C18C5D;
        color: #FEFEFA;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(193, 140, 93, 0.6);
        border: 2.5px solid #FEFEFA;
        animation: bounce 1s infinite alternate;
      ">
        📍
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
};

// Preset demo polygons across India
const PRESET_PARCELS = [
  {
    id: 'punjab_wheat',
    name: 'Ludhiana Wheat Estate (Punjab)',
    state: 'Punjab',
    crop: 'Wheat',
    coords: [
      [30.9010, 75.8573],
      [30.9045, 75.8610],
      [30.8990, 75.8645],
      [30.8965, 75.8590]
    ]
  },
  {
    id: 'maharashtra_cane',
    name: 'Kolhapur Sugarcane Basin (MH)',
    state: 'Maharashtra',
    crop: 'Sugarcane',
    coords: [
      [16.7050, 74.2433],
      [16.7090, 74.2480],
      [16.7035, 74.2510],
      [16.7010, 74.2450]
    ]
  },
  {
    id: 'telangana_cotton',
    name: 'Warangal Cotton Zone (TS)',
    state: 'Telangana',
    crop: 'Cotton',
    coords: [
      [17.9780, 79.5940],
      [17.9815, 79.5985],
      [17.9760, 79.6015],
      [17.9735, 79.5960]
    ]
  },
  {
    id: 'andhra_chilli',
    name: 'Guntur Chilli Farmlands (AP)',
    state: 'Andhra Pradesh',
    crop: 'Chilli',
    coords: [
      [16.3067, 80.4365],
      [16.3095, 80.4410],
      [16.3050, 80.4435],
      [16.3025, 80.4390]
    ]
  }
];

export const PRESET_PLOTS = PRESET_PARCELS;

export const LiveLandScannerMap = () => {
  const { locationState, refreshOnce, isTracking, toggleTracking } = useLocation();
  const { addFarm, showToast, setActiveTab, farms, selectedFarm, setSelectedFarm, sendParcelToGeoSR } = useApp();
  const { user, userProfile } = useAuth();
  const { t } = useLanguage();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polygonLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const searchMarkerRef = useRef(null);
  const labelLayerRef = useRef(null);

  // States
  const [mapLayer, setMapLayer] = useState('hybrid'); // 'hybrid' | 'satellite' | 'street' | 'topo'
  const [showAreaNames, setShowAreaNames] = useState(true);
  const [points, setPoints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanTelemetry, setScanTelemetry] = useState(null);
  const [activeUnit, setActiveUnit] = useState('acres'); // 'acres' | 'hectares' | 'gunthas' | 'bighas' | 'sqMeters'
  const [fieldAddress, setFieldAddress] = useState(null);
  const [savingFarm, setSavingFarm] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Save Modal States
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveFormData, setSaveFormData] = useState({
    name: '',
    farmer_name: '',
    current_crop: 'Wheat',
    soil_type: 'Alluvial Loam',
    irrigation_type: 'Tube Well / Borewell'
  });
  const [savedSuccessModal, setSavedSuccessModal] = useState(null);

  const initialLat = locationState?.coords?.latitude || 30.9010;
  const initialLng = locationState?.coords?.longitude || 75.8573;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 16,
        minZoom: 3,
        maxZoom: 21,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Layer groups
      markersGroupRef.current = L.layerGroup().addTo(map);
      polygonLayerRef.current = L.polygon([], {
        color: '#5D7052',
        weight: 3,
        opacity: 0.95,
        fillColor: '#5D7052',
        fillOpacity: 0.35,
        dashArray: '6, 6'
      }).addTo(map);

      // Click handler to drop land points
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setPoints((prev) => [...prev, [lat, lng]]);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Tile Layer and Area Name Labels
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let baseTileUrl = '';
    let attribution = '';
    let maxNativeZoom = 19;
    let subdomains = ['a', 'b', 'c'];

    if (mapLayer === 'hybrid') {
      // High-resolution Google Hybrid Satellite with village, town & road labels built in
      baseTileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      attribution = 'Imagery © Google';
      maxNativeZoom = 20;
      subdomains = ['0', '1', '2', '3'];
    } else if (mapLayer === 'satellite') {
      // High-resolution Google Pure Optical Satellite
      baseTileUrl = 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
      attribution = 'Imagery © Google';
      maxNativeZoom = 20;
      subdomains = ['0', '1', '2', '3'];
    } else if (mapLayer === 'topo') {
      baseTileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'OpenTopoMap (CC-BY-SA)';
      maxNativeZoom = 17;
      subdomains = ['a', 'b', 'c'];
    } else {
      // Street / OSM
      baseTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '© OpenStreetMap contributors';
      maxNativeZoom = 19;
      subdomains = ['a', 'b', 'c'];
    }

    // Add base imagery tile with maxNativeZoom so Leaflet seamlessly upscales on high zoom levels
    L.tileLayer(baseTileUrl, {
      maxZoom: 22,
      maxNativeZoom,
      subdomains,
      attribution
    }).addTo(map);

    // If showAreaNames is enabled on satellite layers, overlay CartoDB Voyager place names
    if (showAreaNames && mapLayer === 'satellite') {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        maxZoom: 22,
        maxNativeZoom: 19,
        subdomains: ['a', 'b', 'c', 'd'],
        pane: 'overlayPane',
        opacity: 0.95
      }).addTo(map);
    }
  }, [mapLayer, showAreaNames]);

  // Update Markers and Polygon on Points Change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !polygonLayerRef.current) return;

    markersGroupRef.current.clearLayers();

    points.forEach((pt, index) => {
      const marker = L.marker(pt, {
        icon: createPinIcon(index + 1, index === points.length - 1 ? '#C18C5D' : '#5D7052'),
        draggable: true
      });

      marker.bindTooltip(`Point #${index + 1}: ${pt[0].toFixed(5)}, ${pt[1].toFixed(5)}`, {
        direction: 'top',
        className: 'bg-[#2C2C24] text-white text-[11px] font-bold rounded-lg px-2 py-1'
      });

      marker.on('dragend', (e) => {
        const newLatLng = e.target.getLatLng();
        setPoints((prev) => {
          const next = [...prev];
          next[index] = [newLatLng.lat, newLatLng.lng];
          return next;
        });
      });

      markersGroupRef.current.addLayer(marker);
    });

    // Update polygon
    if (points.length >= 3) {
      polygonLayerRef.current.setLatLngs(points);
      polygonLayerRef.current.setStyle({
        color: '#5D7052',
        fillColor: '#5D7052',
        fillOpacity: 0.35
      });
    } else if (points.length === 2) {
      polygonLayerRef.current.setLatLngs(points);
      polygonLayerRef.current.setStyle({
        color: '#C18C5D',
        fillOpacity: 0
      });
    } else {
      polygonLayerRef.current.setLatLngs([]);
    }

    // Resolve address of centroid if we have points
    if (points.length > 0) {
      const center = getPolygonCenter(points);
      reverseGeocode(center[0], center[1]).then(setFieldAddress);
    }
  }, [points]);

  // Live Debounced Autocomplete Search
  useEffect(() => {
    const q = typeof searchQuery === 'string' ? searchQuery.trim() : '';
    if (!q || q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await searchLocations(q);
        setSuggestions(results.slice(0, 6));
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.warn("Search suggestion error:", err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Land measurements
  const sqMeters = calculatePolygonArea(points);
  const perimeterMeters = calculatePerimeter(points);
  const units = convertAreaUnits(sqMeters);
  const centerCoords = getPolygonCenter(points.length > 0 ? points : [[initialLat, initialLng]]);

  // Pan to Live GPS
  const handleLocateMe = async () => {
    try {
      const fix = await refreshOnce();
      const lat = fix.coords.latitude;
      const lng = fix.coords.longitude;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.5 });
      }
      showToast(`Located GPS fix: ${lat.toFixed(5)}, ${lng.toFixed(5)}`, 'success');
    } catch (e) {
      showToast('Could not acquire GPS: ' + e.message, 'error');
    }
  };

  // Select Search Item
  const handleSelectLocation = (item) => {
    if (!item) return;
    setShowSuggestions(false);
    setSelectedSearchResult(item);
    const resolvedName = item.displayName || item.name || item.town || 'Selected Area';
    setSearchQuery(resolvedName);

    const lat = typeof item.lat === 'number' ? item.lat : parseFloat(item.lat);
    const lon = typeof item.lon === 'number' ? item.lon : parseFloat(item.lon);

    if (mapInstanceRef.current && !isNaN(lat) && !isNaN(lon)) {
      const map = mapInstanceRef.current;
      map.flyTo([lat, lon], 16, { duration: 1.5 });

      // Remove existing search marker if any
      if (searchMarkerRef.current) {
        map.removeLayer(searchMarkerRef.current);
      }

      // Add prominent search pin with informative popup
      const zone = getAgroClimaticZone(lat, lon);
      const marker = L.marker([lat, lon], {
        icon: createSearchPinIcon()
      }).addTo(map);

      const titleName = item.town || item.name || resolvedName;
      const subtitle = [item.district, item.state].filter(Boolean).join(', ');
      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 200px;">
          <div style="font-size: 10px; font-weight: 800; color: #5D7052; text-transform: uppercase; margin-bottom: 2px;">
            📍 Located Area
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #2C2C24; margin-bottom: 4px;">
            ${titleName}
          </div>
          <div style="font-size: 11px; color: #78786C; margin-bottom: 6px;">
            ${subtitle}
          </div>
          <div style="background: #F0EBE5; padding: 6px; border-radius: 8px; font-size: 10px; color: #2C2C24; margin-bottom: 8px;">
            <strong>Agro Zone:</strong> ${zone?.name || 'Agro Climatic Zone'}<br/>
            <strong>Coords:</strong> ${lat.toFixed(5)}°N, ${lon.toFixed(5)}°E
          </div>
          <div style="display: flex; gap: 4px;">
            <button id="add-search-pin-btn" style="flex: 1; background: #5D7052; color: #FFF; border: none; border-radius: 6px; padding: 5px 8px; font-size: 10px; font-weight: 700; cursor: pointer;">
              + Add Boundary Pin
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { offset: [0, -10] }).openPopup();

      marker.on('popupopen', () => {
        const btn = document.getElementById('add-search-pin-btn');
        if (btn) {
          btn.onclick = () => {
            setPoints((prev) => [...prev, [lat, lon]]);
            showToast(`Added ${item.town || item.name || 'point'} to boundary polygon`, 'success');
            marker.closePopup();
          };
        }
      });

      searchMarkerRef.current = marker;
      showToast(`Found: ${resolvedName}`, 'success');
    }
  };

  // Search Submit
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const q = typeof searchQuery === 'string' ? searchQuery.trim() : '';
    if (!q) return;

    setSearching(true);
    try {
      const results = await searchLocations(q);
      if (results && results.length > 0) {
        handleSelectLocation(results[0]);
      } else {
        showToast('Location not found. Try entering city, district, village, or lat,lng coordinates.', 'warning');
      }
    } catch (err) {
      showToast('Search query error: ' + (err?.message || 'Failed to search location'), 'error');
    } finally {
      setSearching(false);
    }
  };

  // Trigger Multi-Spectral & Soil Live Scan
  const handleStartScan = () => {
    if (points.length < 3) {
      showToast('Please add at least 3 corner boundary points on the map to scan a land parcel.', 'warning');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanTelemetry(null);

    // Zoom map to fit polygon
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds(points);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }

    const steps = [
      { pct: 20, msg: "Acquiring Sentinel-2 & ISRO Cartosat tiles..." },
      { pct: 45, msg: "Processing B04 (Red) & B08 (NIR) Multi-Spectral Bands..." },
      { pct: 70, msg: "Synthesizing ICAR Soil Nutrients & Moisture Layer..." },
      { pct: 90, msg: "Running Krishi AI Agronomic Diagnostic Model..." },
      { pct: 100, msg: "Scan Complete" }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setScanProgress(steps[stepIdx].pct);
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        const telemetry = generateLandScanTelemetry(centerCoords[0], centerCoords[1], units.acres || 2.5);
        setScanTelemetry(telemetry);
        showToast('Land scan complete! Multi-spectral health & soil telemetry generated.', 'success');
      }
    }, 450);
  };

  // Quick Preset Loader
  const handleLoadPreset = (preset) => {
    setPoints(preset.coords);
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds(preset.coords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
    showToast(`Loaded ${preset.name} (${preset.state})`, 'success');
  };

  // Undo Last Point
  const handleUndo = () => {
    if (points.length === 0) return;
    setPoints((prev) => prev.slice(0, -1));
  };

  // Clear Boundary
  const handleClear = () => {
    setPoints([]);
    setScanTelemetry(null);
    if (searchMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(searchMarkerRef.current);
      searchMarkerRef.current = null;
    }
  };

  // Open Save Modal with prefilled smart metadata
  const openSaveModal = () => {
    if (points.length < 3) {
      showToast('Need at least 3 points defining the parcel boundary to save.', 'warning');
      return;
    }
    const defaultName = fieldAddress?.town 
      ? `${fieldAddress.town} Plot (${units.acres} Acres)` 
      : (fieldAddress?.district ? `${fieldAddress.district} Plot (${units.acres} Acres)` : `Field Plot (${units.acres} Acres)`);
    const farmerName = user?.displayName || userProfile?.displayName || (user?.email ? user.email.split('@')[0] : 'Farmer');
    setSaveFormData({
      name: defaultName,
      farmer_name: farmerName,
      current_crop: 'Wheat',
      soil_type: 'Alluvial Loam',
      irrigation_type: 'Tube Well / Borewell',
      location: fieldAddress?.district ? `${fieldAddress.district}, ${fieldAddress.state}` : `${centerCoords[0].toFixed(4)}°N, ${centerCoords[1].toFixed(4)}°E`
    });
    setShowSaveModal(true);
  };

  // Confirm Save to Farm Management Database
  const handleConfirmSave = async (e) => {
    if (e) e.preventDefault();
    if (!saveFormData.name.trim()) {
      showToast('Please enter a farm name to save.', 'warning');
      return;
    }
    setSavingFarm(true);
    try {
      const savedFarm = await addFarm({
        name: saveFormData.name,
        farmer_name: saveFormData.farmer_name || 'Farmer',
        current_crop: saveFormData.current_crop,
        soil_type: saveFormData.soil_type,
        irrigation_type: saveFormData.irrigation_type,
        location: saveFormData.location,
        land_size_acres: parseFloat(units.acres) || 1.0,
        size: `${units.acres} Acres`,
        health: scanTelemetry?.spectral?.healthStatus || 'Optimal Growth',
        coordinates: {
          lat: centerCoords[0],
          lng: centerCoords[1],
          latitude: centerCoords[0],
          longitude: centerCoords[1],
          boundaryPolygon: points
        },
        boundary_polygon: points,
        scanData: scanTelemetry
      });
      setShowSaveModal(false);
      setSavedSuccessModal(savedFarm);
      showToast(`Field "${savedFarm.name}" saved to your registered farm portfolio!`, 'success');
    } catch (e) {
      showToast('Error saving farm: ' + e.message, 'error');
    } finally {
      setSavingFarm(false);
    }
  };

  // Save to Farm Management Database (Quick Save fallback)
  const handleSaveFarm = () => {
    openSaveModal();
  };

  const handleCopyCoords = () => {
    const text = `${centerCoords[0].toFixed(6)}, ${centerCoords[1].toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    showToast(`Copied centroid coordinates: ${text}`, 'success');
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // Automatically take measured area into GeoSR-AI Studio & Generate Report
  const handleTakeToGeoSR = () => {
    if (points.length < 3) {
      showToast('Please add at least 3 boundary corner points on the map to define the land parcel.', 'warning');
      return;
    }
    const parcelName = fieldAddress?.town 
      ? `${fieldAddress.town} Parcel (${units.acres} Ac)` 
      : (fieldAddress?.district ? `${fieldAddress.district} Parcel (${units.acres} Ac)` : `Measured Parcel (${units.acres} Ac)`);

    const parcelData = {
      name: parcelName,
      acres: parseFloat(units.acres) || 2.5,
      lat: centerCoords[0],
      lon: centerCoords[1],
      points: points,
      address: fieldAddress,
      crop: saveFormData?.current_crop || 'Standing Crop',
      telemetry: scanTelemetry || generateLandScanTelemetry(centerCoords[0], centerCoords[1], units.acres || 2.5)
    };

    if (typeof sendParcelToGeoSR === 'function') {
      sendParcelToGeoSR(parcelData);
    } else {
      setActiveTab('land_satellite');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      
      {/* Top Header Card */}
      <div className="bg-[#FEFEFA] border border-[#DED8CF] shadow-soft rounded-[2rem] p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5D7052]/10 text-[#5D7052] text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Live Geospatial Land Measurement &amp; Multi-Spectral Scanner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2C2C24] font-serif leading-tight">
              Interactive Land Measuring &amp; Spectral Scanner
            </h1>
            <p className="text-xs sm:text-sm text-[#78786C] mt-1">
              Search any Indian village, district, or coordinates. Draw parcel boundaries on high-resolution satellite maps with area names &amp; road labels.
            </p>
          </div>

          {/* Quick Presets Pill Bar & Registered Farm Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#78786C] uppercase">Parcels:</span>
            {farms && farms.length > 0 && farms.map((f) => {
              const boundary = f.coordinates?.boundaryPolygon || f.boundary_polygon;
              if (!boundary || boundary.length < 3) return null;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setPoints(boundary);
                    if (mapInstanceRef.current) {
                      const bounds = L.latLngBounds(boundary);
                      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
                    }
                    showToast(`Loaded "${f.name}" boundary onto map!`, 'success');
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#5D7052]/15 hover:bg-[#5D7052]/25 border border-[#5D7052]/40 text-[11px] font-bold text-[#5D7052] transition cursor-pointer flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{f.name}</span>
                </button>
              );
            })}
            {PRESET_PARCELS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadPreset(p)}
                className="px-2.5 py-1 rounded-full bg-[#F0EBE5]/60 hover:bg-[#F0EBE5] border border-[#DED8CF] text-[11px] font-semibold text-[#2C2C24] transition cursor-pointer"
              >
                {p.name.split(' ')[0]} ({p.state})
              </button>
            ))}
          </div>
        </div>

        {/* Search & Location Bar with Autocomplete */}
        <div className="mt-4 pt-4 border-t border-[#DED8CF]/60 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <div className="flex-1 w-full relative">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78786C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder="Search Indian village, taluk, district, or coordinates (e.g. Miyapur, Ludhiana, 17.493, 78.342)..."
                className="w-full pl-9 pr-24 py-2.5 text-xs bg-[#F0EBE5]/40 focus:bg-[#FEFEFA] border border-[#DED8CF] focus:border-[#5D7052] rounded-full outline-none transition text-[#2C2C24] shadow-inner"
              />
              <button
                type="submit"
                disabled={searching}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] text-xs font-bold transition cursor-pointer shadow-xs"
              >
                {searching ? 'Locating...' : 'Search'}
              </button>
            </form>

            {/* Autocomplete Suggestions Popover */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#FEFEFA] border border-[#DED8CF] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-[#DED8CF]/40">
                <div className="px-3 py-1.5 bg-[#F0EBE5]/60 text-[10px] font-bold text-[#78786C] uppercase flex items-center justify-between">
                  <span>Suggested Agricultural Locations &amp; Towns</span>
                  <span>{suggestions.length} matches</span>
                </div>
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectLocation(item)}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#5D7052]/10 transition flex items-center justify-between gap-2 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#5D7052]/10 text-[#5D7052] group-hover:bg-[#5D7052] group-hover:text-white flex items-center justify-center transition shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2C2C24] group-hover:text-[#5D7052]">
                          {item.town || item.displayName}
                        </div>
                        <div className="text-[11px] text-[#78786C]">
                          {item.district ? item.district + ', ' : ''}{item.state}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0EBE5] text-[#5D7052] font-semibold shrink-0">
                      {item.tag || 'Map Point'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Hubs & Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            <button
              type="button"
              onClick={handleLocateMe}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FEFEFA] hover:bg-[#F0EBE5] border border-[#DED8CF] text-xs font-bold text-[#5D7052] shadow-sm transition hover:scale-102 cursor-pointer"
              title="Fly to Current Live GPS Location"
            >
              <Crosshair className="w-3.5 h-3.5 animate-pulse" />
              <span>Locate Me</span>
            </button>

            {/* Toggle Area Names & Place Labels */}
            <button
              type="button"
              onClick={() => setShowAreaNames(!showAreaNames)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-bold transition cursor-pointer ${
                showAreaNames
                  ? 'bg-[#5D7052]/15 border-[#5D7052] text-[#5D7052]'
                  : 'bg-[#FEFEFA] border-[#DED8CF] text-[#78786C] hover:text-[#2C2C24]'
              }`}
              title="Toggle Place, Village, and Road Name Labels"
            >
              {showAreaNames ? <Eye className="w-3.5 h-3.5 text-[#5D7052]" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Area Names: {showAreaNames ? 'ON' : 'OFF'}</span>
            </button>

            {/* Layer Switcher */}
            <div className="flex items-center p-0.5 bg-[#F0EBE5]/60 rounded-full border border-[#DED8CF]">
              {[
                { id: 'hybrid', label: 'Hybrid Satellite' },
                { id: 'street', label: 'Streets' },
                { id: 'satellite', label: 'Pure Sat' },
                { id: 'topo', label: 'Contours' }
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setMapLayer(l.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                    mapLayer === l.id
                      ? 'bg-[#5D7052] text-[#FEFEFA] shadow-sm'
                      : 'text-[#78786C] hover:text-[#2C2C24]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Location Pills for Instant Navigation */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-bold text-[#78786C] uppercase shrink-0">Agricultural Hubs:</span>
          {INDIAN_AGRICULTURAL_PLACES.slice(0, 7).map((hub, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectLocation(hub)}
              className="px-2.5 py-1 rounded-full bg-[#F0EBE5]/50 hover:bg-[#5D7052]/15 hover:border-[#5D7052] border border-[#DED8CF] text-[11px] font-medium text-[#2C2C24] transition shrink-0 cursor-pointer"
            >
              {hub.town} ({hub.state.slice(0, 2)})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left/Center) + Live Measurements & Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map Viewport (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="relative rounded-[2.25rem] overflow-hidden border border-[#DED8CF] shadow-float bg-[#2C2C24] min-h-[480px] sm:min-h-[580px] flex flex-col">
            
            {/* Map Canvas */}
            <div ref={mapContainerRef} className="w-full h-full min-h-[480px] sm:min-h-[580px] z-10" />

            {/* Map Floating HUD: Instructions & Drawing Controls */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 max-w-[280px] sm:max-w-xs pointer-events-none">
              <div className="bg-[#FEFEFA]/95 backdrop-blur-md border border-[#DED8CF] rounded-2xl p-2.5 shadow-md pointer-events-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C2C24]">
                  <span className="w-2 h-2 rounded-full bg-[#5D7052] animate-ping" />
                  <span>Click map to add boundary corner pins</span>
                </div>
                <p className="text-[10px] text-[#78786C] mt-0.5">
                  Points placed: <strong className="text-[#5D7052]">{points.length}</strong> (need 3+ for closed parcel)
                </p>
              </div>
            </div>

            {/* Floating Top Right: Action Buttons */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleUndo}
                disabled={points.length === 0}
                className="p-2 rounded-full bg-[#FEFEFA]/95 hover:bg-[#F0EBE5] border border-[#DED8CF] text-[#2C2C24] shadow-md transition disabled:opacity-40 cursor-pointer"
                title="Undo last point"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={points.length === 0}
                className="p-2 rounded-full bg-[#FEFEFA]/95 hover:bg-[#A85448]/15 border border-[#DED8CF] text-[#A85448] shadow-md transition disabled:opacity-40 cursor-pointer"
                title="Clear all points"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Scanning Radar Overlay Animation */}
            {isScanning && (
              <div className="absolute inset-0 z-30 bg-[#2C2C24]/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#5D7052] animate-spin-slow" />
                  <div className="absolute inset-4 rounded-full border border-[#C18C5D] animate-ping opacity-40" />
                  <div className="absolute inset-8 rounded-full bg-[#5D7052]/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#FEFEFA] animate-pulse" />
                  </div>
                  {/* Radar Line Sweep */}
                  <div className="absolute inset-0 origin-center animate-spin" style={{ animationDuration: '2s' }}>
                    <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-[#5D7052]" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#FEFEFA] font-serif mb-1">
                  Multi-Spectral Land Scanning Active
                </h3>
                <p className="text-xs text-[#DED8CF] max-w-sm mb-3">
                  Processing Sentinel-2 optical bands &amp; ICAR soil agro-climatic grid for coordinates: {centerCoords[0].toFixed(5)}°N, {centerCoords[1].toFixed(5)}°E
                </p>

                {/* Progress Bar */}
                <div className="w-64 max-w-full bg-[#FEFEFA]/20 rounded-full h-2 overflow-hidden mb-2">
                  <div 
                    className="bg-[#5D7052] h-full rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-[#FEFEFA]/80">{scanProgress}% completed</span>
              </div>
            )}

            {/* Bottom Map Bar: Centroid Coordinates & Fast Scan Trigger */}
            <div className="absolute bottom-3 inset-x-3 z-20 bg-[#FEFEFA]/95 backdrop-blur-md border border-[#DED8CF] rounded-2xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#5D7052] shrink-0" />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#2C2C24]">
                      {centerCoords[0].toFixed(5)}° N, {centerCoords[1].toFixed(5)}° E
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCoords}
                      className="text-[#78786C] hover:text-[#5D7052] transition cursor-pointer"
                      title="Copy Coordinates"
                    >
                      {copiedCoords ? <Check className="w-3 h-3 text-[#5D7052]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#78786C] truncate max-w-[220px] sm:max-w-xs">
                    {fieldAddress?.displayName || 'Centroid Field Parcel Coordinates'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {points.length >= 3 && (
                  <button
                    type="button"
                    onClick={handleTakeToGeoSR}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[#C18C5D] hover:bg-[#A87448] text-[#FEFEFA] shadow-soft transition hover:scale-102 cursor-pointer"
                    title="Send this measured area directly into GeoSR-AI Studio for 4x Super-Resolution & Report"
                  >
                    <Satellite className="w-3.5 h-3.5" />
                    <span>Run GeoSR-AI Report</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleStartScan}
                  disabled={isScanning || points.length < 3}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shadow-soft transition cursor-pointer ${
                    points.length >= 3
                      ? 'bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] hover:scale-102'
                      : 'bg-[#DED8CF] text-[#78786C] cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Scan Land Parcel</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Real-Time Measurements & Live Scan Telemetry Sidebar (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Measured Land Size Breakdown Card */}
          <div className="bg-[#FEFEFA] border border-[#DED8CF] rounded-[2rem] p-5 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2C2C24] font-serif">
                    Measured Land Area
                  </h3>
                  <span className="text-[10px] text-[#78786C]">Geodesic Ellipsoidal Calculation</span>
                </div>
              </div>

              {/* Unit Selector */}
              <div className="flex items-center p-0.5 bg-[#F0EBE5]/70 rounded-full border border-[#DED8CF]">
                {[
                  { id: 'acres', label: 'Acres' },
                  { id: 'gunthas', label: 'Gunthas' },
                  { id: 'bighas', label: 'Bighas' },
                  { id: 'hectares', label: 'Ha' }
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setActiveUnit(u.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                      activeUnit === u.id
                        ? 'bg-[#5D7052] text-[#FEFEFA] shadow-xs'
                        : 'text-[#78786C] hover:text-[#2C2C24]'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Area Number */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F0EBE5]/50 to-[#FEFEFA] border border-[#DED8CF] text-center">
              <div className="text-3xl sm:text-4xl font-bold font-serif text-[#2C2C24] tracking-tight">
                {points.length >= 3 ? (
                  <>
                    {activeUnit === 'acres' && `${units.acres} `}
                    {activeUnit === 'gunthas' && `${units.gunthas} `}
                    {activeUnit === 'bighas' && `${units.bighas} `}
                    {activeUnit === 'hectares' && `${units.hectares} `}
                    {activeUnit === 'sqMeters' && `${units.sqMeters} `}
                    <span className="text-sm font-normal text-[#5D7052]">
                      {activeUnit === 'acres' && 'Acres'}
                      {activeUnit === 'gunthas' && 'Gunthas (Guntas)'}
                      {activeUnit === 'bighas' && 'Pucca Bighas'}
                      {activeUnit === 'hectares' && 'Hectares'}
                    </span>
                  </>
                ) : (
                  <span className="text-lg text-[#78786C] font-normal">
                    {points.length === 0 ? 'Click map to start measuring' : `Add ${3 - points.length} more point${3 - points.length > 1 ? 's' : ''}`}
                  </span>
                )}
              </div>
              <div className="mt-2 pt-2 border-t border-[#DED8CF]/60 flex items-center justify-around text-xs text-[#78786C]">
                <div>
                  <span className="text-[10px] uppercase font-bold block">Fence Perimeter</span>
                  <strong className="text-[#2C2C24]">
                    {perimeterMeters > 0 ? `${perimeterMeters.toFixed(1)} m (${(perimeterMeters / 1000).toFixed(2)} km)` : '0 m'}
                  </strong>
                </div>
                <div className="h-6 w-px bg-[#DED8CF]" />
                <div>
                  <span className="text-[10px] uppercase font-bold block">Sq. Footage</span>
                  <strong className="text-[#2C2C24]">
                    {units.sqFt > 0 ? `${units.sqFt.toLocaleString()} sq ft` : '0 sq ft'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Quick Regional Conversion Table */}
            {points.length >= 3 && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F0EBE5]/40 border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] uppercase font-bold block">Standard Units</span>
                  <span className="font-semibold text-[#2C2C24]">{units.acres} Acres ({units.hectares} ha)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F0EBE5]/40 border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] uppercase font-bold block">Regional Units</span>
                  <span className="font-semibold text-[#5D7052]">{units.gunthas} Gunthas / {units.bighas} Bighas</span>
                </div>
              </div>
            )}

            {/* Primary Action: Send Measured Parcel Directly to GeoSR-AI */}
            <button
              type="button"
              onClick={handleTakeToGeoSR}
              disabled={points.length < 3}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] text-xs font-bold shadow-soft transition-all disabled:opacity-40 cursor-pointer hover:scale-102"
              title="Automatically take this measured land parcel into GeoSR-AI for 4x Super-Resolution & Agronomic Report"
            >
              <Satellite className="w-4 h-4 text-[#A8E6CF] animate-pulse" />
              <span>Analyze in GeoSR-AI &amp; Generate Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Save Farm Button */}
            <button
              type="button"
              onClick={handleSaveFarm}
              disabled={savingFarm || points.length < 3}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#FEFEFA] hover:bg-[#F0EBE5] border border-[#5D7052] text-[#5D7052] text-xs font-bold transition disabled:opacity-40 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingFarm ? 'Saving Farm Plot...' : 'Save Parcel to My Farm Database'}</span>
            </button>
          </div>

          {/* Live Multi-Spectral Scan Diagnostics Card */}
          <div className="bg-[#FEFEFA] border border-[#DED8CF] rounded-[2rem] p-5 shadow-soft space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C18C5D]/10 text-[#C18C5D] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2C2C24] font-serif">
                    Spectral &amp; Soil Scan Telemetry
                  </h3>
                  <span className="text-[10px] text-[#78786C]">Sentinel-2 &amp; ICAR Real-Time Fusion</span>
                </div>
              </div>
            </div>

            {scanTelemetry ? (
              <div className="space-y-3.5 animate-fadeIn text-xs">
                
                {/* Health Badge & Canopy */}
                <div className="p-3 rounded-2xl bg-[#5D7052]/10 border border-[#5D7052]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5D7052] block">Vegetation Status</span>
                    <h4 className="text-sm font-bold text-[#2C2C24] font-serif">
                      {scanTelemetry.spectral.healthStatus}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#78786C] block">Canopy Density</span>
                    <strong className="text-sm text-[#5D7052]">{scanTelemetry.spectral.canopyCoverPct}%</strong>
                  </div>
                </div>

                {/* 4 Spectral Indices Grid */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                    <span className="text-[10px] text-[#78786C] uppercase font-bold block">NDVI (Vegetation)</span>
                    <span className="text-sm font-bold text-[#5D7052] font-mono">{scanTelemetry.spectral.ndvi}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                    <span className="text-[10px] text-[#78786C] uppercase font-bold block">NDWI (Moisture)</span>
                    <span className="text-sm font-bold text-[#4A7C59] font-mono">{scanTelemetry.spectral.ndwi}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                    <span className="text-[10px] text-[#78786C] uppercase font-bold block">NDRE (Chlorophyll)</span>
                    <span className="text-sm font-bold text-[#C18C5D] font-mono">{scanTelemetry.spectral.ndre}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                    <span className="text-[10px] text-[#78786C] uppercase font-bold block">Soil pH</span>
                    <span className="text-sm font-bold text-[#2C2C24] font-mono">{scanTelemetry.soil.ph} ({scanTelemetry.soil.status})</span>
                  </div>
                </div>

                {/* Soil N-P-K & Moisture Bar */}
                <div className="p-3 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#2C2C24]">
                    <span>Soil Health &amp; N-P-K Nutrients</span>
                    <span className="text-[#5D7052]">Moisture: {scanTelemetry.soil.soilMoisturePct}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-[#F0EBE5]/60">
                      <span className="text-[#78786C] block font-bold">N (Nitrogen)</span>
                      <strong className="text-[#2C2C24]">{scanTelemetry.soil.nitrogenKgHa} kg/ha</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#F0EBE5]/60">
                      <span className="text-[#78786C] block font-bold">P (Phosphorus)</span>
                      <strong className="text-[#2C2C24]">{scanTelemetry.soil.phosphorusKgHa} kg/ha</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#F0EBE5]/60">
                      <span className="text-[#78786C] block font-bold">K (Potassium)</span>
                      <strong className="text-[#2C2C24]">{scanTelemetry.soil.potassiumKgHa} kg/ha</strong>
                    </div>
                  </div>
                </div>

                {/* AI Agronomic Advisory Points */}
                <div className="p-3 rounded-2xl bg-[#F0EBE5]/40 border border-[#DED8CF] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#5D7052] block flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Krishi AI Actionable Recommendations</span>
                  </span>
                  {scanTelemetry.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#2C2C24]">
                      <ChevronRight className="w-3 h-3 text-[#5D7052] shrink-0 mt-0.5" />
                      <p className="leading-snug">{rec}</p>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#F0EBE5]/30 border border-dashed border-[#DED8CF] text-center space-y-2">
                <Sparkles className="w-6 h-6 text-[#78786C] mx-auto opacity-60" />
                <p className="text-xs font-semibold text-[#2C2C24]">No Live Scan Executed Yet</p>
                <p className="text-[11px] text-[#78786C]">
                  Select or draw a boundary on the live map and click <strong>"Scan Land Parcel"</strong> to run high-resolution satellite NDVI and ICAR soil diagnostics.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Save Farm Modal Dialog */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/50 backdrop-blur-xs animate-fadeIn">
          <div className="p-6 sm:p-7 max-w-lg w-full rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-float space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#5D7052]/15 text-[#5D7052] flex items-center justify-center">
                  <Save className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2C2C24] font-serif">Save Parcel to My Farms</h3>
                  <p className="text-[11px] text-[#78786C]">Add this measured field to your registered farm portfolio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="p-1 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Polygon Metadata Overview */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs p-3 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#78786C] block">Measured Area</span>
                <strong className="text-sm text-[#2C2C24] font-serif">{units.acres} Acres</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#78786C] block">Regional</span>
                <strong className="text-xs text-[#5D7052] font-semibold">{units.gunthas} Gunthas</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#78786C] block">Boundary</span>
                <strong className="text-xs text-[#2C2C24]">{points.length} Pins</strong>
              </div>
            </div>

            <form onSubmit={handleConfirmSave} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-[#2C2C24] font-bold mb-1">Farm / Parcel Name *</label>
                <input
                  type="text"
                  required
                  value={saveFormData.name}
                  onChange={(e) => setSaveFormData({ ...saveFormData, name: e.target.value })}
                  placeholder="e.g. Miyapur East Field"
                  className="w-full p-2.5 rounded-full bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2C2C24] font-bold mb-1">Farmer / Owner Name</label>
                  <input
                    type="text"
                    value={saveFormData.farmer_name}
                    onChange={(e) => setSaveFormData({ ...saveFormData, farmer_name: e.target.value })}
                    className="w-full p-2.5 rounded-full bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30"
                  />
                </div>

                <div>
                  <label className="block text-[#2C2C24] font-bold mb-1">Location / District</label>
                  <input
                    type="text"
                    value={saveFormData.location}
                    onChange={(e) => setSaveFormData({ ...saveFormData, location: e.target.value })}
                    className="w-full p-2.5 rounded-full bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2C2C24] font-bold mb-1">Standing Crop</label>
                  <select
                    value={saveFormData.current_crop}
                    onChange={(e) => setSaveFormData({ ...saveFormData, current_crop: e.target.value })}
                    className="w-full p-2.5 rounded-full bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs font-bold text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30 cursor-pointer"
                  >
                    {["Wheat", "Rice", "Cotton", "Sugarcane", "Soybean", "Chickpea", "Maize", "Mustard", "Chilli"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#2C2C24] font-bold mb-1">Soil Type</label>
                  <select
                    value={saveFormData.soil_type}
                    onChange={(e) => setSaveFormData({ ...saveFormData, soil_type: e.target.value })}
                    className="w-full p-2.5 rounded-full bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs font-bold text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30 cursor-pointer"
                  >
                    {["Alluvial Loam", "Black Cotton Soil", "Red Sandy Loam", "Clay Loam", "Laterite"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DED8CF]/60">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 rounded-full bg-[#F0EBE5] hover:bg-[#E6DCCD] text-[#78786C] font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingFarm}
                  className="px-5 py-2 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-white font-bold text-xs shadow-soft transition hover:scale-102 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savingFarm ? 'Saving Farm...' : 'Confirm & Save Farm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Saved Successfully Modal with Direct Jump to My Farms */}
      {savedSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/50 backdrop-blur-xs animate-fadeIn">
          <div className="p-7 max-w-md w-full rounded-[2.25rem] bg-[#FEFEFA] border border-[#5D7052]/40 shadow-float space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#5D7052]/15 text-[#5D7052] flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-[#2C2C24] font-serif">Parcel Saved to My Farms!</h3>
              <p className="text-xs text-[#78786C] mt-1">
                <strong className="text-[#2C2C24]">"{savedSuccessModal.name}"</strong> has been registered to your farm database with {savedSuccessModal.land_size_acres} Acres.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-[#78786C]">Crop:</span>
                <span className="font-bold text-[#5D7052]">{savedSuccessModal.current_crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78786C]">Location:</span>
                <span className="font-medium text-[#2C2C24]">{savedSuccessModal.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78786C]">Soil Baseline:</span>
                <span className="font-bold text-[#C18C5D]">{savedSuccessModal.soil_health?.score || 82}/100</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSavedSuccessModal(null)}
                className="flex-1 px-4 py-2.5 rounded-full bg-[#F0EBE5] hover:bg-[#E6DCCD] text-[#78786C] font-bold text-xs transition cursor-pointer"
              >
                Stay on Scanner Map
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFarm(savedSuccessModal);
                  setSavedSuccessModal(null);
                  setActiveTab('farms');
                }}
                className="flex-1 px-4 py-2.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-white font-bold text-xs shadow-soft transition hover:scale-102 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View in My Farms</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default LiveLandScannerMap;

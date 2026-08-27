// Live Geolocation Service & Indian Agro-Climatic Zone Mapper for AgriSphere AI
import { setCookie, COOKIE_KEYS } from '../utils/cookies';

// 15 ICAR Agro-Climatic Zones of India
export const AGRO_CLIMATIC_ZONES = [
  { id: 1, name: "Western Himalayan Region", states: ["Jammu & Kashmir", "Himachal Pradesh", "Uttarakhand"], latMin: 29.5, latMax: 37.0, lonMin: 73.0, lonMax: 81.0, majorCrops: "Apple, Walnut, Maize, Saffron, Wheat" },
  { id: 2, name: "Eastern Himalayan Region", states: ["Assam", "Sikkim", "Arunachal Pradesh", "Nagaland", "Meghalaya"], latMin: 22.0, latMax: 29.5, lonMin: 88.0, lonMax: 97.5, majorCrops: "Tea, Rice, Jute, Ginger, Citrus" },
  { id: 3, name: "Lower Gangetic Plains Region", states: ["West Bengal"], latMin: 21.5, latMax: 27.5, lonMin: 85.5, lonMax: 89.8, majorCrops: "Rice, Jute, Mustard, Potato" },
  { id: 4, name: "Middle Gangetic Plains Region", states: ["Bihar", "Eastern Uttar Pradesh"], latMin: 24.0, latMax: 27.5, lonMin: 81.5, lonMax: 88.0, majorCrops: "Rice, Wheat, Sugarcane, Maize, Lentils" },
  { id: 5, name: "Upper Gangetic Plains Region", states: ["Central & Western Uttar Pradesh"], latMin: 25.5, latMax: 30.5, lonMin: 77.0, lonMax: 82.0, majorCrops: "Wheat, Sugarcane, Rice, Mustard, Potato" },
  { id: 6, name: "Trans-Gangetic Plains Region", states: ["Punjab", "Haryana", "Delhi", "Chandigarh"], latMin: 27.5, latMax: 32.5, lonMin: 73.8, lonMax: 77.8, majorCrops: "Wheat, Paddy, Cotton, Sugarcane, Mustard" },
  { id: 7, name: "Eastern Plateau & Hills Region", states: ["Jharkhand", "Odisha", "Chhattisgarh"], latMin: 18.0, latMax: 25.0, lonMin: 81.0, lonMax: 87.5, majorCrops: "Rice, Groundnut, Pulses, Millets, Niger" },
  { id: 8, name: "Central Plateau & Hills Region", states: ["Madhya Pradesh", "Southern UP", "Rajasthan border"], latMin: 21.0, latMax: 26.5, lonMin: 74.0, lonMax: 82.5, majorCrops: "Soybean, Wheat, Chickpea, Cotton, Mustard" },
  { id: 9, name: "Western Plateau & Hills Region", states: ["Maharashtra", "Western MP"], latMin: 15.5, latMax: 22.0, lonMin: 73.0, lonMax: 80.5, majorCrops: "Sugarcane, Cotton, Jowar, Soybean, Grapes, Pomegranate" },
  { id: 10, name: "Southern Plateau & Hills Region", states: ["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu inland"], latMin: 11.5, latMax: 19.5, lonMin: 74.5, lonMax: 80.0, majorCrops: "Cotton, Maize, Rice, Sunflower, Groundnut, Chillies" },
  { id: 11, name: "East Coast Plains & Hills Region", states: ["Coastal Odisha", "Coastal Andhra", "Coastal TN"], latMin: 8.0, latMax: 21.0, lonMin: 79.5, lonMax: 87.0, majorCrops: "Paddy, Groundnut, Coconut, Tobacco, Black Gram" },
  { id: 12, name: "West Coast Plains & Ghats Region", states: ["Kerala", "Goa", "Coastal Karnataka", "Konkan"], latMin: 8.0, latMax: 19.0, lonMin: 73.5, lonMax: 77.5, majorCrops: "Rice, Spices, Coconut, Cashew, Rubber, Arecanut" },
  { id: 13, name: "Gujarat Plains & Hills Region", states: ["Gujarat", "Dadra & Nagar Haveli"], latMin: 20.0, latMax: 24.8, lonMin: 68.5, lonMax: 74.5, majorCrops: "Cotton, Groundnut, Castor, Cumin, Wheat, Pearl Millet" },
  { id: 14, name: "Western Dry Region", states: ["Rajasthan (Thar Desert)"], latMin: 24.5, latMax: 30.5, lonMin: 69.5, lonMax: 76.0, majorCrops: "Bajra, Guar, Moth Bean, Mustard, Gram" },
  { id: 15, name: "The Islands Region", states: ["Andaman & Nicobar", "Lakshadweep"], latMin: 6.5, latMax: 14.0, lonMin: 71.0, lonMax: 94.0, majorCrops: "Coconut, Arecanut, Cassava, Spices" }
];

// Rich Offline Indian Agrarian Database for instant fallback search
export const INDIAN_AGRICULTURAL_PLACES = [
  { name: "Ludhiana (PAU Research Belt)", displayName: "Ludhiana (PAU Research Belt), Punjab", town: "Ludhiana", district: "Ludhiana", state: "Punjab", lat: 30.9010, lon: 75.8573, tag: "Wheat & Paddy Hub" },
  { name: "Bhatinda Cotton & Wheat Mandi", displayName: "Bhatinda Cotton & Wheat Mandi, Punjab", town: "Bhatinda", district: "Bathinda", state: "Punjab", lat: 30.2110, lon: 74.9455, tag: "Malwa Cotton Belt" },
  { name: "Karnal (CSSRI Soil Research)", displayName: "Karnal (CSSRI Soil Research), Haryana", town: "Karnal", district: "Karnal", state: "Haryana", lat: 29.6857, lon: 76.9905, tag: "Basmati Rice & Wheat" },
  { name: "Hisar Agricultural University", displayName: "Hisar Agricultural University, Haryana", town: "Hisar", district: "Hisar", state: "Haryana", lat: 29.1492, lon: 75.7217, tag: "Cotton & Oilseeds" },
  { name: "Meerut Sugarcane Belt", displayName: "Meerut Sugarcane Belt, Uttar Pradesh", town: "Meerut", district: "Meerut", state: "Uttar Pradesh", lat: 28.9845, lon: 77.7064, tag: "Sugarcane & Potato" },
  { name: "Varanasi Gangetic Plains", displayName: "Varanasi Gangetic Plains, Uttar Pradesh", town: "Varanasi", district: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lon: 82.9739, tag: "Paddy & Vegetables" },
  { name: "Gorakhpur Agricultural Belt", displayName: "Gorakhpur Agricultural Belt, Uttar Pradesh", town: "Gorakhpur", district: "Gorakhpur", state: "Uttar Pradesh", lat: 26.7606, lon: 83.3732, tag: "Sugarcane & Rice" },
  { name: "Patna / Nalanda Farmlands", displayName: "Patna / Nalanda Farmlands, Bihar", town: "Patna", district: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376, tag: "Rice, Maize & Pulses" },
  { name: "Indore Malwa Soybean Region", displayName: "Indore Malwa Soybean Region, Madhya Pradesh", town: "Indore", district: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577, tag: "Soybean & Wheat" },
  { name: "Ujjain Agro Belt", displayName: "Ujjain Agro Belt, Madhya Pradesh", town: "Ujjain", district: "Ujjain", state: "Madhya Pradesh", lat: 23.1765, lon: 75.7885, tag: "Soybean & Gram" },
  { name: "Nashik Precision Vineyard Parcel", displayName: "Nashik Precision Vineyard Parcel, Maharashtra", town: "Nashik", district: "Nashik", state: "Maharashtra", lat: 20.0050, lon: 73.7820, tag: "Grapes, Onion & Tomato" },
  { name: "Pune / Baramati Sugarcane", displayName: "Pune / Baramati Sugarcane, Maharashtra", town: "Baramati", district: "Pune", state: "Maharashtra", lat: 18.1517, lon: 74.5771, tag: "Sugarcane & Dairy" },
  { name: "Nagpur Orange & Cotton Belt", displayName: "Nagpur Orange & Cotton Belt, Maharashtra", town: "Nagpur", district: "Nagpur", state: "Maharashtra", lat: 21.1458, lon: 79.0882, tag: "Citrus & Cotton" },
  { name: "Kolhapur Sugar & Jaggery Region", displayName: "Kolhapur Sugar & Jaggery Region, Maharashtra", town: "Kolhapur", district: "Kolhapur", state: "Maharashtra", lat: 16.7050, lon: 74.2433, tag: "Sugarcane & Turmeric" },
  { name: "Rajkot Groundnut & Cotton Hub", displayName: "Rajkot Groundnut & Cotton Hub, Gujarat", town: "Rajkot", district: "Rajkot", state: "Gujarat", lat: 22.3039, lon: 70.8022, tag: "Saurashtra Groundnut" },
  { name: "Anand Dairy & Spices Belt", displayName: "Anand Dairy & Spices Belt, Gujarat", town: "Anand", district: "Anand", state: "Gujarat", lat: 22.5645, lon: 72.9289, tag: "Tobacco & Dairy" },
  { name: "Warangal Cotton Farm Boundary", displayName: "Warangal Cotton Farm Boundary, Telangana", town: "Warangal", district: "Warangal", state: "Telangana", lat: 17.9780, lon: 79.5940, tag: "Cotton & Chillies" },
  { name: "Hyderabad / Miyapur Farmlands", displayName: "Hyderabad / Miyapur Farmlands, Telangana", town: "Miyapur", district: "Hyderabad", state: "Telangana", lat: 17.4933, lon: 78.3424, tag: "Deccan Agro Zone" },
  { name: "Karimnagar Paddy & Maize", displayName: "Karimnagar Paddy & Maize, Telangana", town: "Karimnagar", district: "Karimnagar", state: "Telangana", lat: 18.4386, lon: 79.1288, tag: "Rice Granary" },
  { name: "Guntur Chilli & Tobacco Yard", displayName: "Guntur Chilli & Tobacco Yard, Andhra Pradesh", town: "Guntur", district: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lon: 80.4365, tag: "Asia's Largest Chilli Mandi" },
  { name: "East Godavari Paddy Delta (Rajahmundry)", displayName: "East Godavari Paddy Delta (Rajahmundry), Andhra Pradesh", town: "Rajahmundry", district: "East Godavari", state: "Andhra Pradesh", lat: 16.9891, lon: 82.2475, tag: "Godavari Paddy Delta" },
  { name: "Anantapur Groundnut Belt", displayName: "Anantapur Groundnut Belt, Andhra Pradesh", town: "Anantapur", district: "Anantapur", state: "Andhra Pradesh", lat: 14.6819, lon: 77.6006, tag: "Groundnut & Millets" },
  { name: "Mandya / Mysuru Sugarcane & Paddy", displayName: "Mandya / Mysuru Sugarcane & Paddy, Karnataka", town: "Mandya", district: "Mandya", state: "Karnataka", lat: 12.5230, lon: 76.8970, tag: "Cauvery Basin Farming" },
  { name: "Belagavi Sugar & Maize", displayName: "Belagavi Sugar & Maize, Karnataka", town: "Belagavi", district: "Belagavi", state: "Karnataka", lat: 15.8497, lon: 74.4977, tag: "Sugarcane & Vegetables" },
  { name: "Coimbatore / Pollachi Coconut Belt", displayName: "Coimbatore / Pollachi Coconut Belt, Tamil Nadu", town: "Pollachi", district: "Coimbatore", state: "Tamil Nadu", lat: 10.6609, lon: 77.0048, tag: "Coconut, Tea & Poultry" },
  { name: "Thanjavur Kaveri Delta Granary", displayName: "Thanjavur Kaveri Delta Granary, Tamil Nadu", town: "Thanjavur", district: "Thanjavur", state: "Tamil Nadu", lat: 10.7870, lon: 79.1378, tag: "Rice Bowl of TN" },
  { name: "Madurai Jasmine & Paddy", displayName: "Madurai Jasmine & Paddy, Tamil Nadu", town: "Madurai", district: "Madurai", state: "Tamil Nadu", lat: 9.9252, lon: 78.1198, tag: "Floriculture & Paddy" },
  { name: "Jaipur / Sikar Mustard & Guar", displayName: "Jaipur / Sikar Mustard & Guar, Rajasthan", town: "Sikar", district: "Sikar", state: "Rajasthan", lat: 27.6094, lon: 75.1398, tag: "Mustard, Guar & Bajra" },
  { name: "Kota Soybean & Coriander", displayName: "Kota Soybean & Coriander, Rajasthan", town: "Kota", district: "Kota", state: "Rajasthan", lat: 25.2138, lon: 75.8648, tag: "Chambal Valley Irrigation" },
  { name: "Burdwan (Rice Bowl of Bengal)", displayName: "Burdwan (Rice Bowl of Bengal), West Bengal", town: "Bardhaman", district: "Purba Bardhaman", state: "West Bengal", lat: 23.2324, lon: 87.8615, tag: "Paddy & Jute Belt" },
  { name: "Cuttack / Mahanadi Delta", displayName: "Cuttack / Mahanadi Delta, Odisha", town: "Cuttack", district: "Cuttack", state: "Odisha", lat: 20.4625, lon: 85.8828, tag: "Paddy & Pulses" },
  { name: "Raipur Chhattisgarh Rice Plains", displayName: "Raipur Chhattisgarh Rice Plains, Chhattisgarh", town: "Raipur", district: "Raipur", state: "Chhattisgarh", lat: 21.2514, lon: 81.6296, tag: "Dhan Ka Katora" },
  { name: "Palakkad Paddy Granary", displayName: "Palakkad Paddy Granary, Kerala", town: "Palakkad", district: "Palakkad", state: "Kerala", lat: 10.7867, lon: 76.6548, tag: "Paddy & Spices" },
  { name: "Jorhat Tea Research Hub", displayName: "Jorhat Tea Research Hub, Assam", town: "Jorhat", district: "Jorhat", state: "Assam", lat: 26.7509, lon: 94.2037, tag: "Tea & Jute" },
  { name: "Shimla Apple Orchard Belt", displayName: "Shimla Apple Orchard Belt, Himachal Pradesh", town: "Theog / Shimla", district: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lon: 77.1734, tag: "Apple & Temperate Fruit" }
];

let watchId = null;
const reverseGeocodeCache = new Map();

/**
 * Determine nearest ICAR Agro-Climatic Zone from GPS coords
 */
export function getAgroClimaticZone(lat, lon) {
  for (const zone of AGRO_CLIMATIC_ZONES) {
    if (lat >= zone.latMin && lat <= zone.latMax && lon >= zone.lonMin && lon <= zone.lonMax) {
      return zone;
    }
  }
  if (lat > 27) return AGRO_CLIMATIC_ZONES[5]; // Trans-Gangetic
  if (lat > 20) return AGRO_CLIMATIC_ZONES[7]; // Central
  return AGRO_CLIMATIC_ZONES[9]; // Southern
}

/**
 * Parses coordinate text strings in different formats:
 * - "30.9010, 75.8573"
 * - "30.9010 75.8573"
 * - "30.9010N, 75.8573E"
 */
export function parseCoordinatesString(query) {
  if (!query || typeof query !== 'string') return null;
  const clean = query.trim().replace(/[°NWSEnwse]/g, '');
  const match = clean.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)[,\s]+[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/);
  if (match) {
    const parts = clean.split(/[,\s]+/).map(p => parseFloat(p.trim())).filter(n => !isNaN(n));
    if (parts.length >= 2) {
      const lat = parts[0];
      const lon = parts[1];
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        return { lat, lon, isCoordinate: true };
      }
    }
  }
  return null;
}

/**
 * Multi-Source Geocoding Search:
 * 1. Coordinates check
 * 2. Photon API (OpenStreetMap-powered, CORS friendly, ultra-fast for Indian locations)
 * 3. Nominatim OpenStreetMap fallback
 * 4. Rich Indian Agrarian Database fuzzy search
 */
export async function searchLocations(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim();

  // 1. Direct coordinate string check
  const coordResult = parseCoordinatesString(q);
  if (coordResult) {
    const zone = getAgroClimaticZone(coordResult.lat, coordResult.lon);
    return [{
      displayName: `Coordinates: ${coordResult.lat.toFixed(5)}°N, ${coordResult.lon.toFixed(5)}°E`,
      town: "Target Coordinates",
      district: zone.name,
      state: zone.states[0] || "India",
      lat: coordResult.lat,
      lon: coordResult.lon,
      tag: "GPS Pin",
      isExactCoord: true
    }];
  }

  const results = [];
  const seenKeys = new Set();

  // 2. Query Photon Komoot API (High reliability & fast for Indian towns/villages)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lat=20.5937&lon=78.9629`;
    const res = await fetch(photonUrl, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        data.features.forEach((feat) => {
          const props = feat.properties || {};
          const coords = feat.geometry?.coordinates || [];
          if (coords.length >= 2) {
            const lon = coords[0];
            const lat = coords[1];
            const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              const name = props.name || props.city || props.town || props.village || q;
              const state = props.state || props.country || "India";
              const district = props.district || props.county || props.city || "";
              const display = [name, district, state].filter(Boolean).join(", ");
              results.push({
                displayName: display,
                town: name,
                district: district || name,
                state: state,
                lat: lat,
                lon: lon,
                tag: props.osm_value || props.type || "Agrarian Location"
              });
            }
          }
        });
      }
    }
  } catch (err) {
    console.warn("Photon search service unavailable, falling back to agrarian index:", err);
  }

  // 3. Match from built-in Indian Agricultural Database
  const lowerQ = q.toLowerCase();
  const matchedLocal = INDIAN_AGRICULTURAL_PLACES.filter(place => 
    place.name.toLowerCase().includes(lowerQ) ||
    place.town.toLowerCase().includes(lowerQ) ||
    place.district.toLowerCase().includes(lowerQ) ||
    place.state.toLowerCase().includes(lowerQ) ||
    place.tag.toLowerCase().includes(lowerQ)
  );

  matchedLocal.forEach(place => {
    const key = `${place.lat.toFixed(3)},${place.lon.toFixed(3)}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      results.push({
        displayName: `${place.name}, ${place.state}`,
        town: place.town,
        district: place.district,
        state: place.state,
        lat: place.lat,
        lon: place.lon,
        tag: place.tag
      });
    }
  });

  // 4. Nominatim as secondary API if needed
  if (results.length === 0) {
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + (q.toLowerCase().includes('india') ? '' : ', India'))}&limit=4&addressdetails=1`;
      const nomRes = await fetch(nomUrl, { headers: { 'Accept-Language': 'en' } });
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        nomData.forEach(item => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            const addr = item.address || {};
            results.push({
              displayName: item.display_name,
              town: addr.village || addr.town || addr.city || item.name || q,
              district: addr.state_district || addr.county || "",
              state: addr.state || "India",
              lat: lat,
              lon: lon,
              tag: item.type || "Map Location"
            });
          }
        });
      }
    } catch (_) {}
  }

  return results;
}

/**
 * Reverse geocode latitude/longitude to Indian District, State, Town
 */
export async function reverseGeocode(lat, lon) {
  const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  if (reverseGeocodeCache.has(cacheKey)) {
    return reverseGeocodeCache.get(cacheKey);
  }

  // First check if near any known agricultural hubs
  for (const hub of INDIAN_AGRICULTURAL_PLACES) {
    const dLat = Math.abs(hub.lat - lat);
    const dLon = Math.abs(hub.lon - lon);
    if (dLat < 0.05 && dLon < 0.05) {
      const hubResult = {
        displayName: `${hub.name}, ${hub.district}, ${hub.state}`,
        town: hub.town,
        district: hub.district,
        state: hub.state,
        postcode: '',
        country: 'India',
        tag: hub.tag
      };
      reverseGeocodeCache.set(cacheKey, hubResult);
      return hubResult;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      { 
        signal: controller.signal,
        headers: { 'Accept-Language': 'en' }
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const result = {
        displayName: data.display_name || 'Agricultural Field Location',
        town: addr.village || addr.town || addr.suburb || addr.city || addr.county || 'Field Parcel',
        district: addr.state_district || addr.county || addr.city || 'District',
        state: addr.state || 'India',
        postcode: addr.postcode || '',
        country: addr.country || 'India',
        raw: data
      };
      reverseGeocodeCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn("Reverse geocode network error, using zone fallback:", err);
  }

  // Fallback using agro-climatic zone
  const zone = getAgroClimaticZone(lat, lon);
  const fallback = {
    displayName: `${zone.name} Farm Region, India`,
    town: 'Agro Field Parcel',
    district: zone.states[0] || 'Local Region',
    state: zone.states[0] || 'India',
    postcode: '',
    country: 'India'
  };
  reverseGeocodeCache.set(cacheKey, fallback);
  return fallback;
}

/**
 * Start live GPS location watching
 */
export function startLiveLocationWatch(onLocationUpdate, onError) {
  if (!navigator.geolocation) {
    if (onError) onError(new Error("Geolocation is not supported by this browser."));
    return null;
  }

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5000
  };

  watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp
      };

      setCookie(COOKIE_KEYS.LAST_COORDS, {
        lat: coords.latitude,
        lon: coords.longitude,
        acc: coords.accuracy,
        time: coords.timestamp
      }, 7);

      const zone = getAgroClimaticZone(coords.latitude, coords.longitude);
      const geoInfo = await reverseGeocode(coords.latitude, coords.longitude);

      onLocationUpdate({
        coords,
        zone,
        geoInfo,
        status: 'active',
        isLive: true
      });
    },
    (error) => {
      console.warn("Geolocation watch error:", error.message);
      if (onError) onError(error);
    },
    options
  );

  return watchId;
}

/**
 * Stop watching GPS location
 */
export function stopLiveLocationWatch() {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

/**
 * Get one-time current GPS fix
 */
export function getCurrentPositionPromise() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
          timestamp: pos.timestamp
        };
        const zone = getAgroClimaticZone(coords.latitude, coords.longitude);
        const geoInfo = await reverseGeocode(coords.latitude, coords.longitude);
        resolve({ coords, zone, geoInfo, status: 'locked' });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}


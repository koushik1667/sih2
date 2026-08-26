// Live Geolocation Service & Indian Agro-Climatic Zone Mapper for AgriSphere AI
import { setCookie, getCookie, COOKIE_KEYS } from '../utils/cookies';

// 15 ICAR Agro-Climatic Zones of India
const AGRO_CLIMATIC_ZONES = [
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
  // Default to Trans-Gangetic if in Northern Plains or Central Plateau if in central
  if (lat > 27) return AGRO_CLIMATIC_ZONES[5]; // Trans-Gangetic
  if (lat > 20) return AGRO_CLIMATIC_ZONES[7]; // Central
  return AGRO_CLIMATIC_ZONES[9]; // Southern
}

/**
 * Reverse geocode latitude/longitude to Indian District, State, Town
 */
export async function reverseGeocode(lat, lon) {
  const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  if (reverseGeocodeCache.has(cacheKey)) {
    return reverseGeocodeCache.get(cacheKey);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
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
    console.warn("Reverse geocode network error, falling back to zone mapping:", err);
  }

  // Fallback using agro-climatic zone
  const zone = getAgroClimaticZone(lat, lon);
  const fallback = {
    displayName: `${zone.name}, India`,
    town: 'Agro Field Location',
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

      // Save cookie if enabled
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

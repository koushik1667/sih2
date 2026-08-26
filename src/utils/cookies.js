// Cookie Utility & Management for AgriSphere AI
export const COOKIE_KEYS = {
  CONSENT: 'agri_cookie_consent',
  SESSION: 'agri_session_token',
  LANGUAGE: 'agri_lang_pref',
  GEO_TRACKING: 'agri_geo_tracking_pref',
  AI_PREFS: 'agri_ai_preferences',
  SATELLITE_CACHE: 'agri_satellite_cache_pref',
  ANALYTICS: 'agri_analytics_consent',
  LAST_COORDS: 'agri_last_known_geo',
  THEME_MODE: 'agri_theme_mode'
};

export const DEFAULT_COOKIE_PREFERENCES = {
  essential: true, // Always true
  agronomy_ai: true,
  live_geo: true,
  satellite_cache: true,
  analytics: true,
  consentGiven: false,
  timestamp: null
};

/**
 * Set a browser cookie with standard security attributes
 */
export function setCookie(name, value, days = 365) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    const encodedValue = encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : String(value));
    document.cookie = `${name}=${encodedValue};${expires};path=/;SameSite=Lax`;
  } catch (err) {
    console.error("Failed to set cookie:", name, err);
  }
}

/**
 * Get a browser cookie by name
 */
export function getCookie(name) {
  try {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(cname) === 0) {
        const val = c.substring(cname.length, c.length);
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
    }
    return null;
  } catch (err) {
    console.error("Failed to get cookie:", name, err);
    return null;
  }
}

/**
 * Delete a browser cookie
 */
export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
}

/**
 * Get all active cookies as an array of objects
 */
export function getAllCookies() {
  const cookies = [];
  try {
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (!c) continue;
      const [name, ...rest] = c.split('=');
      const val = decodeURIComponent(rest.join('='));
      cookies.push({
        name,
        value: val,
        category: getCategoryForCookie(name)
      });
    }
  } catch (e) {
    console.error("Error reading all cookies", e);
  }
  return cookies;
}

/**
 * Get category name for a given cookie key
 */
function getCategoryForCookie(name) {
  if ([COOKIE_KEYS.SESSION, COOKIE_KEYS.CONSENT, COOKIE_KEYS.LANGUAGE].includes(name)) return 'Essential';
  if ([COOKIE_KEYS.GEO_TRACKING, COOKIE_KEYS.LAST_COORDS].includes(name)) return 'Live Location';
  if ([COOKIE_KEYS.AI_PREFS].includes(name)) return 'Krishi AI';
  if ([COOKIE_KEYS.SATELLITE_CACHE].includes(name)) return 'Satellite Cache';
  if ([COOKIE_KEYS.ANALYTICS].includes(name)) return 'National BI Analytics';
  return 'Functional';
}

/**
 * Retrieve saved cookie consent preferences or return defaults
 */
export function getSavedPreferences() {
  const saved = getCookie(COOKIE_KEYS.CONSENT);
  if (saved && typeof saved === 'object') {
    return { ...DEFAULT_COOKIE_PREFERENCES, ...saved, consentGiven: true };
  }
  return DEFAULT_COOKIE_PREFERENCES;
}

/**
 * Save user cookie preferences
 */
export function savePreferences(prefs) {
  const updated = {
    ...prefs,
    essential: true,
    consentGiven: true,
    timestamp: new Date().toISOString()
  };
  setCookie(COOKIE_KEYS.CONSENT, updated, 365);

  // Set individual functional cookies according to preferences
  if (updated.live_geo) {
    setCookie(COOKIE_KEYS.GEO_TRACKING, 'enabled', 180);
  } else {
    deleteCookie(COOKIE_KEYS.GEO_TRACKING);
    deleteCookie(COOKIE_KEYS.LAST_COORDS);
  }

  if (updated.agronomy_ai) {
    setCookie(COOKIE_KEYS.AI_PREFS, { rag_history: true, fast_model: 'gemini-flash' }, 180);
  } else {
    deleteCookie(COOKIE_KEYS.AI_PREFS);
  }

  if (updated.satellite_cache) {
    setCookie(COOKIE_KEYS.SATELLITE_CACHE, { tile_upscale_memory: 'active', resolution: '4x' }, 180);
  } else {
    deleteCookie(COOKIE_KEYS.SATELLITE_CACHE);
  }

  if (updated.analytics) {
    setCookie(COOKIE_KEYS.ANALYTICS, 'granted', 180);
  } else {
    deleteCookie(COOKIE_KEYS.ANALYTICS);
  }

  return updated;
}

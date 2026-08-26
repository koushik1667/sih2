const axios = require('axios');
const { cacheGet, cacheSet } = require('../config/redis');
const WeatherCache = require('../models/WeatherCache');

const WEATHER_API_KEY  = process.env.WEATHER_API_KEY;   // WeatherAPI.com
const WEATHER_BASE_URL = 'https://api.weatherapi.com/v1';
const CACHE_TTL        = 30 * 60;   // 30 minutes in seconds

/**
 * Build a normalized location key for cache bucketing.
 * Rounds coords to 2 decimals (~1 km precision).
 */
function locationKey(lat, lng) {
  return `weather:${parseFloat(lat).toFixed(2)}:${parseFloat(lng).toFixed(2)}`;
}

/**
 * Derive farm-specific alerts from raw forecast data.
 */
function deriveFarmAlerts(current, daily) {
  const alerts = [];

  if (current.humidity > 85 && current.temp > 28) {
    alerts.push({
      severity: 'warning',
      message: 'High humidity + temperature: elevated fungal disease risk',
      action: 'Inspect crops for blight/rust; consider preventive fungicide',
    });
  }
  if (current.uvIndex >= 8) {
    alerts.push({
      severity: 'info',
      message: 'UV index is very high today',
      action: 'Avoid field operations between 11am–3pm',
    });
  }

  const nextRainyDay = daily.find(d => d.rainChance > 70);
  if (nextRainyDay) {
    alerts.push({
      severity: 'warning',
      message: `Heavy rain expected on ${nextRainyDay.dayLabel} (${nextRainyDay.rainChance}% chance)`,
      action: 'Delay pesticide / fertilizer application by 2–3 days for best uptake',
    });
  }

  const hotDays = daily.filter(d => d.tempHigh > 38);
  if (hotDays.length >= 2) {
    alerts.push({
      severity: 'critical',
      message: `Heat stress alert: ${hotDays.length} days above 38°C this week`,
      action: 'Increase irrigation frequency; apply mulch to reduce soil moisture loss',
    });
  }

  const coldDay = daily.find(d => d.tempLow < 8);
  if (coldDay) {
    alerts.push({
      severity: 'warning',
      message: `Near-frost conditions on ${coldDay.dayLabel} (min ${coldDay.tempLow}°C)`,
      action: 'Protect sensitive seedlings with covers overnight',
    });
  }

  return alerts;
}

/**
 * Normalize WeatherAPI.com response into our standard shape.
 */
function normalizeWeatherResponse(apiData) {
  const cur   = apiData.current;
  const astro = apiData.forecast.forecastday[0].astro;

  const current = {
    temp:         cur.temp_c,
    feelsLike:    cur.feelslike_c,
    humidity:     cur.humidity,
    windSpeed:    cur.wind_kph,
    windDir:      cur.wind_dir,
    pressure:     cur.pressure_mb,
    uvIndex:      cur.uv,
    visibility:   cur.vis_km,
    condition:    cur.condition.text,
    conditionCode: cur.condition.code,
    sunrise:      astro.sunrise,
    sunset:       astro.sunset,
    isDay:        cur.is_day === 1,
  };

  const hourly = apiData.forecast.forecastday[0].hour.map(h => ({
    time:      new Date(h.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    temp:      h.temp_c,
    humidity:  h.humidity,
    rain:      h.precip_mm,
    windSpeed: h.wind_kph,
    condition: h.condition.text,
  }));

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daily = apiData.forecast.forecastday.map((d, i) => {
    const date = new Date(d.date);
    return {
      date:        d.date,
      dayLabel:    i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()],
      tempHigh:    d.day.maxtemp_c,
      tempLow:     d.day.mintemp_c,
      humidity:    d.day.avghumidity,
      rain:        d.day.totalprecip_mm,
      rainChance:  d.day.daily_chance_of_rain,
      condition:   d.day.condition.text,
      conditionCode: d.day.condition.code,
    };
  });

  return { current, hourly, daily, farmAlerts: deriveFarmAlerts(current, daily) };
}

/**
 * Main fetch function.
 * Order: Redis L1 cache → MongoDB L2 cache → WeatherAPI external call.
 */
async function fetchWeather(lat, lng, days = 7) {
  const key = locationKey(lat, lng);

  // L1: Redis (fastest, in-memory)
  const redisHit = await cacheGet(key);
  if (redisHit) return { ...redisHit, cacheSource: 'redis' };

  // L2: MongoDB (persisted, survives Redis restart)
  const mongoHit = await WeatherCache.findOne({ locationKey: key, expiresAt: { $gt: new Date() } });
  if (mongoHit) {
    const payload = mongoHit.toObject();
    await cacheSet(key, payload, CACHE_TTL);   // repopulate Redis
    return { ...payload, cacheSource: 'mongo' };
  }

  // L3: External API
  if (!WEATHER_API_KEY) {
    // Return mock data in development when no API key is set
    return getMockWeather(lat, lng);
  }

  const response = await axios.get(`${WEATHER_BASE_URL}/forecast.json`, {
    params: { key: WEATHER_API_KEY, q: `${lat},${lng}`, days, aqi: 'no', alerts: 'yes' },
    timeout: 8000,
  });

  const normalized = normalizeWeatherResponse(response.data);
  const cacheDoc = { locationKey: key, lat, lng, ...normalized, fetchedAt: new Date() };

  // Persist to both layers (non-blocking)
  cacheSet(key, cacheDoc, CACHE_TTL).catch(() => {});
  WeatherCache.findOneAndUpdate(
    { locationKey: key },
    { ...cacheDoc, expiresAt: new Date(Date.now() + 30 * 60_000) },
    { upsert: true, new: true }
  ).catch(() => {});

  return { ...cacheDoc, cacheSource: 'api' };
}

/**
 * Mock weather data for development / offline mode.
 */
function getMockWeather(lat, lng) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  return {
    lat, lng,
    current: {
      temp: 28, feelsLike: 30, humidity: 68, windSpeed: 18,
      windDir: 'NE', pressure: 1012, uvIndex: 7, visibility: 8,
      condition: 'Partly Cloudy', conditionCode: 1003, isDay: true,
      sunrise: '6:24 AM', sunset: '6:48 PM',
    },
    hourly: Array.from({ length: 9 }, (_, i) => ({
      time: `${(6 + i * 2) % 24}:00`,
      temp: 22 + Math.round(Math.random() * 10),
      humidity: 60 + Math.round(Math.random() * 25),
      rain: i === 3 || i === 4 ? 10 + Math.round(Math.random() * 15) : 0,
      windSpeed: 10 + Math.round(Math.random() * 12),
      condition: i < 2 ? 'Clear' : i < 5 ? 'Partly Cloudy' : 'Cloudy',
    })),
    daily: Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() + i);
      return {
        date: d.toISOString().split('T')[0],
        dayLabel: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
        tempHigh: 28 + Math.round(Math.random() * 7),
        tempLow:  18 + Math.round(Math.random() * 5),
        humidity: 55 + Math.round(Math.random() * 30),
        rain: i === 4 || i === 5 ? 20 + Math.round(Math.random() * 40) : 0,
        rainChance: i === 4 ? 75 : i === 5 ? 85 : Math.round(Math.random() * 25),
        condition: i < 2 ? 'Partly Cloudy' : i < 4 ? 'Sunny' : 'Heavy Rain',
        conditionCode: 1003,
      };
    }),
    farmAlerts: [
      { severity: 'info', message: 'Mock data — set WEATHER_API_KEY for live data', action: 'Add API key to .env' },
    ],
    cacheSource: 'mock',
  };
}

module.exports = { fetchWeather };

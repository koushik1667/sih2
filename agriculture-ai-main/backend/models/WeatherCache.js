const mongoose = require('mongoose');

/**
 * WeatherCache: short-lived cache for weather API responses.
 * Avoids repeat calls to external API for the same location within TTL.
 * MongoDB TTL index auto-expires docs after 30 minutes.
 */
const weatherCacheSchema = new mongoose.Schema({
  // Grid key: lat/lng rounded to 2 decimal places for cache grouping
  locationKey: { type: String, required: true, unique: true },
  lat:  { type: Number, required: true },
  lng:  { type: Number, required: true },

  current: {
    temp:        Number,   // °C
    feelsLike:   Number,
    humidity:    Number,   // %
    windSpeed:   Number,   // km/h
    windDir:     String,   // e.g. 'NE'
    pressure:    Number,   // hPa
    uvIndex:     Number,
    visibility:  Number,   // km
    condition:   String,   // 'Partly Cloudy'
    conditionCode: Number,
    sunrise:     String,   // '06:24'
    sunset:      String,
    isDay:       Boolean,
  },

  hourly: [{
    time:     String,
    temp:     Number,
    humidity: Number,
    rain:     Number,     // mm
    windSpeed: Number,
    condition: String,
  }],

  daily: [{
    date:       String,   // 'YYYY-MM-DD'
    dayLabel:   String,   // 'Monday'
    tempHigh:   Number,
    tempLow:    Number,
    humidity:   Number,
    rain:       Number,
    rainChance: Number,   // %
    condition:  String,
    conditionCode: Number,
  }],

  // Farm-tailored alerts from weather data
  farmAlerts: [{
    severity: String,
    message:  String,
    action:   String,
  }],

  fetchedAt: { type: Date, default: Date.now },
  // Auto-expire after 30 minutes
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 60_000) },
}, { timestamps: true });

weatherCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
weatherCacheSchema.index({ locationKey: 1 });

module.exports = mongoose.model('WeatherCache', weatherCacheSchema);

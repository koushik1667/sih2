const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  language: { type: String, default: 'en', enum: ['en', 'kn', 'hi', 'ta', 'te'] },
  district: { type: String, required: true },
  state: { type: String, required: true },
  village: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

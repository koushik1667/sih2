const mongoose = require('mongoose');
const Crop = require('./models/Crop');
require('dotenv').config();

const crops = [
  {
    cropName: 'Rice',
    localNames: { en: 'Rice', kn: 'ಅಕ್ಕಿ', hi: 'चावल', ta: 'அரிசி', te: 'వరి' },
    nutrientRequirement: { N: 80, P: 40, K: 40 },
    nutrientReplenishment: { N: 0, organicMatter: 10 },
    suitableRegions: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu'],
    season: 'Kharif',
    waterRequirement: 'High',
    marketDemand: 95
  },
  {
    cropName: 'Wheat',
    localNames: { en: 'Wheat', kn: 'ಗೋಧಿ', hi: 'गेहूं', ta: 'கோதுமை', te: 'గోధుమ' },
    nutrientRequirement: { N: 120, P: 60, K: 40 },
    nutrientReplenishment: { N: 0, organicMatter: 8 },
    suitableRegions: ['Karnataka', 'Telangana'],
    season: 'Rabi',
    waterRequirement: 'Medium',
    marketDemand: 90
  },
  {
    cropName: 'Soybean',
    localNames: { en: 'Soybean', kn: 'ಸೋಯಾ ಬೀನ್', hi: 'सोयाबीन', ta: 'சோயா', te: 'సోయా' },
    nutrientRequirement: { N: 30, P: 60, K: 40 },
    nutrientReplenishment: { N: 50, organicMatter: 20 },
    suitableRegions: ['Karnataka', 'Andhra Pradesh', 'Telangana'],
    season: 'Kharif',
    waterRequirement: 'Medium',
    marketDemand: 85
  },
  {
    cropName: 'Chickpea',
    localNames: { en: 'Chickpea', kn: 'ಕಡಲೆ', hi: 'चना', ta: 'கொண்டைகடலை', te: 'శెనగలు' },
    nutrientRequirement: { N: 20, P: 40, K: 20 },
    nutrientReplenishment: { N: 40, organicMatter: 18 },
    suitableRegions: ['Karnataka', 'Andhra Pradesh', 'Telangana'],
    season: 'Rabi',
    waterRequirement: 'Low',
    marketDemand: 80
  },
  {
    cropName: 'Cotton',
    localNames: { en: 'Cotton', kn: 'ಹತ್ತಿ', hi: 'कपास', ta: 'பருத்தி', te: 'పత్తి' },
    nutrientRequirement: { N: 120, P: 60, K: 60 },
    nutrientReplenishment: { N: 0, organicMatter: 5 },
    suitableRegions: ['Karnataka', 'Andhra Pradesh', 'Telangana'],
    season: 'Kharif',
    waterRequirement: 'Medium',
    marketDemand: 88
  },
  {
    cropName: 'Maize',
    localNames: { en: 'Maize', kn: 'ಜೋಳ', hi: 'मक्का', ta: 'சோளம்', te: 'మొక్కజొన్న' },
    nutrientRequirement: { N: 120, P: 60, K: 40 },
    nutrientReplenishment: { N: 0, organicMatter: 12 },
    suitableRegions: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu'],
    season: 'All',
    waterRequirement: 'Medium',
    marketDemand: 82
  },
  {
    cropName: 'Pigeon Pea',
    localNames: { en: 'Pigeon Pea', kn: 'ತೊಗರಿ', hi: 'अरहर', ta: 'துவரை', te: 'కందులు' },
    nutrientRequirement: { N: 25, P: 50, K: 25 },
    nutrientReplenishment: { N: 45, organicMatter: 22 },
    suitableRegions: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu'],
    season: 'Kharif',
    waterRequirement: 'Low',
    marketDemand: 78
  },
  {
    cropName: 'Sugarcane',
    localNames: { en: 'Sugarcane', kn: 'ಕಬ್ಬು', hi: 'गन्ना', ta: 'கரும்பு', te: 'చెరకు' },
    nutrientRequirement: { N: 300, P: 100, K: 200 },
    nutrientReplenishment: { N: 0, organicMatter: 15 },
    suitableRegions: ['Karnataka', 'Andhra Pradesh', 'Tamil Nadu'],
    season: 'All',
    waterRequirement: 'High',
    marketDemand: 92
  },
  {
    cropName: 'Sunhemp',
    localNames: { en: 'Sunhemp', kn: 'ಸಣಬು', hi: 'सनई', ta: 'சணப்பு', te: 'జనుము' },
    nutrientRequirement: { N: 10, P: 20, K: 15 },
    nutrientReplenishment: { N: 60, organicMatter: 35 },
    suitableRegions: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu'],
    season: 'Zaid',
    waterRequirement: 'Low',
    marketDemand: 40
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agritech')
.then(async () => {
  console.log('Connected to MongoDB');
  await Crop.deleteMany({});
  await Crop.insertMany(crops);
  console.log('✅ Crop database seeded successfully');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

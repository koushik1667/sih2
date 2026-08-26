import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      app_title: "AgriTech AI - Crop Rotation Advisor",
      login: "Login",
      register: "Register",
      logout: "Logout",
      dashboard: "Dashboard",
      my_farms: "My Farms",
      predictions: "Soil Analysis",
      crop_database: "Crop Database",
      phone: "Phone Number",
      password: "Password",
      name: "Name",
      district: "District",
      state: "State",
      village: "Village",
      land_size: "Land Size (acres)",
      irrigation_type: "Irrigation Type",
      rainfed: "Rainfed",
      canal: "Canal",
      drip: "Drip",
      sprinkler: "Sprinkler",
      cropping_history: "Cropping History",
      season: "Season",
      crop: "Crop",
      yield: "Yield",
      soil_health: "Soil Health",
      nitrogen: "Nitrogen (N)",
      phosphorus: "Phosphorus (P)",
      potassium: "Potassium (K)",
      ph_level: "pH Level",
      organic_carbon: "Organic Carbon %",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      add_farm: "Add Farm",
      risk_score: "Risk Score",
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
      recommendations: "Crop Rotation Recommendations",
      economic_impact: "Economic Impact",
      soil_recovery: "Soil Recovery Timeline"
    }
  },
  kn: {
    translation: {
      app_title: "ಅಗ್ರಿಟೆಕ್ AI - ಬೆಳೆ ಸರದಿ ಸಲಹೆಗಾರ",
      login: "ಲಾಗಿನ್",
      register: "ನೋಂದಣಿ",
      logout: "ಲಾಗೌಟ್",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      my_farms: "ನನ್ನ ಹೊಲಗಳು",
      predictions: "ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ",
      crop_database: "ಬೆಳೆ ಡೇಟಾಬೇಸ್",
      phone: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
      password: "ಪಾಸ್ವರ್ಡ್",
      name: "ಹೆಸರು",
      district: "ಜಿಲ್ಲೆ",
      state: "ರಾಜ್ಯ",
      village: "ಗ್ರಾಮ",
      land_size: "ಭೂಮಿ ಗಾತ್ರ (ಎಕರೆ)",
      irrigation_type: "ನೀರಾವರಿ ಪ್ರಕಾರ",
      rainfed: "ಮಳೆ ಆಧಾರಿತ",
      soil_health: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
      nitrogen: "ಸಾರಜನಕ (N)",
      phosphorus: "ರಂಜಕ (P)",
      potassium: "ಪೊಟ್ಯಾಸಿಯಮ್ (K)",
      submit: "ಸಲ್ಲಿಸು",
      risk_score: "ಅಪಾಯ ಸ್ಕೋರ್",
      low: "ಕಡಿಮೆ",
      medium: "ಮಧ್ಯಮ",
      high: "ಹೆಚ್ಚು",
      critical: "ಅಪಾಯಕಾರಿ"
    }
  },
  hi: {
    translation: {
      app_title: "एग्रीटेक AI - फसल चक्र सलाहकार",
      login: "लॉगिन",
      register: "पंजीकरण",
      logout: "लॉगआउट",
      dashboard: "डैशबोर्ड",
      my_farms: "मेरे खेत",
      predictions: "मिट्टी विश्लेषण",
      phone: "फोन नंबर",
      password: "पासवर्ड",
      name: "नाम",
      district: "जिला",
      state: "राज्य",
      village: "गाँव",
      land_size: "भूमि आकार (एकड़)",
      soil_health: "मिट्टी स्वास्थ्य",
      nitrogen: "नाइट्रोजन (N)",
      phosphorus: "फास्फोरस (P)",
      potassium: "पोटेशियम (K)",
      submit: "जमा करें",
      risk_score: "जोखिम स्कोर",
      low: "कम",
      medium: "मध्यम",
      high: "उच्च",
      critical: "गंभीर"
    }
  },
  ta: {
    translation: {
      app_title: "அக்ரிடெக் AI - பயிர் சுழற்சி ஆலோசகர்",
      login: "உள்நுழைவு",
      register: "பதிவு",
      dashboard: "டாஷ்போர்டு",
      my_farms: "எனது பண்ணைகள்",
      phone: "தொலைபேசி எண்",
      name: "பெயர்",
      district: "மாவட்டம்",
      state: "மாநிலம்",
      soil_health: "மண் ஆரோக்கியம்",
      submit: "சமர்ப்பிக்கவும்",
      low: "குறைவு",
      medium: "நடுத்தர",
      high: "அதிக"
    }
  },
  te: {
    translation: {
      app_title: "అగ్రిటెక్ AI - పంట మార్పిడి సలహాదారు",
      login: "లాగిన్",
      register: "నమోదు",
      dashboard: "డ్యాష్‌బోర్డ్",
      my_farms: "నా పొలాలు",
      phone: "ఫోన్ నంబర్",
      name: "పేరు",
      district: "జిల్లా",
      state: "రాష్ట్రం",
      soil_health: "మట్టి ఆరోగ్యం",
      submit: "సమర్పించండి",
      low: "తక్కువ",
      medium: "మధ్యస్థ",
      high: "అధిక"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

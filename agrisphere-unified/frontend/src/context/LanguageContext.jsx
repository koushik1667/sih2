import React, { createContext, useContext, useState, useEffect } from 'react';
import { liveTranslatorEngine, lookupFastTranslation } from '../services/liveTranslator';
import { api } from '../services/api';

const TRANSLATIONS = {
  en: {
    app_title: "AgriSphere AI",
    tagline: "Geospatial Remote Sensing, Soil Health & National Crop Intelligence",
    nav_command_center: "Command Center",
    nav_satellite_srm: "GeoSR-AI Studio",
    nav_soil_precision: "Soil & Depletion",
    nav_national_analytics: "National Analytics",
    nav_ai_agronomist: "AI Agronomist",
    nav_farms: "My Farms",
    nav_weather: "Weather Radar",
    
    // Command Center
    cmd_welcome: "National Agricultural Command Center",
    cmd_sub: "Real-time synergy across Satellite Remote Sensing, Precision Soil Dynamics & Macro-Economic BI",
    cmd_active_farms: "Monitored Farm Land",
    cmd_avg_soil_health: "Avg Soil Health Index",
    cmd_satellite_ready: "SRM AI Neural Engine",
    cmd_national_output: "National Foodgrain Output",
    cmd_quick_actions: "Fast Action Launcher",
    cmd_launch_srm: "Run Satellite Super-Resolution",
    cmd_test_soil: "Simulate Soil NPK Depletion",
    cmd_view_bi: "Open Power BI Analytics",
    cmd_ask_ai: "Ask AI Agronomist (Krishi Mitra)",
    
    // GeoSR-AI
    srm_title: "GeoSR-AI: Satellite Imagery Super-Resolution Studio",
    srm_subtitle: "Deep Learning Based Super Resolution Mapping (SRM) from Medium-Resolution Satellite Imagery (Sentinel-2 & Landsat)",
    srm_select_scene: "Select Satellite Agro-Scene",
    srm_or_upload: "Or Upload Custom Multi-Spectral / RGB Tile",
    srm_model_select: "Neural Architecture",
    srm_scale_factor: "Scaling Factor (GSD Multiplier)",
    srm_run_btn: "Execute Super-Resolution Mapping",
    srm_running: "Processing Tiled Neural Upscaling...",
    srm_view_layers: "Visualization Layers",
    srm_layer_rgb: "Super-Resolved RGB",
    srm_layer_ndvi: "NDVI Canopy Health",
    srm_layer_nir: "False-Color NIR (CIR)",
    srm_layer_unc: "MC Uncertainty Heatmap",
    srm_metrics_header: "Remote Sensing Benchmarks",
    
    // Soil
    soil_title: "Precision Agronomy & 3-Season Soil NPK Depletion",
    soil_subtitle: "Continuous mono-cropping depletion forecasting and restorative crop rotation simulation",
    soil_input_card: "Soil Health Card Parameters",
    soil_nitrogen: "Available Nitrogen (N)",
    soil_phosphorus: "Available Phosphorus (P)",
    soil_potassium: "Available Potassium (K)",
    soil_ph: "Soil Reaction (pH)",
    soil_oc: "Organic Carbon (OC %)",
    soil_calculate: "Compute Soil Health & 3-Season Drawdown",
    soil_depletion_chart: "3-Season Nutrient Trajectory (Monoculture vs Smart Rotation)",
    soil_rotation_rec: "AI Crop Rotation & Restoration Plan",
    
    // National Analytics
    bi_title: "Bharat Agri-Analytics: National Crop & Economic Intelligence",
    bi_subtitle: "Interactive Power BI Re-Engineered Analytics for Crop Production, Farmer Economics, Climate & Soil Matrix",
    bi_tab_crop_prod: "Crop Production & Districts",
    bi_tab_farmer_econ: "Farmer Economics & Land",
    bi_tab_climate_impact: "Monsoon & Climate Effect",
    bi_tab_soil_radar: "Soil Health Radar Matrix",
    bi_filter_state: "Filter State",
    bi_filter_season: "Filter Season",
    bi_total_prod: "Total Production",
    bi_cultivated_area: "Cultivated Area",
    bi_avg_yield: "National Avg Yield",
    bi_avg_income: "Avg Farmer Income",
    
    // AI Chat
    chat_title: "Krishi Mitra — AI Agronomist & RAG Knowledge Engine",
    chat_subtitle: "Instant multilingual scientific advisories powered by ICAR guidelines & agronomy knowledge base",
    chat_placeholder: "Ask about crop diseases, yellowing leaves, fertilizer dosing, PM-KISAN, or soil management...",
    chat_send: "Ask Krishi Mitra",
    
    // General
    status_online: "AI Engine Online",
    status_cpu: "Device: PyTorch CPU/CUDA",
    current_farm: "Active Field",
    view_details: "View Analysis",
    all_states: "All India (National)"
  },
  hi: {
    app_title: "एग्रीस्फेयर एआई (AgriSphere AI)",
    tagline: "भू-स्थानिक उपग्रह रिमोट सेंसिंग, मृदा स्वास्थ्य एवं राष्ट्रीय फसल विश्लेषण",
    nav_command_center: "कमांड सेंटर",
    nav_satellite_srm: "जियोएसआर उपग्रह स्टूडियो",
    nav_soil_precision: "मृदा स्वास्थ्य एवं पोषक तत्व",
    nav_national_analytics: "राष्ट्रीय फसल विश्लेषण",
    nav_ai_agronomist: "कृषि मित्र एआई",
    nav_farms: "मेरे खेत",
    nav_weather: "मौसम रडार",
    
    cmd_welcome: "राष्ट्रीय कृषि कमांड सेंटर",
    cmd_sub: "उपग्रह रिमोट सेंसिंग, सटीक मृदा स्वास्थ्य एवं आर्थिक विश्लेषण का एकीकृत मंच",
    cmd_active_farms: "निगरानी अधीन कृषि भूमि",
    cmd_avg_soil_health: "औसत मृदा स्वास्थ्य सूचकांक",
    cmd_satellite_ready: "उपग्रह न्यूरल इंजन",
    cmd_national_output: "राष्ट्रीय खाद्यान्न उत्पादन",
    cmd_quick_actions: "त्वरित कार्य",
    cmd_launch_srm: "उपग्रह सुपर-रेजोल्यूशन चलाएं",
    cmd_test_soil: "मृदा पोषक तत्व क्षरण जांचें",
    cmd_view_bi: "राष्ट्रीय विश्लेषण डैशबोर्ड खोलें",
    cmd_ask_ai: "कृषि मित्र से पूछें",
    
    srm_title: "जियोएसआर उपग्रह सुपर-रेजोल्यूशन स्टूडियो",
    srm_subtitle: "मध्यम-रेजोल्यूशन उपग्रह चित्रों (Sentinel-2 एवं Landsat) का एआई सुपर-रेजोल्यूशन मैपिंग",
    srm_select_scene: "उपग्रह कृषि दृश्य चुनें",
    srm_or_upload: "या अपनी छवि अपलोड करें",
    srm_model_select: "न्यूरल नेटवर्क मॉडल",
    srm_scale_factor: "स्केलिंग कारक (4x)",
    srm_run_btn: "सुपर-रेजोल्यूशन निष्पादित करें",
    srm_running: "प्रोसेसिंग जारी है...",
    srm_view_layers: "दृश्य परतें",
    srm_layer_rgb: "हाई-रेजोल्यूशन आरजीबी",
    srm_layer_ndvi: "एनडीवीआई फसल स्वास्थ्य",
    srm_layer_nir: "फॉल्स-कलर एनआईआर",
    srm_layer_unc: "अनिश्चितता हीटमैप",
    srm_metrics_header: "गुणवत्ता मानक एवं मेट्रिक्स",
    
    soil_title: "सटीक कृषि एवं 3-सीजन मृदा पोषक तत्व क्षरण",
    soil_subtitle: "एकल-फसल क्षरण पूर्वानुमान एवं फसल चक्र बहाली सिमुलेशन",
    soil_input_card: "मृदा स्वास्थ्य कार्ड इनपुट",
    soil_nitrogen: "उपलब्ध नाइट्रोजन (N)",
    soil_phosphorus: "उपलब्ध फास्फोरस (P)",
    soil_potassium: "उपलब्ध पोटेशियम (K)",
    soil_ph: "मृदा पीएच (pH)",
    soil_oc: "जैविक कार्बन (OC %)",
    soil_calculate: "मृदा स्वास्थ्य एवं क्षरण की गणना करें",
    soil_depletion_chart: "3-सीजन पोषक तत्व रुझान",
    soil_rotation_rec: "अनुशंसित फसल चक्र योजना",
    
    bi_title: "भारत कृषि-विश्लेषण: राष्ट्रीय फसल एवं आर्थिक डेटा",
    bi_subtitle: "फसल उत्पादन, किसान आय, मौसम एवं मृदा स्वास्थ्य का इंटरैक्टिव पावर बीआई हब",
    bi_tab_crop_prod: "फसल उत्पादन एवं जिले",
    bi_tab_farmer_econ: "किसान आय एवं भूमि",
    bi_tab_climate_impact: "मानसून एवं जलवायु प्रभाव",
    bi_tab_soil_radar: "मृदा स्वास्थ्य रडार मैट्रिक्स",
    bi_filter_state: "राज्य चुनें",
    bi_filter_season: "मौसम चुनें",
    bi_total_prod: "कुल उत्पादन",
    bi_cultivated_area: "कृषि क्षेत्र",
    bi_avg_yield: "राष्ट्रीय औसत उपज",
    bi_avg_income: "औसत किसान आय",
    
    chat_title: "कृषि मित्र — एआई कृषि सलाहकार",
    chat_subtitle: "आईसीएआर दिशानिर्देशों पर आधारित तत्काल बहुभाषी वैज्ञानिक सलाह",
    chat_placeholder: "फसल रोग, पीली पत्तियां, यूरिया खुराक या सरकारी योजनाओं के बारे में पूछें...",
    chat_send: "पूछें",
    
    status_online: "सिस्टम ऑनलाइन",
    status_cpu: "डिवाइस: पायटॉर्च रनटाइम",
    current_farm: "सक्रिय खेत",
    view_details: "विवरण देखें",
    all_states: "संपूर्ण भारत (राष्ट्रीय)"
  },
  kn: {
    app_title: "ಅಗ್ರಿಸ್ಫಿಯರ್ AI (AgriSphere AI)",
    tagline: "ಉಪಗ್ರಹ ರಿಮೋಟ್ ಸೆನ್ಸಿಂಗ್, ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ",
    nav_command_center: "ಕಮಾಂಡ್ ಸೆಂಟರ್",
    nav_satellite_srm: "ಉಪಗ್ರಹ SRM ಸ್ಟುಡಿಯೋ",
    nav_soil_precision: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು NPK",
    nav_national_analytics: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ",
    nav_ai_agronomist: "ಕೃಷಿ ಮಿತ್ರ AI",
    nav_farms: "ನನ್ನ ಜಮೀನುಗಳು",
    nav_weather: "ಹವಾಮಾನ ರೇಡಾರ್",
    
    cmd_welcome: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ಕಮಾಂಡ್ ಸೆಂಟರ್",
    cmd_sub: "ಉಪಗ್ರಹ ಇಮೇಜರಿ, ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಬೆಳೆ ಉತ್ಪಾದಕತೆಯ ಸಮಗ್ರ ವೇದಿಕೆ",
    cmd_active_farms: "ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿರುವ ಜಮೀನು",
    cmd_avg_soil_health: "ಸರಾಸರಿ ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
    cmd_satellite_ready: "ಉಪಗ್ರಹ ನ್ಯೂರಾಲ್ ಎಂಜಿನ್",
    cmd_national_output: "ರಾಷ್ಟ್ರೀಯ ಆಹಾರ ಉತ್ಪಾದನೆ",
    cmd_quick_actions: "ತ್ವರಿತ ಕಾರ್ಯಗಳು",
    cmd_launch_srm: "ಉಪಗ್ರಹ ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ಚಲಾಯಿಸಿ",
    cmd_test_soil: "ಮಣ್ಣಿನ ಪೋಷಕಾಂಶ ಕ್ಷೀಣತೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ",
    cmd_view_bi: "ರಾಷ್ಟ್ರೀಯ ವಿಶ್ಲೇಷಣೆ ವೀಕ್ಷಿಸಿ",
    cmd_ask_ai: "ಕೃಷಿ ಮಿತ್ರನಿಗೆ ಪ್ರಶ್ನಿಸಿ",
    
    srm_title: "GeoSR-AI: ಉಪಗ್ರಹ ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ಸ್ಟುಡಿಯೋ",
    srm_subtitle: "Sentinel-2 ಮತ್ತು Landsat ಉಪಗ್ರಹ ಚಿತ್ರಗಳ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ಮ್ಯಾಪಿಂಗ್",
    srm_select_scene: "ಉಪಗ್ರಹ ಕೃಷಿ ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    srm_or_upload: "ಅಥವಾ ನಿಮ್ಮ ಸ್ವಂತ ಫೈಲ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    srm_model_select: "ನ್ಯೂರಾಲ್ ಮಾಡೆಲ್",
    srm_scale_factor: "ಸ್ಕೇಲಿಂಗ್ ಅಂಶ (4x)",
    srm_run_btn: "ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ಪ್ರಾರಂಭಿಸಿ",
    srm_running: "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
    srm_view_layers: "ದೃಶ್ಯ ಪದರಗಳು",
    srm_layer_rgb: "ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ RGB",
    srm_layer_ndvi: "NDVI ಬೆಳೆ ಆರೋಗ್ಯ",
    srm_layer_nir: "ಫಾಲ್ಸ್-ಕಲರ್ NIR",
    srm_layer_unc: "ಅನಿಶ್ಚಿತತೆಯ ನಕ್ಷೆ",
    srm_metrics_header: "ಗುಣಮಟ್ಟದ ಮೆಟ್ರಿಕ್ಸ್",
    
    soil_title: "ನಿಖರ ಕೃಷಿ ಮತ್ತು 3-ಋತುಗಳ ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳ ಕ್ಷೀಣತೆ",
    soil_subtitle: "ಏಕಬೆಳೆ ಪೋಷಕಾಂಶ ಇಳಿಕೆ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಬೆಳೆ ಪರಿವರ್ತನೆ ಯೋಜನೆ",
    soil_input_card: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ವಿವರಗಳು",
    soil_nitrogen: "ಲಭ್ಯವಿರುವ ಸಾರಜನಕ (N)",
    soil_phosphorus: "ಲಭ್ಯವಿರುವ ರಂಜಕ (P)",
    soil_potassium: "ಲಭ್ಯವಿರುವ ಪೊಟ್ಯಾಶಿಯಂ (K)",
    soil_ph: "ಮಣ್ಣಿನ pH",
    soil_oc: "ಸಾವಯವ ಇಂಗಾಲ (OC %)",
    soil_calculate: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ",
    soil_depletion_chart: "3-ಋತುಗಳ ಪೋಷಕಾಂಶ ಕ್ಷೀಣತೆಯ ರೇಖಾಚಿತ್ರ",
    soil_rotation_rec: "ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆ ಪರಿವರ್ತನೆ",
    
    bi_title: "ಭಾರತ ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ: ರಾಷ್ಟ್ರೀಯ ಬೆಳೆ ಮತ್ತು ಆರ್ಥಿಕ ಡೇಟಾ",
    bi_subtitle: "ಬೆಳೆ ಉತ್ಪಾದನೆ, ರೈತರ ಆದಾಯ, ಹವಾಮಾನ ಮತ್ತು ಮಣ್ಣಿನ ಮ್ಯಾಟ್ರಿಕ್ಸ್‌ನ ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    bi_tab_crop_prod: "ಬೆಳೆ ಉತ್ಪಾದನೆ ಮತ್ತು ಜಿಲ್ಲೆಗಳು",
    bi_tab_farmer_econ: "ರೈತರ ಆದಾಯ ಮತ್ತು ಜಮೀನು",
    bi_tab_climate_impact: "ಮಾನ್ಸೂನ್ ಮತ್ತು ಹವಾಮಾನ ಪ್ರಭಾವ",
    bi_tab_soil_radar: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ರೇಡಾರ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್",
    bi_filter_state: "ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ",
    bi_filter_season: "ಋತು ಆಯ್ಕೆಮಾಡಿ",
    bi_total_prod: "ಒಟ್ಟು ಉತ್ಪಾದನೆ",
    bi_cultivated_area: "ಕೃಷಿ ಪ್ರದೇಶ",
    bi_avg_yield: "ರಾಷ್ಟ್ರೀಯ ಸರಾಸರಿ ಇಳುವರಿ",
    bi_avg_income: "ರೈತರ ಸರಾಸರಿ ಆದಾಯ",
    
    chat_title: "ಕೃಷಿ ಮಿತ್ರ — AI ಕೃಷಿ ಸಲಹೆಗಾರ",
    chat_subtitle: "ICAR ಮಾರ್ಗಸೂಚಿಗಳ ಆಧಾರದ ಮೇಲೆ ತತ್ಕ್ಷಣದ ವೈಜ್ಞಾನಿಕ ಕೃಷಿ ಸಲಹೆ",
    chat_placeholder: "ಬೆಳೆ ರೋಗಗಳು, ಹಳದಿ ಎಲೆಗಳು, ಯೂರಿಯಾ ಡೋಸೇಜ್ ಅಥವಾ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    chat_send: "ಕೇಳಿ",
    
    status_online: "ಆನ್‌ಲೈನ್",
    status_cpu: "ಸಾಧನ: PyTorch ರನ್‌ಟೈಮ್",
    current_farm: "ಸಕ್ರಿಯ ಜಮೀನು",
    view_details: "ವಿವರ ವೀಕ್ಷಿಸಿ",
    all_states: "ಸಮಗ್ರ ಭಾರತ (ರಾಷ್ಟ್ರೀಯ)"
  },
  ta: {
    app_title: "அக்ரிஸ்பியர் AI (AgriSphere AI)",
    tagline: "செயற்கைக்கோள் ரிமோட் சென்சிங், மண் வளம் மற்றும் தேசிய பயிர் நுண்ணறிவு",
    nav_command_center: "கட்டுப்பாட்டு மையம்",
    nav_satellite_srm: "செயற்கைக்கோள் SRM ஸ்டுடியோ",
    nav_soil_precision: "மண் வளம் & ஊட்டச்சத்து",
    nav_national_analytics: "தேசிய வேளாண் பகுப்பாய்வு",
    nav_ai_agronomist: "விவசாய AI ஆலோசகர்",
    nav_farms: "என் பண்ணைகள்",
    nav_weather: "வானிலை ரேடார்",
    
    cmd_welcome: "தேசிய வேளாண் கட்டுப்பாட்டு மையம்",
    cmd_sub: "செயற்கைக்கோள் இமேஜிங், மண் வளம் மற்றும் தேசிய பயிர் உற்பத்தித்திறனின் ஒருங்கிணைந்த தளம்",
    cmd_active_farms: "கண்காணிக்கப்படும் நிலம்",
    cmd_avg_soil_health: "சராசரி மண் ஆரோக்கிய குறியீடு",
    cmd_satellite_ready: "செயற்கைக்கோள் நியூரல் என்ஜின்",
    cmd_national_output: "தேசிய உணவு தானிய உற்பத்தி",
    cmd_quick_actions: "விரைவு செயல்பாடுகள்",
    cmd_launch_srm: "செயற்கைக்கோள் சூப்பர்-தெளிவுத்திறன் இயக்கு",
    cmd_test_soil: "மண் ஊட்டச்சத்து குறைவை சோதிக்கவும்",
    cmd_view_bi: "தேசிய பகுப்பாய்வு டாஷ்போர்டு திறக்கவும்",
    cmd_ask_ai: "விவசாய AI-யிடம் கேளுங்கள்",
    
    srm_title: "GeoSR-AI: செயற்கைக்கோள் சூப்பர்-தெளிவுத்திறன் ஸ்டுடியோ",
    srm_subtitle: "Sentinel-2 & Landsat செயற்கைக்கோள் படங்களின் AI சூப்பர்-தெளிவுத்திறன் மேப்பிங்",
    srm_select_scene: "செயற்கைக்கோள் விவசாய காட்சியைத் தேர்வுசெய்க",
    srm_or_upload: "அல்லது உங்கள் சொந்த படத்தை பதிவேற்றவும்",
    srm_model_select: "நியூரல் நெட்வொர்க் மாதிரி",
    srm_scale_factor: "அளவீட்டுக் காரணி (4x)",
    srm_run_btn: "செயல்முறையைத் தொடங்கு",
    srm_running: "செயலாக்கப்படுகிறது...",
    srm_view_layers: "காட்சி அடுக்குகள்",
    srm_layer_rgb: "சூப்பர்-தெளிவுத்திறன் RGB",
    srm_layer_ndvi: "NDVI பயிர் ஆரோக்கியம்",
    srm_layer_nir: "தவறான வண்ண NIR",
    srm_layer_unc: "நிச்சயமற்ற வெப்ப வரைபடம்",
    srm_metrics_header: "தர அளவீடுகள் & அளவுகோல்கள்",
    
    soil_title: "துல்லிய வேளாண்மை & 3-பருவ மண் ஊட்டச்சத்து குறைவு",
    soil_subtitle: "தொடர் ஒற்றைப் பயிர் ஊட்டச்சத்து குறைவு கணிப்பு மற்றும் பயிர் சுழற்சி திட்டம்",
    soil_input_card: "மண் ஆரோக்கிய அட்டை உள்ளீடு",
    soil_nitrogen: "நைட்ரஜன் (N)",
    soil_phosphorus: "பாஸ்பரஸ் (P)",
    soil_potassium: "பொட்டாசியம் (K)",
    soil_ph: "மண் கார அமிலத்தன்மை (pH)",
    soil_oc: "கரிம கார்பன் (OC %)",
    soil_calculate: "மண் ஆரோக்கியத்தை கணக்கிடுக",
    soil_depletion_chart: "3-பருவ ஊட்டச்சத்து குறைவு வரைபடம்",
    soil_rotation_rec: "பரிந்துரைக்கப்பட்ட பயிர் சுழற்சி",
    
    bi_title: "பாரத வேளாண் பகுப்பாய்வு: தேசிய பயிர் & பொருளாதார தரவு",
    bi_subtitle: "பயிர் உற்பத்தி, விவசாயிகள் வருமானம், பருவமழை மற்றும் மண் மேட்ரிக்ஸின் விரிவான டாஷ்போர்டு",
    bi_tab_crop_prod: "பயிர் உற்பத்தி & மாவட்டங்கள்",
    bi_tab_farmer_econ: "விவசாயிகள் வருமானம் & நிலம்",
    bi_tab_climate_impact: "பருவமழை & காலநிலை தாக்கம்",
    bi_tab_soil_radar: "மண் ஆரோக்கிய ரேடார் மேட்ரிக்ஸ்",
    bi_filter_state: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    bi_filter_season: "பருவத்தைத் தேர்ந்தெடுக்கவும்",
    bi_total_prod: "மொத்த உற்பத்தி",
    bi_cultivated_area: "பயிரிடப்பட்ட பரப்பளவு",
    bi_avg_yield: "தேசிய சராசரி மகசூல்",
    bi_avg_income: "விவசாயிகளின் சராசரி வருமானம்",
    
    chat_title: "விவசாய AI ஆலோசகர் (Krishi Mitra)",
    chat_subtitle: "ICAR வழிகாட்டுதல்களின் அடிப்படையிலான உடனடி பலமொழி அறிவியல் ஆலோசனை",
    chat_placeholder: "பயிர் நோய்கள், மஞ்சள் இலைகள், உர அளவு அல்லது திட்டங்கள் பற்றி கேளுங்கள்...",
    chat_send: "கேளுங்கள்",
    
    status_online: "ஆன்லைன்",
    status_cpu: "சாதனம்: PyTorch இயக்க முறை",
    current_farm: "செயலில் உள்ள பண்ணை",
    view_details: "விவரங்களைக் காண்க",
    all_states: "முழு இந்தியா (தேசிய)"
  },
  te: {
    app_title: "అగ్రిస్ఫియర్ AI (AgriSphere AI)",
    tagline: "ఉపగ్రహ రిమోట్ సెన్సింగ్, నేల ఆరోగ్యం మరియు జాతీయ పంట విశ్లేషణ",
    nav_command_center: "కమాండ్ సెంటర్",
    nav_satellite_srm: "ఉపగ్రహ SRM స్టూడియో",
    nav_soil_precision: "నేల ఆరోగ్యం & NPK",
    nav_national_analytics: "జాతీయ వ్యవసాయ విశ్లేషణ",
    nav_ai_agronomist: "కృషి మిత్ర AI",
    nav_farms: "నా పొలాలు",
    nav_weather: "వాతావరణ రాడార్",
    
    cmd_welcome: "జాతీయ వ్యవసాయ కమాండ్ సెంటర్",
    cmd_sub: "ఉపగ్రహ ఇమేజింగ్, నేల ఆరోగ్యం మరియు జాతీయ పంట ఉత్పాదకత యొక్క సమగ్ర వేదిక",
    cmd_active_farms: "పర్యవేక్షణలో ఉన్న భూమి",
    cmd_avg_soil_health: "సగటు నేల ఆరోగ్య సూచిక",
    cmd_satellite_ready: "ఉపగ్రహ న్యూరల్ ఇంజిన్",
    cmd_national_output: "జాతీయ ఆహార ధాన్యాల ఉత్పత్తి",
    cmd_quick_actions: "త్వరిత చర్యలు",
    cmd_launch_srm: "ఉపగ్రహ సూపర్-రిజల్యూషన్ ప్రారంభించండి",
    cmd_test_soil: "నేల పోషకాల క్షీణతను పరీక్షించండి",
    cmd_view_bi: "జాతీయ విశ్లేషణ డాష్‌బోర్డ్ తెరవండి",
    cmd_ask_ai: "కృషి మిత్రను అడగండి",
    
    srm_title: "GeoSR-AI: ఉపగ్రహ సూపర్-రిజల్యూషన్ స్టూడియో",
    srm_subtitle: "Sentinel-2 & Landsat ఉపగ్రహ చిత్రాల AI ఆధారిత సూపర్-రిజల్యూషన్ మ్యాపింగ్",
    srm_select_scene: "ఉపగ్రహ వ్యవసాయ ప్రాంతాన్ని ఎంచుకోండి",
    srm_or_upload: "లేదా మీ స్వంత చిత్రాన్ని అప్‌లోడ్ చేయండి",
    srm_model_select: "న్యూరల్ నెట్‌వర్క్ మోడల్",
    srm_scale_factor: "స్కేలింగ్ ఫ్యాక్టర్ (4x)",
    srm_run_btn: "సూపర్-రిజల్యూషన్ ప్రారంభించండి",
    srm_running: "ప్రాసెస్ చేయబడుతోంది...",
    srm_view_layers: "దృశ్య పొరలు",
    srm_layer_rgb: "సూపర్-రిజల్యూషన్ RGB",
    srm_layer_ndvi: "NDVI పంట ఆరోగ్యం",
    srm_layer_nir: "ఫాల్స్-కలర్ NIR",
    srm_layer_unc: "అనిశ్చితి హీట్‌మ్యాప్",
    srm_metrics_header: "నాణ్యత ప్రమాణాలు & కొలమానాలు",
    
    soil_title: "ఖచ్చితమైన వ్యవసాయం & 3-సీజన్ల నేల పోషకాల క్షీణత",
    soil_subtitle: "ఏక పంట పోషకాల తగ్గుదల అంచనా మరియు పంట మార్పిడి ప్రణాళిక",
    soil_input_card: "నేల ఆరోగ్య కార్డు వివరాలు",
    soil_nitrogen: "నైట్రోజన్ (N)",
    soil_phosphorus: "భాస్వరం (P)",
    soil_potassium: "పొటాషియం (K)",
    soil_ph: "నేల pH",
    soil_oc: "సేంద్రీయ కార్బన్ (OC %)",
    soil_calculate: "నేల ఆరోగ్యాన్ని లెక్కించండి",
    soil_depletion_chart: "3-సీజన్ల పోషకాల క్షీణత గ్రాఫ్",
    soil_rotation_rec: "సిఫార్సు చేయబడిన పంట మార్పిడి",
    
    bi_title: "భారత వ్యవసాయ విశ్లేషణ: జాతీయ పంట & ఆర్థిక సమాచారం",
    bi_subtitle: "పంట ఉత్పత్తి, రైతుల ఆదాయం, రుతుపవనాలు మరియు నేల ఆరోగ్యం యొక్క ఇంటరాక్టివ్ డాష్‌బోర్డ్",
    bi_tab_crop_prod: "పంట ఉత్పత్తి & జిల్లాలు",
    bi_tab_farmer_econ: "రైతుల ఆదాయం & భూమి",
    bi_tab_climate_impact: "రుతుపవనాలు & వాతావరణ ప్రభావం",
    bi_tab_soil_radar: "నేల ఆరోగ్య రాడార్ మ్యాట్రిక్స్",
    bi_filter_state: "రాష్ట్రాన్ని ఎంచుకోండి",
    bi_filter_season: "సీజన్ ఎంచుకోండి",
    bi_total_prod: "మొత్తం ఉత్పత్తి",
    bi_cultivated_area: "సాగు విస్తీర్ణం",
    bi_avg_yield: "జాతీయ సగటు దిగుబడి",
    bi_avg_income: "రైతు సగటు ఆదాయం",
    
    chat_title: "కృషి మిత్ర — AI వ్యవసాయ సలహాదారు",
    chat_subtitle: "ICAR మార్గదర్శకాల ఆధారంగా తక్షణ బహుభాషా శాస్త్రీయ వ్యవసాయ సలహా",
    chat_placeholder: "పంట తెగుళ్ళు, పసుపు ఆకులు, ఎరువుల మోతాదు లేదా పథకాల గురించి అడగండి...",
    chat_send: "అడగండి",
    
    status_online: "ఆన్‌లైన్",
    status_cpu: "పరికరం: PyTorch రన్‌టైమ్",
    current_farm: "ప్రస్తుత పొలం",
    view_details: "వివరాలు చూడండి",
  }
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' }
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState('en');
  const [isLiveActive, setIsLiveActive] = useState(true);

  const setLang = (newLang) => {
    setLangState(newLang);
    if (isLiveActive) {
      if (newLang === 'en') {
        liveTranslatorEngine.stop();
      } else {
        liveTranslatorEngine.start(newLang);
      }
    }
  };

  // Start / Update DOM Observer on active language change
  React.useEffect(() => {
    if (isLiveActive && lang !== 'en') {
      liveTranslatorEngine.start(lang);
    } else {
      liveTranslatorEngine.stop();
    }
    return () => {
      liveTranslatorEngine.stop();
    };
  }, [lang, isLiveActive]);

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en?.[key] || key;
  };

  const translateDynamic = async (text, targetLang = lang) => {
    if (!text || targetLang === 'en') return text;
    const fast = lookupFastTranslation(text, targetLang);
    if (fast) return fast;

    try {
      const res = await api.translate(text, 'en', targetLang);
      return res.translated_text || text;
    } catch {
      return text;
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      setLang, 
      t, 
      translateDynamic,
      supportedLanguages: SUPPORTED_LANGUAGES,
      isLiveActive,
      setIsLiveActive
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);


/**
 * AgriSphere Unified Live Real-Time DOM & Dynamic Content Translation Engine
 */

import { api } from './api';

// Agronomy & UI Realtime Translation Dictionary (Indian & Global Languages)
export const CLIENT_TRANSLATION_MAP = {
  // Navigation & Core Headers
  "Command Center": { hi: "कमांड सेंटर", kn: "ಕಮಾಂಡ್ ಸೆಂಟರ್", ta: "கட்டளை மையம்", te: "కమాండ్ సెంటర్", mr: "कमांड सेंटर", bn: "কমান্ড সেন্টার", gu: "કમાન્ડ સેન્ટર", pa: "ਕਮਾਂਡ ਸੈਂਟਰ", es: "Centro de Mando", fr: "Centre de Commande", de: "Kommandozentrale" },
  "GeoSR-AI Studio": { hi: "जियोएसआर उपग्रह स्टूडियो", kn: "ಜಿಯೋಎಸ್‌ಆರ್ ಸ್ಟುಡಿಯೋ", ta: "ஜியோஎஸ்ஆர் ஸ்டுடியோ", te: "జియోఎస్ఆర్ స్టూడియో", mr: "जिओएसआर स्टुडिओ", bn: "জিওএসআর স্টুডিও", gu: "જિયોએસઆર સ્ટુડિયો", pa: "ਜੀਓਐਸਆਰ ਸਟੂਡੀਓ", es: "Estudio GeoSR-AI", fr: "Studio GeoSR-AI", de: "GeoSR-AI Studio" },
  "Soil & Depletion": { hi: "मृदा एवं पोषक तत्व क्षरण", kn: "ಮಣ್ಣು ಮತ್ತು ಕ್ಷೀಣತೆ", ta: "மண் & ஊட்டச்சத்து குறைவு", te: "నేల & పోషకాల క్షీణత", mr: "माती आणि घट", bn: "মাটি ও পুষ্টি ক্ষয়", gu: "જમીન અને પોષક તત્વો", pa: "ਮਿੱਟੀ ਅਤੇ ਘਾਟ", es: "Suelo y Agotamiento", fr: "Sol et Épuisement", de: "Boden & Erschöpfung" },
  "National Analytics": { hi: "राष्ट्रीय फसल विश्लेषण", kn: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ", ta: "தேசிய வேளாண் பகுப்பாய்வு", te: "జాతీయ వ్యవసాయ విశ్లేషణ", mr: "राष्ट्रीय कृषी विश्लेषण", bn: "জাতীয় কৃষি विश्लेषण", gu: "રાષ્ટ્રીય કૃષિ વિશ્લેષણ", pa: "ਰਾਸ਼ਟਰੀ ਖੇਤੀ ਵਿਸ਼ਲੇਸ਼ਣ", es: "Analítica Nacional", fr: "Analytique Nationale", de: "Nationale Analytik" },
  "AI Agronomist": { hi: "कृषि मित्र एआई", kn: "ಕೃಷಿ ಮಿತ್ರ AI", ta: "வேளாண் நண்பன் AI", te: "కృషి మిత్ర AI", mr: "कृषी मित्र एआय", bn: "কৃষি মিত্র এআই", gu: "કૃષિ મિત્ર એઆઈ", pa: "ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ ਏਆਈ", es: "Agrónomo IA", fr: "Agronome IA", de: "KI-Agronom" },
  "My Farms": { hi: "मेरे खेत", kn: "ನನ್ನ ಜಮೀನುಗಳು", ta: "எனது பண்ணைகள்", te: "నా పొలాలు", mr: "माझी शेतं", bn: "আমার খামার", gu: "મારા ખેતરો", pa: "ਮੇਰੇ ਖੇਤ", es: "Mis Granjas", fr: "Mes Fermes", de: "Meine Höfe" },
  "Weather Radar": { hi: "मौसम रडार", kn: "ಹವಾಮಾನ ರಾಡಾರ್", ta: "வானிலை ரேடார்", te: "వాతావరణ రాడార్", mr: "हवामान रडार", bn: "আবহাওয়া রাডার", gu: "હવામાન રડાર", pa: "ਮੌਸਮ ਰਾਡਾਰ", es: "Radar Meteorológico", fr: "Radar Météo", de: "Wetterradar" },

  // Command Center & Stats
  "National Agricultural Command Center": { hi: "राष्ट्रीय कृषि कमांड सेंटर", kn: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ಕಮಾಂಡ್ ಸೆಂಟರ್", ta: "தேசிய வேளாண் கட்டளை மையம்", te: "జాతీయ వ్యవసాయ కమాండ్ సెంటర్" },
  "Real-time synergy across Satellite Remote Sensing, Precision Soil Dynamics & Macro-Economic BI": { hi: "उपग्रह रिमोट सेंसिंग, सटीक मृदा स्वास्थ्य एवं आर्थिक विश्लेषण का एकीकृत मंच", kn: "ಉಪಗ್ರಹ ರಿಮೋಟ್ ಸೆನ್ಸಿಂಗ್, ನಿಖರ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ಆರ್ಥಿಕ ವಿಶ್ಲೇಷಣೆಯ ಸಮಗ್ರ ವೇದಿಕೆ", ta: "செயற்கைக்கோள் தொலையுணர்வு, துல்லிய மண் வளம் மற்றும் பொருளாதார பகுப்பாய்வு தளம்", te: "ఉపగ్రహ రిమోట్ సెన్సింగ్, ఖచ్చితమైన నేల ఆరోగ్యం మరియు స్థూల-ఆర్థిక విశ్లేషణల సమగ్ర వేదిక" },
  "Monitored Farm Land": { hi: "निगरानी अधीन कृषि भूमि", kn: "ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿರುವ ಕೃಷಿ ಭೂಮಿ", ta: "கண்காணிக்கப்படும் பண்ணை நிலம்", te: "పర్యవేక్షించబడుతున్న వ్యవసాయ భూమి" },
  "Avg Soil Health Index": { hi: "औसत मृदा स्वास्थ्य सूचकांक", kn: "ಸರಾಸರಿ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ", ta: "சராசரி மண் நலக் குறியீடு", te: "సగటు నేల ఆరోగ్య సూచిక" },
  "SRM AI Neural Engine": { hi: "उपग्रह न्यूरल इंजन", kn: "ಉಪಗ್ರಹ AI ನ್ಯೂರಲ್ ಇಂಜಿನ್", ta: "செயற்கை நுண்ணறிவு இயந்திரம்", te: "ఉపగ్రహ న్యూరల్ ఇంజిన్" },
  "National Foodgrain Output": { hi: "राष्ट्रीय खाद्यान्न उत्पादन", kn: "ರಾಷ್ಟ್ರೀಯ ಆಹಾರ ಧಾನ್ಯ ಉತ್ಪಾದನೆ", ta: "தேசிய உணவு தானிய உற்பத்தி", te: "జాతీయ ఆహార ధాన్యాల ఉత్పత్తి" },
  "Fast Action Launcher": { hi: "त्वरित कार्य लॉन्चर", kn: "ತ್ವರಿತ ಕ್ರಿಯಾ ಲಾಂಚರ್", ta: "விரைவு செயல் துவக்கி", te: "శీఘ్ర కార్యాచరణ లాంచర్" },
  "Run Satellite Super-Resolution": { hi: "उपग्रह सुपर-रेजोल्यूशन चलाएं", kn: "ಉಪಗ್ರಹ ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ರನ್ ಮಾಡಿ", ta: "செயற்கைக்கோள் மேப்பிங் இயக்கவும்", te: "ఉపగ్రహ సూపర్-రిజల్యూషన్ అమలు చేయండి" },
  "Simulate Soil NPK Depletion": { hi: "मृदा एनपीके क्षरण का अनुकरण करें", kn: "ಮಣ್ಣಿನ NPK ಸವಕಳಿ ಸಿಮ್ಯುಲೇಶನ್", ta: "மண் ஊட்டச்சத்து குறைவை கணக்கிடுங்கள்", te: "నేల NPK క్షీణతను అనుకరించండి" },
  "Open Power BI Analytics": { hi: "पावर बीआई विश्लेषण खोलें", kn: "ಪವರ್ ಬಿಐ ವಿಶ್ಲೇಷಣೆ ತೆರೆಯಿರಿ", ta: "பவர் பிஐ பகுப்பாய்வை திறக்கவும்", te: "పవర్ BI విశ్లేషణను తెరవండి" },
  "Ask AI Agronomist (Krishi Mitra)": { hi: "कृषि मित्र एआई से पूछें", kn: "ಕೃಷಿ ಮಿತ್ರ AI ಅನ್ನು ಕೇಳಿ", ta: "கிருஷி மித்ராவிடம் கேளுங்கள்", te: "కృషి మిత్ర AIని అడగండి" },

  // Satellite SRM
  "GeoSR-AI: Satellite Imagery Super-Resolution Studio": { hi: "जियोएसआर-एआई: उपग्रह चित्र सुपर-रेजोल्यूशन स्टूडियो", kn: "ಜಿಯೋಎಸ್‌ಆರ್-AI: ಉಪಗ್ರಹ ಚಿತ್ರಣ ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ಸ್ಟುಡಿಯೋ", ta: "ஜியோஎஸ்ஆர்-AI: செயற்கைக்கோள் பட சூப்பர்-ரெசல்யூஷன்", te: "జియోఎస్ఆర్-AI: ఉపగ్రహ చిత్రాల సూపర్-రిజల్యూషన్ స్టూడియో" },
  "Select Satellite Agro-Scene": { hi: "उपग्रह कृषि-दृश्य चुनें", kn: "ಉಪಗ್ರಹ ಕೃಷಿ ದೃಶ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ", ta: "செயற்கைக்கோள் காட்சியைத் தேர்ந்தெடுக்கவும்", te: "ఉపగ్రహ వ్యవసాయ దృశ్యాన్ని ఎంచుకోండి" },
  "Neural Architecture": { hi: "न्यूरल आर्किटेक्चर", kn: "ನ್ಯೂರಲ್ ಆರ್ಕಿಟೆಕ್ಚರ್", ta: "நியூரல் கட்டமைப்பு", te: "న్యూరల్ ఆర్కిటెక్చర్" },
  "Scaling Factor (GSD Multiplier)": { hi: "स्केलिंग फैक्टर (जीएसडी गुणक)", kn: "ಸ್ಕೇಲಿಂಗ್ ಫ್ಯಾಕ್ಟರ್", ta: "அளவிடுதல் காரணி", te: "స్కేలింగ్ కారకం" },
  "Execute Super-Resolution Mapping": { hi: "सुपर-रेजोल्यूशन मैपिंग निष्पादित करें", kn: "ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ಮ್ಯಾಪಿಂಗ್ ಚಲಾಯಿಸಿ", ta: "சூப்பர்-ரெசல்யூஷன் வரைபடத்தை இயக்கவும்", te: "సూపర్-రిజల్యూషన్ మ్యాపింగ్‌ను అమలు చేయండి" },
  "Processing Tiled Neural Upscaling...": { hi: "न्यूरल अपस्केलिंग की प्रक्रिया जारी है...", kn: "ನ್ಯೂರಲ್ ಅಪ್‌ಸ್ಕೇಲಿಂಗ್ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...", ta: "செயற்கை நுண்ணறிவு செயலாக்கம் நடக்கிறது...", te: "న్యూరల్ అప్‌స్కేలింగ్ జరుగుతోంది..." },
  "Visualization Layers": { hi: "दृश्य परतें", kn: "ದೃಶ್ಯೀಕರಣ ಪದರಗಳು", ta: "காட்சி அடுக்குகள்", te: "విజువలైజేషన్ పొరలు" },
  "Super-Resolved RGB": { hi: "सुपर-रिजॉल्व्ड आरजीबी", kn: "ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ RGB", ta: "சூப்பர்-ரெசல்யூஷன் RGB", te: "సూపర్-రిజాల్వ్డ్ RGB" },
  "NDVI Canopy Health": { hi: "एनडीवीआई फसल स्वास्थ्य", kn: "NDVI ಬೆಳೆ ಆರೋಗ್ಯ", ta: "NDVI பயிர் ஆரோக்கியம்", te: "NDVI పంట ఆరోగ్యం" },
  "False-Color NIR (CIR)": { hi: "फॉल्स-कलर एनआईआर (सीआईआर)", kn: "ಫಾಲ್ಸ್-ಕಲರ್ NIR", ta: "பால்ஸ்-கலர் NIR", te: "ఫాల్స్-కలర్ NIR" },
  "MC Uncertainty Heatmap": { hi: "अनिश्चितता हीटमैप", kn: "ಅನಿಶ್ಚಿತತೆಯ ಹೀಟ್‌ಮ್ಯಾಪ್", ta: "நிச்சயமற்ற வெப்ப வரைபடம்", te: "అనిశ్చితి హీట్‌మ్యాప్" },

  // Soil Precision
  "Precision Agronomy & 3-Season Soil NPK Depletion": { hi: "सटीक कृषि एवं 3-सीजन मृदा एनपीके क्षरण", kn: "ನಿಖರ ಕೃಷಿ ಮತ್ತು 3-ಸೀಸನ್ ಮಣ್ಣಿನ NPK ಸವಕಳಿ", ta: "துல்லிய வேளாண்மை & 3-பருவ மண் ஊட்டச்சத்து குறைவு", te: "ఖచ్చితమైన వ్యవసాయం & 3-సీజన్ల నేల NPK క్షీణత" },
  "Soil Health Card Parameters": { hi: "मृदा स्वास्थ्य कार्ड पैरामीटर", kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ನಿಯತಾಂಕಗಳು", ta: "மண் நல அட்டை அளவுருக்கள்", te: "నేల ఆరోగ్య కార్డు పారామితులు" },
  "Available Nitrogen (N)": { hi: "उपलब्ध नाइट्रोजन (N)", kn: "ಲಭ್ಯವಿರುವ ಸಾರಜನಕ (N)", ta: "கிடைக்கக்கூடிய நைட்ரஜன் (N)", te: "లభ్యమయ్యే నత్రజని (N)" },
  "Available Phosphorus (P)": { hi: "उपलब्ध फास्फोरस (P)", kn: "ಲಭ್ಯವಿರುವ ರಂಜಕ (P)", ta: "கிடைக்கக்கூடிய பாஸ்பரஸ் (P)", te: "లభ్యమయ్యే భాస్వరం (P)" },
  "Available Potassium (K)": { hi: "उपलब्ध पोटेशियम (K)", kn: "ಲಭ್ಯವಿರುವ ಪೊಟ್ಯಾಶಿಯಂ (K)", ta: "கிடைக்கக்கூடிய பொட்டாசியம் (K)", te: "లభ్యమయ్యే పొటాషియం (K)" },
  "Soil Reaction (pH)": { hi: "मृदा पीएच (pH)", kn: "ಮಣ್ಣಿನ pH", ta: "மண் pH", te: "నేల pH" },
  "Organic Carbon (OC %)": { hi: "जैविक कार्बन (OC %)", kn: "ಸಾವಯವ ಇಂಗಾಲ (OC %)", ta: "கரிம கார்பன் (OC %)", te: "సేంద్రీయ కార్బన్ (OC %)" },
  "Compute Soil Health & 3-Season Drawdown": { hi: "मृदा स्वास्थ्य एवं 3-सीजन पोषक तत्व कमी की गणना करें", kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು 3-ಸೀಸನ್ ಸವಕಳಿಯನ್ನು ಲೆಕ್ಕಹಾಕಿ", ta: "மண் வளம் மற்றும் 3-பருவ குறைவை கணக்கிடுங்கள்", te: "నేల ఆరోగ్యం & 3-సీజన్ల క్షీణతను లెక్కించండి" },
  "AI Crop Rotation & Restoration Plan": { hi: "एआई फसल चक्र एवं बहाली योजना", kn: "AI ಬೆಳೆ ಪರಿವರ್ತನೆ ಮತ್ತು ಮಣ್ಣು ಸುಧಾರಣೆ ಯೋಜನೆ", ta: "AI பயிர் சுழற்சி & மண் சீரமைப்பு திட்டம்", te: "AI పంట మార్పిడి & నేల పునరుద్ధరణ ప్రణాళిక" },

  // AI Agronomist
  "Krishi Mitra — AI Agronomist & RAG Knowledge Engine": { hi: "कृषि मित्र — एआई कृषि विशेषज्ञ एवं आईसीएआर ज्ञान इंजन", kn: "ಕೃಷಿ ಮಿತ್ರ — AI ಕೃಷಿ ಸಲಹೆಗಾರ", ta: "கிருஷி மித்ரா — AI வேளாண் ஆலோசகர்", te: "కృషి మిత్ర — AI వ్యవసాయ సలహాదారు" },
  "Ask Krishi Mitra": { hi: "कृषि मित्र से पूछें", kn: "ಕೃಷಿ ಮಿತ್ರರನ್ನು ಕೇಳಿ", ta: "வேளாண் நண்பனிடம் கேளுங்கள்", te: "కృషి మిత్రను అడగండి" },
  "Ask about crop diseases, yellowing leaves, fertilizer dosing, PM-KISAN, or soil management...": { hi: "फसल के रोग, पीली पत्तियां, खाद की मात्रा, पीएम-किसान या मिट्टी प्रबंधन के बारे में पूछें...", kn: "ಬೆಳೆ ರೋಗಗಳು, ರಸಗೊಬ್ಬರ ಮತ್ತು ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...", ta: "பயிர் நோய், உரம் மற்றும் திட்டங்கள் பற்றி கேளுங்கள்...", te: "పంట తెగుళ్ళు, ఎరువుల మోతాదు లేదా పథకాల గురించి అడగండి..." },

  // Common UI words
  "Filter State": { hi: "राज्य चुनें", kn: "ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ", ta: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்", te: "రాష్ట్రాన్ని ఎంచుకోండి" },
  "Filter Season": { hi: "मौसम चुनें", kn: "ಋತು ಆಯ್ಕೆಮಾಡಿ", ta: "பருவத்தைத் தேர்ந்தெடுக்கவும்", te: "సీజన్ ఎంచుకోండి" },
  "Total Production": { hi: "कुल उत्पादन", kn: "ಒಟ್ಟು ಉತ್ಪಾದನೆ", ta: "மொத்த உற்பத்தி", te: "మొత్తం ఉత్పత్తి" },
  "Cultivated Area": { hi: "कृषि क्षेत्र", kn: "ಕೃಷಿ ಪ್ರದೇಶ", ta: "பயிரிடப்பட்ட பரப்பளவு", te: "సాగు విస్తీర్ణం" },
  "National Avg Yield": { hi: "राष्ट्रीय औसत पैदावार", kn: "ರಾಷ್ಟ್ರೀಯ ಸರಾಸರಿ ಇಳುವರಿ", ta: "தேசிய சராசரி மகசூல்", te: "జాతీయ సగటు దిగుబడి" },
  "Avg Farmer Income": { hi: "औसत किसान आय", kn: "ರೈತರ ಸರಾಸರಿ ಆದಾಯ", ta: "சராசரி விவசாயி வருமானம்", te: "రైతు సగటు ఆదాయం" },
  "AI Engine Online": { hi: "एआई इंजन ऑनलाइन", kn: "AI ಎಂಜಿನ್ ಆನ್‌ಲೈನ್", ta: "AI இயந்திரம் இயக்கத்தில் உள்ளது", te: "AI ఇంజిన్ ఆన్‌లైన్" },
  "Local Mode": { hi: "लोकल मोड", kn: "ಲೋಕಲ್ ಮೋಡ್", ta: "லோக்கல் பயன்முறை", te: "లోకల్ మోడ్" },
  "Active Field": { hi: "सक्रिय खेत", kn: "ಸಕ್ರಿಯ ಜಮೀನು", ta: "செயலில் உள்ள பண்ணை", te: "సక్రియ పొలం" },
  "View Analysis": { hi: "विश्लेषण देखें", kn: "ವಿಶ್ಲೇಷಣೆ ವೀಕ್ಷಿಸಿ", ta: "பகுப்பாய்வைக் காண்க", te: "వివరాలు చూడండి" },
  "All India (National)": { hi: "अखिल भारतीय (राष्ट्रीय)", kn: "ಅಖಿಲ ಭಾರತ (ರಾಷ್ಟ್ರೀಯ)", ta: "அனைத்து இந்தியா (தேசிய)", te: "మొత్తం భారతదేశం (జాతీయ)" },
  "Select Field": { hi: "खेत चुनें", kn: "ಜಮೀನು ಆಯ್ಕೆಮಾಡಿ", ta: "பண்ணையைத் தேர்ந்தெடுக்கவும்", te: "పొలాన్ని ఎంచుకోండి" },
  "Live Translation Active": { hi: "लाइव अनुवाद सक्रिय", kn: "ಲೈವ್ ಅನುವಾದ ಸಕ್ರಿಯ", ta: "நேரலை மொழிபெயர்ப்பு இயக்கத்தில் உள்ளது", te: "లైవ్ అనువాదం సక్రియం" },
  "Wheat": { hi: "गेहूं", kn: "ಗೋಧಿ", ta: "கோதுமை", te: "గోధుమ" },
  "Rice": { hi: "धान / चावल", kn: "ಭತ್ತ", ta: "நெல்", te: "వరి" },
  "Paddy": { hi: "धान", kn: "ಭತ್ತ", ta: "நெல்", te: "వరి" },
  "Cotton": { hi: "कपास", kn: "ಹತ್ತಿ", ta: "பருத்தி", te: "పత్తి" },
  "Sugarcane": { hi: "गन्ना", kn: "ಕಬ್ಬು", ta: "கரும்பு", te: "చెరకు" },
  "Maize": { hi: "मक्का", kn: "ಮೆಕ್ಕೆಜೋಳ", ta: "ಮಕ್ಕಾச்சோளம்", te: "మొక్కజొన్న" },
  "Soybean": { hi: "सोयाबीन", kn: "ಸೋಯಾಬೀನ್", ta: "சோயாபீன்", te: "సోయాబీన్" },
  "Mustard": { hi: "सरसों", kn: "ಸಾಸಿವೆ", ta: "கடுகு", te: "ఆవాలు" }
};

// Memory Cache for dynamic strings
const dynamicTranslationCache = new Map();

// Pending batch translation request queue
let batchQueue = [];
let batchTimeout = null;
let liveStatsCallback = null;
let translatedNodesCount = 0;

export function setLiveStatsListener(cb) {
  liveStatsCallback = cb;
}

function updateLiveStats() {
  if (liveStatsCallback) {
    liveStatsCallback({
      nodeCount: translatedNodesCount,
      cacheSize: dynamicTranslationCache.size
    });
  }
}

/**
 * Checks if a DOM node should be skipped for translation
 */
function shouldSkipNode(node) {
  if (!node) return true;
  const parent = node.parentElement;
  if (!parent) return true;

  const tag = parent.tagName;
  if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'PATH', 'TEXTAREA', 'INPUT', 'IFRAME'].includes(tag)) {
    return true;
  }

  // Skip elements marked notranslate
  if (
    parent.classList.contains('notranslate') ||
    parent.getAttribute('translate') === 'no' ||
    parent.hasAttribute('data-no-translate')
  ) {
    return true;
  }

  return false;
}

/**
 * Instant dictionary or cached lookup
 */
export function lookupFastTranslation(text, targetLang) {
  if (!text || targetLang === 'en') return text;
  const trimmed = text.trim();
  if (!trimmed || /^[0-9\s.,:%!@#$^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(trimmed)) {
    return text;
  }

  // Check client dictionary
  if (CLIENT_TRANSLATION_MAP[trimmed] && CLIENT_TRANSLATION_MAP[trimmed][targetLang]) {
    return CLIENT_TRANSLATION_MAP[trimmed][targetLang];
  }

  // Check memory cache
  const cacheKey = `${targetLang}:${trimmed}`;
  if (dynamicTranslationCache.has(cacheKey)) {
    return dynamicTranslationCache.get(cacheKey);
  }

  return null;
}

/**
 * Flushes pending batch translation queue to the Argos backend API
 */
async function flushBatchQueue(targetLang) {
  if (batchQueue.length === 0 || targetLang === 'en') return;

  const currentBatch = [...batchQueue];
  batchQueue = [];

  const uniqueTexts = Array.from(new Set(currentBatch.map(item => item.text)));

  try {
    const res = await api.translateBatch(uniqueTexts, 'en', targetLang);
    if (res && res.translated_texts) {
      res.translated_texts.forEach((translated, index) => {
        const orig = uniqueTexts[index];
        if (orig && translated) {
          const cacheKey = `${targetLang}:${orig}`;
          dynamicTranslationCache.set(cacheKey, translated);
        }
      });

      // Apply to pending nodes in the batch
      currentBatch.forEach(({ node, text }) => {
        const cacheKey = `${targetLang}:${text}`;
        const translated = dynamicTranslationCache.get(cacheKey);
        if (translated && node.nodeValue !== translated) {
          node.nodeValue = translated;
          translatedNodesCount++;
        }
      });

      updateLiveStats();
    }
  } catch (err) {
    console.debug('Batch translation fallback:', err);
  }
}

/**
 * Translates a single DOM Text Node in real-time
 */
export function translateTextNode(node, targetLang) {
  if (shouldSkipNode(node)) return;

  const rawValue = node.nodeValue;
  if (!rawValue || !rawValue.trim()) return;

  // Preserve original text in node custom property
  if (!node.__agriOrigText) {
    node.__agriOrigText = rawValue;
  }

  const origText = node.__agriOrigText;

  if (targetLang === 'en') {
    if (node.nodeValue !== origText) {
      node.nodeValue = origText;
    }
    return;
  }

  // Try fast instant lookup
  const fastMatch = lookupFastTranslation(origText, targetLang);
  if (fastMatch) {
    if (node.nodeValue !== fastMatch) {
      node.nodeValue = fastMatch;
      translatedNodesCount++;
      updateLiveStats();
    }
    return;
  }

  // Otherwise queue for debounced batch translation
  batchQueue.push({ node, text: origText.trim() });

  if (batchTimeout) clearTimeout(batchTimeout);
  batchTimeout = setTimeout(() => {
    flushBatchQueue(targetLang);
  }, 40);
}

/**
 * Deeply translates an entire DOM Subtree
 */
export function translateSubtree(rootNode, targetLang) {
  if (!rootNode) return;

  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let currentNode = walker.nextNode();
  while (currentNode) {
    translateTextNode(currentNode, targetLang);
    currentNode = walker.nextNode();
  }
}

/**
 * Global Live DOM MutationObserver Instance
 */
class LiveDOMTranslator {
  constructor() {
    this.observer = null;
    this.currentLang = 'en';
    this.isActive = false;
  }

  start(targetLang = 'en') {
    this.currentLang = targetLang;
    this.isActive = true;

    // Immediately translate current full document body
    translateSubtree(document.body, targetLang);

    if (this.observer) {
      this.observer.disconnect();
    }

    // Set up MutationObserver to intercept all newly created/streamed elements
    this.observer = new MutationObserver((mutations) => {
      if (!this.isActive || this.currentLang === 'en') return;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              translateTextNode(node, this.currentLang);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              translateSubtree(node, this.currentLang);
            }
          });
        }
        else if (mutation.type === 'characterData') {
          translateTextNode(mutation.target, this.currentLang);
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  setLanguage(newLang) {
    this.currentLang = newLang;
    if (this.isActive) {
      translateSubtree(document.body, newLang);
    }
  }

  stop() {
    this.isActive = false;
    if (this.observer) {
      this.observer.disconnect();
    }
    translateSubtree(document.body, 'en');
  }
}

export const liveTranslatorEngine = new LiveDOMTranslator();

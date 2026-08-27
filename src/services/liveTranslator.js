/**
 * AgriSphere Unified Live Real-Time DOM & Dynamic Content Translation Engine
 * Comprehensive Neural Machine Translation & High-Coverage Indian Language Dictionary
 */

import { api } from './api';

// Agronomy & UI Realtime Translation Dictionary (Indian & Global Languages)
export const CLIENT_TRANSLATION_MAP = {
  // Navigation & Core Headers
  "Command Center": { hi: "कमांड सेंटर", kn: "ಕಮಾಂಡ್ ಸೆಂಟರ್", ta: "கட்டளை மையம்", te: "కమాండ్ సెంటర్", mr: "कमांड सेंटर", bn: "কমান্ড সেন্টার", gu: "કમાન્ડ સેન્ટર", pa: "ਕਮਾਂਡ ਸੈਂਟਰ", ml: "കമാൻഡ് സെന്റർ" },
  "Land Measure & Scan": { hi: "भूमि मापन एवं स्कैन", kn: "ಭೂಮಿ ಅಳತೆ ಮತ್ತು ಸ್ಕ್ಯಾನ್", ta: "நில அளவீடு & ஸ்கேன்", te: "భూమి కొలత & స్కాన్", mr: "जमीन मोजणी आणि स्कॅन", bn: "জমি পরিমাপ ও স্ক্যান", gu: "જમીન માપણી અને સ્કેન", pa: "ਜ਼ਮੀਨ ਮਿਣਤੀ ਅਤੇ ਸਕੈਨ", ml: "ഭൂമി അളക്കലും സ്കാനും" },
  "GeoSR-AI Studio": { hi: "जियोएसआर उपग्रह स्टूडियो", kn: "ಜಿಯೋಎಸ್‌ಆರ್ ಸ್ಟುಡಿಯೋ", ta: "ஜியோஎஸ்ஆர் ஸ்டுடியோ", te: "జియోఎస్ఆర్ స్టూడియో", mr: "जिओएसआर स्टुडिओ", bn: "জিওএসআর স্টুডিও", gu: "જિયોએસઆર સ્ટુડિયો", pa: "ਜੀਓਐਸਆਰ ਸਟੂਡੀਓ", ml: "ജിയോഎസ്ആർ സ്റ്റുഡിയോ" },
  "Soil & Depletion": { hi: "मृदा एवं पोषक तत्व क्षरण", kn: "ಮಣ್ಣು ಮತ್ತು ಕ್ಷೀಣತೆ", ta: "மண் & ஊட்டச்சத்து குறைவு", te: "నేల & పోషకాల క్షీణత", mr: "माती आणि घट", bn: "মাটি ও পুষ্টি ক্ষয়", gu: "જમીન અને પોષક તત્વો", pa: "ਮਿੱਟੀ ਅਤੇ ਘਾਟ", ml: "മണ്ണും പോഷകക്ഷയവും" },
  "National Analytics": { hi: "राष्ट्रीय फसल विश्लेषण", kn: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ", ta: "தேசிய வேளாண் பகுப்பாய்வு", te: "జాతీయ వ్యవసాయ విశ్లేషణ", mr: "राष्ट्रीय कृषी विश्लेषण", bn: "জাতীয় কৃষি বিশ্লেষণ", gu: "રાષ્ટ્રીય કૃષિ વિશ્લેષણ", pa: "ਰਾਸ਼ਟਰੀ ਖੇਤੀ ਵਿਸ਼ਲੇਸ਼ਣ", ml: "ദേശീയ കാർഷിക വിശകലനം" },
  "AI Agronomist": { hi: "कृषि मित्र एआई", kn: "ಕೃಷಿ ಮಿತ್ರ AI", ta: "வேளாண் நண்பன் AI", te: "కృషి మిత్ర AI", mr: "कृषी मित्र एआय", bn: "কৃষি মিত্র এআই", gu: "કૃષિ મિત્ર એઆઈ", pa: "ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ ਏਆਈ", ml: "കാർഷിക മിത്രം AI" },
  "My Farms": { hi: "मेरे खेत", kn: "ನನ್ನ ಜಮೀನುಗಳು", ta: "எனது பண்ணைகள்", te: "నా పొలాలు", mr: "माझी शेतं", bn: "আমার খামার", gu: "મારા ખેતરો", pa: "ਮੇਰੇ ਖੇਤ", ml: "എന്റെ കൃഷിയിടങ്ങൾ" },
  "Weather Radar": { hi: "मौसम रडार", kn: "ಹವಾಮಾನ ರಾಡಾರ್", ta: "வானிலை ரேடார்", te: "వాతావరణ రాడార్", mr: "हवामान रडार", bn: "আবহাওয়া রাডার", gu: "હવામાન રડાર", pa: "ਮੌਸਮ ਰਾਡਾਰ", ml: "കാലാവസ്ഥാ റഡാർ" },
  "Home": { hi: "होम", kn: "ಮುಖಪುಟ", ta: "முகப்பு", te: "హోమ్", mr: "मुख्यपृष्ठ", bn: "হোম", gu: "હોમ", pa: "ਮੁੱਖ ਪੰਨਾ", ml: "ഹോം" },
  "Farmer Account": { hi: "किसान खाता", kn: "ರೈತರ ಖಾತೆ", ta: "விவசாயி கணக்கு", te: "రైతు ఖాతా", mr: "शेतकरी खाते", bn: "কৃষক অ্যাকাউন্ট", gu: "ખેડૂત ખાતું", pa: "ਕਿਸਾਨ ਖਾਤਾ", ml: "കർഷക അക്കൗണ്ട്" },
  "Login Dashboard": { hi: "लॉगिन डैशबोर्ड", kn: "ಲಾಗಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", ta: "உள்நுழைவு டாஷ்போர்டு", te: "లాగిన్ డాష్‌బోర్డ్", mr: "लॉगिन डॅशबोर्ड", bn: "লগইন ড্যাশবোর্ড", gu: "લૉગિન ડૅશબોર્ડ", pa: "ਲਾਗਇਨ ਡੈਸ਼ਬੋਰਡ", ml: "ലോഗിൻ ഡാഷ്ബോർഡ്" },
  "Sign In": { hi: "साइन इन", kn: "ಸೈನ್ ಇನ್", ta: "உள்நுழைக", te: "సైన్ ఇన్", mr: "साइन इन", bn: "সাইন ইন", gu: "સાઇન ઇન", pa: "ਸਾਈਨ ਇਨ", ml: "സൈൻ ഇൻ" },

  // Land Measuring & Scanner
  "Interactive Land Measuring & Spectral Scanner": {
    hi: "इंटरैक्टिव भूमि मापन एवं स्पेक्ट्रल स्कैनर",
    kn: "ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಭೂಮಿ ಅಳತೆ ಮತ್ತು ಸ್ಪೆಕ್ಟ್ರಲ್ ಸ್ಕ್ಯಾನರ್",
    ta: "ஊடாடும் நில அளவீடு மற்றும் ஸ்பெக்ட்ரல் ஸ்கேனர்",
    te: "ఇంటరాక్టివ్ భూమి కొలత మరియు స్పెక్ట్రల్ స్కానర్",
    mr: "परस्परसंवादी जमीन मोजणी आणि स्पेक्ट्रल स्कॅनर",
    bn: "ইন্টারেক্টিভ জমি পরিমাপ ও স্পেকট্রাল স্ক্যানার",
    gu: "ઇન્ટરેક્ટિવ જમીન માપણી અને સ્પેક્ટ્રલ સ્કેનર"
  },
  "Measured Land Area": {
    hi: "मापा गया भूमि क्षेत्र",
    kn: "ಅಳತೆ ಮಾಡಿದ ಭೂ ಪ್ರದೇಶ",
    ta: "அளவிடப்பட்ட நிலப்பரப்பு",
    te: "కొలిచిన భూమి విస్తీర్ణం",
    mr: "मोजलेले जमीन क्षेत्र",
    bn: "পরিমাপকৃত জমির পরিমাণ",
    gu: "માપેલ જમીન વિસ્તાર"
  },
  "Geodesic Ellipsoidal Calculation": {
    hi: "जियोडेसिक दीर्घवृत्ताकार गणना",
    kn: "ಜಿಯೋಡೆಸಿಕ್ ಗಣನೆ",
    ta: "புவிசார் நீள்வட்ட கணக்கீடு",
    te: "జియోడెసిక్ ఎలిప్సోయిడల్ లెక్కింపు",
    mr: "जिओडेसिक गणना"
  },
  "Spectral & Soil Scan Telemetry": {
    hi: "स्पेक्ट्रल एवं मृदा स्कैन टेलीमेट्री",
    kn: "ಸ್ಪೆಕ್ಟ್ರಲ್ ಮತ್ತು ಮಣ್ಣಿನ ಸ್ಕ್ಯಾನ್ ಟೆಲಿಮೆಟ್ರಿ",
    ta: "ஸ்பெக்ட்ரல் & மண் ஸ்கேன் டெலிமெட்ரி",
    te: "స్పెక్ట్రల్ & నేల స్కాన్ టెలిమెట్రీ",
    mr: "स्पेक्ट्रल आणि माती स्कॅन टेलीमेट्री"
  },
  "Scan Land Parcel": {
    hi: "भूमि पार्सल स्कैन करें",
    kn: "ಜಮೀನಿನ ಭಾಗವನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    ta: "நிலப் பார்சலை ஸ்கேன் செய்க",
    te: "భూమి భాగాన్ని స్కాన్ చేయండి",
    mr: "जमीन तुकडा स्कॅन करा",
    bn: "জমির প্লট স্ক্যান করুন"
  },
  "Save Parcel to My Farm Database": {
    hi: "खेत डेटाबेस में पार्सल सहेजें",
    kn: "ನನ್ನ ಜಮೀನಿನ ಡೇಟಾಬೇಸ್‌ಗೆ ಉಳಿಸಿ",
    ta: "எனது பண்ணை தரவுத்தளத்தில் சேமிக்கவும்",
    te: "నా ఫామ్ డేటాబేస్‌లో సేవ్ చేయండి",
    mr: "माझ्या शेत डेटाबेसमध्ये जतन करा"
  },
  "Locate Me": { hi: "मेरी स्थिति खोजें", kn: "ನನ್ನ ಸ್ಥಳ ಹುಡುಕಿ", ta: "என்னை கண்டறிக", te: "నన్ను గుర్తించండి", mr: "माझे स्थान शोधा", bn: "আমার অবস্থান খুঁজুন" },
  "Hybrid Satellite": { hi: "हाइब्रिड उपग्रह", kn: "ಹೈಬ್ರಿಡ್ ಉಪಗ್ರಹ", ta: "ஹைப்ரிட் செயற்கைக்கோள்", te: "హైబ్రిడ్ ఉపగ్రహం", mr: "हायब्रिड सॅटेलाइट" },
  "Streets": { hi: "सड़कें", kn: "ರಸ್ತೆಗಳು", ta: "தெருக்கள்", te: "రహదారులు", mr: "रस्ते" },
  "Pure Sat": { hi: "केवल उपग्रह", kn: "ಶುದ್ಧ ಉಪಗ್ರಹ", ta: "தூய செயற்கைக்கோள்", te: "కేవలం ఉపగ్రహం", mr: "शुद्ध सॅटेलाइट" },
  "Contours": { hi: "समोच्च रेखाएं", kn: "ಕಾಂತೂರುಗಳು", ta: "நில வரையறைகள்", te: "కాంటూర్లు", mr: "समोच्च रेषा" },
  "Acres": { hi: "एकड़", kn: "ಎಕರೆ", ta: "ஏக்கர்", te: "ఎకరాలు", mr: "एकर", bn: "একর", gu: "એકર" },
  "Gunthas": { hi: "गुंठा", kn: "ಗುಂಟೆ", ta: "குண்டா", te: "గుంటలు", mr: "गुंठे", bn: "গুন্ঠা" },
  "Bighas": { hi: "बीघा", kn: "ಬಿಘಾ", ta: "பிகா", te: "బిఘాలు", mr: "बिघा", bn: "বিঘা" },
  "Hectares": { hi: "हेक्टेयर", kn: "ಹೆಕ್ಟೇರ್", ta: "ஹெக்டேர்", te: "హెక్టార్లు", mr: "हेक्टर", bn: "হেক্টর" },
  "Fence Perimeter": { hi: "बाड़ परिधि", kn: "ಬೇಲಿ ಸುತ್ತಳತೆ", ta: "வேலி சுற்றளவு", te: "కంచె చుట్టుకొలత", mr: "कुंपण परिमिती" },
  "Sq. Footage": { hi: "वर्ग फुट", kn: "ಚದರ ಅಡಿ", ta: "சதுர அடி", te: "చదరపు అడుగులు", mr: "चौरस फूट" },
  "Vegetation Status": { hi: "वनस्पति स्थिति", kn: "ಸಸ್ಯವರ್ಗದ ಸ್ಥಿತಿ", ta: "தாவர நிலை", te: "వృక్షసంపద స్థితి", mr: "वनस्पती स्थिती" },
  "Canopy Density": { hi: "छतरी घनत्व", kn: "ಮೇಲಾವರಣ ಸಾಂದ್ರತೆ", ta: "மேற்பரப்பு அடர்த்தி", te: "పందిరి సాంద్రత", mr: "कॅनॉपी घनता" },
  "Standard Units": { hi: "मानक इकाइयां", kn: "ಪ್ರಮಾಣಿತ ಘಟಕಗಳು", ta: "நிலையான அலகுகள்", te: "ప్రామాణిక యూనిట్లు", mr: "प्रमाणित एकके" },
  "Regional Units": { hi: "क्षेत्रीय इकाइयां", kn: "ಪ್ರಾದೇಶಿಕ ಘಟಕಗಳು", ta: "பிராந்திய அலகுகள்", te: "ప్రాంతీయ యూనిట్లు", mr: "प्रादेशिक एकके" },

  // Weather & Radar
  "Air Temp": { hi: "हवा का तापमान", kn: "ಗಾಳಿಯ ತಾಪಮಾನ", ta: "காற்று வெப்பநிலை", te: "గాలి ఉష్ణోగ్రత", mr: "हवेचे तापमान" },
  "Relative Humidity": { hi: "सापेक्ष आर्द्रता", kn: "ಸಾಪೇಕ್ಷ ಆರ್ದ್ರತೆ", ta: "ஒப்பீட்டு ஈரப்பதம்", te: "సాపేక్ష ఆర్ద్రత", mr: "सापेक्ष आर्द्रता" },
  "Soil Temp (0-7cm)": { hi: "मृदा तापमान (0-7 सेमी)", kn: "ಮಣ್ಣಿನ ತಾಪಮಾನ (0-7 ಸೆಂ.ಮೀ)", ta: "மண் வெப்பநிலை (0-7 செ.மீ)", te: "నేల ఉష్ణోగ్రత (0-7 సెం.మీ)", mr: "मातीचे तापमान (0-7 सेमी)" },
  "Wind Velocity": { hi: "हवा की गति", kn: "ಗಾಳಿಯ ವೇಗ", ta: "காற்றின் வேகம்", te: "గాలి వేగం", mr: "वाऱ्याचा वेग" },
  "UV Radiation": { hi: "यूवी विकिरण", kn: "ಯುವಿ ವಿಕಿರಣ", ta: "புற ஊதா கதிர்வீச்சு", te: "UV రేడియేషన్", mr: "अतिनील किरणोत्सर्ग" },
  "Crop ET₀ Demand": { hi: "फसल वाष्पोत्सर्जन मांग", kn: "ಬೆಳೆ ಬಾಷ್ಪೀಕರಣ ಬೇಡಿಕೆ", ta: "பயிர் ஆவியாதல் தேவை", te: "పంట బాష్పోత్సేక డిమాండ్", mr: "पीक बाष्पीभवन मागणी" },
  "Optimal Spray Window": { hi: "छिड़काव के लिए सर्वोत्तम समय", kn: "ಸಿಂಪಡಣೆಗೆ ಸೂಕ್ತ ಸಮಯ", ta: "தெளிப்பதற்கு உகந்த நேரம்", te: "పిచికారీకి అనుకూల సమయం", mr: "फवारणीसाठी योग्य वेळ" },
  "Today's Recommended Spraying Window:": { hi: "आज छिड़काव के लिए अनुशंसित समय:", kn: "ಇಂದಿನ ಶಿಫಾರಸು ಮಾಡಿದ ಸಿಂಪರಣಾ ಸಮಯ:", ta: "இன்றைய பரிந்துரைக்கப்பட்ட தெளிக்கும் நேரம்:", te: "నేటి సిఫార్సు చేయబడిన పిచికారీ సమయం:", mr: "आजची शिफारस केलेली फवारणी वेळ:" },
  "24-Hour Live Precipitation Radar & Spraying Feasibility Timeline": {
    hi: "24 घंटे का लाइव वर्षा रडार एवं छिड़काव उपयुक्तता समयरेखा",
    kn: "24-ಗಂಟೆಗಳ ಲೈವ್ ಮಳೆ ರೇಡಾರ್ ಮತ್ತು ಸಿಂಪರಣಾ ಸೂಕ್ತತೆಯ ಟೈಮ್‌ಲೈನ್",
    ta: "24 மணி நேர நேரலை மழை ரேடார் & தெளிக்கும் சாத்தியக்கூறு காலவரிசை",
    te: "24-గంటల ప్రత్యక్ష వర్షపాతం రాడార్ & పిచికారీ అనుకూలత కాలక్రమం",
    mr: "24-तास थेट पर्जन्यवृष्टी रडार आणि फवारणी व्यवहार्यता टाइमलाइन"
  },
  "7-Day Agricultural Weather Outlook & Field Planning": {
    hi: "7-दिवसीय कृषि मौसम दृष्टिकोण एवं खेत योजना",
    kn: "7-ದಿನಗಳ ಕೃಷಿ ಹವಾಮಾನ ಮುನ್ನೋಟ ಮತ್ತು ಕ್ಷೇತ್ರ ಯೋಜನೆ",
    ta: "7 நாள் வேளாண் வானிலை கண்ணோட்டம் மற்றும் பண்ணைத் திட்டமிடல்",
    te: "7-రోజుల వ్యవసాయ వాతావరణ దృక్పథం & పొలం ప్రణాళిక",
    mr: "7-दिवसीय कृषी हवामान अंदाज आणि शेत नियोजन"
  },
  "Active Regional Agro-Weather Advisories & Alerts": {
    hi: "सक्रिय क्षेत्रीय कृषि-मौसम परामर्श एवं अलर्ट",
    kn: "ಸಕ್ರಿಯ ಪ್ರಾದೇಶಿಕ ಕೃಷಿ-ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು",
    ta: "செயலில் உள்ள பிராந்திய வேளாண்-வானிலை ஆலோசனைகள் & எச்சரிக்கைகள்",
    te: "సక్రియ ప్రాంతీయ వ్యవసాయ-వాతావరణ సలహాలు & హెచ్చరికలు",
    mr: "सक्रिय प्रादेशिक कृषी-हवामान सल्ला आणि सूचना"
  },

  // Command Center
  "National Agricultural Command Center": { hi: "राष्ट्रीय कृषि कमांड सेंटर", kn: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ಕಮಾಂಡ್ ಸೆಂಟರ್", ta: "தேசிய வேளாண் கட்டளை மையம்", te: "జాతీయ వ్యవసాయ కమాండ్ సెంటర్" },
  "Monitored Farm Land": { hi: "निगरानी अधीन कृषि भूमि", kn: "ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿರುವ ಕೃಷಿ ಭೂಮಿ", ta: "கண்காணிக்கப்படும் பண்ணை நிலம்", te: "పర్యవేక్షించబడుతున్న వ్యవసాయ భూమి" },
  "Avg Soil Health Index": { hi: "औसत मृदा स्वास्थ्य सूचकांक", kn: "ಸರಾಸರಿ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ", ta: "சராசரி மண் நலக் குறியீடு", te: "సగటు నేల ఆరోగ్య సూచిక" },
  "SRM AI Neural Engine": { hi: "उपग्रह न्यूरल इंजन", kn: "ಉಪಗ್ರಹ AI ನ್ಯೂರಲ್ ಇಂಜಿನ್", ta: "செயற்கை நுண்ணறிவு இயந்திரம்", te: "ఉపగ్రహ న్యూరల్ ఇంజిన్" },
  "National Foodgrain Output": { hi: "राष्ट्रीय खाद्यान्न उत्पादन", kn: "ರಾಷ್ಟ್ರೀಯ ಆಹಾರ ಧಾನ್ಯ ಉತ್ಪಾದನೆ", ta: "தேசிய உணவு தானிய உற்பத்தி", te: "జాతీయ ఆహార ధాన్యాల ఉత్పత్తి" },
  "Fast Action Launcher": { hi: "त्वरित कार्य लॉन्चर", kn: "ತ್ವರಿತ ಕ್ರಿಯಾ ಲಾಂಚರ್", ta: "விரைவு செயல் துவக்கி", te: "శీఘ్ర కార్యాచరణ లాంచర్" },
  "Run Satellite Super-Resolution": { hi: "उपग्रह सुपर-रेजोल्यूशन चलाएं", kn: "ಉಪಗ್ರಹ ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ರನ್ ಮಾಡಿ", ta: "செயற்கைக்கோள் மேப்பிங் இயக்கவும்", te: "ఉపగ్రహ సూపర్-రిజల్యూషన్ అమలు చేయండి" },
  "Simulate Soil NPK Depletion": { hi: "मृदा एनपीके क्षरण का अनुकरण करें", kn: "ಮಣ್ಣಿನ NPK ಸವಕಳಿ ಸಿಮ್ಯುಲೇಶನ್", ta: "மண் ஊட்டச்சத்து குறைவை கணக்கிடுங்கள்", te: "నేల NPK క్షీణతను అనుకరించండి" },
  "Open Power BI Analytics": { hi: "पावर बीआई विश्लेषण खोलें", kn: "ಪವರ್ ಬಿಐ ವಿಶ್ಲೇಷಣೆ ತೆರೆಯಿರಿ", ta: "பவர் பிஐ பகுப்பாய்வை திறக்கவும்", te: "పవర్ BI విశ్లేషణను తెరవండి" },
  "Ask AI Agronomist (Krishi Mitra)": { hi: "कृषि मित्र एआई से पूछें", kn: "ಕೃಷಿ ಮಿತ್ರ AI ಅನ್ನು ಕೇಳಿ", ta: "கிருஷி மித்ராவிடம் கேளுங்கள்", te: "కృషి మిత్ర AIని అడగండి" },

  // Soil Precision
  "Soil Health Card Parameters": { hi: "मृदा स्वास्थ्य कार्ड पैरामीटर", kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ನಿಯತಾಂಕಗಳು", ta: "மண் நல அட்டை அளவுருக்கள்", te: "నేల ఆరోగ్య కార్డు పారామితులు" },
  "Available Nitrogen (N)": { hi: "उपलब्ध नाइट्रोजन (N)", kn: "ಲಭ್ಯವಿರುವ ಸಾರಜನಕ (N)", ta: "கிடைக்கக்கூடிய நைட்ரஜன் (N)", te: "లభ్యమయ్యే నత్రజని (N)" },
  "Available Phosphorus (P)": { hi: "उपलब्ध फास्फोरस (P)", kn: "ಲಭ್ಯವಿರುವ ರಂಜಕ (P)", ta: "கிடைக்கக்கூடிய பாஸ்பரஸ் (P)", te: "లభ్యమయ్యే భాస్వరం (P)" },
  "Available Potassium (K)": { hi: "उपलब्ध पोटेशियम (K)", kn: "ಲಭ್ಯವಿರುವ ಪೊಟ್ಯಾಶಿಯಂ (K)", ta: "கிடைக்கக்கூடிய பொட்டாசியம் (K)", te: "లభ్యమయ్యే పొటాషియం (K)" },
  "Soil Reaction (pH)": { hi: "मृदा पीएच (pH)", kn: "ಮಣ್ಣಿನ pH", ta: "மண் pH", te: "నేల pH" },
  "Organic Carbon (OC %)": { hi: "जैविक कार्बन (OC %)", kn: "ಸಾವಯವ ಇಂಗಾಲ (OC %)", ta: "கரிம கார்பன் (OC %)", te: "సేంద్రీయ కార్బన్ (OC %)" },
  "Compute Soil Health & 3-Season Drawdown": { hi: "मृदा स्वास्थ्य एवं 3-सीजन पोषक तत्व कमी की गणना करें", kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು 3-ಸೀಸನ್ ಸವಕಳಿಯನ್ನು ಲೆಕ್ಕಹಾಕಿ", ta: "மண் வளம் மற்றும் 3-பருவ குறைவை கணக்கிடுங்கள்", te: "నేల ఆరోగ్యం & 3-సీజన్ల క్షీణతను లెక్కించండి" },
  "AI Crop Rotation & Restoration Plan": { hi: "एआई फसल चक्र एवं बहाली योजना", kn: "AI ಬೆಳೆ ಪರಿವರ್ತನೆ ಮತ್ತು ಮಣ್ಣು ಸುಧಾರಣೆ ಯೋಜನೆ", ta: "AI பயிர் சுழற்சி & மண் சீரமைப்பு திட்டம்", te: "AI పంట మార్పిడి & నేల పునరుద్ధరణ ప్రణాళిక" },

  // Crops
  "Wheat": { hi: "गेहूं", kn: "ಗೋಧಿ", ta: "கோதுமை", te: "గోధుమ", mr: "गहू", bn: "গম", gu: "ઘઉં", pa: "ਕਣਕ", ml: "ഗോതമ്പ്" },
  "Rice": { hi: "धान / चावल", kn: "ಭತ್ತ / ಅಕ್ಕಿ", ta: "நெல் / அரிசி", te: "వరి / బియ్యం", mr: "भात / तांदूळ", bn: "ধান / চাল", gu: "ડાંગર / ચોખા", pa: "ਝੋਨਾ / ਚੌਲ", ml: "നെല്ല് / അരി" },
  "Paddy": { hi: "धान", kn: "ಭತ್ತ", ta: "நெல்", te: "వరి", mr: "भात", bn: "ধান", gu: "ડાંગર", pa: "ਝੋਨਾ", ml: "നെല്ല്" },
  "Cotton": { hi: "कपास", kn: "ಹತ್ತಿ", ta: "பருத்தி", te: "పత్తి", mr: "कापूस", bn: "তুলা", gu: "કપાસ", pa: "ਕਪਾਹ", ml: "പരുത്തി" },
  "Sugarcane": { hi: "गन्ना", kn: "ಕಬ್ಬು", ta: "கரும்பு", te: "చెరకు", mr: "ऊस", bn: "আখ", gu: "શેરડી", pa: "ਗੰਨਾ", ml: "കരിമ്പ്" },
  "Maize": { hi: "मक्का", kn: "ಮೆಕ್ಕೆಜೋಳ", ta: "மக்காச்சோளம்", te: "మొక్కజొన్న", mr: "मका", bn: "ভুট্টা", gu: "મકાઈ", pa: "ਮੱਕੀ", ml: "ചോളം" },
  "Soybean": { hi: "सोयाबीन", kn: "ಸೋಯಾಬೀನ್", ta: "சோயாபீன்", te: "సోయాబీన్", mr: "सोयाबीन", bn: "সয়াবিন", gu: "સોયાબીન", pa: "ਸੋਇਆਬੀਨ", ml: "സോയാബീൻ" },
  "Mustard": { hi: "सरसों", kn: "ಸಾಸಿವೆ", ta: "கடுகு", te: "ఆవాలు", mr: "मोहरी", bn: "সরিষা", gu: "રાઈ", pa: "ਸਰ੍ਹੋਂ", ml: "കടുക്" },
  "Chilli": { hi: "मिर्च", kn: "ಮೆಣಸಿನಕಾಯಿ", ta: "மிளகாய்", te: "మిరపకాయ", mr: "मिरची", bn: "মরিচ", gu: "મરચું", pa: "ਮਿਰਚ", ml: "മുളക്" }
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
  if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'PATH', 'IFRAME'].includes(tag)) {
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
  if (!trimmed || /^[0-9\s.,:%!@#$^&*()_+\-=[\]{};':"\\|,.<>/?°℃℉\/\\|•]+$/.test(trimmed)) {
    return text;
  }

  // 1. Check client dictionary
  if (CLIENT_TRANSLATION_MAP[trimmed] && CLIENT_TRANSLATION_MAP[trimmed][targetLang]) {
    return CLIENT_TRANSLATION_MAP[trimmed][targetLang];
  }

  // 2. Check memory cache
  const cacheKey = `${targetLang}:${trimmed}`;
  if (dynamicTranslationCache.has(cacheKey)) {
    return dynamicTranslationCache.get(cacheKey);
  }

  return null;
}

/**
 * Flushes pending batch translation queue to backend or fallback neural translator
 */
async function flushBatchQueue(targetLang) {
  if (batchQueue.length === 0 || targetLang === 'en') return;

  const currentBatch = [...batchQueue];
  batchQueue = [];

  const uniqueTexts = Array.from(new Set(currentBatch.map(item => item.text)));

  try {
    const res = await api.translateBatch(uniqueTexts, 'en', targetLang);
    if (res && Array.isArray(res.translated_texts)) {
      res.translated_texts.forEach((translated, index) => {
        const orig = uniqueTexts[index];
        if (orig && translated) {
          const cacheKey = `${targetLang}:${orig}`;
          dynamicTranslationCache.set(cacheKey, translated);
        }
      });

      // Apply translations to queued nodes preserving formatting
      currentBatch.forEach(({ node, text, rawOrig }) => {
        const cacheKey = `${targetLang}:${text}`;
        const translated = dynamicTranslationCache.get(cacheKey);
        if (translated) {
          const leadingWs = rawOrig.match(/^\s*/)?.[0] || '';
          const trailingWs = rawOrig.match(/\s*$/)?.[0] || '';
          const finalVal = leadingWs + translated + trailingWs;
          if (node.nodeValue !== finalVal) {
            node.nodeValue = finalVal;
            translatedNodesCount++;
          }
        }
      });

      updateLiveStats();
      return;
    }
  } catch (err) {
    console.debug('[LiveTranslator] Batch API retry with client direct fallback:', err.message);
  }

  // Direct client-side neural translation fallback for un-translated items
  uniqueTexts.forEach(async (text) => {
    try {
      const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
      const r = await fetch(mmUrl);
      if (r.ok) {
        const json = await r.json();
        const translated = json.responseData?.translatedText;
        if (translated && !translated.startsWith('MYMEMORY WARNING:') && translated !== text) {
          const cacheKey = `${targetLang}:${text}`;
          dynamicTranslationCache.set(cacheKey, translated);

          currentBatch.forEach(({ node, text: itemText, rawOrig }) => {
            if (itemText === text) {
              const leadingWs = rawOrig.match(/^\s*/)?.[0] || '';
              const trailingWs = rawOrig.match(/\s*$/)?.[0] || '';
              node.nodeValue = leadingWs + translated + trailingWs;
              translatedNodesCount++;
            }
          });
          updateLiveStats();
        }
      }
    } catch (_) {}
  });
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
  const trimmed = origText.trim();

  if (targetLang === 'en') {
    if (node.nodeValue !== origText) {
      node.nodeValue = origText;
    }
    return;
  }

  // Fast dictionary or cached match
  const fastMatch = lookupFastTranslation(trimmed, targetLang);
  if (fastMatch) {
    const leadingWs = origText.match(/^\s*/)?.[0] || '';
    const trailingWs = origText.match(/\s*$/)?.[0] || '';
    const finalVal = leadingWs + fastMatch + trailingWs;
    if (node.nodeValue !== finalVal) {
      node.nodeValue = finalVal;
      translatedNodesCount++;
      updateLiveStats();
    }
    return;
  }

  // Queue for batch neural translation
  batchQueue.push({ node, text: trimmed, rawOrig: origText });

  if (batchTimeout) clearTimeout(batchTimeout);
  batchTimeout = setTimeout(() => {
    flushBatchQueue(targetLang);
  }, 35);
}

/**
 * Translates element attributes like placeholder and title
 */
function translateElementAttributes(el, targetLang) {
  if (!el || typeof el.getAttribute !== 'function') return;

  // 1. Placeholder
  if (el.hasAttribute('placeholder')) {
    const rawPh = el.getAttribute('placeholder');
    if (rawPh && rawPh.trim()) {
      if (!el.__agriOrigPh) el.__agriOrigPh = rawPh;
      if (targetLang === 'en') {
        el.setAttribute('placeholder', el.__agriOrigPh);
      } else {
        const match = lookupFastTranslation(el.__agriOrigPh.trim(), targetLang);
        if (match) {
          el.setAttribute('placeholder', match);
        } else {
          api.translate(el.__agriOrigPh.trim(), 'en', targetLang)
            .then(res => {
              if (res && res.translated_text) el.setAttribute('placeholder', res.translated_text);
            })
            .catch(() => {});
        }
      }
    }
  }

  // 2. Title attribute
  if (el.hasAttribute('title')) {
    const rawTitle = el.getAttribute('title');
    if (rawTitle && rawTitle.trim()) {
      if (!el.__agriOrigTitle) el.__agriOrigTitle = rawTitle;
      if (targetLang === 'en') {
        el.setAttribute('title', el.__agriOrigTitle);
      } else {
        const match = lookupFastTranslation(el.__agriOrigTitle.trim(), targetLang);
        if (match) {
          el.setAttribute('title', match);
        }
      }
    }
  }
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

  // Also translate form inputs & titles in this subtree
  if (rootNode.querySelectorAll) {
    const elementsWithAttrs = rootNode.querySelectorAll('[placeholder], [title]');
    elementsWithAttrs.forEach(el => translateElementAttributes(el, targetLang));
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

    // MutationObserver to intercept all newly rendered or changed elements
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
        } else if (mutation.type === 'characterData') {
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

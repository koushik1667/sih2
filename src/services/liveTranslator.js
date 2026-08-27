/**
 * AgriSphere Unified Live Real-Time DOM & Dynamic Content Translation Engine
 * Amazon / Flipkart-Style Instant Live Translation with 0ms Latency & High Coverage
 */

import { api } from './api';

// Agronomy & UI Realtime Translation Dictionary
export const CLIENT_TRANSLATION_MAP = {
  // Navigation & Core Headers
  "Command Center": { hi: "कमांड सेंटर", kn: "ಕಮಾಂಡ್ ಸೆಂಟರ್", ta: "கட்டளை மையம்", te: "కమాండ్ సెంటర్", mr: "कमांड सेंटर", bn: "কমান্ড সেন্টার", gu: "કમાન્ડ સેન્ટર", pa: "ਕਮਾਂਡ ਸੈਂਟਰ", ml: "കമാൻഡ് സെന്റർ", or: "କମାଣ୍ଡ ସେଣ୍ଟର" },
  "Land & Satellite": { hi: "भूमि एवं उपग्रह", kn: "ಭೂಮಿ ಮತ್ತು ಉಪಗ್ರಹ", ta: "நிலம் & செயற்கைக்கோள்", te: "భూమి & ఉపగ్రహం", mr: "जमीन आणि उपग्रह", bn: "জমি ও উপগ্রহ", gu: "જમીન અને ઉપગ્રહ", pa: "ਜ਼ਮੀਨ ਅਤੇ ਉਪਗ੍ਰਹਿ", ml: "ഭൂമിയും ഉപഗ്രഹവും", or: "ଜମି ଏବଂ ଉପଗ୍ରହ" },
  "Soil & Weather": { hi: "मृदा एवं मौसम", kn: "ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ", ta: "மண் & வானிலை", te: "నేల & వాతావరణం", mr: "माती आणि हवामान", bn: "মাটি ও আবহাওয়া", gu: "જમીન અને હવામાન", pa: "ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ", ml: "മണ്ണും കാലാവസ്ഥയും", or: "ମାଟି ଏବଂ ପାଣିପାଗ" },
  "Farm Hub & AI": { hi: "फार्म हब एवं एआई", kn: "ಫಾರ್ಮ್ ಹಬ್ & AI", ta: "பண்ணை மையம் & AI", te: "ఫామ్ హబ్ & AI", mr: "फार्म हब आणि एआय", bn: "ফার্ম হাব ও এআই", gu: "ફાર્મ હબ અને AI", pa: "ਫਾਰਮ ਹੱਬ ਅਤੇ ਏਆਈ", ml: "ഫാം ഹബ്ബും AIയും", or: "ଫାର୍ମ ହବ୍ ଏବଂ AI" },
  "Land Measure & Scan": { hi: "भूमि मापन एवं स्कैन", kn: "ಭೂಮಿ ಅಳತೆ ಮತ್ತು ಸ್ಕ್ಯಾನ್", ta: "நில அளவீடு & ஸ்கேன்", te: "భూమి కొలత & స్కాన్", mr: "जमीन मोजणी आणि स्कॅन", bn: "জমি পরিমাপ ও স্ক্যান", gu: "જમીન માપણી અને સ્કેન", pa: "ਜ਼ਮੀਨ ਮਿਣਤੀ ਅਤੇ ਸਕੈਨ", ml: "ഭൂമി അളക്കലും സ്കാനും", or: "ଜମି ମାପ ଏବଂ ସ୍କାନ୍" },
  "GeoSR-AI Studio": { hi: "जियोएसआर उपग्रह स्टूडियो", kn: "ಜಿಯೋಎಸ್‌ಆರ್ ಸ್ಟುಡಿಯೋ", ta: "ஜியோஎஸ்ஆர் ஸ்டுடியோ", te: "జియోఎస్ఆర్ స్టూడియో", mr: "जिओएसआर स्टुडिओ", bn: "জিওএসআর স্টুডিও", gu: "જિયોએસઆર સ્ટુડિયો", pa: "ਜੀਓਐਸਆਰ ਸਟੂਡੀਓ", ml: "ജിയോഎസ്ആർ സ്റ്റുഡിയോ", or: "ଜିଓଏସଆର ଷ୍ଟୁଡିଓ" },
  "Weather Radar & Microclimate": { hi: "मौसम रडार एवं सूक्ष्म जलवायु", kn: "ಹವಾಮಾನ ರಾಡಾರ್", ta: "வானிலை ரேடார்", te: "వాతావరణ రాడార్ & సూక్ష్మ వాతావరణం", mr: "हवामान रडार", bn: "আবহাওয়া রাডার", gu: "હવામાન રડાર", pa: "ਮੌਸਮ ਰਾਡਾਰ", ml: "കാലാവസ്ഥാ റഡാർ" },
  "Soil NPK & Depletion": { hi: "मृदा पोषक तत्व एवं क्षरण", kn: "ಮಣ್ಣಿನ NPK ಮತ್ತು ಕ್ಷೀಣತೆ", ta: "மண் NPK மற்றும் குறைவு", te: "నేల NPK & పోషకాల క్షీణత", mr: "माती एनपीके आणि घट", bn: "মাটি এনপিকে ও ক্ষয়", gu: "જમીન NPK અને ક્ષતિ", pa: "ਮਿੱਟੀ NPK ਅਤੇ ਘਾਟ", ml: "മണ്ണ് NPK ക്ഷയം" },
  "AI Agronomist": { hi: "कृषि मित्र एआई", kn: "ಕೃಷಿ ಮಿತ್ರ AI", ta: "வேளாண் நண்பன் AI", te: "కృషి మిత్ర AI", mr: "कृषी मित्र एआय", bn: "কৃষি মিত্র এআই", gu: "કૃષિ મિત્ર એઆઈ", pa: "ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ ਏਆਈ", ml: "കാർഷിക മിത്രം AI", or: "କୃଷି ମିତ୍ର AI" },
  "My Farm Parcels": { hi: "मेरे खेत के पार्सल", kn: "ನನ್ನ ಜಮೀನುಗಳು", ta: "எனது பண்ணைகள்", te: "నా వ్యవసాయ క్షేత్రాలు", mr: "माझी शेतं", bn: "আমার খামার প্লট", gu: "મારા ખેતરો", pa: "ਮੇਰੇ ਖੇਤ", ml: "എന്റെ കൃഷിയിടങ്ങൾ" },
  "National Analytics": { hi: "राष्ट्रीय फसल विश्लेषण", kn: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ", ta: "தேசிய வேளாண் பகுப்பாய்வு", te: "జాతీయ వ్యవసాయ విశ్లేషణ", mr: "राष्ट्रीय कृषी विश्लेषण", bn: "জাতীয় কৃষি विश्लेषण", gu: "રાષ્ટ્રીય કૃષિ વિશ્લેષણ", pa: "ਰਾਸ਼ਟਰੀ ਖੇਤੀ ਵਿਸ਼ਲੇਸ਼ਣ", ml: "ദേശീയ കാർഷിക വിശകലനം" },
  "Home": { hi: "होम", kn: "ಮುಖಪುಟ", ta: "முகப்பு", te: "హోమ్", mr: "मुख्यपृष्ठ", bn: "হোম", gu: "હોમ", pa: "ਮੁੱਖ ਪੰਨਾ", ml: "ഹോം" },
  "Farmer Account": { hi: "किसान खाता", kn: "ರೈತರ ಖಾತೆ", ta: "விவசாயி கணக்கு", te: "రైతు ఖాతా", mr: "शेतकरी खाते", bn: "কৃষক অ্যাকাউন্ট", gu: "ખેડૂત ખાતું", pa: "ਕਿਸਾਨ ਖਾਤਾ", ml: "കർഷക അക്കൗണ്ട്" },
  "Login Dashboard": { hi: "लॉगिन डैशबोर्ड", kn: "ಲಾಗಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", ta: "உள்நுழைவு டாஷ்போர்டு", te: "లాగిన్ డాష్‌బోర్డ్", mr: "लॉगिन डॅशबोर्ड", bn: "লগইন ড্যাশবোর্ড", gu: "લૉગિન ડૅશબોર્ડ", pa: "ਲਾਗਇਨ ਡੈਸ਼ਬੋਰਡ", ml: "ലോഗിൻ ഡാഷ്ബോർഡ്" },
  "Sign In": { hi: "साइन इन", kn: "ಸೈನ್ ಇನ್", ta: "உள்நுழைக", te: "సైన్ ఇన్", mr: "साइन इन", bn: "সাইন ইন", gu: "સાઇન ઇન", pa: "ਸਾਈਨ ਇਨ", ml: "സൈൻ ഇൻ" },

  // Interactive Land Measuring & Scanner
  "Interactive Land Measuring & Spectral Scanner": {
    hi: "इंटरैक्टिव भूमि मापन एवं स्पेक्ट्रल स्कैनर",
    kn: "ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಭೂಮಿ ಅಳತೆ ಮತ್ತು ಸ್ಪೆಕ್ಟ್ರಲ್ ಸ್ಕ್ಯಾನರ್",
    ta: "ஊடாடும் நில அளவீடு மற்றும் நிறமாலை ஸ்கேனர்",
    te: "ఇంటరాక్టివ్ ల్యాండ్ మెజరింగ్ & స్పెక్ట్రల్ స్కానర్",
    mr: "परस्परसंवादी जमीन मोजणी आणि स्पेक्ट्रल स्कॅनर",
    bn: "ইন্টারেক্টিভ জমি পরিমাপ ও বর্ণালী স্ক্যানার"
  },
  "Search any Indian village, district or GPS coordinates. High-resolution satellite tiles render cadastral boundary lines with village names and roads.": {
    hi: "किसी भी भारतीय गाँव, जिले या जीपीएस निर्देशांक को खोजें। उपग्रह मानचित्र राजस्व सीमाओं, गाँव के नाम और सड़कों को प्रदर्शित करता है।",
    kn: "ಯಾವುದೇ ಭಾರತೀಯ ಗ್ರಾಮ, ಜಿಲ್ಲೆ ಅಥವಾ ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಹುಡುಕಿ. ಉಪಗ್ರಹ ನಕ್ಷೆಯು ಗಡಿಗಳು ಮತ್ತು ರಸ್ತೆಗಳನ್ನು ತೋರಿಸುತ್ತದೆ.",
    ta: "எந்தவொரு இந்திய கிராமம், மாவட்டம் அல்லது ஜிபிஎஸ் ஆயத்தொலைவுகளைத் தேடுங்கள். செயற்கைக்கோள் வரைபடம் எல்லைகள் மற்றும் சாலைகளைக் காட்டுகிறது.",
    te: "ఏదైనా భారతీయ గ్రామం, జిల్లా లేదా జీపీఎస్ అక్షాంశ రేఖాంశాలను శోధించండి. అధిక రిజల్యూషన్ గల ఉపగ్రహ పటాలు సరిహద్దులను చూపుతాయి."
  },
  "Click on the map to add boundary pins.": {
    hi: "सीमा पिन जोड़ने के लिए मानचित्र पर क्लिक करें।",
    kn: "ಗಡಿ ಪಿನ್‌ಗಳನ್ನು ಸೇರಿಸಲು ನಕ್ಷೆಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    ta: "எல்லை முள் புள்ளிகளைச் சேர்க்க வரைபடத்தில் கிளிக் செய்யவும்.",
    te: "సరిహద్దు మూల పిన్‌లను జోడించడానికి మ్యాప్‌పై క్లిక్ చేయండి."
  },
  "Click map to start measuring": {
    hi: "मापना शुरू करने के लिए मानचित्र पर क्लिक करें",
    kn: "ಅಳತೆ ಪ್ರಾರಂಭಿಸಲು ನಕ್ಷೆಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
    ta: "அளவிடத் தொடங்க வரைபடத்தைக் கிளிக் செய்யவும்",
    te: "కొలవడం ప్రారంభించడానికి మ్యాప్‌పై క్లిక్ చేయండి"
  },
  "Measured Land Area": { hi: "मापा गया भूमि क्षेत्र", kn: "ಅಳತೆ ಮಾಡಿದ ಭೂ ಪ್ರದೇಶ", ta: "அளவிடப்பட்ட நிலப்பரப்பு", te: "కొలవబడిన భూ విస్తీర్ణం", mr: "मोजलेले जमीन क्षेत्र" },
  "Fence Perimeter": { hi: "बाड़ परिधि", kn: "ಬೇಲಿ ಸುತ್ತಳತೆ", ta: "வேலி சுற்றளவு", te: "కంచె చుట్టుకొలత", mr: "कुंपण परिमिती" },
  "Sq. Footage": { hi: "वर्ग फुट", kn: "ಚದರ ಅಡಿ", ta: "சதுர அடி", te: "చదరపు అడుగులు", mr: "चौरस फूट" },
  "Locate Me": { hi: "मेरी स्थिति खोजें", kn: "ನನ್ನ ಸ್ಥಳ ಹುಡುಕಿ", ta: "என்னை கண்டறிக", te: "నన్ను గుర్తించండి", mr: "माझे स्थान शोधा" },
  "Hybrid Sat": { hi: "हाइब्रिड उपग्रह", kn: "ಹೈಬ್ರಿಡ್ ಉಪಗ್ರಹ", ta: "ஹைப்ரிட் செயற்கைக்கோள்", te: "హైబ్రిడ్ ఉపగ్రహం", mr: "हायब्रिड सॅटेलाइट" },
  "Streets": { hi: "सड़कें", kn: "ರಸ್ತೆಗಳು", ta: "தெருக்கள்", te: "రహదారులు", mr: "रस्ते" },
  "Pure Sat": { hi: "केवल उपग्रह", kn: "ಶುದ್ಧ ಉಪಗ್ರಹ", ta: "தூய செயற்கைக்கோள்", te: "కేవలం ఉపగ్రహం", mr: "शुद्ध सॅटेलाइट" },
  "Contours": { hi: "समोच्च रेखाएं", kn: "ಕಾಂತೂರುಗಳು", ta: "நில வரையறைகள்", te: "కాంటూర్లు", mr: "समोच्च रेषा" },
  "Acres": { hi: "एकड़", kn: "ಎಕರೆ", ta: "ஏக்கர்", te: "ఎకరాలు", mr: "एकर" },
  "Gunthas": { hi: "गुंठा", kn: "ಗುಂಟೆ", ta: "குண்டா", te: "గుంటలు", mr: "गुंठे" },
  "Bighas": { hi: "बीघा", kn: "ಬಿಘಾ", ta: "பிகா", te: "బిఘాలు", mr: "बिघा" },
  "Hectares": { hi: "हेक्टेयर", kn: "ಹೆಕ್ಟೇರ್", ta: "ஹெக்டேர்", te: "హెక్టార్లు", mr: "हेक्टर" },
  "Analyze in GeoSR-AI Studio & Generate Report": {
    hi: "जियोएसआर स्टूडियो में विश्लेषण करें एवं रिपोर्ट बनाएं",
    kn: "ಜಿಯೋಎಸ್‌ಆರ್ ಸ್ಟುಡಿಯೋದಲ್ಲಿ ವಿಶ್ಲೇಷಿಸಿ ವರದಿ ಪಡೆಯಿರಿ",
    ta: "GeoSR-AI இல் பகுப்பாய்வு செய்து அறிக்கை உருவாக்கவும்",
    te: "జియోఎస్ఆర్-AIలో విశ్లేషించి నివేదికను రూపొందించండి"
  },
  "Save Parcel to My Farm Database": {
    hi: "खेत डेटाबेस में पार्सल सहेजें",
    kn: "ನನ್ನ ಜಮೀನಿನ ಡೇಟಾಬೇಸ್‌ಗೆ ಉಳಿಸಿ",
    ta: "எனது பண்ணை தரவுத்தளத்தில் சேமிக்கவும்",
    te: "నా వ్యవసాయ డేటాబేస్‌లో సేవ్ చేయండి"
  },
  "Spectral & Soil Scan Telemetry": {
    hi: "स्पेक्ट्रल एवं मृदा स्कैन टेलीमेट्री",
    kn: "ಸ್ಪೆಕ್ಟ್ರಲ್ ಮತ್ತು ಮಣ್ಣಿನ ಸ್ಕ್ಯಾನ್ ಟೆಲಿಮೆಟ್ರಿ",
    ta: "ஸ்பெக்ட்ரல் & மண் ஸ்கேன் டெலிமெட்ரி",
    te: "స్పెక్ట్రల్ & సాయిల్ స్కాన్ టెలిమెట్రీ"
  },

  // Satellite Layers & SRM Studio
  "GeoSR-AI: Satellite Imagery Super-Resolution Studio": {
    hi: "GeoSR-AI: उपग्रह इमेजरी सुपर-रेजोल्यूशन स्टूडियो",
    kn: "GeoSR-AI: ಉಪಗ್ರಹ ಚಿತ್ರಣ ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ಸ್ಟುಡಿಯೋ",
    ta: "GeoSR-AI: செயற்கைக்கோள் பட சூப்பர்-ரெசல்யூஷன் ஸ்டுடியோ",
    te: "GeoSR-AI: ఉపగ్రహ చిత్రాల సూపర్-రిజల్యూషన్ స్టూడియో"
  },
  "Deep Learning Based Super Resolution Mapping (SRM) from Medium-Resolution Satellite Imagery (Sentinel-2 & Landsat) - Sub-pixel parcel reconstruction & multi spectral synthesis": {
    hi: "मध्यम-रिज़ॉल्यूशन उपग्रह इमेजरी (सेंटिनल-2 एवं लैंडसैट) से डीप लर्निंग आधारित सुपर रेज़ोल्यूशन मैपिंग - सब-पिक्सेल पार्सल पुनर्निर्माण एवं मल्टी-स्पेक्ट्रल संश्लेषण",
    kn: "ಸೆಂಟಿನೆಲ್-2 ಮತ್ತು ಲ್ಯಾಂಡ್‌ಸ್ಯಾಟ್ ಉಪಗ್ರಹ ಚಿತ್ರಗಳ ಡೀಪ್ ಲರ್ನಿಂಗ್ ಆಧಾರಿತ ಸೂಪರ್ ರೆಸಲ್ಯೂಶನ್ ಮ್ಯಾಪಿಂಗ್",
    ta: "சென்டினல்-2 & லேண்ட்சாட் செயற்கைக்கோள் படங்களிலிருந்து டீப் லேர்னிங் அடிப்படையிலான சூப்பர் ரெசல்யூஷன் மேப்பிங்",
    te: "మధ్యస్థ-రిజల్యూషన్ ఉపగ్రహ చిత్రాల (సెంటినెల్-2 & ల్యాండ్‌శాట్) నుండి డీప్ లెర్నింగ్ ఆధారిత సూపర్ రిజల్యూషన్ మ్యాపింగ్ - సబ్-పిక్సెల్ పునర్నిర్మాణం"
  },
  "Select Satellite Agro-Scene": { hi: "उपग्रह कृषि दृश्य चुनें", kn: "ಉಪಗ್ರಹ ಕೃಷಿ ದೃಶ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ", ta: "செயற்கைக்கோள் வேளாண் காட்சியைத் தேர்ந்தெடுக்கவும்", te: "ఉపగ్రహ వ్యవసాయ రంగాన్ని ఎంచుకోండి" },
  "Or Upload Custom Multi-Spectral / RGB Tile": { hi: "या कस्टम मल्टी-स्पेक्ट्रल / आरजीबी टाइल अपलोड करें", kn: "ಅಥವಾ ಕಸ್ಟಮ್ ಇಮೇಜ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", ta: "அல்லது தனிப்பயன் படத்தை பதிவேற்றவும்", te: "లేదా కస్టమ్ మల్టీ-స్పెక్ట్రల్ / RGB టైల్‌ను అప్‌లోడ్ చేయండి" },
  "Upload Satellite Tile / Drone Imagery": { hi: "उपग्रह टाइल / ड्रोन इमेजरी अपलोड करें", kn: "ಉಪಗ್ರಹ ಅಥವಾ ಡ್ರೋನ್ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", ta: "செயற்கைக்கோள் அல்லது ட்ரோன் படத்தை பதிவேற்றவும்", te: "ఉపగ్రహ టైల్ / డ్రోన్ చిత్రాలను అప్‌లోడ్ చేయండి" },
  "Neural Architecture": { hi: "न्यूरल आर्किटेक्चर", kn: "ನ್ಯೂರಲ್ ಆರ್ಕಿಟೆಕ್ಚರ್", ta: "நியூரல் கட்டமைப்பு", te: "న్యూరల్ ఆర్కిటెక్చర్" },
  "Scaling Factor (GSD Multiplier)": { hi: "स्केलिंग कारक (GSD गुणक)", kn: "ಸ್ಕೇಲಿಂಗ್ ಅಂಶ (4x)", ta: "அளவிடுதல் காரணி (4x)", te: "స్కేలింగ్ కారకం (4x రిజల్యూషన్)" },
  "True Color RGB": { hi: "प्राकृतिक रंग (RGB)", kn: "ನೈಜ ಬಣ್ಣ RGB", ta: "உண்மை நிறம் RGB", te: "సహజ రంగు RGB", mr: "नैसर्गिक रंग RGB" },
  "NDVI Biomass": { hi: "एनडीवीआई बायोमास", kn: "NDVI ಬಯೋಮಾಸ್", ta: "NDVI பயோமாஸ்", te: "NDVI బయోమాస్ (పచ్చదనం)", mr: "एनडीव्हीआय बायोमास" },
  "NIR Infrared (B8)": { hi: "एनआईआर इन्फ्रारेड (B8)", kn: "NIR ಇನ್‌ಫ್ರಾರೆಡ್ (B8)", ta: "NIR அகச்சிவப்பு (B8)", te: "NIR ఇన్‌ఫ్రారెడ్ (B8 క్లోరోఫిల్)", mr: "एनआयआर इन्फ्रारेड (B8)" },
  "Uncertainty": { hi: "अनिश्चितता", kn: "ಅನಿಶ್ಚಿತತೆ", ta: "நிச்சயமற்ற தன்மை", te: "అనిశ్చితి విశ్లేషణ", mr: "अनिश्चितता" },
  "Parcel AI": { hi: "पार्सल एआई", kn: "ಪಾರ್ಸಲ್ AI", ta: "நிலப்பரப்பு AI", te: "భూమి సరిహద్దు AI", mr: "पार्सल एआय" },
  "Download Agronomic Report": { hi: "कृषि रिपोर्ट डाउनलोड करें", kn: "ಕೃಷಿ ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ", ta: "வேளாண் அறிக்கையை பதிவிறக்குக", te: "వ్యవసాయ నివేదికను డౌన్‌లోడ్ చేయండి" },
  "Executive Agronomic Intelligence & Precision Recommendation Report": {
    hi: "कार्यकारी कृषि बुद्धिमत्ता एवं सटीक अनुशंसा रिपोर्ट",
    kn: "ಕಾರ್ಯನಿರ್ವಾಹಕ ಕೃಷಿ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ಶಿಫಾರಸು ವರದಿ",
    ta: "செயல்பாட்டு வேளாண் நுண்ணறிவு மற்றும் துல்லிய பரிந்துரை அறிக்கை",
    te: "ఎగ్జిక్యూటివ్ వ్యవసాయ ఇంటెలిజెన్స్ & ఖచ్చితమైన సిఫార్సుల నివేదిక"
  },
  "Top Recommended Crops for this Agro-Climatic Zone": {
    hi: "इस कृषि-जलवायु क्षेत्र के लिए शीर्ष अनुशंसित फसलें",
    kn: "ಈ ಕೃಷಿ-ಹವಾಮಾನ ವಲಯಕ್ಕೆ ಶಿಫಾರಸು ಮಾಡಲಾದ ಬೆಳೆಗಳು",
    ta: "இந்த வேளாண்-காலநிலை மண்டலத்திற்கான முதன்மை பரிந்துரைக்கப்பட்ட பயிர்கள்",
    te: "ఈ వ్యవసాయ-వాతావరణ మండలానికి అత్యంత అనుకూలమైన సిఫార్సు పంటలు"
  },
  "3-Season Soil Restorative Crop Rotation Plan": {
    hi: "3-सीजन मृदा पुनरुद्धार फसल चक्र योजना",
    kn: "3-ಋತುಗಳ ಮಣ್ಣು ಸುಧಾರಣಾ ಬೆಳೆ ಪರಿವರ್ತನೆ ಯೋಜನೆ",
    ta: "3-பருவ மண் சீரமைப்பு பயிர் சுழற்சி திட்டம்",
    te: "3-సీజన్ల నేల పునరుద్ధరణ పంట మార్పిడి ప్రణాళిక"
  },
  "Targeted Crop Protection & Pest Management": {
    hi: "लक्षित फसल सुरक्षा एवं कीट प्रबंधन",
    kn: "ಗುರಿತ ಬೆಳೆ ರಕ್ಷಣೆ ಮತ್ತು ಕೀಟ ನಿರ್ವಹಣೆ",
    ta: "இலக்கு பயிர் பாதுகாப்பு மற்றும் பூச்சி மேலாண்மை",
    te: "లక్ష్యిత పంట రక్షణ & పురుగుల నివారణ నిర్వహణ"
  },
  "Applicable Government Subsidies & Financial Schemes": {
    hi: "लागू सरकारी सब्सिडी एवं वित्तीय योजनाएं",
    kn: "ಅನ್ವಯವಾಗುವ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳು ಮತ್ತು ಯೋಜನೆಗಳು",
    ta: "பொருந்தக்கூடிய அரசு மானியங்கள் மற்றும் நிதித் திட்டங்கள்",
    te: "వర్తించే ప్రభుత్వ రాయితీలు & ఆర్థిక పథకాలు"
  },

  // Soil Precision & Economics
  "Soil Health Index": { hi: "मृदा स्वास्थ्य सूचकांक", kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ", ta: "மண் நலக் குறியீடு", te: "నేల ఆరోగ్య సూచిక", mr: "माती आरोग्य निर्देशांक" },
  "Est. Net Profit / Acre": { hi: "अनुमानित शुद्ध लाभ / एकड़", kn: "ಅಂದಾಜು ನಿವ್ವಳ ಲಾಭ / ಎಕರೆ", ta: "மதிப்பிடப்பட்ட நிகர லாபம் / ஏக்கர்", te: "అంచనా నికర లాభం / ఎకరం", mr: "अंदाजे निव्वळ नफा / एकर" },
  "Monoculture Loss Risk": { hi: "मोनोकल्चर नुकसान जोखिम", kn: "ಏಕಬೆಳೆ ನಷ್ಟದ ಅಪಾಯ", ta: "ஒற்றைப் பயிர் நஷ்ட அபாயம்", te: "ఒకే పంట నష్ట ముప్పు", mr: "एकल पीक नुकसान धोका" },
  "Rotation Profit Gain": { hi: "फसल चक्र लाभ वृद्धि", kn: "ಬೆಳೆ ಪರಿವರ್ತನೆ ಲಾಭ", ta: "பயிர் சுழற்சி லாப உயர்வு", te: "పంట మార్పిడి లాభం", mr: "पीक फेरपालट नफा वाढ" },
  "Continuous Monocropping Risk": { hi: "लगातार एक ही फसल का जोखिम", kn: "ನಿರಂತರ ಏಕಬೆಳೆ ಬೆಳೆಯುವ ಅಪಾಯ", ta: "தொடர் ஒற்றைப் பயிர் அபாயம்", te: "నిరంతర ఒకే పంట సాగు నష్ట ముప్పు" },
  "Precision NPK + Smart Rotation Gain": { hi: "सटीक एनपीके + स्मार्ट फसल चक्र लाभ", kn: "ನಿಖರ NPK + ಬೆಳೆ ಪರಿವರ್ತನೆಯ ಲಾಭ", ta: "துல்லிய NPK + ஸ்மார்ட் சுழற்சி லாபம்", te: "ఖచ్చితమైన NPK + స్మార్ట్ పంట మార్పిడి లాభం" },
  "Available Nitrogen (N)": { hi: "उपलब्ध नाइट्रोजन (N)", kn: "ಲಭ್ಯವಿರುವ ಸಾರಜನಕ (N)", ta: "கிடைக்கக்கூடிய நைட்ரஜன் (N)", te: "లభ్యమయ్యే నత్రజని (N)", mr: "उपलब्ध नत्र (N)" },
  "Available Phosphorus (P)": { hi: "उपलब्ध फास्फोरस (P)", kn: "ಲಭ್ಯವಿರುವ ರಂಜಕ (P)", ta: "கிடைக்கக்கூடிய பாஸ்பரಸ್ (P)", te: "లభ్యమయ్యే భాస్వరం (P)", mr: "उपलब्ध स्फुरद (P)" },
  "Available Potassium (K)": { hi: "उपलब्ध पोटेशियम (K)", kn: "ಲಭ್ಯವಿರುವ ಪೊಟ್ಯಾಶಿಯಂ (K)", ta: "கிடைக்கக்கூடிய பொட்டாசியம் (K)", te: "లభ్యమయ్యే పొటాషియం (K)", mr: "उपलब्ध पालाश (K)" },
  "Soil Reaction (pH)": { hi: "मृदा पीएच (pH)", kn: "ಮಣ್ಣಿನ pH", ta: "மண் pH", te: "నేల pH స్థాయి", mr: "मातीचा सामू (pH)" },
  "Organic Carbon (OC %)": { hi: "जैविक कार्बन (OC %)", kn: "ಸಾವಯವ ಇಂಗಾಲ (OC %)", ta: "கரிம கார்பன் (OC %)", te: "సేంద్రీయ కర్బనం (OC %)", mr: "सेंद्रिय कर्ब (OC %)" },
  "Compute Soil Health & 3-Season Drawdown": { hi: "मृदा स्वास्थ्य एवं 3-सीजन पोषक तत्व कमी की गणना करें", kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು 3-ಸೀಸನ್ ಸವಕಳಿಯನ್ನು ಲೆಕ್ಕಹಾಕಿ", ta: "மண் வளம் மற்றும் 3-பருவ குறைவை கணக்கிடுங்கள்", te: "నేల ఆరోగ్యం & 3-సీజన్ల క్షీణతను లెక్కించండి" },
  "Current Standing Crop": { hi: "वर्तमान खड़ी फसल", kn: "ಪ್ರಸ್ತುತ ಬೆಳೆ", ta: "தற்போதைய பயிர்", te: "ప్రస్తుత సాగు పంట", mr: "सध्याचे उभे पीक" },

  // Crops
  "Wheat": { hi: "गेहूं", kn: "ಗೋಧಿ", ta: "கோதுமை", te: "గోధుమ", mr: "गहू", bn: "গম", gu: "ઘઉં", pa: "ਕਣਕ", ml: "ഗോതമ്പ്", or: "ଗହମ" },
  "Rice": { hi: "धान / चावल", kn: "ಭತ್ತ / ಅಕ್ಕಿ", ta: "நெல் / அரிசி", te: "వరి / బియ్యం", mr: "भात / तांदूळ", bn: "ধান / চাল", gu: "ડાંગર / ચોખા", pa: "ਝੋਨਾ / ਚੌਲ", ml: "നെല്ല് / അരി", or: "ଧାନ / ଚାଉଳ" },
  "Paddy": { hi: "धान", kn: "ಭತ್ತ", ta: "நெல்", te: "వరి", mr: "भात", bn: "ধান", gu: "ડાંગર", pa: "ਝੋਨਾ", ml: "നെല്ല്", or: "ଧାନ" },
  "Cotton": { hi: "कपास", kn: "ಹತ್ತಿ", ta: "பருத்தி", te: "పత్తి", mr: "कापूस", bn: "তুলা", gu: "કપાસ", pa: "ਕਪਾਹ", ml: "പരുത്തി", or: "କପା" },
  "Sugarcane": { hi: "गन्ना", kn: "ಕಬ್ಬು", ta: "கரும்பு", te: "చెరకు", mr: "ऊस", bn: "আখ", gu: "શેરડી", pa: "ਗੰਨਾ", ml: "കരിമ്പ്", or: "ଆଖୁ" },
  "Maize": { hi: "मक्का", kn: "ಮೆಕ್ಕೆಜೋಳ", ta: "மக்காச்சோளம்", te: "మొక్కజొన్న", mr: "मका", bn: "ভুট্টা", gu: "મકાઈ", pa: "ਮੱਕੀ", ml: "ചോളം", or: "ମକା" },
  "Soybean": { hi: "सोयाबीन", kn: "ಸೋಯಾಬೀನ್", ta: "சோயாபீன்", te: "సోయాబీన్", mr: "సోయాబీన్", bn: "সয়াবিন", gu: "સોયાબીન", pa: "ਸੋਇਆਬੀਨ", ml: "സോയാബീൻ", or: "ସୋୟାବିନ୍" },
  "Chickpea": { hi: "चना", kn: "ಕಡಲೆ", ta: "கொண்டைக்கடலை", te: "శనగలు", mr: "हरभरा", bn: "ছোলা", gu: "ચણા", pa: "ਛੋਲੇ", ml: "കടല", or: "ବୁଟ" },
  "Mustard": { hi: "सरसों", kn: "ಸಾಸಿವೆ", ta: "கடுகு", te: "ఆవాలు", mr: "मोहरी", bn: "સরিষা", gu: "રાઈ", pa: "ਸਰ੍ਹੋਂ", ml: "കടുക്", or: "ସୋରିଷ" },
  "Chilli": { hi: "मिर्च", kn: "ಮೆಣಸಿನಕಾಯಿ", ta: "மிளகாய்", te: "మిరపకాయ", mr: "मिरची", bn: "মরিচ", gu: "મરચું", pa: "ਮਿਰਚ", ml: "മുളക്", or: "ଲଙ୍କା" },
  "Groundnut": { hi: "मूंगफली", kn: "ಕಡಲೆಕಾಯಿ", ta: "வேர்க்கடலை", te: "వేరుశనగ", mr: "भुईमूग", bn: "চীনাবাদাম", gu: "મગફળી", pa: "ਮੂੰਗਫਲੀ", ml: "നിലക്കടല", or: "ଚିନାବାଦାମ" },
  "Black Gram": { hi: "उड़द", kn: "ಉದ್ದು", ta: "உளுந்து", te: "మినుములు", mr: "उडीद", bn: "মাষকলাই", gu: "અડદ", pa: "ਮਾਂਹ", ml: "ഉഴുന്ന്", or: "ବିରି" },

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
    te: "24-గంటల ప్రత్యక్ష వర్షపాతం రాడార్ & పిచికారీ అనుకూలత కాలక్రమం"
  },
  "7-Day Agricultural Weather Outlook & Field Planning": {
    hi: "7-दिवसीय कृषि मौसम दृष्टिकोण एवं खेत योजना",
    kn: "7-ದಿನಗಳ ಕೃಷಿ ಹವಾಮಾನ ಮುನ್ನೋಟ ಮತ್ತು ಕ್ಷೇತ್ರ ಯೋಜನೆ",
    ta: "7 நாள் வேளாண் வானிலை கண்ணோட்டம் மற்றும் பண்ணைத் திட்டமிடல்",
    te: "7-రోజుల వ్యవసాయ వాతావరణ దృక్పథం & పొలం ప్రణాళిక"
  },
  "Active Regional Agro-Weather Advisories & Alerts": {
    hi: "सक्रिय क्षेत्रीय कृषि-मौसम परामर्श एवं अलर्ट",
    kn: "ಸಕ್ರಿಯ ಪ್ರಾದೇಶಿಕ ಕೃಷಿ-ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು",
    ta: "செயலில் உள்ள பிராந்திய வேளாண்-வானிலை ஆலோசனைகள் & எச்சரிக்கைகள்",
    te: "సక్రియ ప్రాంతీయ వ్యవసాయ-వాతావరణ సలహాలు & హెచ్చరికలు"
  }
};

// Persistent In-Memory & LocalStorage Translation Cache
const dynamicTranslationCache = new Map();
try {
  const cached = localStorage.getItem('agri_trans_cache');
  if (cached) {
    const parsed = JSON.parse(cached);
    for (const [k, v] of Object.entries(parsed)) {
      dynamicTranslationCache.set(k, v);
    }
  }
} catch (_) {}

function saveCacheToStorage() {
  try {
    const obj = {};
    let count = 0;
    for (const [k, v] of dynamicTranslationCache.entries()) {
      obj[k] = v;
      if (++count > 500) break;
    }
    localStorage.setItem('agri_trans_cache', JSON.stringify(obj));
  } catch (_) {}
}

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
  if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'PATH', 'IFRAME', 'CANVAS', 'INPUT', 'TEXTAREA'].includes(tag)) {
    return true;
  }

  if (
    parent.classList.contains('notranslate') ||
    parent.getAttribute('translate') === 'no' ||
    parent.hasAttribute('data-no-translate') ||
    parent.closest?.('.notranslate') ||
    parent.closest?.('[translate="no"]') ||
    parent.closest?.('[data-no-translate]')
  ) {
    return true;
  }

  return false;
}

/**
 * Instant dictionary, substring or cached lookup (0ms)
 * Supports bidirectional translation (English <-> All Regional Languages)
 */
export function lookupFastTranslation(text, targetLang) {
  if (!text) return text;
  const trimmed = text.trim();
  if (!trimmed || /^[0-9\s.,:%!@#$^&*()_+\-=[\]{};':"\\|,.<>/?°℃℉\/\\|•₹+\-×÷=]+$/.test(trimmed)) {
    return text;
  }

  // 1. If target is English, perform high-precision reverse lookup
  if (targetLang === 'en') {
    // 1a. Direct Reverse Map
    for (const [enKey, map] of Object.entries(CLIENT_TRANSLATION_MAP)) {
      if (enKey.toLowerCase() === trimmed.toLowerCase()) return enKey;
      for (const val of Object.values(map)) {
        if (typeof val === 'string' && val.toLowerCase() === trimmed.toLowerCase()) {
          return enKey;
        }
      }
    }

    // 1b. Reverse Tokenized Substring Replacer
    let reverseReplaced = trimmed;
    let hasRevReplacement = false;
    for (const [enKey, map] of Object.entries(CLIENT_TRANSLATION_MAP)) {
      for (const val of Object.values(map)) {
        if (typeof val === 'string' && val.length > 2 && reverseReplaced.includes(val)) {
          reverseReplaced = reverseReplaced.split(val).join(enKey);
          hasRevReplacement = true;
        }
      }
    }
    if (hasRevReplacement) {
      return reverseReplaced;
    }

    return trimmed;
  }

  // 2. Direct forward dictionary match (en -> targetLang)
  if (CLIENT_TRANSLATION_MAP[trimmed] && CLIENT_TRANSLATION_MAP[trimmed][targetLang]) {
    return CLIENT_TRANSLATION_MAP[trimmed][targetLang];
  }

  // 3. Case-insensitive forward dictionary match
  for (const [key, map] of Object.entries(CLIENT_TRANSLATION_MAP)) {
    if (key.toLowerCase() === trimmed.toLowerCase() && map[targetLang]) {
      return map[targetLang];
    }
  }

  // 4. Memory cache
  const cacheKey = `${targetLang}:${trimmed}`;
  if (dynamicTranslationCache.has(cacheKey)) {
    return dynamicTranslationCache.get(cacheKey);
  }

  // 5. Tokenized Substring Replacer (e.g. "8.849 Acres", "Wheat (8.5 Q/Ac)", "Soil Health: 78")
  let tokenReplaced = trimmed;
  let hasReplacement = false;
  for (const [key, map] of Object.entries(CLIENT_TRANSLATION_MAP)) {
    if (map[targetLang] && tokenReplaced.includes(key)) {
      tokenReplaced = tokenReplaced.split(key).join(map[targetLang]);
      hasReplacement = true;
    }
  }

  if (hasReplacement) {
    dynamicTranslationCache.set(cacheKey, tokenReplaced);
    return tokenReplaced;
  }

  return null;
}

/**
 * Translates a single text node instantly with zero lag
 */
function translateTextNode(node, targetLang) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  if (shouldSkipNode(node)) return;

  const raw = node.nodeValue;
  if (!raw || !raw.trim()) return;

  // Stash original English text on node if first time seeing English
  if (!node.__agriOriginalText && /^[a-zA-Z0-9\s.,:%!@#$^&*()_+\-=[\]{};':"\\|,.<>/?°℃℉\/\\|•₹]+$/.test(raw.trim())) {
    node.__agriOriginalText = raw;
  }

  const origText = node.__agriOriginalText || raw;
  if (!origText || !origText.trim()) return;

  // If target is English, restore original English text or reverse-translate
  if (targetLang === 'en') {
    if (node.__agriOriginalText) {
      if (node.nodeValue !== node.__agriOriginalText) {
        node.nodeValue = node.__agriOriginalText;
      }
      return;
    }

    const reverseMatch = lookupFastTranslation(raw, 'en');
    if (reverseMatch && reverseMatch !== raw.trim()) {
      const leading = raw.match(/^\s*/)?.[0] || '';
      const trailing = raw.match(/\s*$/)?.[0] || '';
      node.nodeValue = `${leading}${reverseMatch}${trailing}`;
      node.__agriOriginalText = node.nodeValue;
    }
    return;
  }

  const fastMatch = lookupFastTranslation(origText, targetLang);
  if (fastMatch) {
    const leading = origText.match(/^\s*/)?.[0] || '';
    const trailing = origText.match(/\s*$/)?.[0] || '';
    const result = `${leading}${fastMatch}${trailing}`;
    if (node.nodeValue !== result) {
      node.nodeValue = result;
      translatedNodesCount++;
    }
  } else {
    // Background async fallback translation for novel text
    const trimmed = origText.trim();
    if (trimmed.length > 2 && trimmed.length < 150) {
      api.translate(trimmed, 'en', targetLang).then(res => {
        if (res && res.translated_text) {
          const cacheKey = `${targetLang}:${trimmed}`;
          dynamicTranslationCache.set(cacheKey, res.translated_text);
          saveCacheToStorage();
          if (node && node.nodeValue && node.__agriOriginalText === origText) {
            const leading = origText.match(/^\s*/)?.[0] || '';
            const trailing = origText.match(/\s*$/)?.[0] || '';
            node.nodeValue = `${leading}${res.translated_text}${trailing}`;
          }
        }
      }).catch(() => {});
    }
  }
}

/**
 * Deeply translates an entire DOM Subtree inside a single animation frame
 */
export function translateSubtree(rootNode, targetLang) {
  if (!rootNode) return;

  requestAnimationFrame(() => {
    // If switching to English, unwrap Google translate font tags first
    if (targetLang === 'en') {
      rootNode.querySelectorAll?.('font').forEach(font => {
        if (font.parentNode) {
          font.parentNode.replaceChild(document.createTextNode(font.textContent || ''), font);
        }
      });
    }

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
    updateLiveStats();
  });
}

/**
 * Global Live DOM MutationObserver Instance with debounced batching
 */
class LiveDOMTranslator {
  constructor() {
    this.observer = null;
    this.currentLang = 'en';
    this.isActive = false;
    this.debounceTimer = null;
  }

  start(targetLang = 'en') {
    this.currentLang = targetLang;
    this.isActive = true;

    // Fast synchronous pass
    translateSubtree(document.body, targetLang);

    if (this.observer) {
      this.observer.disconnect();
    }

    // Debounced MutationObserver (0ms lag, no cascading cycles)
    this.observer = new MutationObserver((mutations) => {
      if (!this.isActive || this.currentLang === 'en') return;

      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        translateSubtree(document.body, this.currentLang);
      }, 40);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false
    });
  }

  setLanguage(newLang) {
    this.currentLang = newLang;
    translateSubtree(document.body, newLang);
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

/**
 * AgriSphere Universal Real-Time Live DOM & Content Translation Engine
 * Translates EVERY SINGLE WORD and sentence across the entire application live,
 * matching Amazon/Google Translate with instant local cache + live neural fallback.
 */

// Comprehensive Client Dictionary for 0ms Instant Local Rendering (Telugu, Hindi, Kannada, Tamil, Marathi, Bengali, Gujarati, Punjabi, Malayalam, Odia)
export const CLIENT_TRANSLATION_MAP = {
  // Navigation & Core Modules
  "Command Center": { hi: "कमांड सेंटर", kn: "ಕಮಾಂಡ್ ಸೆಂಟರ್", ta: "கட்டளை மையம்", te: "కమాండ్ సెంటర్", mr: "कमांड सेंटर", bn: "কমান্ড সেন্টার", gu: "કમાન્ડ સેન્ટર", pa: "ਕਮਾਂਡ ਸੈਂਟਰ", ml: "കമാൻഡ് സെന്റർ", or: "କମାଣ୍ଡ ସେଣ୍ଟର" },
  "Land & Satellite": { hi: "भूमि एवं उपग्रह", kn: "ಭೂಮಿ ಮತ್ತು ಉಪಗ್ರಹ", ta: "நிலம் & செயற்கைக்கோள்", te: "భూమి & ఉపగ్రహం", mr: "जमीन आणि उपग्रह", bn: "জমি ও উপগ্রহ", gu: "જમીન અને ઉપગ્રહ", pa: "ਜ਼ਮੀਨ ਅਤੇ ਉਪਗ੍ਰਹਿ", ml: "ഭൂമിയും ഉപഗ്രഹവും", or: "ଜମି ଏବଂ ଉପଗ୍ରହ" },
  "Soil & Weather": { hi: "मृदा एवं मौसम", kn: "ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ", ta: "மண் & வானிலை", te: "నేల & వాతావరణం", mr: "माती आणि हवामान", bn: "মাটি ও আবহাওয়া", gu: "જમીન અને હવામાન", pa: "ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ", ml: "മണ്ണും കാലാവസ്ഥയും", or: "ମାଟି ଏବଂ ପାଣିପାଗ" },
  "Farm Hub & AI": { hi: "फार्म हब एवं एआई", kn: "ಫಾರ್ಮ್ ಹಬ್ & AI", ta: "பண்ணை மையம் & AI", te: "ఫామ్ హబ్ & AI", mr: "फार्म हब आणि एआय", bn: "ফার্ম হাব ও এআই", gu: "ફાર્મ હબ અને AI", pa: "ਫਾਰਮ ਹੱਬ ਅਤੇ ਏਆਈ", ml: "ഫാം ഹബ്ബും AIയും", or: "ଫାର୍ମ ହବ୍ ଏବଂ AI" },
  "Land Measure & Scanner": { hi: "भूमि मापन एवं स्कैनर", kn: "ಭೂಮಿ ಅಳತೆ ಮತ್ತು ಸ್ಕ್ಯಾನರ್", ta: "நில அளவீடு & ஸ்கேனர்", te: "భూమి కొలత & స్కానర్", mr: "जमीन मोजणी आणि स्कॅनर", bn: "জমি পরিমাপ ও স্ক্যানার", gu: "જમીન માપણી અને સ્કેનર", pa: "ਜ਼ਮੀਨ ਮਿਣਤੀ ਅਤੇ ਸਕੈਨਰ", ml: "ഭൂമി അളക്കലും സ്കാനറും", or: "ଜମି ମାପ ଏବଂ ସ୍କାନର୍" },
  "Land Measure & Scan": { hi: "भूमि मापन एवं स्कैन", kn: "ಭೂಮಿ ಅಳತೆ ಮತ್ತು ಸ್ಕ್ಯಾನ್", ta: "நில அளவீடு & ஸ்கேன்", te: "భూమి కొలత & స్కాన్", mr: "जमीन मोजणी आणि स्कॅन", bn: "জমি পরিমাপ ও স্ক্যান", gu: "જમીન માપણી અને સ્કેન", pa: "ਜ਼ਮੀਨ ਮਿਣਤੀ ਅਤੇ ਸਕੈਨ", ml: "ഭൂമി അളക്കലും സ്കാനും", or: "ଜମି ମାପ ଏବଂ ସ୍କାନ୍" },
  "GeoSR-AI Studio": { hi: "जियोएसआर उपग्रह स्टूडियो", kn: "ಜಿಯೋಎಸ್‌ಆರ್ ಸ್ಟುಡಿಯೋ", ta: "ஜியோஎஸ்ஆர் ஸ்டுடியோ", te: "జియోఎస్ఆర్ స్టూడియో", mr: "जिओएसआर स्टुडिओ", bn: "জিওএসআর স্টুডিও", gu: "જિયોએસઆર સ્ટુડિયો", pa: "ਜੀਓਐਸਆਰ ਸਟੂਡੀਓ", ml: "ജിയോഎസ്ആർ സ്റ്റുഡിയോ", or: "ଜିଓଏସଆର ଷ୍ଟୁଡିଓ" },
  "Weather Radar & Microclimate": { hi: "मौसम रडार एवं सूक्ष्म जलवायु", kn: "ಹವಾಮಾನ ರಾಡಾರ್", ta: "வானிலை ரேடார்", te: "వాతావరణ రాడార్ & సూక్ష్మ వాతావరణం", mr: "हवामान रडार", bn: "আবহাওয়া রাডার", gu: "હવામાન રડાર", pa: "ਮੌਸਮ ਰਾਡਾਰ", ml: "കാലാവസ്ഥാ റഡാർ" },
  "Soil NPK & Depletion": { hi: "मृदा पोषक तत्व एवं क्षरण", kn: "ಮಣ್ಣಿನ NPK ಮತ್ತು ಕ್ಷೀಣತೆ", ta: "மண் NPK மற்றும் குறைவு", te: "నేల NPK & పోషకాల క్షీణత", mr: "माती एनपीके आणि घट", bn: "মাটি এনপিকে ও ক্ষয়", gu: "જમીન NPK અને ક્ષતિ", pa: "ਮਿੱਟੀ NPK ਅਤੇ ਘਾਟ", ml: "മണ്ണ് NPK ക്ഷയം" },
  "AI Agronomist": { hi: "कृषि मित्र एआई", kn: "ಕೃಷಿ ಮಿತ್ರ AI", ta: "வேளாண் நண்பன் AI", te: "కృషి మిత్ర AI", mr: "कृषी मित्र एआय", bn: "কৃষি মিত্র এআই", gu: "કૃષિ મિત્ર એઆઈ", pa: "ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ ਏਆਈ", ml: "കാർഷിക മിത്രം AI", or: "କୃଷି ମିତ୍ର AI" },
  "My Farm Parcels": { hi: "मेरे खेत के पार्सल", kn: "ನನ್ನ ಜಮೀನುಗಳು", ta: "எனது பண்ணைகள்", te: "నా వ్యవసాయ క్షేత్రాలు", mr: "माझी शेतं", bn: "আমার খামার প্লট", gu: "મારા ખેતરો", pa: "ਮੇਰੇ ਖੇਤ", ml: "എന്റെ കൃഷിയിടങ്ങൾ" },
  "National Analytics": { hi: "राष्ट्रीय फसल विश्लेषण", kn: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ", ta: "தேசிய வேளாண் பகுப்பாய்வு", te: "జాతీయ వ్యవసాయ విశ్లేషణ", mr: "राष्ट्रीय कृषी विश्लेषण", bn: "জাতীয় কৃষি विश्लेषण", gu: "રાષ્ટ્રીય કૃષિ વિશ્લેષણ", pa: "ਰਾਸ਼ਟਰੀ ਖੇਤੀ ਵਿਸ਼ਲੇਸ਼ਣ", ml: "ദേശീയ കാർഷിക വിശകലനം" },
  "Home": { hi: "होम", kn: "ಮುಖಪುಟ", ta: "முகப்பு", te: "హోమ్", mr: "मुख्यपृष्ठ", bn: "হোম", gu: "હોમ", pa: "ਮੁੱਖ ਪੰਨਾ", ml: "ഹോം" },
  "Login Dashboard": { hi: "लॉगिन डैशबोर्ड", kn: "ಲಾಗಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", ta: "உள்நுழைவு டாஷ்போர்டு", te: "లాగిన్ డాష్‌బోర్డ్", mr: "लॉगिन डॅशबोर्ड", bn: "লগইন ড্যাশবোর্ড", gu: "લૉગિન ડૅશબોર્ડ", pa: "ਲਾਗਇਨ ਡੈਸ਼ਬੋਰਡ", ml: "ലോഗിൻ ഡാഷ്ബോർഡ്" },
  "Sign In": { hi: "साइन इन", kn: "ಸೈನ್ ಇನ್", ta: "உள்நுழைக", te: "సైన్ ఇన్", mr: "साइन इन", bn: "সাইন ইন", gu: "સાઇન ઇન", pa: "ਸਾਈਨ ਇਨ", ml: "സൈൻ ഇൻ" },

  // Satellite Layers & Toolbars
  "True Color RGB": { hi: "प्राकृतिक रंग (RGB)", kn: "ನೈಜ ಬಣ್ಣ RGB", ta: "உண்மை நிறம் RGB", te: "సహజ రంగు RGB", mr: "नैसर्गिक रंग RGB", bn: "প্রাকৃতিক রঙ RGB", gu: "કુદરતી રંગ RGB", pa: "ਅਸਲ ਰੰਗ RGB", ml: "യഥാർത്ഥ നിറം RGB" },
  "NDVI Biomass": { hi: "एनडीवीआई बायोमास", kn: "NDVI ಬಯೋಮಾಸ್", ta: "NDVI பயோமாஸ்", te: "NDVI బయోమాస్ (పచ్చదనం)", mr: "एनडीव्हीआय बायोमास", bn: "এনডিভিআই বায়োমাস", gu: "NDVI બાયોમાસ", pa: "NDVI ਬਾਇਓਮਾਸ", ml: "NDVI ബയോമാസ്" },
  "NIR Infrared (B8)": { hi: "एनआईआर इन्फ्रारेड (B8)", kn: "NIR ಇನ್‌ಫ್ರಾರೆಡ್ (B8)", ta: "NIR அகச்சிவப்பு (B8)", te: "NIR ఇన్‌ఫ్రారెడ్ (క్లోరోఫిల్)", mr: "एनआयआर इन्फ्रारेड (B8)", bn: "এনআইআর ইনফ্রারেড (B8)", gu: "NIR ઇન્ફ્રારેડ (B8)", pa: "NIR ਇਨਫਰਾਰੈੱਡ (B8)", ml: "NIR ഇൻഫ്രാറെഡ് (B8)" },
  "Uncertainty": { hi: "अनिश्चितता", kn: "ಅನಿಶ್ಚಿತತೆ", ta: "நிச்சயமற்ற தன்மை", te: "అనిశ్చితి విశ్లేషణ", mr: "अनिश्चितता", bn: "অনিশ্চয়তা", gu: "અનિશ્ચિતતા", pa: "ਅਨਿਸ਼ਚਿਤਤਾ", ml: "അനിശ്ചിതത്വം" },
  "Parcel AI": { hi: "पार्सल एआई", kn: "ಪಾರ್ಸಲ್ AI", ta: "நிலப்பரப்பு AI", te: "భూమి సరిహద్దు AI", mr: "पार्सल एआय", bn: "প্লট এআই", gu: "પાર્સલ AI", pa: "ਪਾਰਸਲ ਏਆਈ", ml: "പാഴ്സൽ AI" },
  "Download Agronomic Report": { hi: "कृषि रिपोर्ट डाउनलोड करें", kn: "ಕೃಷಿ ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ", ta: "வேளாண் அறிக்கையை பதிவிறக்குக", te: "వ్యవసాయ నివేదికను డౌన్‌లోడ్ చేయండి", mr: "कृषी अहवाल डाउनलोड करा", bn: "কৃষি রিপোর্ট ডাউনলোড করুন", gu: "કૃષિ રિપોર્ટ ડાઉનલોડ કરો", pa: "ਖੇਤੀਬਾੜੀ ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ", ml: "കാർഷിക റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക" },
  "Download Full Report": { hi: "संपूर्ण रिपोर्ट डाउनलोड करें", kn: "ಸಂಪೂರ್ಣ ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ", ta: "முழு அறிக்கையை பதிவிறக்குக", te: "పూర్తి నివేదికను డౌన్‌లోడ్ చేయండి", mr: "पूर्ण अहवाल डाउनलोड करा", bn: "সম্পূর্ণ রিপোর্ট ডাউনলোড করুন", gu: "સંપૂર્ણ રિપોર્ટ ડાઉનલોડ કરો" },
  "Execute Super-Resolution Mapping": { hi: "सुपर-रेजोल्यूशन मैपिंग चलाएं", kn: "ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ಮ್ಯಾಪಿಂಗ್ ರನ್ ಮಾಡಿ", ta: "சூப்பர்-ரெசல்யூஷன் மேப்பிங்கை இயக்கவும்", te: "సూపర్-రిజల్యూషన్ మ్యాపింగ్ ప్రారంభించండి", mr: "सुपर-रिझोल्यूशन मॅपिंग कार्यान्वित करा" },
  "Mean NDVI Biomass": { hi: "औसत एनडीवीआई बायोमास", kn: "ಸರಾಸರಿ NDVI ಬಯೋಮಾಸ್", ta: "சராசரி NDVI பயோமாஸ்", te: "సగటు NDVI బయోమాస్", mr: "सरासरी एनडीव्हीआय बायोमास" },
  "Cadastral Parcels": { hi: "राजस्व पार्सल", kn: "ಭೂದಾಖಲೆ ಪಾರ್ಸಲ್‌ಗಳು", ta: "நிலப்பதிவேடு பார்சல்கள்", te: "భూ రికార్డుల పార్సెల్స్", mr: "जमीन तुकडे" },
  "Soil Bioavailability": { hi: "मृदा जैव-उपलब्धता", kn: "ಮಣ್ಣಿನ ಜೈವಿಕ ಲಭ್ಯತೆ", ta: "மண் உயிர் கிடைக்கும் தன்மை", te: "నేల తేమ లభ్యత", mr: "मातीची जैव-उपलब्धता" },
  "Remote Sensing Benchmarks": { hi: "रिमोट सेंसिंग बेंचमार्क", kn: "ರಿಮೋಟ್ ಸೆನ್ಸಿಂಗ್ ಬೆಂಚ್‌ಮಾರ್ಕ್‌ಗಳು", ta: "தொலையுணர்வு அளவுகோல்கள்", te: "రిమోట్ సెన్సింగ్ ప్రమాణాలు", mr: "रिमोट सेन्सिंग बेंचमार्क" },
  "High Vegetative Canopy": { hi: "सघन हरी छतरी", kn: "ಉತ್ತಮ ಹಸಿರು ಮೇಲಾವರಣ", ta: "அடர்ந்த பசுமை விதானம்", te: "దట్టమైన పచ్చని పంట", mr: "दाट हिरवे पीक" },
  "Sub-meter Bund Clarity": { hi: "सटीक मेड़ स्पष्टता", kn: "ಸ್ಪಷ್ಟ ಬದುಗಳು", ta: "துல்லிய வரப்பு தெளிவு", te: "ఖచ్చితమైన గట్ల స్పష్టత", mr: "अचूक बांध स्पष्टता" },
  "Adequate Root Moisture": { hi: "पर्याप्त जड़ नमी", kn: "ಸಾಕಷ್ಟು ಬೇರು ತೇವಾಂಶ", ta: "போதுமான வேர் ஈரப்பதம்", te: "సరిపడా వేరు తేమ", mr: "पुरेसा मुळांचा ओलावा" },

  // Soil & Economics
  "Soil Health Index": { hi: "मृदा स्वास्थ्य सूचकांक", kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ", ta: "மண் நலக் குறியீடு", te: "నేల ఆరోగ్య సూచిక", mr: "माती आरोग्य निर्देशांक", bn: "মাটি স্বাস্থ্য সূচক", gu: "જમીન સ્વાસ્થ્ય સૂચકાંક" },
  "Est. Net Profit / Acre": { hi: "अनुमानित शुद्ध लाभ / एकड़", kn: "ಅಂದಾಜು ನಿವ್ವಳ ಲಾಭ / ಎಕರೆ", ta: "மதிப்பிடப்பட்ட நிகர லாபம் / ஏக்கர்", te: "అంచనా నికర లాభం / ఎకరం", mr: "अंदाजे निव्वळ नफा / एकर", bn: "আনুমানিক নেট লাভ / একর", gu: "અંદાજિત ચોખ્ખો નફો / એકર" },
  "Monoculture Loss Risk": { hi: "मोनोकल्चर नुकसान जोखिम", kn: "ಏಕಬೆಳೆ ನಷ್ಟದ ಅಪಾಯ", ta: "ஒற்றைப் பயிர் நஷ்ட அபாயம்", te: "ఒకే పంట నష్ట ముప్పు", mr: "एकल पीक नुकसान धोका" },
  "Rotation Profit Gain": { hi: "फसल चक्र लाभ वृद्धि", kn: "ಬೆಳೆ ಪರಿವರ್ತನೆ ಲಾಭ", ta: "பயிர் சுழற்சி லாப உயர்வு", te: "పంట మార్పిడి లాభం", mr: "पीक फेરपालट नफा वाढ" },
  "Optimal Precision Yield": { hi: "इष्टतम सटीक उपज", kn: "ಉತ್ತಮ ಇಳುವರಿ", ta: "உகந்த துல்லிய மகசூல்", te: "సరైన అత్యధిక దిగుబడి", mr: "उत्कृष्ट अचूक उत्पादन" },
  "Available Nitrogen (N)": { hi: "उपलब्ध नाइट्रोजन (N)", kn: "ಲಭ್ಯವಿರುವ ಸಾರಜನಕ (N)", ta: "கிடைக்கக்கூடிய நைட்ரஜன் (N)", te: "లభ్యమయ్యే నత్రజని (N)", mr: "उपलब्ध नत्र (N)" },
  "Available Phosphorus (P)": { hi: "उपलब्ध फास्फोरस (P)", kn: "ಲಭ್ಯವಿರುವ ರಂಜಕ (P)", ta: "கிடைக்கக்கூடிய பாஸ்பரஸ் (P)", te: "లభ్యమయ్యే భాస్వరం (P)", mr: "उपलब्ध स्फुरद (P)" },
  "Available Potassium (K)": { hi: "उपलब्ध पोटेशियम (K)", kn: "ಲಭ್ಯವಿರುವ ಪೊಟ್ಯಾಶಿಯಂ (K)", ta: "கிடைக்கக்கூடிய பொட்டாசியம் (K)", te: "లభ్యమయ్యే పొటాషియం (K)", mr: "उपलब्ध पालाश (K)" },
  "Soil Reaction (pH)": { hi: "मृदा पीएच (pH)", kn: "ಮಣ್ಣಿನ pH", ta: "மண் pH", te: "నేల pH స్థాయి", mr: "मातीचा सामू (pH)" },
  "Organic Carbon (OC %)": { hi: "जैविक कार्बन (OC %)", kn: "ಸಾವಯವ ಇಂಗಾಲ (OC %)", ta: "கரிம கார்பன் (OC %)", te: "సేంద్రీయ కర్బనం (OC %)", mr: "सेंद्रिय कर्ब (OC %)" },
  "Compute Soil Health & 3-Season Drawdown": { hi: "मृदा स्वास्थ्य एवं 3-सीजन पोषक तत्व कमी की गणना करें", kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು 3-ಸೀಸನ್ ಸವಕಳಿಯನ್ನು ಲೆಕ್ಕಹಾಕಿ", ta: "மண் வளம் மற்றும் 3-பருவ குறைவை கணக்கிடுங்கள்", te: "నేల ఆరోగ్యం & 3-సీజన్ల క్షీణతను లెక్కించండి" },
  "Current Standing Crop": { hi: "वर्तमान खड़ी फसल", kn: "ಪ್ರಸ್ತುತ ಬೆಳೆ", ta: "தற்போதைய பயிர்", te: "ప్రస్తుత సాగు పంట", mr: "सध्याचे उभे पीक" },
  "Yield Decline Probability": { hi: "उपज में गिरावट की संभावना", kn: "ಇಳುವರಿ ಕುಸಿತದ ಸಾಧ್ಯತೆ", ta: "மகசூல் குறைவு நிகழ்தகவு", te: "దిగుబడి తగ్గే అవకాశం", mr: "उत्पादन घटण्याची शक्यता" },
  "Under continuous monoculture": { hi: "लगातार एक ही फसल उगाने पर", kn: "ನಿರಂತರ ಏಕಬೆಳೆ ಪದ್ಧತಿಯಲ್ಲಿ", ta: "தொடர்ச்சியான ஒற்றைப் பயிரிடலில்", te: "నిరంతరం ఒకే పంట వేయడం వల్ల", mr: "सतत एकच पीक घेतल्यास" },
  "Without rotational resting": { hi: "फसल चक्र के बिना", kn: "ಬೆಳೆ ಪರಿವರ್ತನೆ ಇಲ್ಲದೆ", ta: "பயிர் சுழற்சி இல்லாமல்", te: "పంట మార్పిడి చేయకపోతే", mr: "पीक फेरपालट न केल्यास" },
  "+35% ROI Restoration": { hi: "+35% शुद्ध लाभ सुधार", kn: "+35% ಲಾಭ ಸುಧಾರಣೆ", ta: "+35% கூடுதல் லாபம்", te: "+35% నికర లాభాల పెరుగుదల", mr: "+35% परतावा वाढ" },

  // Crops
  "Wheat": { hi: "गेहूं", kn: "ಗೋಧಿ", ta: "கோதுமை", te: "గోధుమ", mr: "गहू", bn: "গম", gu: "ઘઉં", pa: "ਕਣਕ", ml: "ഗോതമ്പ്", or: "ଗହମ" },
  "Rice": { hi: "धान / चावल", kn: "ಭತ್ತ / ಅಕ್ಕಿ", ta: "நெல் / அரிசி", te: "వరి / బియ్యం", mr: "भात / तांदूळ", bn: "ধান / চাল", gu: "ડાંગર / ચોખા", pa: "ਝੋਨਾ / ਚੌਲ", ml: "നെല്ല് / അരി", or: "ଧାନ / ଚାଉଳ" },
  "Paddy": { hi: "धान", kn: "ಭತ್ತ", ta: "நெல்", te: "వరి", mr: "भात", bn: "ধান", gu: "ડાંગર", pa: "ਝੋਨਾ", ml: "നെല്ല്", or: "ଧାନ" },
  "Cotton": { hi: "कपास", kn: "ಹತ್ತಿ", ta: "பருத்தி", te: "పత్తి", mr: "कापूस", bn: "তুলা", gu: "કપાસ", pa: "ਕਪਾਹ", ml: "പരുത്തി", or: "କପା" },
  "Sugarcane": { hi: "गन्ना", kn: "ಕಬ್ಬು", ta: "கரும்பு", te: "చెరకు", mr: "ऊस", bn: "আখ", gu: "શેરડી", pa: "ਗੰਨਾ", ml: "കരിമ്പ്", or: "ଆଖୁ" },
  "Maize": { hi: "मक्का", kn: "ಮೆಕ್ಕೆಜೋಳ", ta: "மக்காச்சோளம்", te: "మొక్కజొన్న", mr: "मका", bn: "ভুট্টা", gu: "મકાઈ", pa: "ਮੱਕੀ", ml: "ചോളം", or: "ମକା" },
  "Soybean": { hi: "सोयाबीन", kn: "ಸೋಯಾಬೀನ್", ta: "சோயாபீன்", te: "సోయాబీన్", mr: "सोयाबीन", bn: "সয়াবিন", gu: "સોયાબીન", pa: "ਸੋਇਆਬੀਨ", ml: "സോയാബീൻ", or: "ସୋୟାବିନ୍" },
  "Chickpea": { hi: "चना", kn: "ಕಡಲೆ", ta: "கொண்டைக்கடலை", te: "శనగలు", mr: "हरभरा", bn: "ছোলা", gu: "ચણા", pa: "ਛੋਲੇ", ml: "കടല", or: "ବୁଟ" },
  "Mustard": { hi: "सरसों", kn: "ಸಾಸಿವೆ", ta: "கடுகு", te: "ఆవాలు", mr: "मोहरी", bn: "সরিষা", gu: "રાઈ", pa: "ਸਰ੍ਹੋਂ", ml: "കടുക്", or: "ସୋରିଷ" },
  "Chilli": { hi: "मिर्च", kn: "ಮೆಣಸಿನಕಾಯಿ", ta: "மிளகாய்", te: "మిరపకాయ", mr: "मिरची", bn: "মরিচ", gu: "મરચું", pa: "ਮਿਰਚ", ml: "മുളക്", or: "ଲଙ୍କା" },
  "Groundnut": { hi: "मूंगफली", kn: "ಕಡಲೆಕಾಯಿ", ta: "வேர்க்கடலை", te: "వేరుశనగ", mr: "भुईमूग", bn: "চীনাবাদাম", gu: "મગફળી", pa: "ਮੂੰਗਫਲੀ", ml: "നിലക്കടല", or: "ଚିନାବାଦାମ" },
  "Black Gram": { hi: "उड़द", kn: "ಉದ್ದು", ta: "உளுந்து", te: "మినుములు", mr: "उडीद", bn: "মাষকলাই", gu: "અડદ", pa: "ਮਾਂਹ", ml: "ഉഴുന്ന്", or: "ବିରି" },

  // Economic Ledger & Advisory
  "Farm Economic Ledger: Profit vs Loss Comparative Analysis": {
    hi: "खेत आर्थिक बहीखाता: लाभ बनाम हानि तुलनात्मक विश्लेषण",
    kn: "ಕೃಷಿ ಆರ್ಥಿಕ ಲೆಡ್ಜರ್: ಲಾಭ ಮತ್ತು ನಷ್ಟದ ತುಲನಾತ್ಮಕ ವಿಶ್ಲೇಷಣೆ",
    ta: "பண்ணை நிதி அறிக்கை: லாப நஷ்ட ஒப்பீட்டு பகுப்பாய்வு",
    te: "వ్యవసాయ ఆర్థిక నివేదిక: లాభం వర్సెస్ నష్టం తులనాత్మక విశ్లేషణ",
    mr: "शेतकरी आर्थिक खाते: नफा विरूद्ध तोटा तुलनात्मक विश्लेषण"
  },
  "Continuous Monoculture (Depleting)": {
    hi: "लगातार एक ही फसल (पोषक तत्व ह्रास)",
    kn: "ನಿರಂತರ ಏಕಬೆಳೆ (ಸವಕಳಿ)",
    ta: "தொடர் ஒற்றைப் பயிர் (ஊட்டச்சத்து குறைவு)",
    te: "నిరంతర ఏక పంట సాగు (పోషకాల నష్టం)",
    mr: "सतत एकच पीक (घट)"
  },
  "Precision NPK + Rotation (Optimized)": {
    hi: "सटीक एनपीके + फसल चक्र (अधिकतम लाभ)",
    kn: "ನಿಖರ NPK + ಬೆಳೆ ಪರಿವರ್ತನೆ (ಗರಿಷ್ಠ ಲಾಭ)",
    ta: "துல்லிய NPK + பயிர் சுழற்சி (உகந்ததாக்கப்பட்டது)",
    te: "ఖచ్చితమైన NPK + పంట మార్పిడి (గరిష్ట లాభం)",
    mr: "अचूक एनपीके + पीक फेरपालट (उत्कृष्ट)"
  },
  "Gross Crop Revenue:": { hi: "सकल फसल आय:", kn: "ಒಟ್ಟು ಬೆಳೆ ಆದಾಯ:", ta: "மொத்த பயிர் வருமானம்:", te: "స్థూల పంట ఆదాయం:", mr: "एकूण पीक उत्पन्न:" },
  "Fertilizer & Input Expenditure:": { hi: "उर्वरक एवं लागत खर्च:", kn: "ಗೊಬ್ಬರ ಮತ್ತು ಒಳಹರಿವಿನ ವೆಚ್ಚ:", ta: "உர மற்றும் உள்ளீட்டு செலவு:", te: "ఎరువులు & పెట్టుబడి వ్యయం:", mr: "खते आणि बियाणे खर्च:" },
  "Soil Nutrient Depletion Loss:": { hi: "मृदा पोषक तत्व नुकसान:", kn: "ಮಣ್ಣಿನ ಪೋಷಕಾಂಶ ಸವಕಳಿ ನಷ್ಟ:", ta: "மண் ஊட்டச்சத்து இழப்பு:", te: "నేల పోషకాల క్షీణత నష్టం:", mr: "माती पोषण हानी:" },
  "Net Farmer Profit:": { hi: "शुद्ध किसान लाभ:", kn: "ನಿವ್ವಳ ರೈತರ ಲಾಭ:", ta: "நிகர விவசாயி லாபம்:", te: "రైతు నికర లాభం:", mr: "निव्वळ शेतकरी नफा:" },
  "Targeted Precision Gross Revenue:": { hi: "लक्षित सटीक सकल आय:", kn: "ಗುರಿಯಿಟ್ಟ ನಿಖರ ಆದಾಯ:", ta: "இலக்கு துல்லிய மொத்த வருவாய்:", te: "లక్ష్యిత ఖచ్చితమైన స్థూల ఆదాయం:", mr: "अचूक एकूण उत्पन्न:" },
  "Optimized Input Cost (Dosing AI):": { hi: "अनुकूलित लागत (डोज़िंग AI):", kn: "ಉತ್ತಮಗೊಳಿಸಿದ ವೆಚ್ಚ (ಡೋಸಿಂಗ್ AI):", ta: "உகந்த உள்ளீட்டு செலவு:", te: "తగ్గిన పెట్టుబడి వ్యయం (డోసింగ్ AI):", mr: "कमी झालेला खर्च:" },
  "Bio-Fixation Savings (Rhizobium):": { hi: "जैव-स्थिरीकरण बचत (राइजोबियम):", kn: "ಜೈವಿಕ ಸಾರಜನಕ ಉಳಿತಾಯ:", ta: "உயிரியல் உர சேமிப்பு:", te: "రైజోబియం జీవ ఎరువుల ఆదా:", mr: "जैविक बचत:" },
  "Maximized Net Farmer Profit:": { hi: "अधिकतम शुद्ध किसान लाभ:", kn: "ಗರಿಷ್ಠ ನಿವ್ವಳ ರೈತರ ಲಾಭ:", ta: "அதிகபட்ச நிகர விவசாயி லாபம்:", te: "గరిష్ట రైతు నికర లాభం:", mr: "जास्तीत जास्त निव्वळ नफा:" },
  "3-Season Cumulative Profit Forecast": { hi: "3-सीजन संचयी लाभ पूर्वानुमान", kn: "3-ಸೀಸನ್‌ಗಳ ಒಟ್ಟು ಲಾಭದ ಮುನ್ಸೂಚನೆ", ta: "3-பருவ ஒட்டுமொத்த லாப முன்னறிவிப்பு", te: "3-సీజన్ల మొత్తం నికర లాభాల అంచనా", mr: "3-हंगामांचा एकूण नफा अंदाज" },

  // Crop Advisory
  "🌾 Top Recommended Crops for this Parcel": {
    hi: "🌾 इस खेत के लिए शीर्ष अनुशंसित फसलें",
    kn: "🌾 ಈ ಜಮೀನಿಗೆ ಸೂಕ್ತವಾದ ಪ್ರಮುಖ ಬೆಳೆಗಳು",
    ta: "🌾 இந்த நிலத்திற்கு பரிந்துரைக்கப்படும் சிறந்த பயிர்கள்",
    te: "🌾 ఈ భూమికి అత్యంత అనువైన సిఫార్సు పంటలు",
    mr: "🌾 या शेतासाठी उत्कृष्ट शिफारस केलेली पिके"
  },
  "Optimal 3-Season Soil Restorative Crop Rotation": {
    hi: "सर्वोत्तम 3-सीजन मृदा पुनरुद्धार फसल चक्र",
    kn: "ಅತ್ಯುತ್ತಮ 3-ಸೀಸನ್ ಮಣ್ಣು ಸುಧಾರಣೆ ಬೆಳೆ ಪರಿವರ್ತನೆ",
    ta: "சிறந்த 3-பருவ மண் சீரமைப்பு பயிர் சுழற்சி",
    te: "అత్యుత్తమ 3-సీజన్ల నేల పునరుద్ధరణ పంట మార్పిడి",
    mr: "उत्कृष्ट 3-हंगामी पीक फेरपालट"
  },
  "Zero Depletion Cycle": { hi: "शून्य पोषक ह्रास चक्र", kn: "ಶೂನ್ಯ ಸವಕಳಿ ಚಕ್ರ", ta: "பூஜ்ஜிய இழப்பு சுழற்சி", te: "సున్నా పోషకాల క్షీణత చక్రం", mr: "शून्य घट चक्र" },
  "1. Kharif Season": { hi: "1. खरीफ मौसम", kn: "1. ಮುಂಗಾರು ಹಂಗಾಮು (ಖಾರೀಫ್)", ta: "1. காரீப் பருவம்", te: "1. ఖరీఫ్ సీజన్", mr: "1. खरीप हंगाम" },
  "2. Rabi Season": { hi: "2. रबी मौसम", kn: "2. ಹಿಂಗಾರು ಹಂಗಾಮು (ರಬಿ)", ta: "2. ரபி பருவம்", te: "2. రబీ సీజన్", mr: "2. रब्बी हंगाम" },
  "3. Zaid (Summer)": { hi: "3. जायद (ग्रीष्म)", kn: "3. ಬೇಸಿಗೆ ಹಂಗಾಮು (ಜೈದ್)", ta: "3. கோடைப் பருவம்", te: "3. జైద్ (వేసవి కాలం)", mr: "3. उन्हाळी हंगाम" },
  "Pest & Pathogen Prevention Protocol": {
    hi: "कीट एवं रोग निवारण प्रोटोकॉल",
    kn: "ಕೀಟ ಮತ್ತು ರೋಗ ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು",
    ta: "பூச்சி மற்றும் நோய் தடுப்பு நெறிமுறை",
    te: "చీడపీడల & వ్యాధుల నివారణ విధానం",
    mr: "कीड व रोग नियंत्रण उपाय"
  },
  "Applicable Government Schemes & Subsidies": {
    hi: "लागू सरकारी योजनाएं एवं सब्सिडी",
    kn: "ಅನ್ವಯವಾಗುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿ",
    ta: "பொருந்தக்கூடிய அரசு திட்டங்கள் & மானியங்கள்",
    te: "వర్తించే ప్రభుత్వ పథకాలు & సబ్సిడీలు",
    mr: "लागू सरकारी योजना आणि सबसिडी"
  },

  // Units and general terms
  "Acres": { hi: "एकड़", kn: "ಎಕರೆ", ta: "ஏக்கர்", te: "ఎకరాలు", mr: "एकर", bn: "একর", gu: "એકર" },
  "Gunthas": { hi: "गुंठा", kn: "ಗುಂಟೆ", ta: "குண்டா", te: "గుంటలు", mr: "गुंठे", bn: "গুন্ঠা" },
  "Bighas": { hi: "बीघा", kn: "ಬಿಘಾ", ta: "பிகா", te: "బిఘాలు", mr: "बिघा", bn: "বিঘা" },
  "Hectares": { hi: "हेक्टेयर", kn: "ಹೆಕ್ಟೇರ್", ta: "ஹெக்டேர்", te: "హెక్టార్లు", mr: "हेक्टर", bn: "হেক্টর" },
  "Optimal": { hi: "उत्तम", kn: "ಉತ್ತಮ", ta: "உகந்தது", te: "అత్యుత్తమం", mr: "उत्कृष्ट" },
  "Suitable": { hi: "उपयुक्त", kn: "ಸೂಕ್ತ", ta: "ஏற்றது", te: "అనుకూలం", mr: "योग्य" },
  "Low": { hi: "कम", kn: "ಕಡಿಮೆ", ta: "குறைவு", te: "తక్కువ", mr: "कमी" },
  "Medium": { hi: "मध्यम", kn: "ಮಧ್ಯಮ", ta: "நடுத்தர", te: "మధ్యస్థం", mr: "मध्यम" },
  "High": { hi: "उच्च", kn: "ಹೆಚ್ಚು", ta: "அதிகம்", te: "ఎక్కువ", mr: "जास्त" },
  "Live Land Measure Area Loaded": { hi: "लाइव भूमि माप क्षेत्र लोड किया गया", kn: "ಲೈವ್ ಭೂಮಿ ಅಳತೆ ಪ್ರದೇಶ ಲೋಡ್ ಆಗಿದೆ", ta: "நேரலை நில அளவீட்டு பகுதி ஏற்றப்பட்டது", te: "లైవ్ భూమి కొలత ప్రాంతం లోడ్ అయింది", mr: "थेट जमीन मोजणी क्षेत्र लोड केले" },
  "Download Full Agronomic Report": { hi: "पूर्ण कृषि रिपोर्ट डाउनलोड करें", kn: "ಸಂಪೂರ್ಣ ಕೃಷಿ ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ", ta: "முழு வேளாண் அறிக்கையை பதிவிறக்கவும்", te: "పూర్తి వ్యవసాయ నివేదికను డౌన్‌లోడ్ చేసుకోండి", mr: "पूर्ण कृषी अहवाल डाउनलोड करा" }
};

// In-memory instant lookup cache
const dynamicTranslationCache = new Map();

// Local Storage Cache Loader
try {
  const stored = localStorage.getItem('agri_dynamic_translations_v2');
  if (stored) {
    const parsed = JSON.parse(stored);
    Object.entries(parsed).forEach(([k, v]) => dynamicTranslationCache.set(k, v));
  }
} catch (e) {}

function persistCache() {
  try {
    const obj = {};
    dynamicTranslationCache.forEach((v, k) => { obj[k] = v; });
    localStorage.setItem('agri_dynamic_translations_v2', JSON.stringify(obj));
  } catch (e) {}
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
  if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'PATH', 'IFRAME'].includes(tag)) {
    return true;
  }

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
 * Instant dictionary or cached lookup (0ms)
 */
export function lookupFastTranslation(text, targetLang) {
  if (!text || targetLang === 'en') return text;
  const trimmed = text.trim();
  if (!trimmed || /^[0-9\s.,:%!@#$^&*()_+\-=[\]{};':"\\|,.<>/?°℃℉\/\\|•₹]+$/.test(trimmed)) {
    return text;
  }

  // 1. Direct dictionary match
  if (CLIENT_TRANSLATION_MAP[trimmed] && CLIENT_TRANSLATION_MAP[trimmed][targetLang]) {
    return CLIENT_TRANSLATION_MAP[trimmed][targetLang];
  }

  // 2. Case-insensitive dictionary match
  for (const [key, map] of Object.entries(CLIENT_TRANSLATION_MAP)) {
    if (key.toLowerCase() === trimmed.toLowerCase() && map[targetLang]) {
      return map[targetLang];
    }
  }

  // 3. Memory cache
  const cacheKey = `${targetLang}:${trimmed}`;
  if (dynamicTranslationCache.has(cacheKey)) {
    return dynamicTranslationCache.get(cacheKey);
  }

  return null;
}

/**
 * Live Neural Translation Fetcher for ANY unknown word or sentence
 * Uses free Google Translate single API endpoint + local storage caching
 */
export async function fetchLiveNeuralTranslation(text, targetLang) {
  if (!text || targetLang === 'en') return text;
  const trimmed = text.trim();
  if (!trimmed || /^[0-9\s.,:%!@#$^&*()_+\-=[\]{};':"\\|,.<>/?°℃℉\/\\|•₹]+$/.test(trimmed)) {
    return text;
  }

  const cacheKey = `${targetLang}:${trimmed}`;
  if (dynamicTranslationCache.has(cacheKey)) {
    return dynamicTranslationCache.get(cacheKey);
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data[0])) {
        const translated = data[0].map(item => item[0]).join('');
        if (translated && translated.trim()) {
          dynamicTranslationCache.set(cacheKey, translated.trim());
          persistCache();
          return translated.trim();
        }
      }
    }
  } catch (err) {
    // Fallback: try tokenizing sub-words
    const words = trimmed.split(/\s+/);
    if (words.length > 1) {
      const translatedWords = words.map(w => lookupFastTranslation(w, targetLang) || w);
      const joined = translatedWords.join(' ');
      if (joined !== trimmed) {
        dynamicTranslationCache.set(cacheKey, joined);
        return joined;
      }
    }
  }

  return null;
}

/**
 * Translates a single text node instantly with fast lookup and background neural fallback
 */
function translateTextNode(node, targetLang) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  if (shouldSkipNode(node)) return;

  const raw = node.nodeValue;
  if (!raw || !raw.trim()) return;

  // Stash original English text on node
  if (!node.__agriOriginalText) {
    node.__agriOriginalText = raw;
  }

  const origText = node.__agriOriginalText;
  if (!origText || !origText.trim()) return;

  // If target is English, restore original
  if (targetLang === 'en') {
    if (node.nodeValue !== origText) {
      node.nodeValue = origText;
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
    // Unknown phrase: trigger live neural translation and update seamlessly
    fetchLiveNeuralTranslation(origText, targetLang).then(translated => {
      if (translated && node.parentElement && node.nodeValue !== translated) {
        const leading = origText.match(/^\s*/)?.[0] || '';
        const trailing = origText.match(/\s*$/)?.[0] || '';
        node.nodeValue = `${leading}${translated}${trailing}`;
        translatedNodesCount++;
        updateLiveStats();
      }
    });
  }
}

/**
 * Deeply translates an entire DOM Subtree inside requestAnimationFrame
 */
export function translateSubtree(rootNode, targetLang) {
  if (!rootNode) return;

  requestAnimationFrame(() => {
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
 * Global Live DOM MutationObserver Instance
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

    // Fast synchronous pass across whole DOM
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
      }, 50);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false
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

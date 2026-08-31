import os
import sys
import re
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional

# Add argos-translate-master to sys.path if available dynamically
BACKEND_DIR = Path(__file__).resolve().parent.parent
SIH2_ROOT = BACKEND_DIR.parent
argos_candidates = [
    SIH2_ROOT / "argos-translate-master",
    Path(__file__).resolve().parents[2] / "argos-translate-master",
]
for candidate in argos_candidates:
    if candidate.exists() and str(candidate) not in sys.path:
        sys.path.insert(0, str(candidate))
        break

logger = logging.getLogger("agrisphere.translator")

# Comprehensive Multilingual Agricultural, Geospatial & UI Translation Dictionary
AGRICULTURAL_TRANSLATION_DICT: Dict[str, Dict[str, str]] = {
    # App & UI terms
    "command center": {
        "hi": "कमांड सेंटर", "kn": "ಕಮಾಂಡ್ ಸೆಂಟರ್", "ta": "கட்டளை மையம்", "te": "కమాండ్ సెంటర్",
        "mr": "कमांड सेंटर", "bn": "কমান্ড সেন্টার", "gu": "કમાન્ડ સેન્ટર", "pa": "ਕਮਾਂਡ ਸੈਂਟਰ",
        "es": "Centro de Comando", "fr": "Centre de Commandement", "de": "Kommandozentrale"
    },
    "geosr-ai studio": {
        "hi": "जियोएसआर उपग्रह स्टूडियो", "kn": "ಜಿಯೋಎಸ್‌ಆರ್ ಸ್ಯಾಟಲೈಟ್ ಸ್ಟುಡಿಯೋ", "ta": "ஜியோஎஸ்ஆர் செயற்கைக்கோள் ஸ்டுடியோ", "te": "జియోఎస్ఆర్ ఉపగ్రహ స్టూడియో",
        "mr": "जिओएसआर उपग्रह स्टुडिओ", "bn": "জিওএসআর স্যাটেলাইট স্টুডিও", "gu": "જિયોએસઆર સેટેલાઇટ સ્ટુડિયો", "pa": "ਜੀਓਐਸਆਰ ਸੈਟੇਲਾਈਟ ਸਟੂਡੀਓ",
        "es": "Estudio GeoSR-AI", "fr": "Studio GeoSR-AI", "de": "GeoSR-AI Studio"
    },
    "soil & depletion": {
        "hi": "मृदा स्वास्थ्य एवं पोषक तत्व क्षरण", "kn": "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ಕ್ಷೀಣತೆ", "ta": "மண் வளம் & குறைவு", "te": "నేల ఆరోగ్యం & క్షీణత",
        "mr": "माती आरोग्य व घट", "bn": "মাটি স্বাস্থ্য ও ক্ষয়", "gu": "જમીન આરોગ્ય અને ઘટાડો", "pa": "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਅਤੇ ਖਤਮ ਹੋਣਾ",
        "es": "Suelo y Agotamiento", "fr": "Sol et Épuisement", "de": "Boden & Erschöpfung"
    },
    "national analytics": {
        "hi": "राष्ट्रीय कृषि विश्लेषण", "kn": "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ", "ta": "தேசிய வேளாண் பகுப்பாய்வு", "te": "జాతీయ వ్యవసాయ విశ్లేషణ",
        "mr": "राष्ट्रीय कृषी विश्लेषण", "bn": "জাতীয় কৃষি বিশ্লেষণ", "gu": "રાષ્ટ્રીય કૃષિ વિશ્લેષણ", "pa": "ਰਾਸ਼ਟਰੀ ਖੇਤੀ ਵਿਸ਼ਲੇਸ਼ਣ",
        "es": "Analítica Nacional", "fr": "Analytique Nationale", "de": "Nationale Analytik"
    },
    "ai agronomist": {
        "hi": "कृषि मित्र एआई", "kn": "ಕೃಷಿ ಮಿತ್ರ AI", "ta": "வேளாண் நண்பன் AI", "te": "కృషి మిత్ర AI",
        "mr": "कृषी मित्र एआय", "bn": "কৃষি মিত্র এআই", "gu": "કૃષિ મિત્ર એઆઈ", "pa": "ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ ਏਆਈ",
        "es": "Agrónomo IA", "fr": "Agronome IA", "de": "KI-Agronom"
    },
    "my farms": {
        "hi": "मेरे खेत", "kn": "ನನ್ನ ಜಮೀನುಗಳು", "ta": "எனது பண்ணைகள்", "te": "నా పొలాలు",
        "mr": "माझी शेतं", "bn": "আমার খামার", "gu": "મારા ખેતરો", "pa": "ਮੇਰੇ ਖੇਤ",
        "es": "Mis Granjas", "fr": "Mes Fermes", "de": "Meine Höfe"
    },
    "weather radar": {
        "hi": "मौसम रडार", "kn": "ಹವಾಮಾನ ರಾಡಾರ್", "ta": "வானிலை ரேடார்", "te": "వాతావరణ రాడార్",
        "mr": "हवामान रडार", "bn": "আবহাওয়া রাডার", "gu": "હવામાન રડાર", "pa": "ਮੌਸਮ ਰਾਡਾਰ",
        "es": "Radar Meteorológico", "fr": "Radar Météo", "de": "Wetterradar"
    },
    "live auto-translating": {
        "hi": "लाइव स्वतः-अनुवाद सक्रिय", "kn": "ಲೈವ್ ಸ್ವಯಂ ಅನುವಾದ ಸಕ್ರಿಯ", "ta": "நேரலை தானியங்கி மொழிபெயர்ப்பு", "te": "లైవ్ ఆటో-అనువాదం సక్రియం",
        "mr": "लाइव्ह स्वयं-भाषांतर सक्रिय", "bn": "লাইভ অটো অনুবাদ সক্রিয়", "gu": "લાઇવ આપમેળે અનુવાદ ચાલુ", "pa": "ਲਾਈਵ ਸਵੈ-ਅਨੁਵਾਦ ਕਿਰਿਆਸ਼ੀਲ",
        "es": "Traducción Automática en Vivo", "fr": "Traduction Automatique en Direct", "de": "Live-Automatische Übersetzung"
    },
    
    # Crops
    "wheat": {"hi": "गेहूं", "kn": "ಗೋಧಿ", "ta": "கோதுமை", "te": "గోధుమ", "mr": "गहू", "bn": "গম", "gu": "ઘઉં", "pa": "ਕਣਕ", "es": "Trigo", "fr": "Blé", "de": "Weizen"},
    "rice": {"hi": "धान / चावल", "kn": "ಭತ್ತ", "ta": "நெல்", "te": "వరి", "mr": "भात / तांदूळ", "bn": "চাল / ধান", "gu": "ડાંગર / ચોખા", "pa": "ਚੌਲ / ਝੋਨਾ", "es": "Arroz", "fr": "Riz", "de": "Reis"},
    "paddy": {"hi": "धान", "kn": "ಭತ್ತ", "ta": "நெல்", "te": "వరి", "mr": "भात", "bn": "ধান", "gu": "ડાંગર", "pa": "ਝੋਨਾ", "es": "Arroz con cáscara", "fr": "Paddy", "de": "Reis"},
    "sugarcane": {"hi": "गन्ना", "kn": "ಕಬ್ಬು", "ta": "கரும்பு", "te": "చెరకు", "mr": "ऊस", "bn": "আখ", "gu": "શેરડી", "pa": "ਗੰਨਾ", "es": "Caña de azúcar", "fr": "Canne à sucre", "de": "Zuckerrohr"},
    "cotton": {"hi": "कपास", "kn": "ಹತ್ತಿ", "ta": "பருத்தி", "te": "పత్తి", "mr": "कापूस", "bn": "তুলা", "gu": "કપાસ", "pa": "ਕਪਾਹ", "es": "Algodón", "fr": "Coton", "de": "Baumwolle"},
    "soybean": {"hi": "सोयाबीन", "kn": "ಸೋಯಾಬೀನ್", "ta": "சோயாபீன்", "te": "సోయాబీన్", "mr": "सोयाबीन", "bn": "সয়াবিন", "gu": "સોયાબીન", "pa": "ਸੋਇਆਬੀਨ", "es": "Soja", "fr": "Soja", "de": "Sojabohne"},
    "maize": {"hi": "मक्का", "kn": "ಮೆಕ್ಕೆಜೋಳ", "ta": "மக்காச்சோளம்", "te": "మొక్కజొన్న", "mr": "मका", "bn": "ভুট্টা", "gu": "મકાઈ", "pa": "ਮੱਕੀ", "es": "Maíz", "fr": "Maïs", "de": "Mais"},
    "chickpea": {"hi": "चना", "kn": "ಕಡಲೆ", "ta": "கொண்டைக்கடலை", "te": "శనగలు", "mr": "हरभरा", "bn": "ছোলা", "gu": "ચણા", "pa": "ਛੋਲੇ", "es": "Garbanzo", "fr": "Pois chiche", "de": "Kichererbse"},
    "mustard": {"hi": "सरसों", "kn": "ಸಾಸಿವೆ", "ta": "கடுகு", "te": "ఆవాలు", "mr": "मोहरी", "bn": "সরিষা", "gu": "રાઈ", "pa": "ਸਰ੍ਹੋਂ", "es": "Mostaza", "fr": "Moutarde", "de": "Senf"},
    
    # Agronomic nutrients & soil
    "nitrogen": {"hi": "नाइट्रोजन (N)", "kn": "ಸಾರಜನಕ (N)", "ta": "நைட்ரஜன் (N)", "te": "నత్రజని (N)", "mr": "नायट्रोजन (N)", "bn": "নাইট্রোজেন", "gu": "નાઇટ્રોજન", "pa": "ਨਾਈਟ੍ਰੋਜਨ", "es": "Nitrógeno", "fr": "Azote", "de": "Stickstoff"},
    "phosphorus": {"hi": "फास्फोरस (P)", "kn": "ರಂಜಕ (P)", "ta": "பாஸ்பரஸ் (P)", "te": "భాస్వరం (P)", "mr": "फॉस्फरस (P)", "bn": "ফসফরাস", "gu": "ફોસ્ફરસ", "pa": "ਫਾਸਫੋਰਸ", "es": "Fósforo", "fr": "Phosphore", "de": "Phosphor"},
    "potassium": {"hi": "पोटेशियम (K)", "kn": "ಪೊಟ್ಯಾಶಿಯಂ (K)", "ta": "பொட்டாசியம் (K)", "te": "పొటాషియం (K)", "mr": "पोटॅशियम (K)", "bn": "পটাসিয়াম", "gu": "પોટેશિયમ", "pa": "ਪੋਟਾਸ਼ੀਅਮ", "es": "Potasio", "fr": "Potassium", "de": "Kalium"},
    "soil health": {"hi": "मृदा स्वास्थ्य", "kn": "ಮಣ್ಣಿನ ಆರೋಗ್ಯ", "ta": "மண் வளம்", "te": "నేల ఆరోగ్యం", "mr": "माती आरोग्य", "bn": "মাটি স্বাস্থ্য", "gu": "જમીન સ્વાસ્થ્ય", "pa": "ਮਿੱਟੀ ਦੀ ਸਿਹਤ", "es": "Salud del suelo", "fr": "Santé des sols", "de": "Bodengesundheit"},
    "fertilizer": {"hi": "उर्वरक / खाद", "kn": "ಗೊಬ್ಬರ", "ta": "உரம்", "te": "ఎరువులు", "mr": "खत", "bn": "সার", "gu": "ખાતર", "pa": "ਖਾਦ", "es": "Fertilizante", "fr": "Engrais", "de": "Düngemittel"},
    "pesticide": {"hi": "कीटनाशक", "kn": "ಕೀಟನಾಶಕ", "ta": "பூச்சிக்கொல்லி", "te": "పురుగుమందు", "mr": "कीटकनाशक", "bn": "কীটনাশক", "gu": "જંતુનાશક", "pa": "ਕੀਟਨਾਸ਼ਕ", "es": "Pesticida", "fr": "Pesticide", "de": "Pestizid"},
    "irrigation": {"hi": "सिंचाई", "kn": "ನೀರಾವರಿ", "ta": "நீர்ப்பாசனம்", "te": "నీటిపారుదల", "mr": "सिंचन", "bn": "সেচ", "gu": "સિંચાઈ", "pa": "ਸਿੰਚਾਈ", "es": "Riego", "fr": "Irrigation", "de": "Bewässerung"},
    "weather": {"hi": "मौसम", "kn": "ಹವಾಮಾನ", "ta": "வானிலை", "te": "వాతావరణం", "mr": "हवामान", "bn": "আবহাওয়া", "gu": "હવામાન", "pa": "ਮੌਸਮ", "es": "Clima", "fr": "Météo", "de": "Wetter"},
    "rainfall": {"hi": "वर्षा / बारिश", "kn": "ಮಳೆ", "ta": "மழை", "te": "వర్షపాతం", "mr": "पाऊस", "bn": "বৃষ্টিপাত", "gu": "વરસાદ", "pa": "ਮੀਂਹ", "es": "Lluvia", "fr": "Pluie", "de": "Niederschlag"},
    "yield": {"hi": "उपज / पैदावार", "kn": "ಇಳುವರಿ", "ta": "மகசூல்", "te": "దిगुబడి", "mr": "उत्पादन", "bn": "ফলন", "gu": "ઉપજ", "pa": "ਝਾੜ", "es": "Rendimiento", "fr": "Rendement", "de": "Ertrag"},
    "farmer": {"hi": "किसान", "kn": "ರೈತ", "ta": "விவசாயி", "te": "రైతు", "mr": "शेतकरी", "bn": "কৃষক", "gu": "ખેડૂત", "pa": "ਕਿਸਾਨ", "es": "Agricultor", "fr": "Agriculteur", "de": "Landwirt"},

    # Dynamic phrases
    "execute super-resolution mapping": {
        "hi": "उपग्रह सुपर-रेजोल्यूशन मैपिंग निष्पादित करें",
        "kn": "ಸೂಪರ್-ರೆಸಲ್ಯೂಶನ್ ಮ್ಯಾಪಿಂಗ್ ಚಲಾಯಿಸಿ",
        "ta": "சூப்பர்-ரெசல்யூஷன் வரைபடத்தை இயக்கவும்",
        "te": "సూపర్-రిజల్యూషన్ మ్యాపింగ్‌ను అమలు చేయండి"
    },
    "processing tiled neural upscaling...": {
        "hi": "न्यूरल अपस्केलिंग की प्रक्रिया जारी है...",
        "kn": "ನ್ಯೂರಲ್ ಅಪ್‌ಸ್ಕೇಲಿಂಗ್ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...",
        "ta": "செயற்கை நுண்ணறிவு செயலாக்கம் நடக்கிறது...",
        "te": "న్యూరల్ అప్‌స్కేలింగ్ జరుగుతోంది..."
    },
    "compute soil health & 3-season drawdown": {
        "hi": "मृदा स्वास्थ्य एवं 3-सीजन पोषक तत्व कमी की गणना करें",
        "kn": "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು 3-ಸೀಸನ್ ಕ್ಷೀಣತೆಯನ್ನು ಲೆಕ್ಕಹಾಕಿ",
        "ta": "மண் வளம் மற்றும் 3-பருவ குறைவை கணக்கிடுங்கள்",
        "te": "నేల ఆరోగ్యం & 3-సీజన్ల క్షీణతను లెక్కించండి"
    },
    "ask krishi mitra": {
        "hi": "कृषि मित्र से पूछें",
        "kn": "ಕೃಷಿ ಮಿತ್ರರನ್ನು ಕೇಳಿ",
        "ta": "வேளாண் நண்பனிடம் கேளுங்கள்",
        "te": "కృషి మిత్రను అడగండి"
    },
    "namaste! i am krishi mitra, your ai agronomist & icar knowledge assistant. how can i help you with crop health, fertilizer dosing, pest protection, or government schemes today?": {
        "hi": "नमस्ते! मैं कृषि मित्र हूँ, आपका एआई कृषि विशेषज्ञ एवं आईसीएआर सहायक। आज मैं आपकी फसल सुरक्षा, उर्वरक, कीट नियंत्रण या योजनाओं में क्या सहायता कर सकता हूँ?",
        "kn": "ನಮಸ್ಕಾರ! ನಾನು ಕೃಷಿ ಮಿತ್ರ, ನಿಮ್ಮ AI ಕೃಷಿ ಸಲಹೆಗಾರ. ಬೆಳೆ ಆರೋಗ್ಯ, ರಸಗೊಬ್ಬರ ಮತ್ತು ಕೀಟ ನಿಯಂತ್ರಣದಲ್ಲಿ ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
        "ta": "வணக்கம்! நான் கிருஷி மித்ரா, உங்கள் AI வேளாண் ஆலோசகர். பயிர் நலம், உரம், பூச்சி மேலாண்மை பற்றி உங்களுக்கு எவ்வாறு உதவ முடியும்?",
        "te": "నమస్కారం! నేను కృషి మిత్ర, మీ AI వ్యవసాయ సలహాదారుని. పంట ఆరోగ్యం, ఎరువుల మోతాదు, పురుగుమందులు లేదా పథకాలపై నేను మీకు ఎలా సహాయం చేయగలను?"
    }
}

SUPPORTED_LANGUAGES = [
    {"code": "en", "name": "English", "native": "English"},
    {"code": "hi", "name": "Hindi", "native": "हिंदी"},
    {"code": "kn", "name": "Kannada", "native": "ಕನ್ನಡ"},
    {"code": "ta", "name": "Tamil", "native": "தமிழ்"},
    {"code": "te", "name": "Telugu", "native": "తెలుగు"},
    {"code": "mr", "name": "Marathi", "native": "मराठी"},
    {"code": "bn", "name": "Bengali", "native": "বাংলা"},
    {"code": "gu", "name": "Gujarati", "native": "ગુજરાતી"},
    {"code": "pa", "name": "Punjabi", "native": "ਪੰਜਾਬੀ"},
    {"code": "ml", "name": "Malayalam", "native": "മലയാളം"},
    {"code": "es", "name": "Spanish", "native": "Español"},
    {"code": "fr", "name": "French", "native": "Français"},
    {"code": "de", "name": "German", "native": "Deutsch"}
]


class ArgosTranslationEngine:
    """
    Argos Translate Integration Engine with dynamic vocabulary neural replacement & cache.
    """
    def __init__(self):
        self.argos_installed = False
        self.cache: Dict[str, str] = {}
        try:
            import argostranslate.package
            import argostranslate.translate
            self.argos = argostranslate
            self.argos_installed = True
            logger.info("Argos Translate engine initialized successfully.")
        except Exception as e:
            logger.info(f"Argos Translate engine fallback mode active: {e}")
            self.argos = None

    def translate_text(self, text: str, from_code: str = "en", to_code: str = "hi") -> str:
        if not text or from_code == to_code:
            return text

        cache_key = f"{from_code}:{to_code}:{text.strip()}"
        if cache_key in self.cache:
            return self.cache[cache_key]

        cleaned = text.strip()
        cleaned_lower = cleaned.lower()

        # 1. Exact phrase match in comprehensive Agronomy dictionary
        if cleaned_lower in AGRICULTURAL_TRANSLATION_DICT:
            target_map = AGRICULTURAL_TRANSLATION_DICT[cleaned_lower]
            if to_code in target_map:
                res = target_map[to_code]
                self.cache[cache_key] = res
                return res

        # 2. Check if Argos package is available
        if self.argos_installed and self.argos:
            try:
                installed_languages = self.argos.translate.get_installed_languages()
                from_lang = next((l for l in installed_languages if l.code == from_code), None)
                to_lang = next((l for l in installed_languages if l.code == to_code), None)
                if from_lang and to_lang:
                    translation = from_lang.get_translation(to_lang)
                    if translation:
                        res = translation.translate(text)
                        self.cache[cache_key] = res
                        return res
            except Exception as e:
                logger.debug(f"Argos direct translation fallback: {e}")

        # 3. High-speed phrase and vocabulary replacement for sentences
        result_text = text
        for term, translations in AGRICULTURAL_TRANSLATION_DICT.items():
            if to_code in translations:
                # Case-insensitive replacement of multi-word or single-word phrases
                pattern = re.compile(re.escape(term), re.IGNORECASE)
                result_text = pattern.sub(translations[to_code], result_text)

        self.cache[cache_key] = result_text
        return result_text


# Global Translator Instance
translator_engine = ArgosTranslationEngine()


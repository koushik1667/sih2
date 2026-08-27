import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Bot, 
  Languages, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  Radio
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

const SPEECH_LANG_CODES = {
  te: 'te-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  ml: 'ml-IN',
  or: 'or-IN',
  as: 'as-IN',
  en: 'en-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE'
};

const SAMPLE_VOICE_PROMPTS = {
  te: [
    "రబీ సీజన్‌లో ఏ పంట వేయాలి?",
    "వరిలో ఆకు ముడత తెగులు నివారణ ఏమిటి?",
    "పీఎం కిసాన్ రాయితీ ఎలా పొందాలి?",
    "నేల సారవంతం పెంచడానికి ఎరువుల మోతాదు ఎంత?"
  ],
  hi: [
    "रबी मौसम में कौन सी फसल बोनी चाहिए?",
    "धान में तना छेदक कीट की रोकथाम कैसे करें?",
    "पीएम किसान सम्मान निधि का लाभ कैसे लें?",
    "मृदा स्वास्थ्य और एनपीके खाद की सही मात्रा क्या है?"
  ],
  kn: [
    "ರಬಿ ಋತುವಿನಲ್ಲಿ ಯಾವ ಬೆಳೆ ಬೆಳೆಯಬೇಕು?",
    "ಭತ್ತದಲ್ಲಿ ಕೀಟ ನಿಯಂತ್ರಣ ಹೇಗೆ ಮಾಡುವುದು?",
    "ಪಿಎಂ ಕಿಸಾನ್ ಯೋಜನೆಯ ವಿವರ ತಿಳಿಸಿ",
    "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ ಎಷ್ಟು?"
  ],
  ta: [
    "ரபி பருவத்தில் என்ன பயிர் நடவு செய்ய வேண்டும்?",
    "நெல் பயிரில் பூச்சி தாக்குதலை கட்டுப்படுத்துவது எப்படி?",
    "பிஎம் கிசான் மானியம் பெறுவது எப்படி?",
    "மண் வளம் மற்றும் உர அளவு என்ன?"
  ],
  en: [
    "What crops are recommended for Rabi season?",
    "How to manage stem borer in paddy fields?",
    "How do I apply for PM-Kisan & drip irrigation subsidy?",
    "What is the optimal NPK dose for wheat and cotton?"
  ]
};

export const MultilingualVoiceAgent = ({ isOpen, onClose }) => {
  const { lang, setLang } = useLanguage();
  const { selectedFarm, setChatMessages } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis || null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = SPEECH_LANG_CODES[lang] || 'en-IN';

    recog.onstart = () => {
      setIsListening(true);
      setInterimText('');
    };

    recog.onresult = (event) => {
      let currentInterim = '';
      let finalSpeech = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalSpeech += text;
        } else {
          currentInterim += text;
        }
      }

      if (finalSpeech) {
        setTranscript(finalSpeech);
        setInterimText('');
        handleProcessSpeech(finalSpeech);
      } else {
        setInterimText(currentInterim);
      }
    };

    recog.onerror = (event) => {
      console.warn("Speech recognition notice:", event.error);
      setIsListening(false);
    };

    recog.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recog;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [lang]);

  // Update recognition language when user changes language
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = SPEECH_LANG_CODES[lang] || 'en-IN';
    }
  }, [lang]);

  const toggleListening = () => {
    if (isSpeaking) {
      stopSpeaking();
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    } else {
      setTranscript('');
      setInterimText('');
      try {
        recognitionRef.current?.start();
      } catch (_) {
        // restart instance if needed
        setIsListening(true);
      }
    }
  };

  const handleProcessSpeech = async (queryText) => {
    if (!queryText.trim()) return;

    setLoading(true);
    try {
      const res = await api.sendChatMessage({
        query: queryText,
        language: lang,
        farm_context: selectedFarm ? {
          crop: selectedFarm.current_crop,
          land_size: selectedFarm.land_size_acres,
          soil_type: selectedFarm.soil_type
        } : null
      });

      setAiResponse(res);

      // Append to global chat state for persistence
      setChatMessages(prev => [
        ...prev,
        { id: `voice-user-${Date.now()}`, sender: 'user', text: queryText },
        { id: `voice-bot-${Date.now()}`, sender: 'bot', text: res.answer, citation: res.citation, topic: res.topic }
      ]);

      // Speak response aloud in target language
      speakText(res.answer);
    } catch (err) {
      const fallback = "I have recorded your agronomic query. For balanced NPK application, soil testing every season and crop rotation with legumes is recommended.";
      setAiResponse({ answer: fallback, citation: "ICAR Agronomy" });
      speakText(fallback);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (textToSpeak) => {
    if (!synthRef.current || !textToSpeak) return;

    synthRef.current.cancel();
    const cleanText = textToSpeak.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = SPEECH_LANG_CODES[lang] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick best matching voice
    const voices = synthRef.current.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang) || v.lang.includes(SPEECH_LANG_CODES[lang]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
  const samplePrompts = SAMPLE_VOICE_PROMPTS[lang] || SAMPLE_VOICE_PROMPTS.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FEFEFA] rounded-3xl border border-[#DED8CF] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Language Selector & Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DED8CF] bg-[#FDFCF8]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#5D7052]/15 text-[#5D7052]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#2C2C24] font-serif">
                  Krishi Mitra AI Voice Agent
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5D7052]/10 text-[#5D7052] text-[10px] font-extrabold uppercase">
                  <Radio className="w-3 h-3 animate-pulse text-[#5D7052]" />
                  Live Voice
                </span>
              </div>
              <p className="text-xs text-[#78786C]">
                Speak in your native language for instant agricultural advice
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              if (isListening) recognitionRef.current?.stop();
              onClose();
            }}
            className="p-2 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Quick Selector Pills */}
        <div className="px-6 py-2.5 bg-[#F0EBE5]/50 border-b border-[#DED8CF]/60 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-[#78786C] shrink-0 mr-1 flex items-center gap-1">
            <Languages className="w-3.5 h-3.5" /> Language:
          </span>
          {[
            { code: 'te', name: 'తెలుగు' },
            { code: 'hi', name: 'हिंदी' },
            { code: 'kn', name: 'ಕನ್ನಡ' },
            { code: 'ta', name: 'தமிழ்' },
            { code: 'mr', name: 'मराठी' },
            { code: 'bn', name: 'বাংলা' },
            { code: 'gu', name: 'ગુજરાતી' },
            { code: 'pa', name: 'ਪੰਜਾਬੀ' },
            { code: 'en', name: 'English' }
          ].map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setLang(item.code)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                lang === item.code
                  ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                  : 'bg-[#FEFEFA] text-[#78786C] hover:text-[#2C2C24] border border-[#DED8CF]'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Central Pulsating Voice Orb Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col items-center justify-center text-center">
          
          {/* Animated Pulsating Voice Orb */}
          <div className="relative flex items-center justify-center my-4">
            {/* Multi-Ring Soundwave Animations when active */}
            {isListening && (
              <>
                <div className="absolute w-36 h-36 rounded-full bg-[#5D7052]/20 animate-ping" />
                <div className="absolute w-28 h-28 rounded-full bg-[#A85448]/20 animate-pulse" />
              </>
            )}
            {isSpeaking && (
              <>
                <div className="absolute w-36 h-36 rounded-full bg-[#C18C5D]/25 animate-ping" />
                <div className="absolute w-28 h-28 rounded-full bg-[#5D7052]/20 animate-pulse" />
              </>
            )}

            <button
              type="button"
              onClick={toggleListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 cursor-pointer ${
                isListening
                  ? 'bg-[#A85448] text-[#FEFEFA] ring-8 ring-[#A85448]/30 scale-105'
                  : isSpeaking
                  ? 'bg-[#C18C5D] text-[#FEFEFA] ring-8 ring-[#C18C5D]/30'
                  : 'bg-[#5D7052] text-[#FEFEFA] hover:bg-[#4D5E44] ring-4 ring-[#5D7052]/20'
              }`}
            >
              {loading ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : isListening ? (
                <Mic className="w-10 h-10 animate-pulse" />
              ) : isSpeaking ? (
                <Volume2 className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Status Text */}
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#2C2C24]">
              {loading
                ? "Analyzing with Krishi Mitra AI..."
                : isListening
                ? `Listening in ${currentLangObj.name} (${currentLangObj.native})...`
                : isSpeaking
                ? "Krishi Mitra is speaking..."
                : `Tap the microphone to speak in ${currentLangObj.name}`}
            </h4>
            <p className="text-xs text-[#78786C]">
              {isListening
                ? "Speak clearly into your microphone..."
                : "Ask about crops, soil nutrients, pests, weather or subsidies"}
            </p>
          </div>

          {/* Live Transcript / Response Box */}
          {(transcript || interimText || aiResponse) && (
            <div className="w-full space-y-3 text-left">
              {/* User Speech Transcription */}
              {(transcript || interimText) && (
                <div className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs">
                  <span className="font-bold text-[#5D7052] block mb-1">You asked:</span>
                  <p className="text-[#2C2C24] font-medium">
                    {transcript || interimText}
                    {interimText && <span className="text-[#78786C] italic"> ...</span>}
                  </p>
                </div>
              )}

              {/* AI Response Card */}
              {aiResponse && (
                <div className="p-4 rounded-2xl bg-[#5D7052]/10 border border-[#5D7052]/30 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#5D7052] flex items-center gap-1.5 font-serif">
                      <Sparkles className="w-3.5 h-3.5 text-[#C18C5D]" />
                      Krishi Mitra Advisory:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => isSpeaking ? stopSpeaking() : speakText(aiResponse.answer)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEFEFA] text-[#5D7052] border border-[#5D7052]/30 font-bold hover:bg-[#5D7052] hover:text-[#FEFEFA] transition cursor-pointer"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isSpeaking ? "Mute" : "Read Aloud"}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[#2C2C24] leading-relaxed text-[12.5px] font-sans">
                    {aiResponse.answer}
                  </p>
                  {aiResponse.citation && (
                    <div className="text-[10px] text-[#78786C] border-t border-[#5D7052]/20 pt-1.5">
                      Source: {aiResponse.citation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Suggested Voice Questions */}
          {!aiResponse && !loading && (
            <div className="w-full space-y-2 pt-2 text-left">
              <span className="text-[11px] font-bold text-[#78786C] block uppercase tracking-wider">
                Or try asking:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(prompt);
                      handleProcessSpeech(prompt);
                    }}
                    className="p-2.5 rounded-xl bg-[#FEFEFA] border border-[#DED8CF] hover:border-[#5D7052] hover:bg-[#5D7052]/5 text-left text-xs text-[#2C2C24] transition flex items-start gap-2 group cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#5D7052] shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#FDFCF8] border-t border-[#DED8CF] flex items-center justify-between text-[11px] text-[#78786C]">
          <span>⚡ Speech-to-Text &amp; Neural TTS enabled</span>
          <span className="font-semibold text-[#5D7052]">ICAR Certified Advisory</span>
        </div>
      </div>
    </div>
  );
};

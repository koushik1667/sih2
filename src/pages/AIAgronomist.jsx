import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb,
  Languages
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const AIAgronomist = () => {
  const { lang, t } = useLanguage();
  const { selectedFarm, chatMessages, setChatMessages } = useApp();

  const messages = chatMessages;
  const setMessages = setChatMessages;
  const [inputText, setInputText] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadPrompts() {
      try {
        const data = await api.getChatPrompts();
        if (data && data.prompts) {
          setPrompts(data.prompts);
        }
      } catch (err) {
        console.error("Failed to load prompts:", err);
      }
    }
    loadPrompts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (queryText = inputText) => {
    if (!queryText.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
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

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.answer,
        topic: res.topic,
        citation: res.citation,
        suggested_actions: res.suggested_actions
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: "I apologize, but I encountered an error retrieving agronomic data. Please ensure balanced NPK fertilization and consult your local KVK center.",
        citation: "ICAR Fallback Advisory"
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-fadeIn">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#5D7052] text-xs font-bold uppercase tracking-wider mb-1.5">
          <Bot className="w-4 h-4" />
          <span>RAG-Powered Natural Agronomy Advisor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C24] font-serif">
          {t('chat_title')}
        </h1>
        <p className="text-xs sm:text-sm text-[#78786C] mt-1.5 font-medium">
          {t('chat_subtitle')}
        </p>
      </div>

      {/* Suggested Quick Prompt Chips */}
      {prompts.length > 0 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-[#78786C] font-bold flex items-center gap-1.5 shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-[#C18C5D]" />
            <span>Try asking:</span>
          </span>
          {prompts.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSendMessage(p.query)}
              className="px-4 py-2 rounded-full bg-[#F0EBE5]/80 hover:bg-[#E6DCCD] border border-[#DED8CF] text-xs text-[#2C2C24] font-semibold whitespace-nowrap transition-all hover:scale-102 active:scale-98"
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft min-h-[460px] max-h-[580px] overflow-y-auto flex flex-col space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-soft ${
                isUser 
                  ? 'bg-[#C18C5D] text-white' 
                  : 'bg-[#5D7052] text-white'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] rounded-[1.75rem] p-5 text-xs sm:text-sm leading-relaxed ${
                isUser 
                  ? 'bg-[#C18C5D] text-white rounded-tr-sm shadow-sm' 
                  : 'bg-[#F0EBE5]/80 border border-[#DED8CF]/70 text-[#2C2C24] rounded-tl-sm shadow-soft'
              }`}>
                {msg.topic && !isUser && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#DED8CF]/60 text-xs font-bold text-[#5D7052] font-serif">
                    <Sparkles className="w-3.5 h-3.5 text-[#5D7052]" />
                    <span>{msg.topic}</span>
                  </div>
                )}

                <p className="whitespace-pre-line leading-relaxed font-sans">{msg.translated_text || msg.text}</p>

                {/* Argos Translate Action */}
                {!isUser && (
                  <div className="mt-3 pt-2.5 border-t border-[#DED8CF]/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#78786C] font-semibold">
                      <Languages className="w-3.5 h-3.5 text-[#5D7052]" />
                      <span>Argos Neural Translate:</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {['hi', 'kn', 'ta', 'te', 'en'].map(targetCode => (
                        <button
                          key={targetCode}
                          onClick={async () => {
                            try {
                              const res = await api.translate(msg.text, 'en', targetCode);
                              setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, translated_text: res.translated_text } : m));
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="px-2 py-0.5 rounded-full bg-[#FEFEFA] hover:bg-[#5D7052]/20 text-[10px] font-bold text-[#5D7052] border border-[#DED8CF] transition"
                        >
                          {targetCode.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="mt-3.5 pt-2.5 border-t border-[#DED8CF]/60 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#78786C] block">Recommended Agronomy Actions:</span>
                    {msg.suggested_actions.map((act, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#5D7052] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5D7052] shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.citation && (
                  <div className="mt-3 pt-2 border-t border-[#DED8CF]/60 flex items-center gap-1 text-[10px] text-[#78786C] font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-[#78786C]" />
                    <span>Source: {msg.citation}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-[#78786C] font-semibold">
            <div className="w-8 h-8 rounded-full bg-[#5D7052]/20 flex items-center justify-center text-[#5D7052] animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-full bg-[#F0EBE5] border border-[#DED8CF] flex items-center gap-2.5 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-[#5D7052] animate-ping" />
              <span>Krishi Mitra is consulting ICAR Agronomy Knowledge Repository...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={t('chat_placeholder')}
          className="w-full pl-6 pr-14 py-4 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-sm text-[#2C2C24] placeholder-[#78786C]/70 shadow-soft focus-visible:ring-2 ring-[#5D7052]/30 outline-none transition"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || loading}
          className="absolute right-2.5 p-3 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-white font-bold shadow-soft disabled:opacity-40 transition cursor-pointer hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

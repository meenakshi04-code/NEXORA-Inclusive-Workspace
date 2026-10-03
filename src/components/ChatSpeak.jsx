import React, { useState } from 'react';
import { MessageCircle, Volume2, Send, Grid, Keyboard } from 'lucide-react';

export default function ChatSpeak() {
  const [mode, setMode] = useState('aac'); // 'aac' or 'type'
  const [customText, setCustomText] = useState("");

  const aacPhrases = [
    { text: "Hello", icon: "👋", color: "bg-blue-100 border-blue-300 text-blue-800" },
    { text: "Yes", icon: "👍", color: "bg-green-100 border-green-300 text-green-800" },
    { text: "No", icon: "👎", color: "bg-red-100 border-red-300 text-red-800" },
    { text: "Thank You", icon: "🙏", color: "bg-purple-100 border-purple-300 text-purple-800" },
    { text: "I need help", icon: "🆘", color: "bg-orange-100 border-orange-300 text-orange-800" },
    { text: "I don't understand", icon: "🤔", color: "bg-yellow-100 border-yellow-300 text-yellow-800" },
    { text: "Please repeat", icon: "🔁", color: "bg-teal-100 border-teal-300 text-teal-800" },
    { text: "Goodbye", icon: "👋", color: "bg-gray-200 border-gray-400 text-gray-800" },
  ];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCustomSpeak = (e) => {
    e.preventDefault();
    if(customText.trim()) {
      speak(customText);
      setCustomText(""); // Clear after speaking
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-nx-panel border-l-8 border-[#3b82f6] rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-1">Chat & Speak (AAC)</h2>
          <p className="text-nx-text-muted font-medium">Use preset buttons or type text to speak out loud instantly.</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1 border border-nx-border">
          <button 
            onClick={() => setMode('aac')}
            className={`px-6 py-2 rounded-md font-bold flex items-center ${mode === 'aac' ? 'bg-white shadow-sm text-[#3b82f6]' : 'text-nx-text-muted hover:text-nx-text'}`}
          >
            <Grid className="w-5 h-5 mr-2" /> Quick Phrases
          </button>
          <button 
            onClick={() => setMode('type')}
            className={`px-6 py-2 rounded-md font-bold flex items-center ${mode === 'type' ? 'bg-white shadow-sm text-[#3b82f6]' : 'text-nx-text-muted hover:text-nx-text'}`}
          >
            <Keyboard className="w-5 h-5 mr-2" /> Type to Speak
          </button>
        </div>
      </div>

      <div className="flex-1 bg-nx-panel border border-nx-border rounded-xl shadow-sm p-8 flex flex-col">
        
        {mode === 'aac' ? (
          <div className="grid grid-cols-4 gap-6 flex-1 content-start">
            {aacPhrases.map((phrase, idx) => (
              <button 
                key={idx}
                onClick={() => speak(phrase.text)}
                className={`h-40 ${phrase.color} border-4 rounded-2xl flex flex-col items-center justify-center shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all`}
              >
                <span className="text-6xl mb-4">{phrase.icon}</span>
                <span className="text-xl font-black text-center px-2">{phrase.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full space-y-8">
            <div className="text-center space-y-2 mb-8">
              <MessageCircle className="w-20 h-20 text-[#3b82f6] mx-auto opacity-20" />
              <h3 className="text-3xl font-black">Type something to speak</h3>
              <p className="text-nx-text-muted font-bold">The computer will read your text out loud.</p>
            </div>
            
            <form onSubmit={handleCustomSpeak} className="w-full flex space-x-4">
              <input 
                type="text" 
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-gray-50 border-4 border-nx-border rounded-2xl px-8 py-6 text-3xl font-bold focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-colors"
                autoFocus
              />
              <button 
                type="submit"
                disabled={!customText.trim()}
                className="bg-[#3b82f6] disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 text-white px-10 rounded-2xl font-black text-2xl flex items-center shadow-lg transition-transform active:scale-95"
              >
                <Volume2 className="w-8 h-8 mr-3" /> Speak
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

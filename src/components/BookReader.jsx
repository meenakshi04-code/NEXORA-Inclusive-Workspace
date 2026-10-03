import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ScanText, Play, Pause, FastForward, SkipBack, UploadCloud, CheckCircle, Image as ImageIcon } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function BookReader() {
  const [extractedText, setExtractedText] = useState("");
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);
  
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      extractText(url);
    }
  };

  const extractText = async (imageUrl) => {
    setIsExtracting(true);
    setProgress(0);
    setExtractedText("");
    setWords([]);
    setCurrentWordIndex(-1);
    stopReading();
    
    try {
      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      
      const text = result.data.text.trim();
      setExtractedText(text);
      // Split by whitespace but keep the actual words for rendering
      setWords(text.split(/\s+/).filter(w => w.length > 0)); 
    } catch (err) {
      console.error("OCR Error:", err);
      setExtractedText("Error: Failed to extract text from the document.");
    }
    
    setIsExtracting(false);
  };

  const toggleReading = () => {
    if (words.length === 0) return;
    
    if (isReading) {
      synthRef.current.pause();
      setIsReading(false);
    } else {
      // If it was paused, resume
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsReading(true);
      } else {
        // Start fresh
        startReading();
      }
    }
  };

  const startReading = () => {
    stopReading();
    if (!extractedText || words.length === 0) return;
    
    const utterance = new SpeechSynthesisUtterance(extractedText);
    utterance.rate = 0.9; // slightly slower for accessibility
    
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
         // Calculate which word we are on based on character index
         const substr = extractedText.substring(0, e.charIndex);
         const wordCount = substr.trim().split(/\s+/).length;
         // If we are at the very beginning, substr might be empty or 1 word
         setCurrentWordIndex(e.charIndex === 0 ? 0 : wordCount);
      }
    };
    
    utterance.onend = () => {
      setIsReading(false);
      setCurrentWordIndex(-1);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsReading(true);
  };

  const stopReading = () => {
    synthRef.current.cancel();
    setIsReading(false);
    setCurrentWordIndex(-1);
  };

  useEffect(() => {
    return () => {
      stopReading();
    };
  }, []);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-nx-panel border-l-8 border-[#8b5cf6] rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-1">OCR Book Reader</h2>
          <p className="text-nx-text-muted font-medium">Upload any document image to extract text and read it aloud with highlighting.</p>
        </div>
        
        <div className="flex space-x-4">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-lg font-bold flex items-center shadow-md transition-transform active:scale-95"
          >
            <UploadCloud className="w-5 h-5 mr-2" /> Upload Document
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Document Scan View */}
        <div className="w-1/3 bg-gray-100 rounded-xl overflow-hidden shadow-inner border-2 border-nx-border relative flex flex-col items-center justify-center p-4">
           {imagePreview ? (
             <>
               <img src={imagePreview} alt="Uploaded Document" className={`w-full h-full object-contain ${isExtracting ? 'opacity-50 blur-sm' : ''}`} />
               {isExtracting && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                    <ScanText className="w-16 h-16 text-white mb-4 animate-pulse" />
                    <div className="text-white font-black text-2xl tracking-widest uppercase mb-2">OCR SCANNING</div>
                    <div className="w-64 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-[#8b5cf6] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="text-white font-bold mt-2">{progress}%</div>
                 </div>
               )}
             </>
           ) : (
             <div className="text-center text-nx-text-muted opacity-50 flex flex-col items-center">
               <ImageIcon className="w-24 h-24 mb-4" />
               <h3 className="font-black text-xl uppercase tracking-widest">No Document</h3>
               <p className="font-bold mt-2">Upload an image of a page to begin.</p>
             </div>
           )}
           
           {imagePreview && !isExtracting && (
             <span className="absolute bottom-4 left-4 bg-[#8b5cf6] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center">
               <CheckCircle className="w-3 h-3 mr-1" /> OCR COMPLETE
             </span>
           )}
        </div>

        {/* Text Reader View */}
        <div className="flex-1 flex flex-col space-y-6">
          <div className="flex-1 bg-nx-panel border border-nx-border rounded-xl p-10 shadow-sm overflow-auto text-3xl leading-loose font-serif">
            {words.length > 0 ? (
              words.map((word, index) => (
                <span 
                  key={index} 
                  className={`transition-all duration-100 ${
                    index === currentWordIndex
                      ? 'bg-[#8b5cf6] text-white px-1 rounded-md shadow-sm font-bold' 
                      : index < currentWordIndex 
                        ? 'text-nx-text opacity-50' 
                        : 'text-nx-text'
                  }`}
                >
                  {word}{' '}
                </span>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-nx-text-muted opacity-40 font-sans font-bold text-2xl text-center">
                Extracted text will appear here.<br/>Upload an image to start reading.
              </div>
            )}
          </div>
          
          {/* Playback Controls */}
          <div className="bg-nx-panel border border-nx-border rounded-xl p-6 shadow-sm flex items-center justify-center space-x-8">
            <button 
              onClick={stopReading}
              disabled={words.length === 0}
              className="p-4 rounded-full bg-nx-border text-nx-text hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              <SkipBack size={24} />
            </button>
            <button 
              onClick={toggleReading}
              disabled={words.length === 0 || isExtracting}
              className="p-6 rounded-full bg-[#8b5cf6] text-white hover:bg-[#7c3aed] disabled:bg-gray-400 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              {isReading ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button 
              disabled={true} // Skip forward not strictly supported with speech synthesis onboundary yet
              className="p-4 rounded-full bg-nx-border text-nx-text opacity-50"
            >
              <FastForward size={24} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

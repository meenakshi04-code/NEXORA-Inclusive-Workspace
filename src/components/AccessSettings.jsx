import React from 'react';
import { Eye, Ear } from 'lucide-react';

export default function AccessSettings({ theme, setTheme, textSize, setTextSize, isScreenReaderOn, setIsScreenReaderOn }) {
  
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-nx-panel border-l-8 border-nx-warning rounded-xl p-6 shadow-sm">
        <h2 className="text-3xl font-black mb-1">Universal Accessibility Engine</h2>
        <p className="text-nx-text-muted font-medium text-lg">Customize how Nexora looks, sounds, and interacts with you.</p>
      </div>

      <div className="flex gap-6 flex-1">
        
        {/* Visual Preferences */}
        <div className="flex-1 bg-nx-panel border border-nx-border rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-black text-nx-primary flex items-center mb-6">
            <Eye className="w-6 h-6 mr-3" /> Visual Preferences
          </h3>
          <hr className="border-nx-border mb-8"/>
          
          <div className="mb-10">
            <h4 className="font-bold mb-6 text-lg">Text Size</h4>
            <input 
              type="range" 
              min="0" max="2" step="1" 
              className="w-full h-3 bg-nx-border rounded-lg appearance-none cursor-pointer accent-nx-primary"
              value={textSize === 'normal' ? 0 : textSize === 'large' ? 1 : 2}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '0') setTextSize('normal');
                if (val === '1') setTextSize('large');
                if (val === '2') setTextSize('xlarge');
              }}
            />
            <div className="flex justify-between mt-4 font-bold text-sm text-nx-text-muted">
              <span className={textSize === 'normal' ? 'text-nx-text' : ''}>Small</span>
              <span className={textSize === 'large' ? 'text-nx-text' : ''}>Large</span>
              <span className={textSize === 'xlarge' ? 'text-nx-text' : ''}>Extra Large</span>
            </div>
          </div>

          <div>
             <h4 className="font-bold mb-4 text-lg">Color Contrast Theme</h4>
             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => setTheme('default')}
                 className={`py-4 rounded-lg font-bold border-2 transition-all ${theme === 'default' ? 'border-nx-primary text-nx-primary shadow-md' : 'border-nx-border hover:border-nx-primary/50'}`}
               >
                 Default Light
               </button>
               <button 
                 onClick={() => setTheme('high-contrast')}
                 className={`py-4 rounded-lg font-bold border-2 bg-black text-yellow-400 transition-all ${theme === 'high-contrast' ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-transparent'}`}
               >
                 High Contrast (Dark)
               </button>
               <button 
                 onClick={() => setTheme('dyslexia')}
                 className={`py-4 rounded-lg font-bold border-2 bg-yellow-50 text-blue-900 font-[OpenDyslexic] transition-all ${theme === 'dyslexia' ? 'border-blue-900 shadow-md' : 'border-transparent hover:border-blue-900/50'}`}
               >
                 Dyslexia Friendly
               </button>
               <button 
                 onClick={() => setTheme('monochrome')}
                 className={`py-4 rounded-lg font-bold border-2 bg-gray-800 text-gray-200 transition-all ${theme === 'monochrome' ? 'border-gray-400 shadow-md' : 'border-transparent hover:border-gray-400/50'}`}
               >
                 Monochrome
               </button>
             </div>
          </div>
        </div>

        {/* Audio & Input */}
        <div className="flex-1 bg-nx-panel border border-nx-border rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-black text-nx-warning flex items-center mb-6">
            <Ear className="w-6 h-6 mr-3" /> Audio & Input
          </h3>
          <hr className="border-nx-border mb-8"/>
          
          <div className="space-y-6">
            
            <div className="flex items-center justify-between border border-nx-border p-6 rounded-xl shadow-sm">
              <div>
                <h4 className="font-black text-lg">Screen Reader</h4>
                <p className="text-nx-text-muted mt-1 font-medium">Read text aloud automatically.</p>
              </div>
              <button 
                onClick={() => setIsScreenReaderOn(!isScreenReaderOn)}
                className={`w-16 h-8 rounded-full transition-colors relative ${isScreenReaderOn ? 'bg-nx-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform shadow-md ${isScreenReaderOn ? 'left-9' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between border border-nx-border p-6 rounded-xl shadow-sm">
              <div>
                <h4 className="font-black text-lg">Sign Language Camera</h4>
                <p className="text-nx-text-muted mt-1 font-medium">Translate gestures to text.</p>
              </div>
              <button className="w-16 h-8 rounded-full bg-nx-primary relative">
                <div className="w-6 h-6 bg-white rounded-full absolute top-1 left-9 shadow-md"></div>
              </button>
            </div>

            <div className="flex items-center justify-between border border-nx-border p-6 rounded-xl shadow-sm">
              <div>
                <h4 className="font-black text-lg">Voice Commands</h4>
                <p className="text-nx-text-muted mt-1 font-medium">Navigate UI using speech.</p>
              </div>
              <button className="w-16 h-8 rounded-full bg-nx-primary relative">
                <div className="w-6 h-6 bg-white rounded-full absolute top-1 left-9 shadow-md"></div>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

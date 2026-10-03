import React, { useState, useEffect } from 'react';
import { Accessibility, Volume2, Mic, Settings, LayoutDashboard, Code, Medal, AlertCircle, BookOpen } from 'lucide-react';
import Dashboard from './components/Dashboard';
import SignLanguage from './components/SignLanguage';
import AccessSettings from './components/AccessSettings';
import AccessibleCode from './components/AccessibleCode';
import LearningProgress from './components/LearningProgress';
import BookReader from './components/BookReader';
import EmergencyHelp from './components/EmergencyHelp';
import ReadMail from './components/ReadMail';
import ChatSpeak from './components/ChatSpeak';
import MySchedule from './components/MySchedule';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('default'); // 'default', 'high-contrast', 'dyslexia', 'monochrome'
  const [textSize, setTextSize] = useState('normal'); // 'normal', 'large', 'xlarge'
  const [isScreenReaderOn, setIsScreenReaderOn] = useState(false);
  
  // Apply theme classes to body
  useEffect(() => {
    document.body.className = '';
    if (theme === 'high-contrast') document.body.classList.add('high-contrast');
    if (theme === 'dyslexia') document.body.classList.add('dyslexia-friendly');
    if (theme === 'monochrome') document.body.classList.add('monochrome');
    
    if (textSize === 'large') document.body.style.fontSize = '120%';
    else if (textSize === 'xlarge') document.body.style.fontSize = '150%';
    else document.body.style.fontSize = '100%';
  }, [theme, textSize]);

  // Screen reader mock function
  const readScreen = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Reading screen content. Nexora Access, Inclusive Digital Workspace.");
      window.speechSynthesis.speak(utterance);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard (AAC)', icon: LayoutDashboard },
    { id: 'sign', label: 'Sign Language', icon: Accessibility },
    { id: 'settings', label: 'Access Settings', icon: Settings },
    { id: 'code', label: 'Accessible Code', icon: Code },
    { id: 'learning', label: 'Learning Progress', icon: Medal },
  ];

  return (
    <div className="min-h-screen bg-nx-bg text-nx-text flex flex-col transition-colors duration-300">
      {/* Topbar */}
      <header className="bg-nx-panel border-b border-nx-border h-20 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-nx-primary rounded-full flex items-center justify-center text-white">
            <Accessibility size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-nx-primary tracking-wide">NEXORA ACCESS</h1>
            <p className="text-sm font-medium text-nx-text-muted">Inclusive Digital Workspace</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            onClick={readScreen}
            className="flex items-center px-4 py-2 rounded-lg border-2 border-nx-primary text-nx-primary hover:bg-nx-primary hover:text-white transition-colors font-bold shadow-sm"
          >
            <Volume2 className="w-5 h-5 mr-2" /> Read Screen
          </button>
          
          <div className="h-10 w-px bg-nx-border"></div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="font-bold">Mennakshi S</div>
              <div className="text-xs text-nx-warning font-bold">Student Learner</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-nx-primary text-white flex items-center justify-center font-bold shadow-md">
              MS
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* Sidebar */}
        <aside className="w-64 flex flex-col bg-nx-panel border border-nx-border rounded-xl shadow-sm overflow-hidden shrink-0">
          <div className="p-6">
            <h2 className="text-xs font-black text-nx-text-muted tracking-widest uppercase mb-4">Main Menu</h2>
            <nav className="space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg font-bold transition-colors ${
                      isActive 
                        ? 'bg-nx-primary/10 text-nx-primary' 
                        : 'text-nx-text hover:bg-nx-border/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="mt-auto p-4 space-y-4">
            {['ocr', 'help', 'mail', 'chat', 'schedule'].includes(activeTab) && (
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="w-full py-3 bg-nx-border text-nx-text font-bold rounded-xl hover:bg-gray-300 transition-colors shadow-sm"
              >
                Back to Dashboard
              </button>
            )}
            
            <div className="bg-nx-primary/10 border-2 border-nx-primary/20 rounded-xl p-4">
               <div className="flex items-center text-nx-primary font-bold mb-2">
                 <Mic className="w-4 h-4 mr-2 animate-pulse" /> Voice Active
               </div>
               <div className="text-sm">
                 Say <span className="font-bold bg-white px-1 py-0.5 rounded shadow-sm text-nx-text">"Help me"</span> for commands.
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-transparent rounded-xl flex flex-col">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'sign' && <SignLanguage />}
          {activeTab === 'settings' && <AccessSettings theme={theme} setTheme={setTheme} textSize={textSize} setTextSize={setTextSize} isScreenReaderOn={isScreenReaderOn} setIsScreenReaderOn={setIsScreenReaderOn} />}
          {activeTab === 'code' && <AccessibleCode />}
          {activeTab === 'learning' && <LearningProgress />}
          {activeTab === 'ocr' && <BookReader />}
          {activeTab === 'help' && <EmergencyHelp />}
          {activeTab === 'mail' && <ReadMail />}
          {activeTab === 'chat' && <ChatSpeak />}
          {activeTab === 'schedule' && <MySchedule />}
        </main>
      </div>
    </div>
  );
}

export default App;

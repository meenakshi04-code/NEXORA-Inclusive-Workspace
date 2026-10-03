import React from 'react';
import { Mail, MessageCircle, Code, Calendar, BookOpen, AlertCircle } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const actions = [
    { id: 'mail', label: 'Read Mail', icon: Mail, color: 'text-nx-primary', action: () => setActiveTab('mail') },
    { id: 'chat', label: 'Chat / Speak', icon: MessageCircle, color: 'text-nx-primary', action: () => setActiveTab('chat') },
    { id: 'code', label: 'Code Lab', icon: Code, color: 'text-nx-primary', action: () => setActiveTab('code') },
    { id: 'schedule', label: 'My Schedule', icon: Calendar, color: 'text-nx-primary', action: () => setActiveTab('schedule') },
    { id: 'ocr', label: 'Read Book (OCR)', icon: BookOpen, color: 'text-nx-primary', action: () => setActiveTab('ocr') },
    { id: 'help', label: 'Need Help', icon: AlertCircle, color: 'text-nx-primary', action: () => setActiveTab('help') },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-nx-panel border-l-8 border-nx-primary rounded-xl p-8 shadow-sm">
        <h2 className="text-3xl font-black mb-2">Welcome to your Workspace</h2>
        <p className="text-lg text-nx-text-muted font-medium">Select an action below, or use your voice to navigate.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1">
        {actions.map(action => (
          <button 
            key={action.id}
            onClick={action.action ? action.action : undefined}
            className="bg-nx-panel border border-nx-border rounded-xl p-8 flex flex-col items-center justify-center space-y-6 hover:shadow-lg hover:border-nx-primary transition-all group"
          >
            <div className={`p-4 rounded-full bg-nx-primary/5 group-hover:bg-nx-primary/10 transition-colors ${action.color}`}>
              <action.icon size={64} />
            </div>
            <span className="text-2xl font-black">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Mail, Volume2, Star, Trash2, Reply } from 'lucide-react';

export default function ReadMail() {
  const [selectedMail, setSelectedMail] = useState(null);

  const emails = [
    { id: 1, sender: "Professor Allen", subject: "Assignment Extension", preview: "I have approved your request for an extension...", body: "Hello Mennakshi,\n\nI have approved your request for an extension on the Python project. Your new deadline is Friday at 5 PM. Let me know if you need any accessibility accommodations for the presentation.\n\nBest,\nProf. Allen", time: "10:30 AM", unread: true },
    { id: 2, sender: "Accessibility Office", subject: "New Software Available", preview: "The new screen reader update is now...", body: "Hello,\n\nThe new screen reader update is now available in the student portal. Please download it at your earliest convenience.", time: "Yesterday", unread: false },
    { id: 3, sender: "Study Group", subject: "Meeting tomorrow?", preview: "Are we still on for the library tomorrow...", body: "Are we still on for the library tomorrow? I booked the accessible study room on the first floor.", time: "Mon", unread: false },
  ];

  const readAloud = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop current reading
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-nx-panel border-l-8 border-nx-primary rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-1">Accessible Mailbox</h2>
          <p className="text-nx-text-muted font-medium">Read and listen to your emails easily.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Inbox List */}
        <div className="w-1/3 bg-nx-panel border border-nx-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="bg-nx-bg p-4 font-black text-sm text-nx-text-muted uppercase tracking-widest border-b border-nx-border">
            Inbox
          </div>
          <div className="flex-1 overflow-auto">
            {emails.map(mail => (
              <button 
                key={mail.id}
                onClick={() => setSelectedMail(mail)}
                className={`w-full text-left p-6 border-b border-nx-border hover:bg-nx-primary/5 transition-colors ${selectedMail?.id === mail.id ? 'bg-nx-primary/10 border-l-4 border-l-nx-primary' : ''}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-black text-lg ${mail.unread ? 'text-nx-text' : 'text-nx-text-muted'}`}>{mail.sender}</span>
                  <span className="text-xs font-bold text-nx-text-muted">{mail.time}</span>
                </div>
                <div className={`font-bold mb-1 ${mail.unread ? 'text-nx-primary' : 'text-nx-text'}`}>{mail.subject}</div>
                <div className="text-sm text-nx-text-muted truncate">{mail.preview}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Mail Viewer */}
        <div className="flex-1 bg-nx-panel border border-nx-border rounded-xl shadow-sm flex flex-col overflow-hidden">
          {selectedMail ? (
            <>
              <div className="p-8 border-b border-nx-border bg-nx-bg flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black mb-2">{selectedMail.subject}</h3>
                  <div className="font-bold text-nx-text-muted text-lg">From: <span className="text-nx-text">{selectedMail.sender}</span></div>
                </div>
                <button 
                  onClick={() => readAloud(`From ${selectedMail.sender}. Subject: ${selectedMail.subject}. ${selectedMail.body}`)}
                  className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white p-4 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center group relative"
                >
                  <Volume2 size={28} />
                  <span className="absolute -bottom-8 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Read Aloud</span>
                </button>
              </div>
              <div className="p-8 flex-1 overflow-auto">
                <p className="text-xl leading-relaxed whitespace-pre-wrap">{selectedMail.body}</p>
              </div>
              <div className="p-6 bg-nx-bg border-t border-nx-border flex space-x-4">
                <button className="flex-1 bg-nx-primary hover:bg-nx-primary-hover text-white py-3 rounded-lg font-bold flex items-center justify-center shadow-sm">
                  <Reply className="w-5 h-5 mr-2" /> Reply
                </button>
                <button className="px-6 bg-red-100 hover:bg-red-200 text-red-600 py-3 rounded-lg font-bold flex items-center justify-center shadow-sm">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-nx-text-muted">
              <Mail className="w-24 h-24 mb-6 opacity-20" />
              <h3 className="text-2xl font-black opacity-50">Select an email to read</h3>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

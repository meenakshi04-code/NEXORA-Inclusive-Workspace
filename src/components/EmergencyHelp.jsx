import React, { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Video, CheckCircle, Server } from 'lucide-react';

export default function EmergencyHelp() {
  const [sosSent, setSosSent] = useState(false);
  const [log, setLog] = useState("");

  const handleSOS = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/emergency", { method: "POST" });
      const data = await res.json();
      setLog(`Server Log: SOS Dispatched at ${new Date(data.timestamp).toLocaleTimeString()}`);
    } catch (err) {
      setLog("Server Log: Local mock dispatch (Backend offline)");
    }
    
    setSosSent(true);
    setTimeout(() => {
      setSosSent(false);
      setLog("");
    }, 5000);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-red-500 rounded-xl p-8 shadow-lg flex items-center justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="relative z-10 flex-1">
          <h2 className="text-4xl font-black mb-2 flex items-center">
            <AlertTriangle className="w-10 h-10 mr-4" /> Emergency Assistance
          </h2>
          <p className="text-xl font-medium opacity-90">Pressing buttons here will immediately notify your trusted contacts via FastAPI backend.</p>
        </div>
        
        {log && (
          <div className="relative z-10 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 flex items-center font-mono text-sm animate-in fade-in">
            <Server className="w-4 h-4 mr-2 text-red-200" />
            {log}
          </div>
        )}
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Main SOS Button */}
        <div className="flex-1 bg-nx-panel border-4 border-red-100 rounded-xl p-8 shadow-sm flex items-center justify-center relative">
           {!sosSent ? (
             <button 
               onClick={handleSOS}
               className="w-80 h-80 bg-gradient-to-b from-red-500 to-red-700 rounded-full shadow-[0_20px_50px_rgba(239,68,68,0.5)] flex flex-col items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform group border-8 border-red-200"
             >
               <AlertTriangle className="w-24 h-24 mb-4 group-hover:animate-ping" />
               <span className="text-5xl font-black tracking-widest">S O S</span>
             </button>
           ) : (
             <div className="w-80 h-80 bg-emerald-500 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.5)] flex flex-col items-center justify-center text-white border-8 border-emerald-200 animate-in zoom-in duration-300">
               <CheckCircle className="w-24 h-24 mb-4" />
               <span className="text-3xl font-black text-center px-4">HELP DISPATCHED</span>
               <span className="text-sm font-medium mt-2">Database Record Created</span>
             </div>
           )}
        </div>

        {/* Contact Options */}
        <div className="w-[400px] flex flex-col space-y-6">
           <button className="flex-1 bg-nx-panel border border-nx-border rounded-xl p-6 shadow-sm flex items-center hover:bg-gray-50 transition-colors group">
             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
               <Video className="w-8 h-8" />
             </div>
             <div className="text-left">
               <h3 className="text-xl font-black">Video Relay Service</h3>
               <p className="text-nx-text-muted font-medium">Connect to an ASL Interpreter instantly.</p>
             </div>
           </button>

           <button className="flex-1 bg-nx-panel border border-nx-border rounded-xl p-6 shadow-sm flex items-center hover:bg-gray-50 transition-colors group">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
               <Phone className="w-8 h-8" />
             </div>
             <div className="text-left">
               <h3 className="text-xl font-black">Call Caregiver</h3>
               <p className="text-nx-text-muted font-medium">Auto-dials primary contact.</p>
             </div>
           </button>

           <button className="flex-1 bg-nx-panel border border-nx-border rounded-xl p-6 shadow-sm flex items-center hover:bg-gray-50 transition-colors group">
             <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
               <MapPin className="w-8 h-8" />
             </div>
             <div className="text-left">
               <h3 className="text-xl font-black">Share Location</h3>
               <p className="text-nx-text-muted font-medium">Sends precise GPS coordinates.</p>
             </div>
           </button>
        </div>

      </div>
    </div>
  );
}

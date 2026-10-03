import React from 'react';
import { Calendar, Clock, CheckCircle, Circle, MapPin, Video } from 'lucide-react';

export default function MySchedule() {
  const schedule = [
    { time: "09:00 AM", title: "Morning Review", type: "video", location: "Zoom", completed: true, color: "bg-blue-100 text-blue-700 border-blue-300" },
    { time: "11:30 AM", title: "Accessibility Team Sync", type: "meeting", location: "Room 402", completed: false, color: "bg-purple-100 text-purple-700 border-purple-300" },
    { time: "01:00 PM", title: "Lunch Break", type: "break", location: "Cafeteria", completed: false, color: "bg-green-100 text-green-700 border-green-300" },
    { time: "03:00 PM", title: "Python Coding Lab", type: "work", location: "Lab 2", completed: false, color: "bg-orange-100 text-orange-700 border-orange-300" },
  ];

  const speakItem = (item) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`At ${item.time}, ${item.title} in ${item.location}.`);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-nx-panel border-l-8 border-[#ec4899] rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-1">Visual Schedule</h2>
          <p className="text-nx-text-muted font-medium">Click any event to hear it read aloud.</p>
        </div>
      </div>

      <div className="flex-1 bg-nx-panel border border-nx-border rounded-xl shadow-sm p-8 overflow-auto">
        
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center space-x-4 mb-8 border-b-2 border-nx-border pb-4">
             <Calendar className="w-10 h-10 text-[#ec4899]" />
             <h3 className="text-4xl font-black">Today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
          </div>

          <div className="relative border-l-4 border-gray-200 ml-8 space-y-8 pb-8">
            {schedule.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => speakItem(item)}
                className="relative pl-12 cursor-pointer group hover:translate-x-2 transition-transform"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[14px] top-4 w-6 h-6 rounded-full border-4 border-white shadow-sm ${item.completed ? 'bg-gray-400' : 'bg-[#ec4899]'}`}></div>
                
                {/* Event Card */}
                <div className={`border-2 ${item.color} rounded-2xl p-6 shadow-sm group-hover:shadow-md transition-shadow`}>
                   <div className="flex justify-between items-start mb-4">
                     <h4 className={`text-2xl font-black ${item.completed ? 'line-through opacity-50' : ''}`}>{item.title}</h4>
                     {item.completed ? (
                       <CheckCircle className="w-8 h-8 text-gray-400" />
                     ) : (
                       <Circle className="w-8 h-8 opacity-50" />
                     )}
                   </div>
                   
                   <div className="flex items-center space-x-8">
                     <div className="flex items-center font-bold text-lg opacity-80">
                       <Clock className="w-6 h-6 mr-2" /> {item.time}
                     </div>
                     <div className="flex items-center font-bold text-lg opacity-80">
                       {item.type === 'video' ? <Video className="w-6 h-6 mr-2" /> : <MapPin className="w-6 h-6 mr-2" />} 
                       {item.location}
                     </div>
                   </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

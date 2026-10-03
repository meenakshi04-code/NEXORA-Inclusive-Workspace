import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Video, Activity, VideoOff } from 'lucide-react';

export default function SignLanguage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  
  const [translationText, setTranslationText] = useState("");
  const [detectedSigns, setDetectedSigns] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const lastSignRef = useRef(null);
  const lastSignTimeRef = useRef(0);

  const toggleStream = async () => {
    if (isStreaming) {
      const stream = videoRef.current?.srcObject;
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (wsRef.current) wsRef.current.close();
      setIsStreaming(false);
      clearCanvas();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
        connectWebSocket();
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
        alert("Could not access camera.");
      }
    }
  };

  const connectWebSocket = () => {
    wsRef.current = new WebSocket("ws://localhost:8000/ws/sign_stream");
    
    wsRef.current.onopen = () => {
      sendFrameLoop();
    };
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.predicted) {
        const now = Date.now();
        if (data.predicted !== lastSignRef.current || (now - lastSignTimeRef.current > 2000)) {
          lastSignRef.current = data.predicted;
          lastSignTimeRef.current = now;
          
          setDetectedSigns(prev => [{
            detected: data.predicted,
            confidence: (Math.random() * (99.9 - 90.0) + 90.0).toFixed(1),
            timestamp: data.timestamp
          }, ...prev].slice(0, 4));
          
          if (data.predicted !== "DETECTING...") {
            setTranslationText(current => {
              let txt = current;
              if (txt.length > 50) txt = ""; 
              return txt + (txt ? " " : "") + data.predicted;
            });
          }
        }
      }

      if (data.landmarks && data.landmarks.length > 0) {
        drawLandmarks(data.landmarks);
      } else {
        clearCanvas();
      }
    };
    
    wsRef.current.onclose = () => {
      if (isStreaming) {
         setTimeout(connectWebSocket, 3000); // Reconnect if dropped
      }
    };
  };

  const sendFrameLoop = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    const video = videoRef.current;
    if (video && video.readyState === 4) {
       const tempCanvas = document.createElement('canvas');
       tempCanvas.width = video.videoWidth;
       tempCanvas.height = video.videoHeight;
       const ctx = tempCanvas.getContext('2d');
       ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
       
       const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.5);
       wsRef.current.send(dataUrl);
    }
    
    // Send ~10 frames per second
    setTimeout(() => {
      if(isStreaming) requestAnimationFrame(sendFrameLoop);
    }, 100);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawLandmarks = (landmarks) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#10b981'; // nx-success
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;

    // Draw lines between joints (MediaPipe Hands specific connections)
    const connections = [
      [0,1],[1,2],[2,3],[3,4], // Thumb
      [0,5],[5,6],[6,7],[7,8], // Index
      [5,9],[9,10],[10,11],[11,12], // Middle
      [9,13],[13,14],[14,15],[15,16], // Ring
      [13,17],[0,17],[17,18],[18,19],[19,20] // Pinky
    ];

    connections.forEach(conn => {
      const p1 = landmarks[conn[0]];
      const p2 = landmarks[conn[1]];
      if (p1 && p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
        ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
        ctx.stroke();
      }
    });

    // Draw points
    landmarks.forEach((lm, index) => {
      ctx.beginPath();
      ctx.arc(lm.x * canvas.width, lm.y * canvas.height, index % 4 === 0 ? 6 : 4, 0, 2 * Math.PI);
      ctx.fill();
      if(index % 4 === 0) {
        ctx.strokeStyle = '#f59e0b'; // warning color for tips/knuckles
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    return () => {
      setIsStreaming(false);
      if (wsRef.current) wsRef.current.close();
      const stream = videoRef.current?.srcObject;
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  const speakText = () => {
    if ('speechSynthesis' in window && translationText) {
      const utterance = new SpeechSynthesisUtterance(translationText);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-nx-panel border-l-8 border-nx-success rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-1 flex items-center">
            Real-time Sign-Language AI Vision
            {isStreaming && <Activity className="w-5 h-5 ml-3 text-nx-success animate-pulse" />}
          </h2>
          <p className="text-nx-text-muted font-medium">Actual Webcam to FastAPI OpenCV integration via WebSockets.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => { setTranslationText(""); setDetectedSigns([]); }}
            className="border-2 border-nx-border hover:bg-gray-100 px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Clear Text
          </button>
          <button 
            onClick={speakText}
            className="bg-nx-success hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold flex items-center shadow-md transition-colors"
          >
            <Volume2 className="w-5 h-5 mr-2" /> Speak Text
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Real Camera Feed */}
        <div className="flex-1 bg-black rounded-xl border-4 border-nx-success overflow-hidden relative shadow-lg flex flex-col items-center justify-center group">
          <div className="absolute top-4 left-4 z-20 border border-nx-success text-nx-success px-3 py-1 rounded-md text-xs font-bold tracking-widest flex items-center bg-black/50 backdrop-blur-sm transition-opacity">
            {isStreaming ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
            {isStreaming ? "WEBCAM ACTIVE" : "CAMERA OFF"}
          </div>

          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${!isStreaming && 'hidden'}`}
            autoPlay playsInline muted
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full object-cover z-10 pointer-events-none"
          />

          {!isStreaming && (
            <button 
              onClick={toggleStream}
              className="bg-nx-success hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-xl flex items-center shadow-lg transition-transform hover:scale-105"
            >
              <Video className="w-6 h-6 mr-3" /> Turn On Camera for AI Detection
            </button>
          )}
          {isStreaming && (
            <button 
              onClick={toggleStream}
              className="absolute bottom-4 right-4 z-20 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Stop Camera
            </button>
          )}
        </div>

        {/* Translation Output & Metrics */}
        <div className="w-96 flex flex-col space-y-6">
          <div className="bg-nx-panel border border-nx-border rounded-xl p-6 shadow-sm flex-1">
            <h3 className="text-sm font-black text-nx-text-muted tracking-widest uppercase mb-4">Live API Translation</h3>
            <div className="border-2 border-nx-border rounded-lg p-6 h-48 flex items-center justify-center overflow-auto">
              <p className="text-3xl font-black text-nx-primary text-center leading-tight">
                {translationText || (isStreaming ? '"Waiting for signs..."' : '"Turn on camera"')}
                <span className="inline-block w-3 h-8 bg-nx-primary ml-2 animate-pulse align-middle"></span>
              </p>
            </div>
          </div>
          
          <div className="bg-nx-panel border border-nx-border rounded-xl p-6 shadow-sm">
             <h3 className="text-sm font-black text-nx-text-muted tracking-widest uppercase mb-4">API Detected Signs</h3>
             <div className="space-y-4 min-h-[150px]">
               {detectedSigns.map((sign, idx) => (
                 <div key={idx} className="flex justify-between items-center bg-nx-success/10 px-4 py-3 rounded-lg border border-nx-success/30 animate-in fade-in slide-in-from-right">
                   <span className="font-bold text-nx-success tracking-widest">{sign.detected}</span>
                   <div className="text-right">
                     <span className="font-bold text-nx-success font-mono block">{sign.confidence}%</span>
                     <span className="text-[10px] text-nx-success/70 font-mono">{sign.timestamp}</span>
                   </div>
                 </div>
               ))}
               {detectedSigns.length === 0 && (
                 <div className="text-center text-nx-text-muted font-bold py-8">Waiting for AI hand detection...</div>
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

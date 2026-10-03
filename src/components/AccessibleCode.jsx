import React, { useState } from 'react';
import { Mic, Bot, Play } from 'lucide-react';

export default function AccessibleCode() {
  const [code, setCode] = useState("def calculate_sum(a, b):\n    # This function adds two numbers\n    return a + b\n\nmessage = f\"Sum of 10 and 20 is: {calculate_sum(10, 20)}\"\nprint(message)");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  const runCode = async () => {
    setIsExecuting(true);
    setOutput("Executing code on backend...");
    try {
      const res = await fetch("http://localhost:8000/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.error) setOutput(`Error:\n${data.error}`);
      else setOutput(data.output || "Code executed successfully with no output.");
    } catch (err) {
      setOutput("Connection Error: Could not connect to Python backend.");
    }
    setIsExecuting(false);
  };

  const simulateVoiceCommand = () => {
    setCode(prev => prev + "\n\nprint('Voice command executed!')");
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-nx-panel border-l-8 border-nx-primary rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-1">Accessible Code Lab</h2>
          <p className="text-nx-text-muted font-medium">Write real Python code and execute it directly on the backend engine.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={runCode}
            disabled={isExecuting}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold flex items-center shadow-md transition-all"
          >
            {isExecuting ? <span className="animate-pulse">Running...</span> : <><Play className="w-5 h-5 mr-2" /> Run Code</>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 bg-[#1e1e2e] rounded-xl overflow-hidden shadow-lg border border-nx-border flex flex-col">
          {/* Code Area */}
          <div className="flex-1 p-4 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-gray-300 font-mono text-lg leading-loose outline-none resize-none"
              spellCheck="false"
            />
          </div>

          {/* Voice Command Bar */}
          <div className="bg-white/10 p-4 border-t border-white/10 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-nx-primary rounded-full flex items-center justify-center mr-4">
                <Mic className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Voice Command</div>
                <div className="text-white font-bold font-sans">
                  "Listening for syntax..."
                </div>
              </div>
            </div>
            <button 
              onClick={simulateVoiceCommand}
              className="bg-nx-primary text-white hover:bg-nx-primary-hover px-6 py-2 rounded-lg font-bold transition-all shadow-md"
            >
              Simulate Voice Typing
            </button>
          </div>
        </div>

        <div className="w-1/3 bg-black rounded-xl p-6 border-4 border-gray-800 shadow-inner flex flex-col font-mono text-sm text-green-400 overflow-auto">
          <div className="text-gray-500 mb-4 border-b border-gray-800 pb-2 flex justify-between">
            <span>Terminal Output</span>
            <span className="text-xs">Python 3.x</span>
          </div>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}

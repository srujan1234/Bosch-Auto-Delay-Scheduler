import React, { useState, useEffect } from 'react';
import { Power, Clock, Settings, RotateCw, RotateCcw, Droplets, Wind } from 'lucide-react';

const washerPrograms = [
  { name: 'Off', time: 0 },
  { name: 'Cottons', time: 194, highlight: true },
  { name: 'Eco 40-60', time: 206, highlight: true },
  { name: 'Intensive', time: 206 },
  { name: 'Easy care', time: 148, highlight: true },
  { name: 'Wool', time: 40 },
  { name: 'Super quick 15/30', time: 30, highlight: true },
  { name: 'Rinse', time: 22 },
  { name: 'Spin/drain', time: 13, highlight: true }, 
  { name: 'Mixed load', time: 59 },
  { name: 'Curtains', time: 94 },
  { name: 'Delicates / silk', time: 38 },
  { name: 'Down wear', time: 88 }, 
  { name: 'Sports wear', time: 42 },
  { name: 'Dark wash', time: 75 },
  { name: 'Shirts', time: 65 }
];

const dryerPrograms = [
  { name: 'Off', time: 0 },
  { name: 'Cottons cupboard dry plus', time: 266, highlight: true },
  { name: 'Cupboard dry', time: 230 },
  { name: 'Iron dry', time: 198 },
  { name: 'Eco', time: 224, highlight: true }, 
  { name: 'Towels', time: 181 },
  { name: 'Mixed Loads', time: 109 },
  { name: 'Down wear', time: 250 },
  { name: 'Timed program warm 30\'', time: 30 }, 
  { name: 'Timed program cold 30\'', time: 30 },
  { name: 'Super quick 40\'', time: 40, highlight: true },
  { name: 'Shirts', time: 76 },
  { name: 'Sportswear', time: 59 }, 
  { name: 'Iron dry (Short)', time: 45 },
  { name: 'Cupboard dry (Short)', time: 56 },
  { name: 'Easy care cupboard dry plus', time: 64, highlight: true }
];

const getDublinTime = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Dublin',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
  });
  const parts = formatter.formatToParts(now);
  const dt = {};
  parts.forEach(p => { dt[p.type] = p.value });
  return new Date(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second);
};

function App() {
  const [mode, setMode] = useState('washer');
  const [index, setIndex] = useState(0);
  const [targetTime, setTargetTime] = useState('23:00');
  const [currentTime, setCurrentTime] = useState(getDublinTime());

  const programs = mode === 'washer' ? washerPrograms : dryerPrograms;
  const currentProgram = programs[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getDublinTime());
    }, 1000); 
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setIndex((prev) => (prev + 1) % programs.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + programs.length) % programs.length);

  const calculateResult = () => {
    if (index === 0) return null; 

    const [tHours, tMins] = targetTime.split(':').map(Number);
    let targetStart = new Date(currentTime);
    targetStart.setHours(tHours, tMins, 0, 0);

    if (targetStart <= currentTime) {
      targetStart.setDate(targetStart.getDate() + 1);
    }

    const diffMs = targetStart.getTime() - currentTime.getTime();
    const diffHours = diffMs / 3600000;
    
    let pressesNeeded = Math.ceil(diffHours);
    if (pressesNeeded < 0) pressesNeeded = 0;

    const totalMinutesToFinish = (pressesNeeded * 60) + currentProgram.time;
    const exactFinishInHours = Math.floor(totalMinutesToFinish / 60);
    const exactFinishInMins = totalMinutesToFinish % 60;
    const exactFinishInDisplay = `${exactFinishInHours.toString().padStart(2, '0')}:${exactFinishInMins.toString().padStart(2, '0')}`;

    const actualStart = new Date(currentTime.getTime() + pressesNeeded * 3600000);
    const actualFinish = new Date(actualStart.getTime() + currentProgram.time * 60000);

    const formatTime = (d) => d.toLocaleTimeString('en-IE', { hour: '2-digit', minute:'2-digit', hour12: true });

    return {
      presses: pressesNeeded,
      finishInDisplay: exactFinishInDisplay,
      actualStart: formatTime(actualStart),
      actualFinish: formatTime(actualFinish)
    };
  };

  const result = calculateResult();
  const rotationDegrees = index * (360 / programs.length);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center py-8 px-4 selection:bg-red-500/30 overflow-x-hidden">
      
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center justify-center gap-2">
          Bosch Auto-Delay
        </h1>
        <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 shadow-inner">
          <Clock size={16} className="text-red-400" />
          <span className="text-sm font-medium font-mono">
            Irish Time: {currentTime.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
        </div>
      </div>

      <div className="flex w-full max-w-md bg-slate-800 p-1 rounded-2xl mb-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] border border-slate-700">
        <button
          onClick={() => { setMode('washer'); setIndex(0); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
            mode === 'washer' 
              ? 'bg-gradient-to-b from-slate-600 to-slate-700 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Droplets size={20} className={mode === 'washer' ? 'text-blue-400' : ''} />
          Washer
        </button>
        <button
          onClick={() => { setMode('dryer'); setIndex(0); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
            mode === 'dryer' 
              ? 'bg-gradient-to-b from-slate-600 to-slate-700 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wind size={20} className={mode === 'dryer' ? 'text-red-400' : ''} />
          Dryer
        </button>
      </div>

      <div className="relative w-full max-w-md bg-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_10px_40px_-10px_rgba(0,0,0,0.8)] border border-slate-700/50 flex flex-col items-center">
        
        <div className="w-full max-w-[280px] bg-slate-950 rounded-xl p-4 mb-10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] border border-slate-800">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Program</span>
            <span className="text-xs text-red-500 font-mono flex items-center gap-1">
              <Clock size={12}/> 
              {Math.floor(currentProgram.time / 60)}h {(currentProgram.time % 60).toString().padStart(2, '0')}m
            </span>
          </div>
          <div className="text-xl font-medium text-white min-h-[1.75rem] truncate text-center">
            {currentProgram.name}
          </div>
        </div>

        <div className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] flex items-center justify-center mb-6">
          
          {programs.map((prog, i) => {
            const angle = i * (360 / programs.length);
            const angleRad = (angle - 90) * (Math.PI / 180);
            const textRadius = window.innerWidth < 400 ? 140 : 155; 
            const textX = Math.cos(angleRad) * textRadius;
            const textY = Math.sin(angleRad) * textRadius;
            const isSelected = index === i;

            return (
              <React.Fragment key={i}>
                <div 
                  className="absolute inset-0 flex items-start justify-center pointer-events-none"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className={`w-0.5 h-2.5 rounded-full mt-10 sm:mt-8 transition-colors duration-300 ${
                    isSelected ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]' : 'bg-slate-500'
                  }`} />
                </div>

                <div 
                  onClick={() => setIndex(i)}
                  className="absolute flex items-center justify-center w-24 cursor-pointer hover:scale-110 transition-transform z-10"
                  style={{ transform: `translate(${textX}px, ${textY}px)` }}
                >
                  <span className={`text-[10px] sm:text-[11px] font-semibold leading-tight text-center transition-colors duration-300 ${
                    isSelected 
                      ? 'text-white font-bold drop-shadow-md scale-110' 
                      : prog.highlight 
                        ? 'text-emerald-400 hover:text-emerald-300' 
                        : 'text-slate-400 hover:text-slate-200'
                  }`}>
                    {prog.name}
                  </span>
                </div>
              </React.Fragment>
            );
          })}

          <div className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-[10px_10px_20px_rgba(0,0,0,0.5),-5px_-5px_15px_rgba(255,255,255,0.05)] border-[4px] border-slate-800 z-0">
            <div 
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-[inset_0_4px_10px_rgba(255,255,255,0.1),0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${rotationDegrees}deg)` }}
            >
              <div className="absolute top-1.5 w-1.5 h-6 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
              
              <div 
                 className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-[inset_0_-2px_5px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.05)] flex items-center justify-center"
                 style={{ transform: `rotate(-${rotationDegrees}deg)` }} 
              >
                <Power className={`transition-colors duration-500 ${index === 0 ? 'text-red-500/80' : 'text-slate-600'}`} size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-12 mt-2">
          <button onClick={handlePrev} className="p-3 bg-slate-700/50 rounded-full text-slate-300 hover:text-white hover:bg-slate-600 transition-colors active:scale-90">
            <RotateCcw size={22} />
          </button>
          <button onClick={handleNext} className="p-3 bg-slate-700/50 rounded-full text-slate-300 hover:text-white hover:bg-slate-600 transition-colors active:scale-90">
            <RotateCw size={22} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-md flex items-center justify-between bg-slate-800 p-4 rounded-2xl mb-6 border border-slate-700 shadow-md">
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-slate-400" />
          <span className="font-medium">Target Start Time</span>
        </div>
        <input 
          type="time" 
          value={targetTime}
          onChange={(e) => setTargetTime(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono"
        />
      </div>

      {index !== 0 && result ? (
        <div className="w-full max-w-md bg-gradient-to-br from-blue-900/40 to-slate-900 p-6 rounded-3xl border border-blue-500/30 text-center shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
          
          <div className="text-slate-300 text-lg mb-4 flex flex-col gap-1">
            <span>1. Press <strong>'Finish in / Delay'</strong> first</span>
            <span>2. Then press it:</span>
          </div>
          
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="text-7xl font-black text-white tracking-tighter drop-shadow-lg">
              {result.presses}
            </span>
            <span className="text-2xl font-bold text-blue-400">times</span>
          </div>

          <div className="bg-black/30 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
            <p className="text-slate-300 text-sm mb-2">
              Bosch Screen should display: <strong className="text-white text-lg ml-1">{result.finishInDisplay}</strong>
            </p>
            <div className="flex justify-between text-xs font-mono text-slate-400 mt-3 pt-3 border-t border-white/10">
              <span>Starts: <span className="text-white">{result.actualStart}</span></span>
              <span>Ends: <span className="text-white">{result.actualFinish}</span></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 text-center text-slate-500 border-dashed">
          Select a washing or drying cycle to calculate the delay.
        </div>
      )}

    </div>
  );
}

export default App;
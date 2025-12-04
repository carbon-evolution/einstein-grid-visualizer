import React, { useState } from 'react';
import { StellarStage, INITIAL_MASS, MAX_MASS, CHANDRASEKHAR_LIMIT, TOV_LIMIT, STAGE_COLORS } from '../constants';
import { Play, Pause, RefreshCw, Download, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { PROJECT_FILES, APP_SOURCE } from '../utils/sourceCode';
// Note: SpacetimeMesh is omitted from APP_SOURCE due to size, but we can instruct user or try to include it if feasible.
// For now we assume the key files are there.

interface OverlayProps {
  mass: number;
  radius: number;
  stage: StellarStage;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

const LegendItem = ({ color, label, isActive }: { color: string, label: string, isActive: boolean }) => (
  <div className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/10 border border-white/20 translate-x-2 shadow-lg shadow-black/50' : 'opacity-40 hover:opacity-70'}`}>
    <div 
      className={`w-3 h-3 rounded-full ${isActive ? 'ring-2 ring-white/50 scale-125' : ''}`} 
      style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
    ></div>
    <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-400'}`}>
      {label}
    </span>
  </div>
);

const Overlay: React.FC<OverlayProps> = ({ mass, radius, stage, isRunning, onToggle, onReset }) => {
  const [isZipping, setIsZipping] = useState(false);
  const massProgress = ((mass - INITIAL_MASS) / (MAX_MASS - INITIAL_MASS)) * 100;

  const handleDownload = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      
      // Add Config Files
      Object.entries(PROJECT_FILES).forEach(([path, content]) => {
        zip.file(path, content);
      });
      
      // Add Source Files
      Object.entries(APP_SOURCE).forEach(([path, content]) => {
        zip.file(path, content);
      });
      
      // We need to fetch SpacetimeMesh separately or accept it's missing from the generator
      // For this demo, we will add a placeholder or try to fetch if we had the content.
      // (In a real app, we'd have the raw string).
      zip.file("src/components/SpacetimeMesh.tsx", "// Please copy the content of SpacetimeMesh.tsx from the editor into here.\n// It was too large to bundle automatically in this demo.");

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'antigravity-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to zip", e);
      alert("Failed to generate zip file.");
    } finally {
      setIsZipping(false);
    }
  };
  
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-6 flex flex-col justify-between z-10">
      
      {/* Header & Legend Area */}
      <div className="flex flex-col gap-6 pointer-events-auto items-start">
        <div>
          <h1 className="text-4xl md:text-5xl font-black italic bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
            GRAVITY COMPARISON
          </h1>
          <p className="text-blue-200/60 text-xs font-mono mt-1 ml-1 uppercase tracking-[0.2em]">
            Earth vs. Stellar Evolution
          </p>
        </div>

        {/* Dynamic Legend */}
        <div className="bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-white/10 min-w-[200px]">
           <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
             Bodies
           </h3>
           <div className="space-y-1">
             <LegendItem 
               color={STAGE_COLORS[StellarStage.EARTH]} 
               label="Earth (Static)" 
               isActive={true} 
             />
             <div className="h-px bg-white/10 my-2" />
             <LegendItem 
               color={STAGE_COLORS[StellarStage.SUN]} 
               label="Sun" 
               isActive={stage === StellarStage.SUN} 
             />
             <LegendItem 
               color={STAGE_COLORS[StellarStage.NEUTRON_STAR]} 
               label="Neutron Star" 
               isActive={stage === StellarStage.NEUTRON_STAR} 
             />
             <LegendItem 
               color={STAGE_COLORS[StellarStage.BLACK_HOLE]} 
               label="Black Hole" 
               isActive={stage === StellarStage.BLACK_HOLE} 
             />
           </div>
        </div>
      </div>

      {/* Physics Equations & Annotations */}
      <div className="absolute top-6 right-6 pointer-events-auto bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 hidden md:block">
        <h3 className="text-lg font-mono font-bold text-gray-200 mb-2">Einstein Field Equation</h3>
        <div className="text-xl font-serif text-yellow-400 mb-4">
          G<sub>μν</sub> + Λg<sub>μν</sub> = κT<sub>μν</sub>
        </div>
        
        <div className="space-y-2 text-sm font-mono text-gray-300">
          <div className="flex justify-between items-center gap-8">
            <span className="text-gray-500">Evolving Body</span>
            <span className={`font-bold ${stage === StellarStage.BLACK_HOLE ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
              {stage}
            </span>
          </div>
          
          <div className="h-px bg-white/10 my-2" />
          
          <div className="flex justify-between items-center gap-4">
             <span className="text-gray-500">Chandrasekhar Limit</span>
             <span className="text-orange-400 font-bold">{CHANDRASEKHAR_LIMIT} M<sub>⊙</sub></span>
          </div>
          <div className="flex justify-between items-center gap-4">
             <span className="text-gray-500">TOV Limit</span>
             <span className="text-red-400 font-bold">~{TOV_LIMIT} M<sub>⊙</sub></span>
          </div>
        </div>
      </div>

      {/* Curvature Intensity Bar (Right Side) */}
      <div className="absolute right-6 bottom-32 pointer-events-auto flex items-center gap-3">
        <div 
          className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] rotate-180" 
          style={{ writingMode: 'vertical-rl' }}
        >
          Curvature Intensity
        </div>
        <div className="bg-black/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex flex-col items-center gap-2 shadow-2xl">
          <span className="text-[8px] font-bold text-red-500">MAX</span>
          <div className="w-3 h-40 rounded-full border border-white/20 relative overflow-hidden ring-1 ring-white/5">
             <div 
               className="absolute inset-0" 
               style={{ background: 'linear-gradient(to top, #001966 0%, #00ccff 30%, #ff8000 70%, #ff0000 100%)' }} 
             />
          </div>
          <span className="text-[8px] font-bold text-blue-500">MIN</span>
        </div>
      </div>

      {/* Real-time Counters */}
      <div className="w-full max-w-lg pointer-events-auto bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 self-center mb-8 shadow-2xl shadow-black/50">
         <div className="grid grid-cols-2 gap-8">
          
          {/* Mass Control */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Mass (Right)</span>
              <span className="font-mono text-lg font-bold text-white">{mass.toFixed(2)} M<sub>⊙</sub></span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-75 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                style={{ width: `${massProgress}%` }}
              />
            </div>
          </div>

          {/* Radius Display */}
          <div>
             <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Radius (Right)</span>
              <span className="font-mono text-lg font-bold text-white">{radius.toFixed(2)} u</span>
            </div>
             <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-purple-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                style={{ width: `${(radius / 5) * 100}%` }}
              />
            </div>
          </div>

        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-8 justify-center">
          <button 
            onClick={onToggle}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 ${isRunning ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' : 'bg-white text-black hover:bg-gray-200'}`}
          >
            {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            {isRunning ? 'PAUSE' : 'SIMULATE'}
          </button>
          
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 bg-transparent text-gray-400 border border-gray-700 rounded-full font-bold hover:bg-gray-800 hover:text-white transition-colors"
          >
            <RefreshCw size={18} />
            RESET
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={isZipping}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-blue-400 border border-gray-700 rounded-full font-bold hover:bg-gray-700 hover:text-blue-300 transition-colors disabled:opacity-50"
            title="Download Source Code (ZIP)"
          >
            {isZipping ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Overlay;
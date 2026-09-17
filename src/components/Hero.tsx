import React from 'react';
import { Network, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-6 md:p-8 mb-6 border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90">
      {/* Background dynamic animated network SVG mesh */}
      <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <g stroke="url(#hero-grad)" strokeWidth="1" strokeDasharray="4 4">
            <line x1="5%" y1="20%" x2="25%" y2="70%" />
            <line x1="25%" y1="70%" x2="50%" y2="30%" />
            <line x1="50%" y1="30%" x2="75%" y2="80%" />
            <line x1="75%" y1="80%" x2="95%" y2="25%" />
            <line x1="25%" y1="70%" x2="75%" y2="80%" />
          </g>
          <circle cx="5%" cy="20%" r="4" fill="#38bdf8" className="animate-ping" />
          <circle cx="25%" cy="70%" r="4" fill="#818cf8" />
          <circle cx="50%" cy="30%" r="4" fill="#38bdf8" />
          <circle cx="75%" cy="80%" r="4" fill="#818cf8" />
          <circle cx="95%" cy="25%" r="4" fill="#10b981" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-3 shadow-inner">
          <Network className="w-3.5 h-3.5 animate-pulse" />
          <span>GREEDY ALGORITHM • MINIMUM SPANNING TREE</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Kruskal’s Algorithm Visualizer
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-medium text-cyan-300/90 mb-3 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 inline" />
          <span>Visualize how a greedy algorithm builds the Minimum Spanning Tree step-by-step.</span>
        </p>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Build a weighted graph, sort its edges, and watch Kruskal’s Algorithm select the minimum-cost connections while preventing cycles using Disjoint Set Union (Union-Find).
        </p>

        {/* Pipeline breadcrumb */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-xs font-mono text-slate-400 bg-slate-950/60 py-2 px-4 rounded-xl border border-slate-800/80 inline-flex max-w-full overflow-x-auto">
          <span className="text-cyan-400 font-semibold">INPUT GRAPH</span>
          <span className="text-slate-600">→</span>
          <span className="text-indigo-400 font-semibold">SORT EDGES</span>
          <span className="text-slate-600">→</span>
          <span className="text-amber-400 font-semibold">SELECT SMALLEST</span>
          <span className="text-slate-600">→</span>
          <span className="text-rose-400 font-semibold">CYCLE CHECK</span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400 font-semibold">ACCEPT/REJECT</span>
          <span className="text-slate-600">→</span>
          <span className="text-cyan-300 font-semibold">BUILD MST</span>
        </div>
      </div>
    </div>
  );
};

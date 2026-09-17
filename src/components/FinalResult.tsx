import React, { useEffect } from 'react';
import type { KruskalStep, GraphNode } from '../types/graph';
import { Trophy, CheckCircle, AlertTriangle, ShieldCheck, Hash } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalResultProps {
  currentStep: KruskalStep;
  nodes: GraphNode[];
}

export const FinalResult: React.FC<FinalResultProps> = ({ currentStep, nodes }) => {
  const { phase, mstEdges, rejectedEdges, totalCost, cycleCheckCount } = currentStep;

  const isCompleted = phase === 'COMPLETED';

  useEffect(() => {
    if (isCompleted) {
      // Trigger subtle celebratory confetti burst
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#10b981', '#fbbf24', '#818cf8'],
      });
    }
  }, [isCompleted]);

  if (phase !== 'COMPLETED' && phase !== 'DISCONNECTED_ERROR') {
    return null;
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-6 bg-gradient-to-b from-slate-900/90 to-slate-950/95">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Trophy className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Minimum Spanning Tree Result</h2>
            <p className="text-xs text-slate-400">Dynamically computed via Kruskal’s Algorithm</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Total MST Cost</span>
          <span className="text-3xl font-black text-emerald-400 font-mono drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            {totalCost}
          </span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Selected MST Edges List */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Selected MST Edges ({mstEdges.length})</span>
          </h3>

          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {mstEdges.map(edge => (
              <div
                key={edge.id}
                className="flex items-center justify-between bg-emerald-950/30 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-emerald-200 font-bold">{edge.source} ── {edge.target}</span>
                </div>
                <span className="text-amber-300 font-bold">Weight: {edge.weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Algorithm Performance Statistics */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-cyan-400" />
            <span>Execution Summary</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Vertices (V)</span>
              <span className="text-lg font-black text-white font-mono">{nodes.length}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">MST Edges (|E_MST|)</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{mstEdges.length}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Rejected Edges</span>
              <span className="text-lg font-black text-rose-400 font-mono">{rejectedEdges.length}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Cycle Checks</span>
              <span className="text-lg font-black text-amber-400 font-mono">{cycleCheckCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Verification Panel */}
      <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>MST Verification Checklist</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            {isCompleted ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="text-slate-300">
              {isCompleted ? 'All vertices connected in single component' : 'Graph is disconnected'}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">No cycles exist in MST</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">Number of MST edges = V − 1 ({nodes.length - 1})</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">Sum of edge weights calculated dynamically</span>
          </div>
        </div>
      </div>
    </div>
  );
};

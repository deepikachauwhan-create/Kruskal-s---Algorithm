import React from 'react';
import type { KruskalStep } from '../types/graph';
import { MessageSquareText, CheckCircle2, XCircle, Sparkles, AlertTriangle } from 'lucide-react';

interface ExplanationPanelProps {
  currentStep: KruskalStep;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ currentStep }) => {
  const { phase, description, isCycle: _isCycle, currentEdgeId: _currentEdgeId, totalCost, acceptedCount: _acceptedCount, requiredCount } = currentStep;

  let headerColor = 'text-cyan-400';
  let badge = null;

  if (phase === 'ACCEPTING_EDGE') {
    headerColor = 'text-emerald-400';
    badge = (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
        <CheckCircle2 className="w-4 h-4" />
        <span>✓ EDGE ACCEPTED</span>
      </div>
    );
  } else if (phase === 'REJECTING_EDGE') {
    headerColor = 'text-rose-400';
    badge = (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black uppercase tracking-wider">
        <XCircle className="w-4 h-4" />
        <span>✕ CYCLE DETECTED — REJECTED</span>
      </div>
    );
  } else if (phase === 'COMPLETED') {
    headerColor = 'text-cyan-300';
    badge = (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>MST COMPLETE</span>
      </div>
    );
  } else if (phase === 'DISCONNECTED_ERROR') {
    headerColor = 'text-amber-400';
    badge = (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <span>DISCONNECTED GRAPH</span>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col gap-3 relative overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <MessageSquareText className={`w-5 h-5 ${headerColor}`} />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Step Narration
          </h3>
        </div>
        {badge}
      </div>

      <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans min-h-[48px] flex items-center bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
        {description}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
        <span>Required MST Edges: <strong className="text-white">{requiredCount}</strong> (V - 1)</span>
        <span>Current MST Cost: <strong className="text-emerald-400 font-bold">{totalCost}</strong></span>
      </div>
    </div>
  );
};

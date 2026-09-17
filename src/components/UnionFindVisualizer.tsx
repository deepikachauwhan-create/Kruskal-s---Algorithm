import React from 'react';
import type { UnionFindSnapshot } from '../types/graph';
import { GitBranch, Info, Link2 } from 'lucide-react';

interface UnionFindVisualizerProps {
  unionFindState: UnionFindSnapshot;
  highlightedComponentNodes: string[];
  isCycle: boolean;
}

export const UnionFindVisualizer: React.FC<UnionFindVisualizerProps> = ({
  unionFindState,
  highlightedComponentNodes,
  isCycle,
}) => {
  const leaders = Object.keys(unionFindState.sets);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Disjoint Set / Union-Find
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
          {leaders.length} {leaders.length === 1 ? 'Component' : 'Components'}
        </span>
      </div>

      {/* Components Group Badges */}
      <div className="flex flex-wrap gap-2 py-1">
        {leaders.map(leader => {
          const members = unionFindState.sets[leader] || [];
          const containsHighlighted = members.some(m => highlightedComponentNodes.includes(m));

          let setBg = 'bg-slate-900 border-slate-800 text-slate-300';
          if (containsHighlighted) {
            setBg = isCycle
              ? 'bg-rose-950/50 border-rose-500/60 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse'
              : 'bg-cyan-950/50 border-cyan-500/60 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]';
          } else if (members.length > 1) {
            setBg = 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200';
          }

          return (
            <div
              key={leader}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all duration-300 ${setBg}`}
            >
              <Link2 className="w-3.5 h-3.5 opacity-70" />
              <span>{`{ ${members.join(', ')} }`}</span>
              <span className="text-[10px] text-slate-400 font-normal ml-1">
                (Root: {leader})
              </span>
            </div>
          );
        })}
      </div>

      {/* Educational Tooltip */}
      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-200">Union-Find Operation:</strong> Checks if source and target vertices belong to the same root set. If roots differ, sets merge via <span className="text-cyan-300 font-semibold">Union by Rank</span> and <span className="text-cyan-300 font-semibold">Path Compression</span> ($O(\alpha(V))$ amortized).
        </span>
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import type { EvaluatedEdge } from '../types/graph';
import { ArrowDownAZ, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface SortedEdgeTableProps {
  evaluatedEdges: EvaluatedEdge[];
  currentEdgeId: string | null;
  phase: string;
}

export const SortedEdgeTable: React.FC<SortedEdgeTableProps> = ({
  evaluatedEdges,
  currentEdgeId,
  phase,
}) => {
  const activeRowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentEdgeId]);

  const isSorted = phase !== 'INITIAL';

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <ArrowDownAZ className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {isSorted ? 'Sorted Edges Queue' : 'Unsorted Edges Queue'}
          </h3>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
          Smallest → Largest
        </span>
      </div>

      <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800/80 bg-slate-950/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 sticky top-0 backdrop-blur-md">
              <th className="py-2 px-3">Edge</th>
              <th className="py-2 px-3">Weight</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3 text-right">Action / Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {evaluatedEdges.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-500 italic">
                  No edges available. Add edges in the graph builder.
                </td>
              </tr>
            ) : (
              evaluatedEdges.map(edge => {
                const isCurrent = edge.id === currentEdgeId;

                let rowBg = 'hover:bg-slate-900/40';
                let statusBadge = (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono">
                    <Clock className="w-3 h-3" /> PENDING
                  </span>
                );

                if (edge.status === 'ACCEPTED') {
                  rowBg = 'bg-emerald-950/30 text-emerald-200';
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      <CheckCircle className="w-3 h-3" /> ACCEPTED
                    </span>
                  );
                } else if (edge.status === 'REJECTED') {
                  rowBg = 'bg-rose-950/20 text-rose-300 line-through opacity-75';
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                      <XCircle className="w-3 h-3" /> REJECTED
                    </span>
                  );
                } else if (edge.status === 'CHECKING' || isCurrent) {
                  rowBg = 'bg-amber-500/15 border-l-4 border-l-amber-400 text-amber-200 font-bold';
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[10px] font-bold animate-pulse">
                      <Eye className="w-3 h-3" /> CHECKING
                    </span>
                  );
                }

                return (
                  <tr
                    key={edge.id}
                    ref={isCurrent ? activeRowRef : null}
                    className={`transition-colors ${rowBg}`}
                  >
                    <td className="py-2 px-3 font-mono font-bold text-cyan-300">
                      {edge.source} ↔ {edge.target}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-amber-300">
                      {edge.weight}
                    </td>
                    <td className="py-2 px-3">{statusBadge}</td>
                    <td className="py-2 px-3 text-right text-[11px] text-slate-400 font-mono">
                      {edge.actionReason || (isCurrent ? 'Checking cycle...' : 'Awaiting turn')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

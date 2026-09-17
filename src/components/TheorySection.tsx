import React from 'react';
import { BookOpen, Clock, GitCompare, Lightbulb, CheckCircle2, XCircle, Network } from 'lucide-react';

export const TheorySection: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 mt-8">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <BookOpen className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">Algorithm Reference & Theory</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time & Space Complexity */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Complexity Analysis</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Time Complexity</span>
              <span className="text-xl font-black text-cyan-300 font-mono">O(E log E)</span>
              <p className="text-[11px] text-slate-400 mt-1">Dominated by sorting all E edges by weight.</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Space Complexity</span>
              <span className="text-xl font-black text-indigo-300 font-mono">O(V + E)</span>
              <p className="text-[11px] text-slate-400 mt-1">Stores edges and Union-Find arrays parent/rank.</p>
            </div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <strong>Key Insight:</strong> Disjoint Set Union operations with path compression run in near-constant $O(\alpha(V))$ amortized time per query (where $\alpha$ is the Inverse Ackermann function). Thus, edge sorting dominates runtime.
          </div>
        </div>

        {/* Why Greedy? */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span>Why is Kruskal’s Algorithm Greedy?</span>
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Kruskal’s algorithm follows a <strong>locally optimal greedy choice</strong> at every step: it always picks the smallest available edge in the entire graph that does not form a cycle.
          </p>

          <div className="flex flex-col gap-2 font-mono text-xs">
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">1</span>
              <span>Sort all edges in non-decreasing order of weight</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">2</span>
              <span>Select the next smallest edge</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">3</span>
              <span>Accept if safe (no cycle), otherwise reject</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kruskal vs Prim Comparison Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <GitCompare className="w-4 h-4" />
          <span>Kruskal’s vs. Prim’s Algorithm</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                <th className="py-2.5 px-4">Feature</th>
                <th className="py-2.5 px-4 text-cyan-300">Kruskal’s Algorithm</th>
                <th className="py-2.5 px-4 text-indigo-300">Prim’s Algorithm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-slate-300">Approach</td>
                <td className="py-2.5 px-4 text-slate-300">Edge-based (processes global edges)</td>
                <td className="py-2.5 px-4 text-slate-300">Vertex/Tree-based (grows tree from a root)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-slate-300">Main Operation</td>
                <td className="py-2.5 px-4 text-slate-300">Sort all edges by weight</td>
                <td className="py-2.5 px-4 text-slate-300">Select min connecting edge from priority queue</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-slate-300">Cycle Detection</td>
                <td className="py-2.5 px-4 text-slate-300">Disjoint Set Union (Union-Find)</td>
                <td className="py-2.5 px-4 text-slate-300">Track visited vertex set</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-slate-300">Graph Preference</td>
                <td className="py-2.5 px-4 text-slate-300">Sparse graphs ($E \ll V^2$)</td>
                <td className="py-2.5 px-4 text-slate-300">Dense graphs ($E \approx V^2$)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Applications, Advantages, Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Applications */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Network className="w-4 h-4" />
            <span>Applications</span>
          </h4>
          <ul className="text-xs text-slate-300 flex flex-col gap-1.5 list-disc list-inside">
            <li>Computer network topology design</li>
            <li>Road and transportation network planning</li>
            <li>Electrical power grid distribution</li>
            <li>Telecommunications cable wiring</li>
            <li>Water pipeline cost minimization</li>
          </ul>
        </div>

        {/* Advantages */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Advantages</span>
          </h4>
          <ul className="text-xs text-slate-300 flex flex-col gap-1.5 list-disc list-inside">
            <li>Intuitive greedy methodology</li>
            <li>Fast execution on sparse graphs</li>
            <li>Efficient cycle checking using DSU</li>
            <li>Guaranteed minimum total cost</li>
          </ul>
        </div>

        {/* Limitations */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Limitations</span>
          </h4>
          <ul className="text-xs text-slate-300 flex flex-col gap-1.5 list-disc list-inside">
            <li>Requires sorting all edges upfront</li>
            <li>Slower on very dense graphs ($E \approx V^2$)</li>
            <li>Explicit DSU data structure required</li>
            <li>Not suitable for dynamic graph updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

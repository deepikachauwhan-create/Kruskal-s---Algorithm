import React, { useState } from 'react';
import type { GraphNode, GraphEdge } from '../types/graph';
import { REFERENCE_NODES, REFERENCE_EDGES, generateRandomGraph, calculateCircularPositions, validateGraph } from '../logic/graphUtils';
import { Plus, Trash2, RotateCcw, Shuffle, BookmarkCheck, AlertCircle, Layers } from 'lucide-react';

interface GraphInputProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onGraphChange: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  isExecuting: boolean;
}

export const GraphInput: React.FC<GraphInputProps> = ({
  nodes,
  edges,
  onGraphChange,
  isExecuting,
}) => {
  const [newFrom, setNewFrom] = useState<string>('A');
  const [newTo, setNewTo] = useState<string>('B');
  const [newWeight, setNewWeight] = useState<number>(5);
  const [inputError, setInputError] = useState<string | null>(null);

  const availableVertexCount = [3, 4, 5, 6, 7, 8, 9, 10];
  const nodeIds = nodes.map(n => n.id);

  const handleVertexCountChange = (count: number) => {
    if (isExecuting) return;
    const newNodes = calculateCircularPositions(count);
    // Filter out edges connecting to now-removed nodes
    const validIds = new Set(newNodes.map(n => n.id));
    const newEdges = edges.filter(e => validIds.has(e.source) && validIds.has(e.target));
    
    setInputError(null);
    onGraphChange(newNodes, newEdges);
  };

  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExecuting) return;

    if (newFrom === newTo) {
      setInputError('Self-loops (From and To being the same vertex) are not allowed in MST.');
      return;
    }

    const edgeId = newFrom < newTo ? `${newFrom}-${newTo}` : `${newTo}-${newFrom}`;
    
    if (edges.some(e => e.id === edgeId)) {
      setInputError(`Edge between ${newFrom} and ${newTo} already exists.`);
      return;
    }

    const newEdgeObj: GraphEdge = {
      id: edgeId,
      source: newFrom < newTo ? newFrom : newTo,
      target: newFrom < newTo ? newTo : newFrom,
      weight: Number(newWeight),
    };

    setInputError(null);
    onGraphChange(nodes, [...edges, newEdgeObj]);
  };

  const handleDeleteEdge = (edgeId: string) => {
    if (isExecuting) return;
    onGraphChange(nodes, edges.filter(e => e.id !== edgeId));
  };

  const handleEdgeWeightChange = (edgeId: string, newWeightVal: number) => {
    if (isExecuting) return;
    onGraphChange(
      nodes,
      edges.map(e => (e.id === edgeId ? { ...e, weight: newWeightVal } : e))
    );
  };

  const handleLoadExample = () => {
    if (isExecuting) return;
    setInputError(null);
    onGraphChange(REFERENCE_NODES, REFERENCE_EDGES);
  };

  const handleGenerateRandom = () => {
    if (isExecuting) return;
    setInputError(null);
    const { nodes: rNodes, edges: rEdges } = generateRandomGraph(nodes.length);
    onGraphChange(rNodes, rEdges);
  };

  const handleResetGraph = () => {
    if (isExecuting) return;
    setInputError(null);
    const defaultNodes = calculateCircularPositions(4);
    const defaultEdges: GraphEdge[] = [
      { id: 'A-B', source: 'A', target: 'B', weight: 4 },
      { id: 'B-C', source: 'B', target: 'C', weight: 2 },
      { id: 'A-C', source: 'A', target: 'C', weight: 5 },
      { id: 'C-D', source: 'C', target: 'D', weight: 3 },
    ];
    onGraphChange(defaultNodes, defaultEdges);
  };

  const validation = validateGraph(nodes, edges);

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-5 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Graph Builder</span>
        </h2>
        <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
          V = {nodes.length} | E = {edges.length}
        </span>
      </div>

      {/* Quick Action Presets */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleLoadExample}
          disabled={isExecuting}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Load Reference Graph</span>
        </button>
        <button
          onClick={handleGenerateRandom}
          disabled={isExecuting}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
          <span>Random Graph</span>
        </button>
      </div>

      {/* Vertices Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Number of Vertices (V)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableVertexCount.map(cnt => (
            <button
              key={cnt}
              onClick={() => handleVertexCountChange(cnt)}
              disabled={isExecuting}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                nodes.length === cnt
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
              } disabled:opacity-50`}
            >
              {cnt}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Edge Form */}
      <form onSubmit={handleAddEdge} className="flex flex-col gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Add New Edge
        </span>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-slate-400">From</label>
            <select
              value={newFrom}
              onChange={e => setNewFrom(e.target.value)}
              disabled={isExecuting}
              className="w-full bg-slate-950 text-white text-xs rounded-lg border border-slate-700 p-2 font-mono focus:border-cyan-400 focus:outline-none"
            >
              {nodeIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-400">To</label>
            <select
              value={newTo}
              onChange={e => setNewTo(e.target.value)}
              disabled={isExecuting}
              className="w-full bg-slate-950 text-white text-xs rounded-lg border border-slate-700 p-2 font-mono focus:border-cyan-400 focus:outline-none"
            >
              {nodeIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-400">Weight</label>
            <input
              type="number"
              value={newWeight}
              onChange={e => setNewWeight(Number(e.target.value))}
              disabled={isExecuting}
              className="w-full bg-slate-950 text-white text-xs rounded-lg border border-slate-700 p-2 font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isExecuting}
          className="mt-1 w-full py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Edge</span>
        </button>
      </form>

      {/* Input Validation & Disconnected Graph Alert */}
      {inputError && (
        <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{inputError}</span>
        </div>
      )}

      {validation.isDisconnected && (
        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{validation.errorMessage}</span>
        </div>
      )}

      {/* Current Edges Table */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Edge List ({edges.length})</span>
          <button
            onClick={handleResetGraph}
            disabled={isExecuting}
            className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </span>
        <div className="max-h-52 overflow-y-auto flex flex-col gap-1.5 pr-1">
          {edges.length === 0 ? (
            <div className="text-xs text-slate-500 italic text-center py-4">No edges defined. Add an edge above.</div>
          ) : (
            edges.map(e => (
              <div
                key={e.id}
                className="flex items-center justify-between bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-6 text-cyan-400 font-bold">{e.source}</span>
                  <span className="text-slate-500">↔</span>
                  <span className="w-6 text-cyan-400 font-bold">{e.target}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Weight:</span>
                    <input
                      type="number"
                      value={e.weight}
                      onChange={ev => handleEdgeWeightChange(e.id, Number(ev.target.value))}
                      disabled={isExecuting}
                      className="w-14 bg-slate-950 text-amber-300 text-xs text-center rounded border border-slate-700 font-mono py-0.5 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteEdge(e.id)}
                    disabled={isExecuting}
                    title="Delete Edge"
                    className="text-slate-500 hover:text-rose-400 transition cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

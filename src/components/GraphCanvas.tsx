import React, { useState, useRef } from 'react';
import type { GraphNode, GraphEdge, EvaluatedEdge, EdgeStatus } from '../types/graph';
import { Move } from 'lucide-react';

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  evaluatedEdges: EvaluatedEdge[];
  currentEdgeId: string | null;
  highlightedComponentNodes: string[];
  isCycle: boolean;
  onNodePositionChange: (nodeId: string, x: number, y: number) => void;
  isExecuting: boolean;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  evaluatedEdges,
  currentEdgeId,
  highlightedComponentNodes,
  isCycle,
  onNodePositionChange,
  isExecuting: _isExecuting,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Map edge IDs to their evaluated status
  const edgeStatusMap = new Map<string, EdgeStatus>();
  evaluatedEdges.forEach(e => edgeStatusMap.set(e.id, e.status));

  // Node position map
  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  // Handle Dragging
  const handleMouseDown = (nodeId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDraggingNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingNodeId || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = Math.max(30, Math.min(rect.width - 30, clientX - rect.left));
    const y = Math.max(30, Math.min(rect.height - 30, clientY - rect.top));

    onNodePositionChange(draggingNodeId, Math.round(x), Math.round(y));
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] glass-panel rounded-2xl overflow-hidden border border-slate-800 flex flex-col">
      {/* Visual Canvas Bar */}
      <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono shadow-md backdrop-blur-md pointer-events-auto">
          <Move className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Canvas</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">(Drag nodes to reposition)</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-semibold text-slate-300 shadow-md backdrop-blur-md pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span className="text-slate-400">Unprocessed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-amber-300">Checking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
            <span className="text-emerald-300 font-bold">MST</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-rose-300">Rejected</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-crosshair select-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          {/* Signal Pulse Gradient */}
          <linearGradient id="edge-pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </linearGradient>

          {/* Glow filter for MST edges */}
          <filter id="mst-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Render Edges */}
        {edges.map(edge => {
          const u = nodeMap.get(edge.source);
          const v = nodeMap.get(edge.target);
          if (!u || !v) return null;

          const status = edgeStatusMap.get(edge.id) || 'PENDING';
          const isCurrent = edge.id === currentEdgeId;

          let strokeColor = '#334155'; // default slate-700
          let strokeWidth = 2.5;
          let strokeDasharray = 'none';
          let filter = 'none';

          if (status === 'ACCEPTED') {
            strokeColor = '#10b981'; // emerald-500
            strokeWidth = 4.5;
            filter = 'url(#mst-glow)';
          } else if (status === 'REJECTED') {
            strokeColor = '#f43f5e'; // rose-500
            strokeWidth = 2;
            strokeDasharray = '6 4';
          } else if (isCurrent || status === 'CHECKING') {
            strokeColor = isCycle ? '#f43f5e' : '#fbbf24'; // rose if cycle, amber if checking
            strokeWidth = 5;
            filter = 'url(#mst-glow)';
          }

          // Edge midpoints for weight badge
          const midX = (u.x + v.x) / 2;
          const midY = (u.y + v.y) / 2;

          return (
            <g key={edge.id} className="transition-all duration-300">
              {/* Main Line */}
              <line
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                filter={filter}
                className={isCurrent && isCycle ? 'animate-cycle-warning' : ''}
              />

              {/* Animated Pulse Signal on Active Checking Line */}
              {isCurrent && (
                <circle r="6" fill="#fbbf24">
                  <animateMotion
                    path={`M ${u.x} ${u.y} L ${v.x} ${v.y}`}
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Edge Weight Badge */}
              <g transform={`translate(${midX}, ${midY})`}>
                <rect
                  x="-16"
                  y="-12"
                  width="32"
                  height="24"
                  rx="6"
                  fill={
                    status === 'ACCEPTED'
                      ? '#064e3b'
                      : status === 'REJECTED'
                      ? '#4c0519'
                      : isCurrent
                      ? '#78350f'
                      : '#0f172a'
                  }
                  stroke={
                    status === 'ACCEPTED'
                      ? '#10b981'
                      : status === 'REJECTED'
                      ? '#f43f5e'
                      : isCurrent
                      ? '#fbbf24'
                      : '#334155'
                  }
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={
                    status === 'ACCEPTED'
                      ? '#34d399'
                      : status === 'REJECTED'
                      ? '#fda4af'
                      : isCurrent
                      ? '#fef08a'
                      : '#94a3b8'
                  }
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {edge.weight}
                </text>
              </g>

              {/* Status Indicator Icon Badge on Edge */}
              {status === 'ACCEPTED' && (
                <g transform={`translate(${midX + 22}, ${midY - 12})`}>
                  <circle r="8" fill="#10b981" />
                  <path d="M-3 0 L-1 2 L3 -2" stroke="#022c22" strokeWidth="2" fill="none" />
                </g>
              )}

              {status === 'REJECTED' && (
                <g transform={`translate(${midX + 22}, ${midY - 12})`}>
                  <circle r="8" fill="#f43f5e" />
                  <path d="M-2 -2 L2 2 M2 -2 L-2 2" stroke="#4c0519" strokeWidth="2" fill="none" />
                </g>
              )}
            </g>
          );
        })}

        {/* Render Vertices */}
        {nodes.map(node => {
          const isHighlighted = highlightedComponentNodes.includes(node.id);
          const isDragging = draggingNodeId === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseDown={e => handleMouseDown(node.id, e)}
              onTouchStart={e => handleMouseDown(node.id, e)}
              className="cursor-grab active:cursor-grabbing transition-transform"
            >
              {/* Outer halo when in highlighted component */}
              {isHighlighted && (
                <circle
                  r="26"
                  fill="none"
                  stroke={isCycle ? '#f43f5e' : '#38bdf8'}
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  className="animate-spin"
                  style={{ animationDuration: '8s' }}
                />
              )}

              {/* Node Outer Circle */}
              <circle
                r="20"
                fill={isHighlighted ? (isCycle ? '#881337' : '#0369a1') : '#0f172a'}
                stroke={isHighlighted ? (isCycle ? '#f43f5e' : '#38bdf8') : isDragging ? '#38bdf8' : '#475569'}
                strokeWidth={isHighlighted || isDragging ? '3' : '2'}
                className="transition-colors duration-300"
              />

              {/* Node Label Text */}
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill={isHighlighted ? '#ffffff' : '#e2e8f0'}
                fontSize="14"
                fontWeight="800"
                fontFamily="sans-serif"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

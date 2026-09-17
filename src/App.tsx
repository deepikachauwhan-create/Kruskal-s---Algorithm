import { useState, useEffect, useMemo, useRef } from 'react';
import type { GraphNode, GraphEdge, KruskalStep } from './types/graph';
import { REFERENCE_NODES, REFERENCE_EDGES, validateGraph } from './logic/graphUtils';
import { generateKruskalSteps } from './logic/kruskal';

import { Hero } from './components/Hero';
import { GraphInput } from './components/GraphInput';
import { GraphCanvas } from './components/GraphCanvas';
import { SortedEdgeTable } from './components/SortedEdgeTable';
import { UnionFindVisualizer } from './components/UnionFindVisualizer';
import { AlgorithmControls } from './components/AlgorithmControls';
import { ExplanationPanel } from './components/ExplanationPanel';
import { FinalResult } from './components/FinalResult';
import { TheorySection } from './components/TheorySection';
import { VivaMode } from './components/VivaMode';

import { Network, Code2, GraduationCap } from 'lucide-react';

export function App() {
  // Graph state
  const [nodes, setNodes] = useState<GraphNode[]>(REFERENCE_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(REFERENCE_EDGES);

  // Execution steps state (dynamically derived via useMemo)
  const steps = useMemo(() => generateKruskalSteps(nodes, edges), [nodes, edges]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(700); // ms per step

  // UI Modals
  const [isVivaOpen, setIsVivaOpen] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Handle Playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  const currentStep: KruskalStep = steps[currentStepIndex] || {
    stepIndex: 0,
    totalSteps: 1,
    phase: 'INITIAL',
    currentEdgeId: null,
    evaluatedEdges: [],
    mstEdges: [],
    rejectedEdges: [],
    unionFindState: { parent: {}, rank: {}, sets: {} },
    description: 'Initializing algorithm...',
    highlightedComponentNodes: [],
    isCycle: false,
    totalCost: 0,
    acceptedCount: 0,
    requiredCount: Math.max(0, nodes.length - 1),
    cycleCheckCount: 0,
  };

  const validation = validateGraph(nodes, edges);

  const handleGraphChange = (newNodes: GraphNode[], newEdges: GraphEdge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleNodePositionChange = (nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => (n.id === nodeId ? { ...n, x, y } : n)));
  };

  const handlePlay = () => {
    if (!validation.isValid) return;
    if (currentStepIndex === steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleStepSelect = (index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(index);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 pb-16">
      {/* Navbar Header */}
      <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black shadow-md shadow-cyan-500/20">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Kruskal’s Algorithm</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-normal">
                v2.0 DAA Lab
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Minimum Spanning Tree & Disjoint Set Visualizer</p>
          </div>
        </div>

        {/* Viva Mode & Extra Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVivaOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Viva Mode</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Compact Hero */}
        <Hero />

        {/* 3-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Graph Input (3 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <GraphInput
              nodes={nodes}
              edges={edges}
              onGraphChange={handleGraphChange}
              isExecuting={isPlaying}
            />
          </div>

          {/* CENTER COLUMN: Live Graph Canvas & Controls (5 cols) */}
          <div className="lg:col-span-8 xl:col-span-5 flex flex-col gap-5">
            {/* Interactive Graph Canvas */}
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              evaluatedEdges={currentStep.evaluatedEdges}
              currentEdgeId={currentStep.currentEdgeId}
              highlightedComponentNodes={currentStep.highlightedComponentNodes}
              isCycle={currentStep.isCycle}
              onNodePositionChange={handleNodePositionChange}
              isExecuting={isPlaying}
            />

            {/* Controls Bar */}
            <AlgorithmControls
              currentStep={currentStep}
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onPlay={handlePlay}
              onPause={handlePause}
              onNext={handleNext}
              onPrev={handlePrev}
              onRestart={handleRestart}
              onSpeedChange={setPlaybackSpeed}
              onStepSelect={handleStepSelect}
              isGraphValid={validation.isValid}
            />

            {/* Step Narration Explanation */}
            <ExplanationPanel currentStep={currentStep} />
          </div>

          {/* RIGHT COLUMN: Queues & Union Find Visualizer (3 cols) */}
          <div className="lg:col-span-12 xl:col-span-3 flex flex-col gap-5">
            <SortedEdgeTable
              evaluatedEdges={currentStep.evaluatedEdges}
              currentEdgeId={currentStep.currentEdgeId}
              phase={currentStep.phase}
            />

            <UnionFindVisualizer
              unionFindState={currentStep.unionFindState}
              highlightedComponentNodes={currentStep.highlightedComponentNodes}
              isCycle={currentStep.isCycle}
            />
          </div>
        </div>

        {/* Final MST Result (Rendered when completed or on last step) */}
        {(currentStep.phase === 'COMPLETED' || currentStep.phase === 'DISCONNECTED_ERROR') && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <FinalResult currentStep={currentStep} nodes={nodes} />
          </div>
        )}

        {/* Theory & Complexity Reference Section */}
        <TheorySection />
      </main>

      {/* Educational Viva Quiz Modal */}
      {isVivaOpen && <VivaMode onClose={() => setIsVivaOpen(false)} />}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>Kruskal’s Algorithm Visualizer — Data Structures & Algorithms Lab</span>
        </div>
        <div className="text-slate-400 font-mono">
          Interactive Greedy Algorithm Laboratory • DAA Viva Mode
        </div>
      </footer>
    </div>
  );
}

export default App;

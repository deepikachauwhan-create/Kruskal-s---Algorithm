import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Zap, Activity } from 'lucide-react';
import type { KruskalStep } from '../types/graph';

interface AlgorithmControlsProps {
  currentStep: KruskalStep;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number; // in ms per step
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  onStepSelect: (stepIndex: number) => void;
  isGraphValid: boolean;
}

export const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  currentStep,
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onRestart,
  onSpeedChange,
  onStepSelect,
  isGraphValid,
}) => {
  const isStart = currentStepIndex === 0;
  const isEnd = currentStepIndex === totalSteps - 1;

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
      {/* Top Header & Counters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h2 className="text-base sm:text-lg font-bold text-white">Algorithm Execution</h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-slate-300">
            Step: <span className="text-cyan-400 font-bold">{currentStepIndex + 1}</span> / {totalSteps || 1}
          </div>
          <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-slate-300">
            MST Edges: <span className="text-emerald-400 font-bold">{currentStep.acceptedCount}</span> / {currentStep.requiredCount}
          </div>
        </div>
      </div>

      {/* Main Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={onPlay}
              disabled={!isGraphValid || isEnd}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isStart ? '▶ Run Kruskal’s Algorithm' : 'Resume'}</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={onPrev}
            disabled={isPlaying || isStart}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer disabled:opacity-40"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onNext}
            disabled={isPlaying || isEnd}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer disabled:opacity-40"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onRestart}
            disabled={isPlaying}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer disabled:opacity-40"
            title="Restart Algorithm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400 font-semibold hidden sm:inline">Speed:</span>
          <div className="flex items-center gap-1">
            {[
              { label: 'Slow', val: 1400 },
              { label: 'Normal', val: 700 },
              { label: 'Fast', val: 250 },
            ].map(s => (
              <button
                key={s.label}
                onClick={() => onSpeedChange(s.val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  playbackSpeed === s.val
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Timeline Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>Timeline Progress</span>
          <span className="font-mono text-cyan-300">
            {Math.round(((currentStepIndex + 1) / (totalSteps || 1)) * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={e => onStepSelect(Number(e.target.value))}
          disabled={isPlaying}
          className="w-full accent-cyan-400 h-2 bg-slate-900 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { VIVA_QUESTIONS } from '../logic/vivaQuestions';
import { HelpCircle, CheckCircle, XCircle, ChevronRight, Award, RotateCcw, X } from 'lucide-react';

interface VivaModeProps {
  onClose: () => void;
}

export const VivaMode: React.FC<VivaModeProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = VIVA_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // Prevent re-answer
    setSelectedOption(idx);
    setShowExplanation(true);
    setAnsweredCount(prev => prev + 1);

    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < VIVA_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredCount(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700 p-6 flex flex-col gap-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 pr-8">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Educational Viva Mode</h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">
              Q: <strong className="text-white">{currentIndex + 1}</strong> / {VIVA_QUESTIONS.length}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Score: {score} / {answeredCount}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="text-sm font-semibold text-slate-100 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          {currentQ.question}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {currentQ.options.map((opt, idx) => {
            let optionStyle = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800';

            if (selectedOption !== null) {
              if (idx === currentQ.correctIndex) {
                optionStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]';
              } else if (idx === selectedOption) {
                optionStyle = 'bg-rose-950/60 border-rose-500/80 text-rose-200 font-bold';
              } else {
                optionStyle = 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <span>{opt}</span>
                {selectedOption !== null && idx === currentQ.correctIndex && (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                )}
                {selectedOption !== null && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Banner */}
        {showExplanation && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex flex-col gap-1">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Award className="w-4 h-4" /> Viva Explanation:
            </span>
            <p className="leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Quiz
          </button>

          {currentIndex < VIVA_QUESTIONS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition disabled:opacity-40 cursor-pointer"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Finish Viva Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

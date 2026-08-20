import React from 'react';
import { X, HelpCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { FractionProblem } from '../types/game';
import { FractionView } from './FractionView';

interface HintModalProps {
  problem: FractionProblem;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ problem, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col space-y-4 border border-amber-500/40">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span className="text-xs uppercase tracking-widest font-black">HINT RADAR / 분수 힌트</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Equation */}
        <div className="flex items-center justify-center gap-3 p-4 glass-panel rounded-2xl border border-white/10">
          <FractionView fraction={problem.operand1} size="lg" />
          <span className="text-2xl font-black text-amber-400">{problem.operation}</span>
          <FractionView fraction={problem.operand2} size="lg" />
          <span className="text-2xl font-black text-slate-400">=</span>
          <span className="text-xl font-bold text-blue-400">?</span>
        </div>

        {/* Step-by-Step Hint Text */}
        <div className="glass-panel border border-amber-500/30 rounded-2xl p-4 space-y-2">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            단계별 계산 힌트
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
            {problem.explanation}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-white text-slate-950 font-black text-sm rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-102 transition-all cursor-pointer uppercase tracking-tight"
        >
          확인하고 계속하기!
        </button>
      </div>
    </div>
  );
};

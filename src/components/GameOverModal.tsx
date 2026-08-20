import React, { useEffect } from 'react';
import { RotateCcw, Home, BookOpen, AlertCircle, HeartCrack } from 'lucide-react';
import { PlayerProfile, WrongQuestionReview } from '../types/game';
import { FractionView } from './FractionView';
import { soundManager } from '../utils/audio';

interface GameOverModalProps {
  profile: PlayerProfile;
  score: number;
  stage: number;
  wrongReviews: WrongQuestionReview[];
  onRetry: () => void;
  onReturnToTitle: () => void;
  onOpenConceptGuide: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  profile,
  score,
  stage,
  wrongReviews,
  onRetry,
  onReturnToTitle,
  onOpenConceptGuide,
}) => {
  useEffect(() => {
    soundManager.playGameOver();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg max-h-[90vh] glass-panel-glow rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col overflow-hidden border border-rose-500/40">
        
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl glass-panel border border-rose-500/50 flex items-center justify-center text-rose-400 mb-2 animate-pulse shadow-lg shadow-rose-500/20">
            <HeartCrack className="w-9 h-9" />
          </div>
          <span className="text-[10px] uppercase font-black text-rose-400 tracking-widest">MISSION FAILED / 게임 오버</span>
          <h2 className="text-2xl font-black italic tracking-tight text-white mt-0.5">
            목숨이 모두 소진되었어요!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            괜찮아요! 틀린 문제를 다시 확인하고 재도전해 보세요.
          </p>
        </div>

        {/* Score & Stage summary */}
        <div className="flex items-center justify-around glass-panel rounded-2xl p-3 my-4 text-center border border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Stage Reached</span>
            <p className="text-sm font-black text-blue-400">{stage}단계</p>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Final Score</span>
            <p className="text-base font-black text-amber-300 font-mono">{score.toLocaleString()} 점</p>
          </div>
        </div>

        {/* Wrong Questions Review List */}
        {wrongReviews.length > 0 && (
          <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-1 scrollbar-none">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              틀린 문제 복습 노트 ({wrongReviews.length}문제)
            </h4>

            {wrongReviews.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-xl p-3 text-xs space-y-2 border border-white/10"
              >
                {/* Equation & Answer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <FractionView fraction={item.problem.operand1} size="sm" />
                    <span className="text-amber-400">{item.problem.operation}</span>
                    <FractionView fraction={item.problem.operand2} size="sm" />
                    <span>=</span>
                    <div className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-300 font-bold">
                      <FractionView fraction={item.problem.answer} size="sm" textColor="text-emerald-300" />
                    </div>
                  </div>
                  <span className="text-[10px] text-rose-400 font-medium">정답 확인</span>
                </div>

                {/* Explanation text */}
                <p className="text-[11px] text-slate-300 whitespace-pre-line bg-slate-900/60 p-2.5 rounded-lg leading-relaxed border border-white/5 font-sans">
                  💡 {item.problem.explanation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-3 border-t border-white/10 mt-2">
          <button
            onClick={onRetry}
            className="w-full py-3.5 bg-white text-slate-950 font-black text-sm rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer uppercase tracking-tight"
          >
            <RotateCcw className="w-4 h-4 text-slate-950" />
            <span>이 스테이지 다시 도전하기!</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onOpenConceptGuide}
              className="flex-1 py-2.5 glass-panel hover:bg-white/10 text-blue-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-blue-500/30"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>분수 비법서</span>
            </button>

            <button
              onClick={onReturnToTitle}
              className="flex-1 py-2.5 glass-panel hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
            >
              <Home className="w-4 h-4" />
              <span>메인 화면으로</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

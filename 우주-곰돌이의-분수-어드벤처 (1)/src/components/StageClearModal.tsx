import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { StageConfig, PlayerProfile } from '../types/game';
import { soundManager } from '../utils/audio';

interface StageClearModalProps {
  stageConfig: StageConfig;
  profile: PlayerProfile;
  score: number;
  stageScore: number;
  maxCombo: number;
  accuracy: number;
  isLastStage: boolean;
  onNextStage: () => void;
  onReplayStage: () => void;
  onReturnToTitle: () => void;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  stageConfig,
  profile,
  score,
  stageScore,
  maxCombo,
  accuracy,
  isLastStage,
  onNextStage,
  onReplayStage,
  onReturnToTitle,
}) => {
  useEffect(() => {
    soundManager.playStageClear();

    // Fire fireworks confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#38bdf8', '#818cf8', '#f43f5e', '#fbbf24'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#38bdf8', '#818cf8', '#f43f5e', '#fbbf24'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Determine star rating based on accuracy & combo
  let stars = 1;
  if (accuracy >= 85 && maxCombo >= 3) stars = 3;
  else if (accuracy >= 65 || maxCombo >= 2) stars = 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(59,130,246,0.3)] text-center text-slate-100 flex flex-col items-center border border-white/20">
        
        {/* Victory Trophy Badge */}
        <div className="relative -mt-16 mb-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-white p-1 shadow-xl shadow-amber-500/40 flex items-center justify-center animate-bounce" style={{ animationDuration: '2s' }}>
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-amber-400">
              <Trophy className="w-12 h-12" />
            </div>
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-7 h-7 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        {/* Stage Clear Title */}
        <span className="px-4 py-1 glass-panel text-amber-300 border border-amber-400/40 rounded-full text-[10px] uppercase font-black tracking-widest">
          {isLastStage ? '우주 마스터 최종 제패!' : 'STAGE CLEAR / 임무 완료'}
        </span>
        <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400">
          {stageConfig.title} 완료!
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          #{profile.studentNumber} {profile.studentName} 비행사님의 완벽한 분수 항해!
        </p>

        {/* Star Rating */}
        <div className="flex gap-2 my-5">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-10 h-10 transition-all duration-500 ${
                s <= stars
                  ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                  : 'fill-slate-800 text-slate-700 scale-90'
              }`}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full glass-panel rounded-2xl p-4 my-2 border border-white/10">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Stage Score</span>
            <p className="text-base font-black text-amber-300 font-mono">+{stageScore.toLocaleString()}</p>
          </div>
          <div className="space-y-0.5 border-x border-white/10">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Max Combo</span>
            <p className="text-base font-black text-blue-400 font-mono">{maxCombo} COMBO</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Accuracy</span>
            <p className="text-base font-black text-emerald-400 font-mono">{Math.round(accuracy)}%</p>
          </div>
        </div>

        {/* Total Score */}
        <div className="flex items-center justify-between w-full px-4 py-2.5 glass-panel rounded-xl my-2 text-xs border border-white/10">
          <span className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">Total Score</span>
          <span className="text-lg font-black text-white font-mono">{score.toLocaleString()} 점</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-4">
          {!isLastStage ? (
            <button
              onClick={onNextStage}
              className="flex-1 py-3.5 bg-white text-slate-950 font-black text-sm rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-tight"
            >
              <span>Next Stage / 다음 단계</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          ) : (
            <button
              onClick={onReturnToTitle}
              className="flex-1 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-400/40 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-tight"
            >
              <Award className="w-5 h-5 text-slate-950" />
              <span>우주 마스터 명예의 전당 등록</span>
            </button>
          )}

          <button
            onClick={onReplayStage}
            className="px-4 py-3.5 glass-panel hover:bg-white/10 text-slate-200 font-bold text-xs rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>재도전</span>
          </button>
        </div>
      </div>
    </div>
  );
};

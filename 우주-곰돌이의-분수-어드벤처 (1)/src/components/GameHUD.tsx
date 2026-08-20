import React, { useState } from 'react';
import {
  FractionProblem,
  PlayerProfile,
  ActiveBuffs,
  StageConfig,
} from '../types/game';
import { FractionView } from './FractionView';
import {
  Heart,
  Shield,
  Zap,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Sparkles,
  Flame,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  LogOut,
} from 'lucide-react';

interface GameHUDProps {
  currentProblem: FractionProblem;
  profile: PlayerProfile;
  lives: number;
  maxLives: number;
  score: number;
  combo: number;
  stageConfig: StageConfig;
  stageProgress: number;
  requiredQuestions: number;
  activeBuffs: ActiveBuffs;
  isPaused: boolean;
  onTogglePause: () => void;
  onToggleSound: () => void;
  onOpenHint: () => void;
  onExitGame: () => void;
  onJoystickChange: (input: { x: number; y: number }) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentProblem,
  profile,
  lives,
  maxLives,
  score,
  combo,
  stageConfig,
  stageProgress,
  requiredQuestions,
  activeBuffs,
  isPaused,
  onTogglePause,
  onToggleSound,
  onOpenHint,
  onExitGame,
  onJoystickChange,
}) => {
  const [touchActiveDir, setTouchActiveDir] = useState<{ [key: string]: boolean }>({});

  const isMagnet = Date.now() < activeBuffs.magnetUntil;
  const isFreeze = Date.now() < activeBuffs.freezeUntil;
  const isDoubleStar = Date.now() < activeBuffs.doubleStarUntil;
  const isHint = Date.now() < activeBuffs.hintUntil;

  // Touch D-Pad handlers
  const handleTouchDir = (dir: 'up' | 'down' | 'left' | 'right', active: boolean) => {
    const updated = { ...touchActiveDir, [dir]: active };
    setTouchActiveDir(updated);

    let x = 0;
    let y = 0;
    if (updated.left) x -= 1;
    if (updated.right) x += 1;
    if (updated.up) y -= 1;
    if (updated.down) y += 1;

    onJoystickChange({ x, y });
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 md:p-5 select-none z-20">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2 pointer-events-auto">
        {/* Left: Player Info & Lives (Hearts) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 glass-panel rounded-2xl shadow-lg border border-white/10">
            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">
              #{profile.studentNumber}
            </span>
            <span className="text-xs font-black text-white">
              {profile.studentName}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-semibold border border-blue-400/30">
              {stageConfig.stage}단계
            </span>
          </div>

          {/* Hearts (Lives) Bar */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 glass-panel rounded-2xl shadow-lg border border-white/10">
            <div className="flex gap-1.5 items-center">
              {Array.from({ length: maxLives }).map((_, idx) => (
                <Heart
                  key={idx}
                  className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
                    idx < lives
                      ? 'fill-red-500 text-red-500 scale-100 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                      : 'fill-slate-800 text-slate-700 scale-90'
                  }`}
                />
              ))}
            </div>

            {activeBuffs.shield && (
              <div className="flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded-lg bg-blue-950/80 border border-blue-400 text-blue-300 text-[10px] font-black animate-pulse">
                <Shield className="w-3.5 h-3.5 fill-blue-400" />
                <span>SHIELD</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Stage Progress Tracker */}
        <div className="hidden sm:flex flex-col items-center gap-1 px-5 py-2 glass-panel rounded-2xl shadow-lg border border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <span className="text-blue-300 uppercase tracking-wide">{stageConfig.title}</span>
            <span className="text-slate-400 font-mono text-[11px]">
              ({stageProgress} / {requiredQuestions})
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-40 h-2 bg-slate-950/90 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]"
              style={{ width: `${Math.min(100, (stageProgress / requiredQuestions) * 100)}%` }}
            />
          </div>
        </div>

        {/* Right: Score, Combo & Menu Actions */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            {/* Combo Badge */}
            {combo > 1 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{combo} COMBO!</span>
              </div>
            )}

            {/* Score Pill */}
            <div className="px-4 py-1.5 glass-panel rounded-2xl shadow-lg text-right border border-white/10">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block leading-tight">SCORE</span>
              <span className="text-base font-black text-amber-300 font-mono">
                {score.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenHint}
              className="p-2 glass-panel hover:bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 transition-all cursor-pointer shadow-md"
              title="힌트 보기"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleSound}
              className="p-2 glass-panel hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all cursor-pointer"
              title="소리 토글"
            >
              {profile.soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={onTogglePause}
              className="p-2 glass-panel hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all cursor-pointer"
              title="일시정지"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-slate-300" />}
            </button>

            <button
              onClick={onExitGame}
              className="p-2 glass-panel hover:bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 transition-all cursor-pointer"
              title="나가기"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Buffs Pill Indicators */}
      {(isMagnet || isFreeze || isDoubleStar || isHint) && (
        <div className="flex items-center justify-center gap-2 pointer-events-auto mt-2">
          {isMagnet && (
            <span className="px-3 py-1 glass-panel border border-indigo-400/60 rounded-full text-xs font-bold text-indigo-200 flex items-center gap-1 shadow-md animate-pulse">
              🧲 자석 활성
            </span>
          )}
          {isFreeze && (
            <span className="px-3 py-1 glass-panel border border-emerald-400/60 rounded-full text-xs font-bold text-emerald-200 flex items-center gap-1 shadow-md animate-pulse">
              ⏱️ 시간 슬로우
            </span>
          )}
          {isDoubleStar && (
            <span className="px-3 py-1 glass-panel border border-yellow-400/60 rounded-full text-xs font-bold text-yellow-200 flex items-center gap-1 shadow-md animate-pulse">
              🌟 점수 2배
            </span>
          )}
          {isHint && (
            <span className="px-3 py-1 glass-panel border border-amber-400/60 rounded-full text-xs font-bold text-amber-200 flex items-center gap-1 shadow-md animate-pulse">
              💡 레이더 탐지
            </span>
          )}
        </div>
      )}

      {/* Center Top: Floating Math Equation Box */}
      <div className="self-center my-auto pointer-events-auto transform -translate-y-8 md:-translate-y-12">
        <div className="relative px-6 py-4 md:px-8 md:py-5 glass-panel-glow rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.35)] flex items-center gap-3 md:gap-5 animate-pulse border border-white/20">
          {/* Question Tag */}
          <div className="absolute -top-3 left-6 px-3.5 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-[10px] uppercase font-black tracking-widest text-white shadow-md">
            TARGET EQUATION / 정답 분수 수집
          </div>

          {/* Operand 1 */}
          <FractionView
            fraction={currentProblem.operand1}
            size="xl"
            textColor="text-white"
          />

          {/* Operator (+ or -) */}
          <span className="text-3xl md:text-4xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
            {currentProblem.operation}
          </span>

          {/* Operand 2 */}
          <FractionView
            fraction={currentProblem.operand2}
            size="xl"
            textColor="text-white"
          />

          {/* Equals Sign */}
          <span className="text-3xl md:text-4xl font-black text-blue-400">
            =
          </span>

          {/* Target Question Box */}
          <div className="px-4 py-2 bg-blue-950/60 border-2 border-dashed border-blue-400/80 rounded-2xl flex items-center justify-center min-w-[52px] shadow-inner">
            <span className="text-2xl md:text-3xl font-black text-blue-300 animate-bounce">
              ?
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Controls & Onscreen Virtual D-Pad for Touch/Mobile */}
      <div className="flex items-end justify-between w-full pointer-events-auto">
        {/* Desktop Keyboard Helper */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 glass-panel rounded-2xl text-xs text-slate-400 border border-white/10">
          <span className="font-bold text-slate-300 text-[10px] uppercase tracking-widest">Controls:</span>
          <div className="flex gap-1.5 font-mono text-[10px] text-blue-300 items-center">
            <kbd className="px-1.5 py-0.5 bg-slate-900/80 rounded border border-slate-700">W</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-900/80 rounded border border-slate-700">A</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-900/80 rounded border border-slate-700">S</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-900/80 rounded border border-slate-700">D</kbd>
            <span className="text-slate-500 font-sans">또는</span>
            <kbd className="px-2 py-0.5 bg-slate-900/80 rounded border border-slate-700">방향키</kbd>
          </div>
        </div>

        {/* Mobile/Touch Screen Onscreen D-Pad */}
        <div className="flex md:hidden relative w-36 h-36 mx-auto sm:mr-4">
          <div className="absolute inset-0 glass-panel rounded-full border border-white/15 shadow-xl" />

          {/* Up */}
          <button
            onTouchStart={() => handleTouchDir('up', true)}
            onTouchEnd={() => handleTouchDir('up', false)}
            onMouseDown={() => handleTouchDir('up', true)}
            onMouseUp={() => handleTouchDir('up', false)}
            className="absolute top-1 left-1/2 -translate-x-1/2 w-11 h-11 bg-slate-800/80 active:bg-blue-600 rounded-2xl flex items-center justify-center text-white border border-slate-600 shadow-md active:scale-95 transition-all"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Down */}
          <button
            onTouchStart={() => handleTouchDir('down', true)}
            onTouchEnd={() => handleTouchDir('down', false)}
            onMouseDown={() => handleTouchDir('down', true)}
            onMouseUp={() => handleTouchDir('down', false)}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-11 h-11 bg-slate-800/80 active:bg-blue-600 rounded-2xl flex items-center justify-center text-white border border-slate-600 shadow-md active:scale-95 transition-all"
          >
            <ArrowDown className="w-5 h-5" />
          </button>

          {/* Left */}
          <button
            onTouchStart={() => handleTouchDir('left', true)}
            onTouchEnd={() => handleTouchDir('left', false)}
            onMouseDown={() => handleTouchDir('left', true)}
            onMouseUp={() => handleTouchDir('left', false)}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-11 h-11 bg-slate-800/80 active:bg-blue-600 rounded-2xl flex items-center justify-center text-white border border-slate-600 shadow-md active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Right */}
          <button
            onTouchStart={() => handleTouchDir('right', true)}
            onTouchEnd={() => handleTouchDir('right', false)}
            onMouseDown={() => handleTouchDir('right', true)}
            onMouseUp={() => handleTouchDir('right', false)}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 bg-slate-800/80 active:bg-blue-600 rounded-2xl flex items-center justify-center text-white border border-slate-600 shadow-md active:scale-95 transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

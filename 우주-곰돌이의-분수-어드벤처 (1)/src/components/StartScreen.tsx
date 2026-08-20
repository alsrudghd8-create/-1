import React, { useState } from 'react';
import { PlayerProfile, BearSkin } from '../types/game';
import { BEAR_SKINS, STAGE_CONFIGS } from '../utils/mathGenerator';
import { 
  Rocket, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Music, 
  BookOpen, 
  Trophy, 
  Play, 
  User, 
  Hash, 
  Shield, 
  Heart, 
  Compass,
  Zap
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StartScreenProps {
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onStartGame: (selectedStage: number) => void;
  onOpenConceptGuide: () => void;
  onOpenHallOfFame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  profile,
  onUpdateProfile,
  onStartGame,
  onOpenConceptGuide,
  onOpenHallOfFame,
}) => {
  const [studentNumber, setStudentNumber] = useState(profile.studentNumber);
  const [studentName, setStudentName] = useState(profile.studentName);
  const [selectedSkin, setSelectedSkin] = useState<BearSkin>(profile.skin);
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [soundOn, setSoundOn] = useState(profile.soundEnabled);
  const [bgmOn, setBgmOn] = useState(profile.bgmEnabled);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSoundToggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setSoundMuted(!next);
    onUpdateProfile({ ...profile, soundEnabled: next });
  };

  const handleBgmToggle = () => {
    const next = !bgmOn;
    setBgmOn(next);
    soundManager.setBgmMuted(!next);
    onUpdateProfile({ ...profile, bgmEnabled: next });
  };

  const handleLaunch = () => {
    soundManager.ensureContext();
    if (!studentNumber.trim()) {
      setErrorMsg('출석 번호(학번)를 입력해주세요! (예: 15)');
      return;
    }
    if (!studentName.trim()) {
      setErrorMsg('탐험가 이름을 입력해주세요! (예: 곰돌이)');
      return;
    }

    setErrorMsg('');
    const updatedProfile: PlayerProfile = {
      studentNumber: studentNumber.trim(),
      studentName: studentName.trim(),
      skin: selectedSkin,
      soundEnabled: soundOn,
      bgmEnabled: bgmOn,
    };

    onUpdateProfile(updatedProfile);
    soundManager.playItem();
    if (bgmOn) {
      soundManager.startBGM();
    }
    onStartGame(selectedStage);
  };

  const currentSkinInfo = BEAR_SKINS.find((s) => s.id === selectedSkin) || BEAR_SKINS[0];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950 overflow-x-hidden text-slate-100 select-none" style={{ background: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)' }}>
      {/* Artistic Flair Background Nebulas and Stars */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/20 top-[-100px] left-[-100px] rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 bottom-[-100px] right-[-100px] rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute w-2 h-2 top-20 left-40 bg-white rounded-full opacity-60 shadow-[0_0_10px_#fff]" />
      <div className="absolute w-1 h-1 top-60 left-80 bg-blue-300 rounded-full opacity-80 shadow-[0_0_8px_#60a5fa]" />
      <div className="absolute w-1.5 h-1.5 top-1/4 right-1/4 bg-purple-300 rounded-full opacity-70 shadow-[0_0_8px_#c084fc]" />
      <div className="absolute w-2 h-2 bottom-1/3 left-16 bg-white rounded-full opacity-40" />
      <div className="absolute w-1.5 h-1.5 bottom-12 right-28 bg-blue-200 rounded-full opacity-75" />

      {/* Floating Sample Math Equations for Artistic Flair */}
      <div className="absolute top-10 right-8 hidden lg:flex flex-col space-y-3 items-end pointer-events-none z-10">
        <div className="glass-panel px-4 py-2 rounded-full text-xs font-mono text-blue-300 shadow-lg animate-floating" style={{ animationDelay: '0.5s' }}>
          ✨ 1/5 + 2/5 = 3/5
        </div>
        <div className="glass-panel px-4 py-2 rounded-full text-xs font-mono text-purple-300 shadow-lg animate-floating" style={{ animationDelay: '2s' }}>
          🚀 1 - 3/7 = 4/7
        </div>
        <div className="glass-panel px-4 py-2 rounded-full text-xs font-mono text-pink-300 shadow-lg animate-floating" style={{ animationDelay: '3.5s' }}>
          ⭐ 2 1/4 + 1 2/4 = 3 3/4
        </div>
      </div>

      {/* Top Header Controls (Sound, Guide, Hall of Fame) */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 glass-panel rounded-full text-xs font-bold text-blue-300 flex items-center gap-2 shadow-sm border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
            초등 4학년 2학기 수학
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-medium tracking-wide">
            분수의 덧셈과 뺄셈 우주 미션
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenConceptGuide}
            className="flex items-center gap-1.5 px-3.5 py-2 glass-panel hover:bg-white/10 rounded-xl text-xs font-bold text-blue-200 transition-all cursor-pointer shadow-md hover:scale-105 border border-blue-500/30"
            title="분수 개념 비법서"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">분수 비법서</span>
          </button>

          <button
            onClick={onOpenHallOfFame}
            className="flex items-center gap-1.5 px-3.5 py-2 glass-panel hover:bg-white/10 rounded-xl text-xs font-bold text-amber-200 transition-all cursor-pointer shadow-md hover:scale-105 border border-amber-500/30"
            title="명예의 전당"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">명예의 전당</span>
          </button>

          <button
            onClick={handleBgmToggle}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              bgmOn
                ? 'glass-panel border-purple-500/50 text-purple-300 shadow-md'
                : 'glass-panel text-slate-500 border-white/5 opacity-60'
            }`}
            title="배경음악 토글"
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={handleSoundToggle}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              soundOn
                ? 'glass-panel border-blue-500/50 text-blue-300 shadow-md'
                : 'glass-panel text-slate-500 border-white/5 opacity-60'
            }`}
            title="효과음 토글"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Title Hero Banner */}
      <div className="relative z-10 text-center max-w-3xl mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-blue-200 text-xs font-semibold mb-3 border border-blue-400/20 shadow-sm">
          <Rocket className="w-3.5 h-3.5 text-blue-400" />
          <span className="tracking-wide">우주를 유영하며 정답 분수를 먹고 하트를 지켜라!</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 drop-shadow-[0_10px_25px_rgba(59,130,246,0.3)] leading-tight">
          우주 분수 대모험
        </h1>
        <p className="text-slate-400 text-xs md:text-sm tracking-widest uppercase font-semibold mt-1">
          Space Fraction Adventure: Grade 4 Phase
        </p>
      </div>

      {/* Central Input & Setup Card */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Col: Astronaut Registration Form (번호 & 이름 입력) */}
        <div className="lg:col-span-7 glass-panel-glow rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between border border-white/15">
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                <Rocket className="w-6 h-6 animate-bounce" style={{ animationDuration: '2.5s' }} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">우주 비행사 등록</h2>
                <p className="text-xs text-slate-400">학생 번호와 이름을 입력하고 출항 준비를 마치세요!</p>
              </div>
            </div>

            {/* Input fields with Artistic Flair Micro Labels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-blue-400 font-bold ml-1 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-blue-400" />
                  Student ID / 번호
                </label>
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="예: 2401"
                  maxLength={10}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-base font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-purple-400 font-bold ml-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-purple-400" />
                  Name / 이름
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="홍길동"
                  maxLength={12}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-base font-bold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
                />
              </div>
            </div>

            {/* Stage Selector */}
            <div className="space-y-2 pt-1">
              <label className="text-[10px] uppercase tracking-widest text-blue-300 font-bold ml-1 flex items-center gap-1">
                <Compass className="w-3 h-3 text-blue-400" />
                Stage Select / 스테이지 난이도
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STAGE_CONFIGS.map((st) => (
                  <button
                    key={st.stage}
                    onClick={() => setSelectedStage(st.stage)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedStage === st.stage
                        ? 'bg-blue-600/30 border-blue-400 shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-300">{st.stage}단계</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono">
                        {st.stage === 1 ? '기초' : st.stage === 5 ? '킬러' : st.stage === 6 ? '마스터' : '도전'}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-200 truncate mt-1">{st.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Bear Skin Selector */}
            <div className="space-y-2 pt-1">
              <label className="text-[10px] uppercase tracking-widest text-purple-300 font-bold ml-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Astronaut Suit / 수트 선택
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {BEAR_SKINS.map((skin) => (
                  <button
                    key={skin.id}
                    onClick={() => setSelectedSkin(skin.id as BearSkin)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                      selectedSkin === skin.id
                        ? 'bg-purple-900/40 border-purple-400 text-white shadow-md shadow-purple-500/20'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner"
                      style={{ backgroundColor: skin.suitColor }}
                    />
                    <span className="text-xs font-bold">{skin.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs font-bold text-rose-300 text-center animate-shake">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Launch Button with Artistic Flair White Glow */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={handleLaunch}
              className="w-full bg-white text-slate-950 font-black py-4 rounded-xl text-lg md:text-xl hover:scale-105 active:scale-95 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] uppercase tracking-tight flex items-center justify-center gap-3 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-current text-slate-950" />
              <span>Game Start / 시작하기</span>
            </button>
          </div>
        </div>

        {/* Right Col: Live Space Bear Preview & Item Manual */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Animated Space Bear Card */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute top-3 right-4 text-[10px] text-slate-400 font-mono tracking-widest">
              SUIT STATUS: READY
            </div>
            
            {/* Bear Avatar with Floating Animation and Heart Badge */}
            <div className="relative w-40 h-40 my-2 flex items-center justify-center animate-floating">
              {/* Outer Helmet Glow */}
              <div className="bear-helmet-glow w-36 h-36 rounded-full mx-auto flex items-center justify-center overflow-hidden relative shadow-2xl">
                <svg viewBox="0 0 120 120" className="w-28 h-28 relative z-10 drop-shadow-2xl">
                  {/* Thruster Jetpack Flames */}
                  <path d="M40,95 Q50,118 45,110" stroke="#f97316" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
                  <path d="M80,95 Q70,118 75,110" stroke="#f97316" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
                  
                  {/* Astronaut Backpack / Jetpack */}
                  <rect x="35" y="45" width="50" height="45" rx="10" fill="#64748b" />
                  <circle cx="60" cy="65" r="10" fill="#0284c7" />

                  {/* Bear Suit Body */}
                  <ellipse cx="60" cy="72" rx="30" ry="26" fill={currentSkinInfo.suitColor} stroke="#0f172a" strokeWidth="3" />
                  <ellipse cx="60" cy="74" rx="18" ry="14" fill="#cbd5e1" opacity="0.6" />

                  {/* Bear Ears */}
                  <circle cx="35" cy="30" r="14" fill={currentSkinInfo.earColor} stroke="#0f172a" strokeWidth="2.5" />
                  <circle cx="35" cy="30" r="8" fill="#fda4af" />
                  <circle cx="85" cy="30" r="14" fill={currentSkinInfo.earColor} stroke="#0f172a" strokeWidth="2.5" />
                  <circle cx="85" cy="30" r="8" fill="#fda4af" />

                  {/* Astronaut Helmet Bubble */}
                  <circle cx="60" cy="46" r="32" fill="rgba(224, 242, 254, 0.4)" stroke={currentSkinInfo.accentColor} strokeWidth="3.5" />

                  {/* Bear Head */}
                  <circle cx="60" cy="46" r="22" fill={currentSkinInfo.earColor} />
                  
                  {/* Bear Snout */}
                  <ellipse cx="60" cy="52" rx="11" ry="8" fill="#fef08a" />
                  <ellipse cx="60" cy="48" rx="4" ry="2.5" fill="#0f172a" />
                  {/* Bear Smile */}
                  <path d="M56,53 Q60,57 64,53" stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                  {/* Bear Eyes (Sparkling) */}
                  <circle cx="51" cy="42" r="3" fill="#0f172a" />
                  <circle cx="52" cy="41" r="1" fill="#ffffff" />
                  <circle cx="69" cy="42" r="3" fill="#0f172a" />
                  <circle cx="70" cy="41" r="1" fill="#ffffff" />

                  {/* Helmet Visor Reflection */}
                  <path d="M42,32 Q60,24 78,32" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" fill="none" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
              </div>

              {/* Red Heart Badge on Top Right */}
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-2.5 shadow-lg flex items-center justify-center shadow-red-500/50">
                <Heart className="w-4 h-4 fill-white" />
              </div>
            </div>

            <h3 className="text-base font-black text-white mt-1">{currentSkinInfo.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentSkinInfo.description}</p>
          </div>

          {/* Quick Rules & Power-ups Card */}
          <div className="glass-panel rounded-3xl p-5 flex-1 flex flex-col justify-between border border-white/10">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
              <Zap className="w-4 h-4 text-amber-400" />
              우주 특수 아이템 안내
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-base">💖</span>
                <div>
                  <p className="font-bold text-pink-300">생명 하트</p>
                  <p className="text-[10px] text-slate-400">목숨 +1 회복</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-base">🛡️</span>
                <div>
                  <p className="font-bold text-sky-300">우주 쉴드</p>
                  <p className="text-[10px] text-slate-400">오답 1회 방어</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-base">🧲</span>
                <div>
                  <p className="font-bold text-indigo-300">별빛 자석</p>
                  <p className="text-[10px] text-slate-400">정답 자동 흡수</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-base">⏱️</span>
                <div>
                  <p className="font-bold text-emerald-300">시간 정지</p>
                  <p className="text-[10px] text-slate-400">오답/운석 감속</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-base">💣</span>
                <div>
                  <p className="font-bold text-amber-300">오답 폭탄</p>
                  <p className="text-[10px] text-slate-400">화면 오답 폭파</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-base">💡</span>
                <div>
                  <p className="font-bold text-yellow-300">정답 레이더</p>
                  <p className="text-[10px] text-slate-400">정답 황금 오라</p>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-blue-950/40 rounded-xl border border-blue-500/30 flex items-center justify-between text-[11px] text-blue-200">
              <span>🎮 조작: 방향키 / WASD / 화면 터치</span>
              <span className="font-bold text-amber-300">기본 목숨 5개</span>
            </div>
          </div>
        </div>

      </div>

      {/* Artistic Flair Bottom Quick Stats Row */}
      <div className="relative z-10 flex items-center justify-center space-x-8 md:space-x-12 pt-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-red-500 text-lg border border-white/10 shadow-md">
            ❤️
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Lives</p>
            <p className="text-base font-bold text-white">5 / 5</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-blue-400 text-lg border border-white/10 shadow-md">
            🚀
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Mission</p>
            <p className="text-base font-bold text-white">4학년 2학기 분수</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-yellow-400 text-lg border border-white/10 shadow-md">
            ⭐
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Items</p>
            <p className="text-base font-bold text-white">자석, 보호막</p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="relative z-10 mt-6 text-center text-xs text-slate-500 tracking-wide">
        초등학교 4학년 2학기 수학과 교육과정 | 분수의 덧셈과 뺄셈 에듀케이션 아케이드
      </footer>

      {/* Bottom glowing aura */}
      <div className="absolute bottom-0 w-full h-32 opacity-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #3b82f6, transparent)' }} />
    </div>
  );
};

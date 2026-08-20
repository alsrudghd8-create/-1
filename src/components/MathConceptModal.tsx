import React, { useState } from 'react';
import { X, BookOpen, Sparkles, CheckCircle2, ChevronRight, AlertTriangle, ArrowRight } from 'lucide-react';
import { FractionView } from './FractionView';

interface MathConceptModalProps {
  onClose: () => void;
}

export const MathConceptModal: React.FC<MathConceptModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const concepts = [
    {
      title: '1. 진분수의 덧셈과 뺄셈',
      badge: '기초 핵심',
      icon: '🍕',
      summary: '분모는 절대 더하거나 빼지 않고 그대로 두고, 분자끼리만 계산해요!',
      rules: [
        {
          formula: '2/7 + 3/7 = 5/7',
          desc: '피자 7조각 중 2조각과 3조각을 합치면 7조각 중 5조각이 됩니다.',
          visual: [
            { total: 7, filled: 2, color: 'bg-sky-500', label: '2/7' },
            { total: 7, filled: 3, color: 'bg-indigo-500', label: '3/7' },
            { total: 7, filled: 5, color: 'bg-emerald-500', label: '합 = 5/7' },
          ],
        },
        {
          formula: '6/8 - 2/8 = 4/8',
          desc: '8조각 중 6조각에서 2조각을 먹으면 4조각이 남습니다.',
        },
      ],
      dangerTip: '주의! 분모끼리 더해서 2/7 + 3/7 = 5/14 로 쓰면 안 돼요! 분모는 크기(기준)이므로 변하지 않아요.',
    },
    {
      title: '2. 합이 1보다 큰 진분수의 덧셈',
      badge: '가분수 → 대분수',
      icon: '✨',
      summary: '분자끼리 더해서 분모보다 크거나 같아지면 1과 몇 분의 몇(대분수)으로 바꿔요!',
      rules: [
        {
          formula: '3/5 + 4/5 = 7/5 = 1과 2/5',
          desc: '분자끼리 더하면 7/5가 됩니다. 7조각 중 5조각은 피자 온전한 1판이 되고, 2조각이 남으므로 1과 2/5가 됩니다!',
        },
      ],
      dangerTip: '7/5는 가분수 형태이고, 4학년 수학에서는 대분수(1과 2/5)로 고쳐 쓰는 것을 배웁니다.',
    },
    {
      title: '3. 자연수와 분수의 뺄셈',
      badge: '자연수 변신',
      icon: '🔄',
      summary: '자연수 1을 분모와 분자가 같은 분수로 변신시켜서 빼줍니다!',
      rules: [
        {
          formula: '1 - 3/5 = 5/5 - 3/5 = 2/5',
          desc: '자연수 1을 5/5로 바꾸면 분모가 같아져서 쉽게 뺄 수 있습니다.',
        },
        {
          formula: '3 - 1과 2/7 = 2와 7/7 - 1과 2/7 = 1과 5/7',
          desc: '자연수 3에서 1을 빌려와 2와 7/7로 바꾼 뒤 대분수를 뺍니다.',
        },
      ],
      dangerTip: '자연수에서 1을 빌려올 때, 뒤 분수의 분모와 같은 분수로 바꿔주세요! (예: 분모가 7이면 7/7)',
    },
    {
      title: '4. 대분수의 덧셈 (받아올림)',
      badge: '자연수 + 분수',
      icon: '🚀',
      summary: '자연수는 자연수끼리, 분수는 분수끼리 더하고, 분수의 합이 1 이상이면 자연수로 올려줘요!',
      rules: [
        {
          formula: '1과 4/7 + 2과 5/7',
          desc: '1. 자연수끼리: 1 + 2 = 3\n2. 분수끼리: 4/7 + 5/7 = 9/7 = 1과 2/7\n3. 합치기: 3 + 1과 2/7 = 4과 2/7!',
        },
      ],
      dangerTip: '분수끼리 더해서 9/7가 되었을 때 3과 9/7로 끝내지 않고, 1을 자연수에 올려 4과 2/7로 완성해야 정답입니다.',
    },
    {
      title: '5. 대분수의 뺄셈 (받아내림 - 킬러)',
      badge: '자연수 빌려오기',
      icon: '💡',
      summary: '앞 분수의 분자가 작아서 뺄 수 없을 때는 자연수에서 1을 빌려와 가분수로 만들어 뺍니다!',
      rules: [
        {
          formula: '3과 1/5 - 1과 4/5',
          desc: '1. 1/5에서 4/5를 뺄 수 없어요!\n2. 3에서 1을 빌려와 2와 6/5 (1 = 5/5)로 변신!\n3. 2와 6/5 - 1과 4/5\n4. 자연수: 2 - 1 = 1, 분수: (6-4)/5 = 2/5\n5. 정답: 1과 2/5!',
        },
      ],
      dangerTip: '가장 많이 하는 실수: 3과 1/5 - 1과 4/5에서 큰 분자 4에서 1을 그냥 빼서 2와 3/5로 쓰면 오답입니다! 반드시 1을 빌려와야 해요.',
    },
  ];

  const current = concepts[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-panel-glow rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 border border-white/20">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 glass-panel border border-blue-400/40 rounded-2xl text-blue-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400">
                4학년 2학기 분수 비법서
              </h2>
              <p className="text-xs text-slate-400">분수의 덧셈과 뺄셈 핵심 개념 및 필승 풀이법</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 p-3 bg-slate-950/30 border-b border-white/10 scrollbar-none">
          {concepts.map((c, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-102'
                  : 'glass-panel text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.badge}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="glass-panel border border-blue-500/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-black text-blue-300 flex items-center gap-2">
                <span>{current.icon}</span>
                {current.title}
              </h3>
              <span className="px-3 py-0.5 text-xs font-semibold glass-panel text-blue-300 border border-blue-400/40 rounded-full">
                {current.badge}
              </span>
            </div>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">{current.summary}</p>
          </div>

          {/* Rules & Examples */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              핵심 계산 예시 및 단계별 풀이
            </h4>

            {current.rules.map((r, i) => (
              <div key={i} className="glass-panel rounded-2xl p-4 space-y-3 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-black border border-blue-500/30">
                    {i + 1}
                  </span>
                  <span className="text-base font-black text-amber-300 font-mono tracking-wide">
                    {r.formula}
                  </span>
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed pl-9 font-sans">
                  {r.desc}
                </p>

                {/* Visual fraction bar diagram if provided */}
                {r.visual && (
                  <div className="mt-3 pl-9 space-y-2">
                    {r.visual.map((v, vi) => (
                      <div key={vi} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>{v.label}</span>
                          <span>{v.filled}/{v.total} 조각</span>
                        </div>
                        <div className="flex h-5 w-full bg-slate-950/80 rounded-lg overflow-hidden border border-white/10">
                          {Array.from({ length: v.total }).map((_, bi) => (
                            <div
                              key={bi}
                              className={`flex-1 border-r border-slate-800 last:border-r-0 transition-all ${
                                bi < v.filled ? v.color : 'bg-transparent'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Danger / Misconception Warning Box */}
          <div className="glass-panel border border-rose-500/40 rounded-2xl p-4 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wide">시험에서 가장 자주 틀리는 함정!</h5>
              <p className="text-xs text-rose-200/90 leading-relaxed font-sans">{current.dangerTip}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-950/60">
          <div className="text-xs text-slate-400">
            {activeTab < concepts.length - 1 ? (
              <span>다음 비법: {concepts[activeTab + 1].badge}</span>
            ) : (
              <span className="text-emerald-400 font-bold">모든 분수 비법 마스터 완료!</span>
            )}
          </div>
          <div className="flex gap-2">
            {activeTab < concepts.length - 1 ? (
              <button
                onClick={() => setActiveTab((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 glass-panel hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/15"
              >
                다음 비법 보기
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-102 uppercase"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                우주 비행 시작하기!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

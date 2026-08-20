import React from 'react';
import { X, Trophy, Medal, Trash2, User, Star } from 'lucide-react';
import { GameScoreRecord } from '../types/game';

interface HallOfFameModalProps {
  records: GameScoreRecord[];
  onClose: () => void;
  onClearRecords: () => void;
}

export const HallOfFameModal: React.FC<HallOfFameModalProps> = ({
  records,
  onClose,
  onClearRecords,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl max-h-[85vh] glass-panel-glow rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col overflow-hidden border border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 glass-panel text-amber-400 rounded-2xl border border-amber-400/40">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tight text-white flex items-center gap-2">
                HALL OF FAME / 명예의 전당
              </h2>
              <p className="text-xs text-slate-400">우리 반 최고 분수 탐험가들의 명예 랭킹</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 scrollbar-none">
          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Star className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
              <p className="text-sm font-bold text-slate-400">아직 등록된 우주 비행 기록이 없습니다.</p>
              <p className="text-xs text-slate-500">게임을 플레이하고 첫 번째 명예의 주인공이 되어보세요!</p>
            </div>
          ) : (
            records.map((r, idx) => {
              const rank = idx + 1;
              return (
                <div
                  key={r.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    rank === 1
                      ? 'glass-panel border-amber-400/60 shadow-lg shadow-amber-500/10'
                      : rank === 2
                      ? 'glass-panel border-slate-300/50 shadow-md'
                      : rank === 3
                      ? 'glass-panel border-amber-700/50 shadow-md'
                      : 'glass-panel border-white/5 opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
                      {rank === 1 ? (
                        <span className="text-xl">🥇</span>
                      ) : rank === 2 ? (
                        <span className="text-xl">🥈</span>
                      ) : rank === 3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-slate-400 text-xs font-mono">{rank}위</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-400">#{r.studentNumber}</span>
                        <span className="text-sm font-black text-white">{r.studentName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/40 border border-blue-400/20 text-blue-300 font-semibold">
                          {r.stageReached}단계 도달
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                        최고 콤보 {r.maxCombo}회 | 정답률 {Math.round(r.accuracy)}% | {r.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-amber-300 font-mono">
                      {r.score.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">점</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
          {records.length > 0 ? (
            <button
              onClick={onClearRecords}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>기록 초기화</span>
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-slate-950 font-black rounded-xl hover:scale-102 transition-all cursor-pointer uppercase text-xs shadow-md"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

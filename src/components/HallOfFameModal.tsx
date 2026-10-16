import React from 'react';
import { HallOfFameEntry } from '../types/game';
import { Trophy, X, Skull, Award, Trash2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HallOfFameModalProps {
  entries: HallOfFameEntry[];
  onClose: () => void;
  onClearHistory: () => void;
}

export const HallOfFameModal: React.FC<HallOfFameModalProps> = ({ entries, onClose, onClearHistory }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-100">Ancestral Hall of Fame</h2>
              <p className="text-xs text-slate-400">Memorial records of your past Nigerian lives</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <Skull className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-medium text-slate-400">No departed souls in the records yet.</p>
              <p className="text-xs mt-1">Live your first Nigerian journey to the fullest!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-display font-bold text-slate-100 text-base">{entry.name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Aged {entry.finalAge}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{entry.city}</span>
                      <span aria-hidden="true">·</span>
                      <span>{entry.highestCareer}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono-numbers font-bold text-emerald-400 block">
                      ₦{entry.netWorthNaira.toLocaleString()}
                    </span>
                    {entry.japaAchieved && (
                      <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                        ★ Japa Expatriate
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs italic text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-800/50 mb-2">
                  "{entry.causeOfDeath}"
                </p>

                {entry.titles.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.titles.map((title, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {entries.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                soundEngine.playClick();
                if (confirm('Are you sure you want to clear all ancestral records?')) {
                  onClearHistory();
                }
              }}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Hall of Fame</span>
            </button>
            <span className="text-slate-500 font-mono-numbers">{entries.length} Lives Recorded</span>
          </div>
        )}
      </div>
    </div>
  );
};

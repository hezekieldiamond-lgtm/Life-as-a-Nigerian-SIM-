import React from 'react';
import { CharacterState } from '../types/game';
import { Avatar } from './Avatar';
import { soundEngine } from '../utils/audio';
import { Award, Trophy, RotateCcw, Skull } from 'lucide-react';

interface ObituaryModalProps {
  character: CharacterState;
  onSaveAndRestart: () => void;
}

export const ObituaryModal: React.FC<ObituaryModalProps> = ({ character, onSaveAndRestart }) => {
  const isOldAge = character.age >= 70;
  const headline = isOldAge
    ? 'CELEBRATION OF A GLORIOUS & WELL-LIVED LIFE'
    : 'GONE TOO SOON: HEAVY HEARTS ACROSS THE NATION';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Ornate Gold Border & Background Pattern */}
        <div className="absolute inset-0 border-8 border-amber-500/10 pointer-events-none rounded-3xl" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Traditional Poster Banner */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-widest font-extrabold text-amber-400 mb-1">
            Official Obituary & Memorial Announcement
          </p>
          <h2 className="text-xl sm:text-2xl font-display font-black text-amber-300 tracking-wide border-b border-amber-500/30 pb-3">
            {headline}
          </h2>
        </div>

        {/* Center Portrait */}
        <div className="my-5 flex flex-col items-center">
          <div className="p-2 rounded-3xl bg-amber-500/20 border-2 border-amber-400/80 shadow-xl">
            <Avatar character={character} size="xl" />
          </div>
          <h3 className="text-2xl font-display font-extrabold text-slate-100 mt-4">
            {character.name}
          </h3>
          {character.titles.length > 0 && (
            <p className="text-sm font-semibold text-amber-400 mt-0.5">
              {character.titles.join(' · ')}
            </p>
          )}
          <p className="text-xs text-slate-400 font-mono-numbers mt-1">
            {character.year - character.age} — {character.year} (Aged {character.age} Years)
          </p>
        </div>

        {/* Cause of Departure */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 mb-5 text-xs text-slate-300">
          <span className="text-slate-500 font-semibold block mb-0.5">Cause of Transition:</span>
          <span className="italic text-slate-200">
            {character.causeOfDeath || 'Passed away peacefully surrounded by family and loved ones.'}
          </span>
        </div>

        {/* Life Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6 text-left">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Final Net Worth</span>
            <span className="font-mono-numbers text-sm font-bold text-emerald-400">
              ₦{character.cashNaira.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Highest Career</span>
            <span className="text-xs font-semibold text-slate-200 truncate block">
              {character.currentJob ? character.currentJob.title : 'Independent Hustler'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-500 block">Home City</span>
            <span className="text-xs font-semibold text-amber-300 capitalize block">
              {character.city}
            </span>
          </div>
        </div>

        {/* Achievements Badge strip */}
        {character.achievements.length > 0 && (
          <div className="mb-6 text-left">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Honors & Achievements
            </div>
            <div className="flex flex-wrap gap-1.5">
              {character.achievements.map((ach, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg"
                >
                  {ach}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Restart Action */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onSaveAndRestart();
          }}
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-extrabold text-base rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5 text-slate-950" />
          <span>Rest in Power & Reincarnate a New Life</span>
        </button>
      </div>
    </div>
  );
};

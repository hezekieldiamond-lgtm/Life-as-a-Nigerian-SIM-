import React from 'react';
import { YearLog, CharacterState } from '../types/game';
import { Avatar } from './Avatar';
import { Calendar, ChevronRight, Zap, Award } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ChronicleFeedProps {
  logs: YearLog[];
  character: CharacterState;
  onAdvanceAge: () => void;
  onOpenAvatarCustomizer: () => void;
}

export const ChronicleFeed: React.FC<ChronicleFeedProps> = ({
  logs,
  character,
  onAdvanceAge,
  onOpenAvatarCustomizer,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-full">
      {/* Top Profile Card Summary */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800/80 mb-5">
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAvatarCustomizer();
          }}
          className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl"
          title="Click to customize wardrobe & style"
        >
          <Avatar character={character} size="lg" />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-xs text-amber-300 font-medium">
            Edit Style
          </div>
        </button>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-xl font-display font-bold text-slate-100">{character.name}</h1>
            {character.titles.length > 0 && (
              <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {character.titles[character.titles.length - 1]}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <span>{character.gender === 'male' ? 'Male' : 'Female'}</span>
            <span aria-hidden="true">·</span>
            <span>Origin: {character.background === 'silver_spoon' ? 'Silver Spoon' : character.background === 'middle_class' ? 'Middle Class' : 'Trench Kid'}</span>
            <span aria-hidden="true">·</span>
            <span>Education: {character.education.replace('_', ' ').toUpperCase()}</span>
          </div>

          {/* Living Situation & Vehicle */}
          <div className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 flex flex-wrap gap-x-4 gap-y-1">
            <div>
              <span className="text-slate-500">Home:</span> {character.home.name}
            </div>
            {character.vehicle && (
              <div>
                <span className="text-slate-500">Ride:</span> {character.vehicle.name}
              </div>
            )}
            {character.generator && (
              <div>
                <span className="text-slate-500">Power:</span> {character.generator.name}
              </div>
            )}
          </div>
        </div>

        {/* Primary Action Button: Age +1 */}
        <div className="sm:self-center shrink-0 w-full sm:w-auto">
          <button
            onClick={() => {
              soundEngine.playClick();
              onAdvanceAge();
            }}
            className="w-full sm:w-auto py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-extrabold text-base rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 group"
          >
            <Zap className="w-5 h-5 text-slate-950 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>Age +1 Year</span>
            <ChevronRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>

      {/* Chronicle Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-400" /> Life Chronicle
        </h2>
        <span className="text-xs text-slate-500 font-mono-numbers">
          {logs.length} {logs.length === 1 ? 'Year' : 'Years'} Lived
        </span>
      </div>

      {/* Scrollable Year History Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[460px]">
        {logs.map((log) => (
          <div
            key={log.age}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 transition-colors hover:border-slate-700"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-display font-bold text-amber-400">
                Age {log.age} · Year {log.year}
              </span>
              <span className="font-mono-numbers text-slate-400 text-xs">
                Net Worth: ₦{log.netWorthNaira.toLocaleString()}
              </span>
            </div>

            <p className="text-slate-200 text-sm font-medium mb-1">{log.summary}</p>

            {log.events.length > 0 && (
              <ul className="space-y-1 mt-2 pt-2 border-t border-slate-800/60">
                {log.events.map((evt, idx) => (
                  <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                    <span className="text-amber-500/80 font-bold shrink-0">·</span>
                    <span>{evt}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

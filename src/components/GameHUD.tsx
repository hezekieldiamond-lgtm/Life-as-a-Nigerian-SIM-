import React from 'react';
import { CharacterState } from '../types/game';
import { CITIES } from '../data/cities';
import { Volume2, VolumeX, Heart, Sparkles, Brain, Shield, Flame, Wallet, Trophy, User, Newspaper } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface GameHUDProps {
  character: CharacterState;
  onOpenProfile: () => void;
  onOpenHallOfFame: () => void;
  onOpenPressArchive: () => void;
  onToggleSound: () => void;
  isMuted: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  character,
  onOpenProfile,
  onOpenHallOfFame,
  onOpenPressArchive,
  onToggleSound,
  isMuted,
}) => {
  const city = CITIES[character.city];

  // Sapa meter color and text
  const getSapaStatus = (val: number) => {
    if (val <= 20) return { label: 'Balling', color: 'text-emerald-400', bar: 'bg-emerald-500' };
    if (val <= 50) return { label: 'Surviving', color: 'text-amber-400', bar: 'bg-amber-500' };
    if (val <= 75) return { label: 'Sapa is Real', color: 'text-orange-400', bar: 'bg-orange-500' };
    return { label: 'Sapa Choke!', color: 'text-rose-400', bar: 'bg-rose-500 animate-pulse' };
  };

  const sapa = getSapaStatus(character.sapaLevel);

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Zone 1: Identity & Location */}
        <div className="flex items-center justify-between lg:justify-start gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenProfile();
              }}
              className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1 transition-colors hover:bg-slate-800/60"
            >
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-slate-100 group-hover:text-amber-400 transition-colors">
                  {character.name}
                </span>
                <span className="text-xs text-slate-400 font-mono-numbers">
                  Age {character.age} · {character.year}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-amber-400 font-medium">{city?.name}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[160px]">{character.currentJob ? character.currentJob.title : 'Unemployed / Hustling'}</span>
              </div>
            </button>
          </div>

          {/* Quick HUD controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onToggleSound}
              aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={onOpenPressArchive}
              aria-label="Daily Times Press Archive"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Newspaper className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={onOpenHallOfFame}
              aria-label="Hall of Fame"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Zone 2: Vitals & Sapa Meter */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-4 items-center">
          {/* Health */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl px-2.5 py-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Health
              </span>
              <span className="font-mono-numbers text-slate-200">{character.health}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all duration-300" style={{ width: `${character.health}%` }} />
            </div>
          </div>

          {/* Happiness */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl px-2.5 py-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Joy
              </span>
              <span className="font-mono-numbers text-slate-200">{character.happiness}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all duration-300" style={{ width: `${character.happiness}%` }} />
            </div>
          </div>

          {/* Smarts */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl px-2.5 py-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Brain className="w-3.5 h-3.5 text-cyan-400" /> Smarts
              </span>
              <span className="font-mono-numbers text-slate-200">{character.smarts}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${character.smarts}%` }} />
            </div>
          </div>

          {/* Street Cred */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl px-2.5 py-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Cred
              </span>
              <span className="font-mono-numbers text-slate-200">{character.streetCred}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${character.streetCred}%` }} />
            </div>
          </div>

          {/* Sapa Meter */}
          <div className="col-span-2 sm:col-span-1 bg-slate-900/80 border border-slate-800/80 rounded-xl px-2.5 py-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Sapa
              </span>
              <span className={`font-mono-numbers font-semibold ${sapa.color}`}>{sapa.label}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${sapa.bar}`} style={{ width: `${character.sapaLevel}%` }} />
            </div>
          </div>
        </div>

        {/* Zone 3: Financials & Desktop Controls */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-1 lg:pt-0 border-t border-slate-800/60 lg:border-t-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/50 rounded-xl px-3 py-1.5">
              <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <span className="font-mono-numbers font-bold text-sm text-emerald-300">
                  ₦{character.cashNaira.toLocaleString()}
                </span>
                {character.cashUSD > 0 && (
                  <span className="font-mono-numbers text-xs text-amber-300 font-medium">
                    ${character.cashUSD.toLocaleString()} USD
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onOpenPressArchive}
              aria-label="Daily Times Press Archive"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              <Newspaper className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Times</span>
            </button>
            <button
              onClick={onToggleSound}
              aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMuted ? 'Sound Muted' : 'Sound Active'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={onOpenHallOfFame}
              aria-label="View Hall of Fame"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Graveyard</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

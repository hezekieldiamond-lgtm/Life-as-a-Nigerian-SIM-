import React from 'react';
import { CharacterState } from '../types/game';
import { Avatar, SKIN_TONES, HAIR_STYLES, OUTFITS, ACCESSORIES } from './Avatar';
import { X, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AvatarModalProps {
  character: CharacterState;
  onUpdateStyle: (updates: {
    avatarSkin?: string;
    avatarHair?: string;
    avatarOutfit?: string;
    avatarAccessory?: string;
  }) => void;
  onClose: () => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({ character, onUpdateStyle, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-display font-bold text-slate-100">Wardrobe & Swagger</h2>
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

        <div className="flex flex-col sm:flex-row items-center gap-6 my-5">
          <div className="shrink-0 p-2 rounded-2xl bg-slate-950 border border-slate-800">
            <Avatar character={character} size="xl" />
          </div>

          <div className="flex-1 w-full space-y-3">
            {/* Skin tone */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Melanin Tone</label>
              <div className="flex gap-2">
                {SKIN_TONES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      soundEngine.playClick();
                      onUpdateStyle({ avatarSkin: s.id });
                    }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      character.avatarSkin === s.id ? 'border-amber-400 scale-110 shadow' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: s.color }}
                    title={s.name}
                  />
                ))}
              </div>
            </div>

            {/* Hair */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Hair / Gele</label>
              <select
                value={character.avatarHair}
                onChange={(e) => {
                  soundEngine.playClick();
                  onUpdateStyle({ avatarHair: e.target.value });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
              >
                {HAIR_STYLES.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Outfit */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Attire</label>
              <select
                value={character.avatarOutfit}
                onChange={(e) => {
                  soundEngine.playClick();
                  onUpdateStyle({ avatarOutfit: e.target.value });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
              >
                {OUTFITS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Accessories */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Accessories</label>
              <select
                value={character.avatarAccessory}
                onChange={(e) => {
                  soundEngine.playClick();
                  onUpdateStyle({ avatarAccessory: e.target.value });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
              >
                {ACCESSORIES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md"
        >
          Confirm Swagger
        </button>
      </div>
    </div>
  );
};

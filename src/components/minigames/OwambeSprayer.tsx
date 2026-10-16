import React, { useState, useEffect, useRef } from 'react';
import { CharacterState } from '../../types/game';
import { soundEngine } from '../../utils/audio';
import { Sparkles, Trophy, Music, Award, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OwambeSprayerProps {
  character: CharacterState;
  onComplete: (results: {
    cashSprayed: number;
    streetCredBonus: number;
    happinessBonus: number;
    titleAwarded?: string;
  }) => void;
  onClose: () => void;
}

const PRAISE_SINGER_LINES = [
  'Gbogbo Big Boys! Otunba in the building!',
  'Look at the swag! Money stops nonsense!',
  'Chairman of the high table! Spray the mint notes!',
  'Your family will never lack! Gbe body e!',
  'King Sunny Ade and the Fuji masters hail you!',
];

export const OwambeSprayer: React.FC<OwambeSprayerProps> = ({ character, onComplete, onClose }) => {
  const [beatPhase, setBeatPhase] = useState<number>(0);
  const [hypeLevel, setHypeLevel] = useState<number>(20); // 0 to 100
  const [sprayedTotal, setSprayedTotal] = useState<number>(0);
  const [praiseText, setPraiseText] = useState<string>(PRAISE_SINGER_LINES[0]);
  const [activeNotes, setActiveNotes] = useState<Array<{ id: number; text: string; x: number; y: number }>>([]);
  const [partyTimeLeft, setPartyTimeLeft] = useState<number>(25); // 25 seconds party

  const timerRef = useRef<number | null>(null);

  // Beat oscillation
  useEffect(() => {
    const interval = window.setInterval(() => {
      setBeatPhase((b) => (b + 1) % 4);
    }, 450); // ~133 BPM party beat
    return () => clearInterval(interval);
  }, []);

  // Party countdown timer
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setPartyTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          finishParty();
          return 0;
        }
        // Change praise singer lines periodically
        if (t % 5 === 0) {
          const nextLine = PRAISE_SINGER_LINES[Math.floor(Math.random() * PRAISE_SINGER_LINES.length)];
          setPraiseText(nextLine);
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hypeLevel, sprayedTotal]);

  const finishParty = () => {
    soundEngine.playFanfare();
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
  };

  const handleSpray = (amount: number) => {
    if (character.cashNaira < sprayedTotal + amount) {
      soundEngine.playFailure();
      return;
    }

    soundEngine.playMoneyChime();
    setSprayedTotal((s) => s + amount);

    // Timing check
    const isGoodTiming = beatPhase === 0 || beatPhase === 2;
    const hypeGain = isGoodTiming ? 12 : 6;
    setHypeLevel((h) => Math.min(100, h + hypeGain));

    // Floating note visual
    const id = Date.now() + Math.random();
    const x = 30 + Math.random() * 40;
    const y = 40 + Math.random() * 20;
    setActiveNotes((prev) => [...prev, { id, text: `₦${amount.toLocaleString()}`, x, y }]);
    setTimeout(() => {
      setActiveNotes((prev) => prev.filter((n) => n.id !== id));
    }, 900);
  };

  const handleClaim = () => {
    soundEngine.playClick();
    onComplete({
      cashSprayed: sprayedTotal,
      streetCredBonus: Math.round(hypeLevel * 0.4),
      happinessBonus: Math.round(hypeLevel * 0.3),
      titleAwarded: hypeLevel >= 80 ? 'Owambe VIP Legend' : undefined,
    });
  };

  const isPartyFinished = partyTimeLeft === 0;

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl max-w-lg mx-auto flex flex-col items-center relative overflow-hidden">
      {/* Ornate Gold Top Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Surulere Owambe Spraying Rhythm
            </h3>
            <p className="text-[11px] text-slate-400">
              Paste mint notes on the dancing couple to the Fuji beat!
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono-numbers text-amber-400 font-bold block">
            {partyTimeLeft}s Left
          </span>
          <span className="text-[11px] text-slate-500 font-mono-numbers">
            Sprayed: ₦{sprayedTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Fuji Dance Floor Visualizer */}
      <div className="relative w-full h-56 bg-gradient-to-b from-purple-950/40 via-slate-950 to-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-between overflow-hidden mb-4">
        {/* Fuji praise singer shout banner */}
        <div className="w-full text-center">
          <span className="text-[10px] text-amber-400 uppercase tracking-widest font-black block">
            🎤 Live Fuji Praise Singer
          </span>
          <p className="text-xs font-display font-bold text-amber-300 italic">
            "{praiseText}"
          </p>
        </div>

        {/* Dancing Silhouette & Beat Pulse Ring */}
        <div className="relative flex items-center justify-center my-auto">
          {/* Beat Pulse concentric rings */}
          <div
            className={`absolute w-24 h-24 rounded-full border-2 border-amber-400/40 transition-transform duration-300 ${
              beatPhase === 0 ? 'scale-125 border-amber-400' : 'scale-90'
            }`}
          />
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-2xl shadow-xl shadow-amber-500/20 transition-transform duration-200 ${
              beatPhase % 2 === 0 ? 'scale-105' : 'scale-95'
            }`}
          >
            💃🕺
          </div>

          {/* Floating Sprayed Naira Notes */}
          {activeNotes.map((note) => (
            <div
              key={note.id}
              className="absolute text-xs font-mono-numbers font-black bg-emerald-400 text-slate-950 px-2 py-0.5 rounded shadow-lg animate-out fade-out slide-out-to-top duration-700 pointer-events-none"
              style={{
                left: `${note.x}%`,
                top: `${note.y}%`,
              }}
            >
              {note.text}
            </div>
          ))}
        </div>

        {/* Crowd Hype Bar */}
        <div className="w-full">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" /> Crowd Hype & Family Respect
            </span>
            <span className="text-amber-400 font-mono-numbers font-bold">{hypeLevel}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${hypeLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Spray Buttons */}
      {!isPartyFinished ? (
        <div className="w-full grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSpray(500)}
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1.5"
          >
            <span>💵 Spray ₦500 Mint Note</span>
          </button>
          <button
            onClick={() => handleSpray(1000)}
            className="py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1.5"
          >
            <span>💰 Spray ₦1,000 Bundle</span>
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center animate-in fade-in">
          <div className="text-center mb-3">
            <h4 className="text-base font-display font-extrabold text-amber-400">
              Owambe Party Concluded!
            </h4>
            <p className="text-xs text-slate-300">
              Total sprayed: ₦{sprayedTotal.toLocaleString()} · Final Crowd Hype: {hypeLevel}%
            </p>
          </div>
          <button
            onClick={handleClaim}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
          >
            Claim Respect & Return to Life
          </button>
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        Exit Party Tent
      </button>
    </div>
  );
};

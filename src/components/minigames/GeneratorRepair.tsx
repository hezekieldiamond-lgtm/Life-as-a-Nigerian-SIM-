import React, { useState, useEffect, useRef } from 'react';
import { CharacterState } from '../../types/game';
import { soundEngine } from '../../utils/audio';
import { Zap, RotateCcw, CheckCircle2, AlertTriangle, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GeneratorRepairProps {
  character: CharacterState;
  onComplete: (results: {
    success: boolean;
    happinessGain: number;
    smartsGain: number;
    cashSaved: number;
  }) => void;
  onClose: () => void;
}

export const GeneratorRepair: React.FC<GeneratorRepairProps> = ({ character, onComplete, onClose }) => {
  const [needlePos, setNeedlePos] = useState<number>(20);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);
  const [sparkPlugCleanliness, setSparkPlugCleanliness] = useState<number>(40); // 0 to 100
  const [engineStarted, setEngineStarted] = useState<boolean>(false);
  const [engineFlooded, setEngineFlooded] = useState<boolean>(false);

  const directionRef = useRef<number>(1);
  const animRef = useRef<number | null>(null);

  // Sweet spot range
  const targetMin = 62;
  const targetMax = 82;

  // Oscillating needle animation
  useEffect(() => {
    if (engineStarted || engineFlooded) return;

    let pos = 20;
    const speed = 1.6;

    const animate = () => {
      pos += speed * directionRef.current;
      if (pos >= 98) {
        pos = 98;
        directionRef.current = -1;
      } else if (pos <= 2) {
        pos = 2;
        directionRef.current = 1;
      }
      setNeedlePos(pos);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [engineStarted, engineFlooded]);

  const handlePullCord = () => {
    if (engineStarted || engineFlooded || isPulling) return;
    setIsPulling(true);
    soundEngine.playClick();

    // Check if spark plug is clean enough
    if (sparkPlugCleanliness < 70) {
      soundEngine.playFailure();
      setAttemptsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) setEngineFlooded(true);
        return next;
      });
      setTimeout(() => setIsPulling(false), 500);
      return;
    }

    // Check timing
    if (needlePos >= targetMin && needlePos <= targetMax) {
      // SUCCESS!
      soundEngine.playGeneratorStart();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      setEngineStarted(true);
      setTimeout(() => {
        onComplete({
          success: true,
          happinessGain: 20,
          smartsGain: 12,
          cashSaved: 30000,
        });
      }, 1500);
    } else {
      // Missed timing
      soundEngine.playFailure();
      setAttemptsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) setEngineFlooded(true);
        return next;
      });
      setTimeout(() => setIsPulling(false), 500);
    }
  };

  const handleCleanSparkPlug = () => {
    soundEngine.playClick();
    setSparkPlugCleanliness((prev) => Math.min(100, prev + 25));
  };

  const handleReset = () => {
    soundEngine.playClick();
    setAttemptsLeft(3);
    setSparkPlugCleanliness(40);
    setEngineStarted(false);
    setEngineFlooded(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-2xl max-w-lg mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Generator Starter & Spark Plug Mechanic
            </h3>
            <p className="text-[11px] text-slate-400">
              Clean the spark plug and time the recoil pull cord to restore home electricity!
            </p>
          </div>
        </div>
        <span className="text-xs font-mono-numbers text-amber-400 font-bold">
          {attemptsLeft} Pulls Left
        </span>
      </div>

      {/* Main Engine Status Card */}
      <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 flex flex-col items-center">
        {/* RPM / Compression Gauge */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-semibold">
            <span>Recoil Tension Meter</span>
            <span className="text-amber-400 font-mono-numbers">{Math.round(needlePos)}%</span>
          </div>

          <div className="relative w-full h-7 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-0.5">
            {/* Target Compression Zone */}
            <div
              className="absolute top-0 bottom-0 bg-emerald-500/30 border-x-2 border-emerald-400"
              style={{
                left: `${targetMin}%`,
                width: `${targetMax - targetMin}%`,
              }}
            >
              <span className="text-[9px] font-black text-emerald-300 uppercase tracking-tighter absolute top-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                PULL ZONE
              </span>
            </div>

            {/* Moving Tension Needle */}
            <div
              className="absolute top-0 bottom-0 w-2.5 bg-amber-400 rounded shadow-md shadow-amber-400/50 -translate-x-1/2 transition-transform"
              style={{ left: `${needlePos}%` }}
            />
          </div>
        </div>

        {/* Spark Plug Condition Bar */}
        <div className="w-full bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Spark Plug Cleanliness:</span>
            <span className={`font-mono-numbers font-bold text-xs ${sparkPlugCleanliness >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {sparkPlugCleanliness}% {sparkPlugCleanliness < 70 ? '(Dirty / Soot)' : '(Ready)'}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-200 ${sparkPlugCleanliness >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${sparkPlugCleanliness}%` }}
            />
          </div>
          {sparkPlugCleanliness < 70 && (
            <button
              onClick={handleCleanSparkPlug}
              className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>🧰 Scrub Spark Plug with Sandpaper</span>
            </button>
          )}
        </div>

        {/* Engine State Feedback */}
        {engineStarted && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ROAR! The generator caught fire and is humming smoothly! Light restored!</span>
          </div>
        )}

        {engineFlooded && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center justify-between w-full animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Engine flooded with fuel and black smoke!</span>
            </div>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-200 rounded text-xs"
            >
              Drain & Retry
            </button>
          </div>
        )}
      </div>

      {/* Main Pull Cord Action */}
      {!engineStarted && !engineFlooded && (
        <button
          onClick={handlePullCord}
          disabled={isPulling}
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2"
        >
          <Flame className="w-4 h-4 text-slate-950" />
          <span>YANK STARTER ROPE!</span>
        </button>
      )}

      {/* Exit */}
      <button
        onClick={onClose}
        className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        Close Tool
      </button>
    </div>
  );
};

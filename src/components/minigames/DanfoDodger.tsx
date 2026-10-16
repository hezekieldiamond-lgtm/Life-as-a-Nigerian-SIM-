import React, { useState, useEffect, useRef } from 'react';
import { CharacterState } from '../../types/game';
import { soundEngine } from '../../utils/audio';
import { ArrowLeft, ArrowRight, Play, RotateCcw, Award, ShieldAlert, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DanfoDodgerProps {
  character: CharacterState;
  onGameComplete: (results: {
    cashEarned: number;
    streetCredBonus: number;
    happinessBonus: number;
  }) => void;
  onClose: () => void;
}

interface Obstacle {
  id: number;
  lane: number; // 0, 1, 2
  y: number; // 0 to 100%
  type: 'trailer' | 'pothole' | 'lastma';
}

interface Pickup {
  id: number;
  lane: number;
  y: number;
  type: 'cash' | 'passenger';
}

export const DanfoDodger: React.FC<DanfoDodgerProps> = ({ character, onGameComplete, onClose }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'crashed' | 'won'>('idle');
  const [playerLane, setPlayerLane] = useState<number>(1); // 0 = left, 1 = mid, 2 = right
  const [score, setScore] = useState<number>(0);
  const [cashCollected, setCashCollected] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);

  const animFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const lastPickupSpawnRef = useRef<number>(0);
  const nextIdRef = useRef<number>(1);

  const targetDistance = 1000; // Finish line at toll gate

  const isOkada = character.vehicle?.id === 'bajaj_okada';

  const startGame = () => {
    soundEngine.playClick();
    setGameState('playing');
    setPlayerLane(1);
    setScore(0);
    setCashCollected(0);
    setDistance(0);
    setObstacles([]);
    setPickups([]);
    lastSpawnRef.current = Date.now();
    lastPickupSpawnRef.current = Date.now();
  };

  const moveLeft = () => {
    if (gameState !== 'playing') return;
    soundEngine.playClick();
    setPlayerLane((prev) => Math.max(0, prev - 1));
  };

  const moveRight = () => {
    if (gameState !== 'playing') return;
    soundEngine.playClick();
    setPlayerLane((prev) => Math.min(2, prev + 1));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let prevTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - prevTime) / 1000;
      prevTime = time;

      // Advance distance & score
      setDistance((d) => {
        const nextDist = d + dt * 110;
        if (nextDist >= targetDistance) {
          setGameState('won');
          soundEngine.playFanfare();
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          return targetDistance;
        }
        return nextDist;
      });

      setScore((s) => s + Math.round(dt * 30));

      // Spawn Obstacles
      if (Date.now() - lastSpawnRef.current > 1200) {
        lastSpawnRef.current = Date.now();
        const lane = Math.floor(Math.random() * 3);
        const types: Array<'trailer' | 'pothole' | 'lastma'> = ['trailer', 'pothole', 'lastma'];
        const type = types[Math.floor(Math.random() * types.length)];
        setObstacles((prev) => [...prev, { id: nextIdRef.current++, lane, y: -10, type }]);
      }

      // Spawn Pickups
      if (Date.now() - lastPickupSpawnRef.current > 1500) {
        lastPickupSpawnRef.current = Date.now();
        const lane = Math.floor(Math.random() * 3);
        const type: 'cash' | 'passenger' = Math.random() > 0.4 ? 'cash' : 'passenger';
        setPickups((prev) => [...prev, { id: nextIdRef.current++, lane, y: -10, type }]);
      }

      // Move and check collisions
      const speed = 48 * dt; // percent per sec

      setObstacles((prev) => {
        const updated: Obstacle[] = [];
        for (const obs of prev) {
          const nextY = obs.y + speed;

          // Check player collision: player sits at y: 80%
          if (nextY >= 72 && nextY <= 88 && obs.lane === playerLane) {
            soundEngine.playFailure();
            setGameState('crashed');
            return prev;
          }

          if (nextY <= 110) {
            updated.push({ ...obs, y: nextY });
          }
        }
        return updated;
      });

      setPickups((prev) => {
        const remaining: Pickup[] = [];
        for (const item of prev) {
          const nextY = item.y + speed;

          // Check collect
          if (nextY >= 72 && nextY <= 88 && item.lane === playerLane) {
            soundEngine.playMoneyChime();
            const reward = item.type === 'cash' ? 5000 : 2500;
            setCashCollected((c) => c + reward);
            setScore((s) => s + 50);
          } else if (nextY <= 110) {
            remaining.push({ ...item, y: nextY });
          }
        }
        return remaining;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, playerLane]);

  const handleFinish = () => {
    soundEngine.playClick();
    onGameComplete({
      cashEarned: cashCollected,
      streetCredBonus: gameState === 'won' ? 18 : 6,
      happinessBonus: gameState === 'won' ? 15 : -5,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl max-w-xl mx-auto flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div>
          <h3 className="font-display font-bold text-base text-amber-400">
            Third Mainland Expressway Dodger
          </h3>
          <p className="text-xs text-slate-400">
            Dodge potholes, trucks, and LASTMA checkpoints while collecting fares!
          </p>
        </div>
        <div className="text-right font-mono-numbers">
          <span className="text-xs text-emerald-400 font-bold block">
            ₦{cashCollected.toLocaleString()} Fare
          </span>
          <span className="text-[11px] text-slate-500">
            {Math.round(distance)}m / {targetDistance}m
          </span>
        </div>
      </div>

      {/* Highway Viewport */}
      <div className="relative w-full h-80 bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-inner flex">
        {/* Road Lanes */}
        <div className="flex-1 border-r border-dashed border-amber-500/30 relative" />
        <div className="flex-1 border-r border-dashed border-amber-500/30 relative" />
        <div className="flex-1 relative" />

        {/* Start / Game Over Overlays */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <h4 className="text-xl font-display font-extrabold text-slate-100 mb-2">
              Lagos Traffic Rush
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-5">
              Navigate your {isOkada ? 'Okada Motorcycle' : 'Yellow Danfo Bus'} across 3 lanes. Collect cash notes and pick up passengers!
            </p>
            <button
              onClick={startGame}
              className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Start Engine
            </button>
          </div>
        )}

        {gameState === 'crashed' && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in">
            <ShieldAlert className="w-10 h-10 text-rose-400 mb-2" />
            <h4 className="text-lg font-display font-extrabold text-rose-200 mb-1">
              Accident on Third Mainland Bridge!
            </h4>
            <p className="text-xs text-rose-300 max-w-xs mb-4">
              You hit a deep pothole and LASTMA impounded your vehicle! You still managed to keep ₦{cashCollected.toLocaleString()} in fares.
            </p>
            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Try Again
              </button>
              <button
                onClick={handleFinish}
                className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
              >
                Collect Payout & Exit
              </button>
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in">
            <Trophy className="w-10 h-10 text-amber-400 mb-2" />
            <h4 className="text-lg font-display font-extrabold text-emerald-200 mb-1">
              Lekki Toll Gate Cleared!
            </h4>
            <p className="text-xs text-emerald-300 max-w-xs mb-4">
              Master driver! You navigated rush-hour traffic flawlessly and earned ₦{cashCollected.toLocaleString()} plus major street cred!
            </p>
            <button
              onClick={handleFinish}
              className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg"
            >
              Claim Rewards
            </button>
          </div>
        )}

        {/* Dynamic Obstacles */}
        {obstacles.map((obs) => (
          <div
            key={obs.id}
            className="absolute -translate-x-1/2 flex items-center justify-center z-10 transition-transform"
            style={{
              left: `${obs.lane === 0 ? 16.6 : obs.lane === 1 ? 50 : 83.3}%`,
              top: `${obs.y}%`,
            }}
          >
            {obs.type === 'trailer' && (
              <div className="bg-slate-700 border border-slate-500 rounded-md px-2 py-3 text-[10px] font-bold text-slate-200 shadow-md">
                🚛 TRUCK
              </div>
            )}
            {obs.type === 'pothole' && (
              <div className="w-9 h-7 rounded-full bg-slate-900 border-2 border-stone-600 shadow-inner flex items-center justify-center text-[9px] text-stone-400 font-bold">
                POTHOLE
              </div>
            )}
            {obs.type === 'lastma' && (
              <div className="bg-amber-500 border border-amber-300 rounded px-1.5 py-2 text-[9px] font-black text-slate-950 shadow">
                ⚠️ LASTMA
              </div>
            )}
          </div>
        ))}

        {/* Pickups */}
        {pickups.map((pick) => (
          <div
            key={pick.id}
            className="absolute -translate-x-1/2 flex items-center justify-center z-10 animate-bounce"
            style={{
              left: `${pick.lane === 0 ? 16.6 : pick.lane === 1 ? 50 : 83.3}%`,
              top: `${pick.y}%`,
            }}
          >
            {pick.type === 'cash' ? (
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg border border-emerald-300">
                ₦5k
              </span>
            ) : (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-amber-200">
                🙋 FARE
              </span>
            )}
          </div>
        ))}

        {/* Player Vehicle */}
        <div
          className="absolute -translate-x-1/2 top-[80%] z-10 transition-all duration-100"
          style={{
            left: `${playerLane === 0 ? 16.6 : playerLane === 1 ? 50 : 83.3}%`,
          }}
        >
          {isOkada ? (
            <div className="w-8 h-12 bg-red-600 rounded-full border-2 border-amber-400 flex flex-col items-center justify-center text-[9px] font-bold text-white shadow-lg">
              🏍️
            </div>
          ) : (
            <div className="w-14 h-16 bg-amber-400 border-2 border-slate-900 rounded-lg flex flex-col items-center justify-between p-1 shadow-2xl text-slate-950 font-black text-[9px]">
              <div className="w-full flex justify-between px-0.5">
                <span className="w-1.5 h-1.5 bg-yellow-100 rounded-full" />
                <span className="w-1.5 h-1.5 bg-yellow-100 rounded-full" />
              </div>
              <div className="w-full h-2 bg-slate-900 my-0.5" />
              <span>DANFO</span>
            </div>
          )}
        </div>
      </div>

      {/* Touch / Click Steering Controls */}
      <div className="w-full flex items-center justify-between gap-4 mt-4">
        <button
          onClick={moveLeft}
          disabled={gameState !== 'playing' || playerLane === 0}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Steer Left
        </button>
        <button
          onClick={moveRight}
          disabled={gameState !== 'playing' || playerLane === 2}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors border border-slate-700"
        >
          Steer Right <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exit Button */}
      <button
        onClick={onClose}
        className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        Exit Arcade
      </button>
    </div>
  );
};

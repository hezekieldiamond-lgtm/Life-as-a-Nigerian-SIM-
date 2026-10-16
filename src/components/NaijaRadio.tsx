import React, { useEffect, useState } from 'react';
import { naijaRadio, RADIO_STATIONS, RadioStationId } from '../utils/radio';
import { Radio, Play, Pause, Volume2, VolumeX, Sparkles, Disc } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const NaijaRadio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(naijaRadio.getIsPlaying());
  const [currentStation, setCurrentStation] = useState(naijaRadio.getCurrentStation());
  const [volume, setVolume] = useState<number>(naijaRadio.getVolume());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const unsub = naijaRadio.subscribe(() => {
      setIsPlaying(naijaRadio.getIsPlaying());
      setCurrentStation(naijaRadio.getCurrentStation());
      setVolume(naijaRadio.getVolume());
    });
    return unsub;
  }, []);

  const handleToggle = () => {
    soundEngine.playClick();
    naijaRadio.togglePlay();
  };

  const handleStationChange = (id: RadioStationId) => {
    soundEngine.playClick();
    naijaRadio.setStation(id);
    if (!isPlaying) {
      naijaRadio.play();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    naijaRadio.setVolume(val);
  };

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-3 shadow-xl transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Radio Brand & Frequency */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25 transition-colors relative group"
            title="Toggle Radio Controls"
          >
            <Radio className="w-4 h-4" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-display font-bold text-slate-100">
                Naija FM {currentStation.frequency}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                LIVE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-xs">
              {isPlaying ? currentStation.currentTrack : 'Station Off Air'}
            </div>
          </div>
        </div>

        {/* Center: Live Audio Equalizer Animation */}
        <div className="hidden sm:flex items-center gap-1 h-5 px-3 bg-slate-950/60 rounded-lg border border-slate-800">
          {[40, 75, 100, 60, 85, 45, 90].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-amber-400' : 'bg-slate-700'
              }`}
              style={{
                height: isPlaying ? `${Math.max(20, (h * (i % 2 === 0 ? 1 : 0.7)))}%` : '20%',
                animation: isPlaying ? `pulse 0.${4 + i}s infinite alternate ease-in-out` : 'none',
              }}
            />
          ))}
        </div>

        {/* Right: Primary Play/Pause & Quick Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            aria-label={isPlaying ? 'Pause radio' : 'Play radio'}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-transform active:scale-95 shadow-md shadow-amber-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
          </button>
        </div>
      </div>

      {/* Expanded Tuning Drawer */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-150">
          {/* Station Preset Buttons */}
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
              Select Preset Channel
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {RADIO_STATIONS.map((station) => {
                const isActive = currentStation.id === station.id;
                return (
                  <button
                    key={station.id}
                    onClick={() => handleStationChange(station.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-400 text-slate-100 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{station.name}</div>
                    <div className="text-[10px] text-amber-400/80">{station.frequency} · {station.genre}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Control Slider */}
          <div className="flex items-center justify-between gap-3 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              <span>Radio Volume</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-32 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* DJ Hype Quote */}
          <div className="text-[11px] text-amber-300/90 italic bg-amber-500/5 border border-amber-500/20 p-2 rounded-lg text-center">
            "{currentStation.djQuote}"
          </div>
        </div>
      )}
    </div>
  );
};

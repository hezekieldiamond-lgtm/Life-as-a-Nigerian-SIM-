import React, { useState } from 'react';
import { LifeEvent, CharacterState, EventOutcome } from '../types/game';
import { soundEngine } from '../utils/audio';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EventModalProps {
  event: LifeEvent;
  character: CharacterState;
  onResolve: (outcome: EventOutcome) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, character, onResolve }) => {
  const [selectedOutcome, setSelectedOutcome] = useState<EventOutcome | null>(null);

  const handleSelectChoice = (outcome: EventOutcome | ((char: CharacterState) => EventOutcome)) => {
    const resolvedOutcome = typeof outcome === 'function' ? outcome(character) : outcome;
    setSelectedOutcome(resolvedOutcome);

    // Play appropriate sound effect
    if (resolvedOutcome.cashNairaChange && resolvedOutcome.cashNairaChange > 0) {
      soundEngine.playMoneyChime();
    } else if (resolvedOutcome.happinessChange && resolvedOutcome.happinessChange < -10) {
      soundEngine.playFailure();
    } else if (resolvedOutcome.sapaChange && resolvedOutcome.sapaChange > 15) {
      soundEngine.playSapaWarning();
    } else if (resolvedOutcome.addAchievement || resolvedOutcome.addTitle) {
      soundEngine.playFanfare();
    } else {
      soundEngine.playClick();
    }
  };

  const handleProceed = () => {
    if (selectedOutcome) {
      soundEngine.playClick();
      onResolve(selectedOutcome);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {!selectedOutcome ? (
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <span className="uppercase tracking-wider">{event.category.replace('_', ' ')}</span>
              {event.subtitle && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{event.subtitle}</span>
                </>
              )}
            </div>

            <h2 className="text-2xl font-display font-bold text-slate-100 mb-3">{event.title}</h2>

            <p className="text-slate-300 text-sm leading-relaxed mb-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              {event.description}
            </p>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">What do you do?</p>
              {event.choices.map((choice, index) => {
                const condition = choice.requireCondition ? choice.requireCondition(character) : { allowed: true };

                return (
                  <button
                    key={index}
                    disabled={!condition.allowed}
                    onClick={() => handleSelectChoice(choice.outcome)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-start justify-between gap-3 ${
                      condition.allowed
                        ? 'bg-slate-800/80 hover:bg-slate-800 hover:border-amber-500/50 border-slate-700 text-slate-100 hover:shadow-md'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium leading-snug">{choice.text}</div>
                      {!condition.allowed && condition.reason && (
                        <div className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> {condition.reason}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-display font-bold text-slate-100 mb-2">Consequence</h3>

            <p className="text-slate-200 text-sm leading-relaxed mb-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-left">
              {selectedOutcome.text}
            </p>

            {/* Stat impact summary pill row */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs font-mono-numbers">
              {selectedOutcome.cashNairaChange !== undefined && selectedOutcome.cashNairaChange !== 0 && (
                <span className={`px-2.5 py-1 rounded-lg ${selectedOutcome.cashNairaChange > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                  {selectedOutcome.cashNairaChange > 0 ? '+' : ''}₦{selectedOutcome.cashNairaChange.toLocaleString()}
                </span>
              )}
              {selectedOutcome.happinessChange !== undefined && selectedOutcome.happinessChange !== 0 && (
                <span className={`px-2.5 py-1 rounded-lg ${selectedOutcome.happinessChange > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-400'}`}>
                  Joy {selectedOutcome.happinessChange > 0 ? '+' : ''}{selectedOutcome.happinessChange}
                </span>
              )}
              {selectedOutcome.healthChange !== undefined && selectedOutcome.healthChange !== 0 && (
                <span className={`px-2.5 py-1 rounded-lg ${selectedOutcome.healthChange > 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-rose-400'}`}>
                  Health {selectedOutcome.healthChange > 0 ? '+' : ''}{selectedOutcome.healthChange}
                </span>
              )}
              {selectedOutcome.streetCredChange !== undefined && selectedOutcome.streetCredChange !== 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Street Cred {selectedOutcome.streetCredChange > 0 ? '+' : ''}{selectedOutcome.streetCredChange}
                </span>
              )}
              {selectedOutcome.smartsChange !== undefined && selectedOutcome.smartsChange !== 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Smarts {selectedOutcome.smartsChange > 0 ? '+' : ''}{selectedOutcome.smartsChange}
                </span>
              )}
              {selectedOutcome.addTitle && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Title: {selectedOutcome.addTitle}
                </span>
              )}
            </div>

            <button
              onClick={handleProceed}
              className="w-full py-3 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              Continue Life
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

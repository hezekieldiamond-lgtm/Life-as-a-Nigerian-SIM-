import React, { useState, useEffect } from 'react';
import {
  CharacterState,
  YearLog,
  LifeEvent,
  EventOutcome,
  HallOfFameEntry,
} from './types/game';
import { LIFE_EVENTS } from './data/events';
import { CITIES } from './data/cities';
import { GameHUD } from './components/GameHUD';
import { ChronicleFeed } from './components/ChronicleFeed';
import { ActionHub } from './components/ActionHub';
import { EventModal } from './components/EventModal';
import { NewGameModal } from './components/NewGameModal';
import { ObituaryModal } from './components/ObituaryModal';
import { HallOfFameModal } from './components/HallOfFameModal';
import { AvatarModal } from './components/AvatarModal';
import { NaijaRadio } from './components/NaijaRadio';
import { PressArchiveModal } from './components/PressArchiveModal';
import { soundEngine } from './utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Trophy, UserPlus } from 'lucide-react';

const STORAGE_KEY_CHAR = 'naija_sim_save_char';
const STORAGE_KEY_LOGS = 'naija_sim_save_logs';
const STORAGE_KEY_HOF = 'naija_sim_hall_of_fame';

export default function App() {
  const [character, setCharacter] = useState<CharacterState | null>(null);
  const [logs, setLogs] = useState<YearLog[]>([]);
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>([]);
  const [activeEvent, setActiveEvent] = useState<LifeEvent | null>(null);

  // Modals
  const [showNewGameModal, setShowNewGameModal] = useState<boolean>(false);
  const [showObituaryModal, setShowObituaryModal] = useState<boolean>(false);
  const [showHallOfFameModal, setShowHallOfFameModal] = useState<boolean>(false);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showPressArchiveModal, setShowPressArchiveModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.isMuted());

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedChar = localStorage.getItem(STORAGE_KEY_CHAR);
      const savedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      const savedHof = localStorage.getItem(STORAGE_KEY_HOF);

      if (savedHof) {
        setHallOfFame(JSON.parse(savedHof));
      }

      if (savedChar && savedLogs) {
        const parsedChar = JSON.parse(savedChar);
        setCharacter(parsedChar);
        setLogs(JSON.parse(savedLogs));
        if (!parsedChar.isAlive) {
          setShowObituaryModal(true);
        }
      } else {
        // No saved game, open character creator
        setShowNewGameModal(true);
      }
    } catch {
      setShowNewGameModal(true);
    }
  }, []);

  // Autosave when character or logs mutate
  useEffect(() => {
    if (character) {
      localStorage.setItem(STORAGE_KEY_CHAR, JSON.stringify(character));
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    }
  }, [character, logs]);

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleStartNewGame = (newChar: CharacterState) => {
    setCharacter(newChar);
    const initialLog: YearLog = {
      age: newChar.age,
      year: newChar.year,
      summary: `Began adult life in ${CITIES[newChar.city].name} as a ${newChar.background.replace('_', ' ')}.`,
      events: ['Obtained National Identity Number (NIN)', 'Ready to hustle and conquer Sapa'],
      netWorthNaira: newChar.cashNaira,
      sapaLevel: newChar.sapaLevel,
    };
    setLogs([initialLog]);
    setShowNewGameModal(false);
    setShowObituaryModal(false);
  };

  const handleAddLogMessage = (msg: string) => {
    setLogs((prev) => {
      if (prev.length === 0) return prev;
      const latest = { ...prev[0] };
      latest.events = [msg, ...latest.events];
      return [latest, ...prev.slice(1)];
    });
  };

  const handleCharacterDeath = (char: CharacterState, cause: string) => {
    soundEngine.playFailure();
    const updatedChar: CharacterState = {
      ...char,
      isAlive: false,
      causeOfDeath: cause,
    };
    setCharacter(updatedChar);

    // Record into Hall of Fame
    const hofEntry: HallOfFameEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: updatedChar.name,
      gender: updatedChar.gender,
      city: CITIES[updatedChar.city]?.name || 'Nigeria',
      finalAge: updatedChar.age,
      netWorthNaira: updatedChar.cashNaira,
      netWorthUSD: updatedChar.cashUSD,
      highestCareer: updatedChar.currentJob ? updatedChar.currentJob.title : 'Hustler',
      titles: updatedChar.titles,
      causeOfDeath: cause,
      avatarSnapshot: {
        skin: updatedChar.avatarSkin,
        hair: updatedChar.avatarHair,
        outfit: updatedChar.avatarOutfit,
        accessory: updatedChar.avatarAccessory,
      },
      japaAchieved: updatedChar.japa.isRelocated,
      achievementsCount: updatedChar.achievements.length,
      dateRecorded: new Date().toLocaleDateString(),
    };

    const newHof = [hofEntry, ...hallOfFame];
    setHallOfFame(newHof);
    localStorage.setItem(STORAGE_KEY_HOF, JSON.stringify(newHof));

    setShowObituaryModal(true);
  };

  // Main turn-based simulation tick
  const handleAdvanceAge = () => {
    if (!character || !character.isAlive) return;

    const nextAge = character.age + 1;
    const nextYear = character.year + 1;
    const cityInfo = CITIES[character.city];

    // Milestone confetti
    if ([21, 30, 40, 50, 60, 70, 80].includes(nextAge)) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      soundEngine.playFanfare();
    }

    // 1. Calculate Financials
    let annualIncome = 0;
    if (character.currentJob) {
      if (character.currentJob.isDollarIncome && character.currentJob.dollarSalary) {
        annualIncome += character.currentJob.dollarSalary * character.usdExchangeRate;
      } else {
        annualIncome += character.currentJob.salary;
      }
    }
    if (character.sideHustle) {
      annualIncome += character.sideHustle.annualIncome;
    }
    character.businesses.forEach((biz) => {
      annualIncome += biz.yearlyProfit;
    });

    // Cost of living & maintenance expenses
    const baseLivingCost = Math.round(720000 * cityInfo.costOfLivingMultiplier);
    const housingCost = character.home.yearlyRentOrMaintenance;
    const generatorCost = character.generator ? character.generator.fuelCostPerYear : 0;
    const vehicleCost = character.vehicle ? character.vehicle.maintenanceCostPerYear : 0;
    const totalExpenses = baseLivingCost + housingCost + generatorCost + vehicleCost;

    const netCashFlow = annualIncome - totalExpenses;
    const newCash = Math.max(0, character.cashNaira + netCashFlow);

    // 2. Sapa Calculation
    let newSapa = character.sapaLevel;
    if (newCash < 50000) {
      newSapa = Math.min(100, newSapa + 25);
    } else if (newCash < 300000) {
      newSapa = Math.min(100, newSapa + 10);
    } else if (newCash > 5000000) {
      newSapa = Math.max(0, newSapa - 30);
    } else {
      newSapa = Math.max(0, newSapa - 10);
    }

    // 3. Health & Happiness Drift
    let newHealth = character.health;
    let newHappiness = character.happiness;

    if (newSapa > 70) {
      newHealth = Math.max(10, newHealth - 8);
      newHappiness = Math.max(10, newHappiness - 12);
    }

    // If no generator, occasional mosquito / heat wave irritation
    if (!character.generator && Math.random() < 0.45) {
      newHappiness = Math.max(10, newHappiness - 6);
      newHealth = Math.max(10, newHealth - 3);
    }

    // Fluctuate USD exchange rate realistically
    const fxDrift = Math.floor((Math.random() - 0.4) * 60);
    const newFxRate = Math.max(1200, character.usdExchangeRate + fxDrift);

    // Natural aging health deduction after 55
    if (nextAge > 55) {
      newHealth = Math.max(0, newHealth - Math.floor((nextAge - 50) * 0.3));
    }

    // 4. Mortality Checks
    if (newHealth <= 0) {
      handleCharacterDeath(character, 'Complications from chronic stress, extreme Sapa, and fatigue.');
      return;
    }
    if (nextAge >= 85 && Math.random() < 0.3) {
      handleCharacterDeath(character, 'Peaceful transition in old age after a glorious Nigerian journey.');
      return;
    }

    // 5. Build Year Log
    const yearSummary =
      annualIncome > 0
        ? `Earned ₦${annualIncome.toLocaleString()} from career and hustle. Incurred ₦${totalExpenses.toLocaleString()} living expenses.`
        : `Surviving in ${cityInfo.name}. Incurred ₦${totalExpenses.toLocaleString()} basic living costs.`;

    const eventsThisYear: string[] = [];
    if (!character.generator) {
      eventsThisYear.push('Endured frequent national grid blackouts with manual hand fans.');
    } else if (character.generator.id === 'solar_inverter_5kva') {
      eventsThisYear.push('Solar inverter provided uninterrupted 24/7 power all year.');
    }
    if (netCashFlow < 0) {
      eventsThisYear.push(`Sapa pinched your pockets by -₦${Math.abs(netCashFlow).toLocaleString()}.`);
    }

    const updatedChar: CharacterState = {
      ...character,
      age: nextAge,
      year: nextYear,
      cashNaira: newCash,
      health: newHealth,
      happiness: newHappiness,
      sapaLevel: newSapa,
      usdExchangeRate: newFxRate,
    };

    const newYearLog: YearLog = {
      age: nextAge,
      year: nextYear,
      summary: yearSummary,
      events: eventsThisYear,
      netWorthNaira: newCash,
      sapaLevel: newSapa,
    };

    setCharacter(updatedChar);
    setLogs((prev) => [newYearLog, ...prev]);

    // 6. Trigger Random Event for the Year
    const eligibleEvents = LIFE_EVENTS.filter((e) => {
      if (nextAge < e.minAge || nextAge > e.maxAge) return false;
      if (e.condition && !e.condition(updatedChar)) return false;
      return true;
    });

    if (eligibleEvents.length > 0 && Math.random() < 0.85) {
      const picked = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
      setActiveEvent(picked);
    }
  };

  const handleResolveEvent = (outcome: EventOutcome) => {
    if (!character) return;

    let updated = { ...character };

    if (outcome.cashNairaChange) {
      updated.cashNaira = Math.max(0, updated.cashNaira + outcome.cashNairaChange);
    }
    if (outcome.cashUSDChange) {
      updated.cashUSD = Math.max(0, updated.cashUSD + outcome.cashUSDChange);
    }
    if (outcome.debtNairaChange) {
      updated.debtNaira = Math.max(0, updated.debtNaira + outcome.debtNairaChange);
    }
    if (outcome.healthChange) {
      updated.health = Math.min(100, Math.max(0, updated.health + outcome.healthChange));
    }
    if (outcome.happinessChange) {
      updated.happiness = Math.min(100, Math.max(0, updated.happiness + outcome.happinessChange));
    }
    if (outcome.smartsChange) {
      updated.smarts = Math.min(100, Math.max(0, updated.smarts + outcome.smartsChange));
    }
    if (outcome.streetCredChange) {
      updated.streetCred = Math.min(100, Math.max(0, updated.streetCred + outcome.streetCredChange));
    }
    if (outcome.sapaChange) {
      updated.sapaLevel = Math.min(100, Math.max(0, updated.sapaLevel + outcome.sapaChange));
    }
    if (outcome.jobChange !== undefined) {
      updated.currentJob = outcome.jobChange;
    }
    if (outcome.addTitle && !updated.titles.includes(outcome.addTitle)) {
      updated.titles = [...updated.titles, outcome.addTitle];
    }
    if (outcome.addAchievement && !updated.achievements.includes(outcome.addAchievement)) {
      updated.achievements = [...updated.achievements, outcome.addAchievement];
    }
    if (outcome.japaProgress) {
      updated.japa = { ...updated.japa, ...outcome.japaProgress };
    }

    // Death trigger from event (rare)
    if (outcome.deathTrigger || updated.health <= 0) {
      setActiveEvent(null);
      handleCharacterDeath(updated, outcome.text);
      return;
    }

    setCharacter(updated);
    handleAddLogMessage(outcome.text);
    setActiveEvent(null);
  };

  const handleClearHallOfFame = () => {
    setHallOfFame([]);
    localStorage.removeItem(STORAGE_KEY_HOF);
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <NewGameModal onStartGame={handleStartNewGame} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top HUD */}
      <GameHUD
        character={character}
        onOpenProfile={() => setShowAvatarModal(true)}
        onOpenHallOfFame={() => setShowHallOfFameModal(true)}
        onOpenPressArchive={() => setShowPressArchiveModal(true)}
        onToggleSound={handleToggleSound}
        isMuted={isMuted}
      />

      {/* Main 2-Column Responsive Game Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chronicle Timeline & Primary Advance Age (7 cols on desktop) */}
        <div className="lg:col-span-7 h-full flex flex-col">
          <ChronicleFeed
            logs={logs}
            character={character}
            onAdvanceAge={handleAdvanceAge}
            onOpenAvatarCustomizer={() => setShowAvatarModal(true)}
          />
        </div>

        {/* Right Column: Interactive Action Hub & Radio (5 cols on desktop) */}
        <div className="lg:col-span-5 h-full flex flex-col space-y-4">
          {/* Naija FM Procedural Afrobeats Radio */}
          <NaijaRadio />

          <ActionHub
            character={character}
            logs={logs}
            onUpdateCharacter={(updater) => setCharacter((prev) => (prev ? updater(prev) : null))}
            onAddLogMessage={handleAddLogMessage}
          />

          {/* Quick Life Reset Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowNewGameModal(true);
              }}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create New Character</span>
            </button>
            <span className="font-mono-numbers">
              FX: ₦{character.usdExchangeRate.toLocaleString()} / $1 USD
            </span>
          </div>
        </div>
      </main>

      {/* Active Dilemma Event Modal */}
      {activeEvent && (
        <EventModal
          event={activeEvent}
          character={character}
          onResolve={handleResolveEvent}
        />
      )}

      {/* Character Creation Modal */}
      {showNewGameModal && (
        <NewGameModal
          onStartGame={handleStartNewGame}
          canCancel={character !== null}
          onCancel={() => setShowNewGameModal(false)}
        />
      )}

      {/* Obituary / Funeral Poster Modal */}
      {showObituaryModal && (
        <ObituaryModal
          character={character}
          onSaveAndRestart={() => {
            setShowObituaryModal(false);
            setShowNewGameModal(true);
          }}
        />
      )}

      {/* Hall of Fame Memorial Modal */}
      {showHallOfFameModal && (
        <HallOfFameModal
          entries={hallOfFame}
          onClose={() => setShowHallOfFameModal(false)}
          onClearHistory={handleClearHallOfFame}
        />
      )}

      {/* Press & Newspaper Archive Modal */}
      {showPressArchiveModal && (
        <PressArchiveModal
          character={character}
          onClose={() => setShowPressArchiveModal(false)}
        />
      )}

      {/* Avatar & Swagger Wardrobe Modal */}
      {showAvatarModal && (
        <AvatarModal
          character={character}
          onUpdateStyle={(updates) => setCharacter((prev) => (prev ? { ...prev, ...updates } : null))}
          onClose={() => setShowAvatarModal(false)}
        />
      )}
    </div>
  );
}

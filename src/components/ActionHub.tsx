import React, { useState } from 'react';
import {
  CharacterState,
  Job,
  SideHustle,
  GeneratorAsset,
  VehicleAsset,
  PropertyAsset,
  BusinessAsset,
  YearLog,
} from '../types/game';
import { AVAILABLE_JOBS, SIDE_HUSTLES } from '../data/jobs';
import { GENERATORS, VEHICLES, HOUSING_OPTIONS, BUSINESS_OPTIONS } from '../data/assets';
import { soundEngine } from '../utils/audio';
import {
  Briefcase,
  GraduationCap,
  Home,
  Users,
  Plane,
  Coffee,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Gamepad2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WealthTracker } from './WealthTracker';
import { DanfoDodger } from './minigames/DanfoDodger';
import { GeneratorRepair } from './minigames/GeneratorRepair';
import { OwambeSprayer } from './minigames/OwambeSprayer';

interface ActionHubProps {
  character: CharacterState;
  logs: YearLog[];
  onUpdateCharacter: (updater: (prev: CharacterState) => CharacterState) => void;
  onAddLogMessage: (msg: string) => void;
}

type TabType = 'career' | 'education' | 'assets' | 'japa' | 'wealth' | 'arcade' | 'leisure';

export const ActionHub: React.FC<ActionHubProps> = ({
  character,
  logs,
  onUpdateCharacter,
  onAddLogMessage,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('career');
  const [activeMinigame, setActiveMinigame] = useState<'danfo' | 'generator' | 'owambe' | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // ================= CAREER HANDLERS =================
  const handleApplyJob = (job: Job) => {
    soundEngine.playClick();
    if (character.smarts < job.minSmarts) {
      soundEngine.playFailure();
      showFeedback(`Application rejected: The interviewer said you need more smarts (min ${job.minSmarts}).`);
      return;
    }
    if (character.streetCred < job.minStreetCred) {
      soundEngine.playFailure();
      showFeedback(`Rejected: You lack the street credibility needed for this position (min ${job.minStreetCred}).`);
      return;
    }

    soundEngine.playFanfare();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    onUpdateCharacter((prev) => ({
      ...prev,
      currentJob: job,
      happiness: Math.min(100, prev.happiness + 15),
      sapaLevel: Math.max(0, prev.sapaLevel - 20),
    }));
    onAddLogMessage(`Hired as ${job.title}! Starting salary: ₦${job.salary.toLocaleString()}/yr.`);
    showFeedback(`Congratulations! You were hired as ${job.title}!`);
  };

  const handleWorkOvertime = () => {
    if (!character.currentJob) {
      showFeedback('You have no formal job to do overtime at! Go find a hustle.');
      return;
    }
    soundEngine.playMoneyChime();
    const bonus = Math.round(character.currentJob.salary * 0.12);
    onUpdateCharacter((prev) => ({
      ...prev,
      cashNaira: prev.cashNaira + bonus,
      health: Math.max(10, prev.health - 6),
      happiness: Math.max(10, prev.happiness - 4),
      streetCred: Math.min(100, prev.streetCred + 4),
      sapaLevel: Math.max(0, prev.sapaLevel - 8),
    }));
    onAddLogMessage(`Put in intense overtime at work. Earned ₦${bonus.toLocaleString()} bonus.`);
    showFeedback(`Worked late into the night. Earned ₦${bonus.toLocaleString()} extra!`);
  };

  const handleStartSideHustle = (hustle: typeof SIDE_HUSTLES[0]) => {
    soundEngine.playClick();
    if (character.sideHustle?.id === hustle.id) {
      showFeedback(`You are already running this ${hustle.name} hustle.`);
      return;
    }
    soundEngine.playMoneyChime();
    onUpdateCharacter((prev) => ({
      ...prev,
      sideHustle: hustle,
      streetCred: Math.min(100, prev.streetCred + hustle.streetCredBonus),
      happiness: Math.min(100, prev.happiness + 8),
    }));
    onAddLogMessage(`Started side-hustle: ${hustle.name}. Expected ₦${hustle.annualIncome.toLocaleString()}/yr.`);
    showFeedback(`Started ${hustle.name}! Extra income stream activated.`);
  };

  // ================= EDUCATION HANDLERS =================
  const handleTakeWAEC = () => {
    soundEngine.playClick();
    if (character.age < 15) {
      showFeedback('Too young to sit for Senior WAEC exams.');
      return;
    }
    const cost = 25000;
    if (character.cashNaira < cost) {
      soundEngine.playSapaWarning();
      showFeedback('Sapa strikes! You do not have ₦25,000 for WAEC registration fees.');
      return;
    }

    if (character.smarts >= 45) {
      soundEngine.playFanfare();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
      onUpdateCharacter((prev) => ({
        ...prev,
        cashNaira: prev.cashNaira - cost,
        education: 'waec_passed',
        smarts: Math.min(100, prev.smarts + 15),
        happiness: Math.min(100, prev.happiness + 20),
      }));
      onAddLogMessage('Passed WAEC with 6 credits including Mathematics and English!');
      showFeedback('Passed WAEC with flying colors! University admission is now unlocked.');
    } else {
      soundEngine.playFailure();
      onUpdateCharacter((prev) => ({
        ...prev,
        cashNaira: prev.cashNaira - cost,
        happiness: Math.max(10, prev.happiness - 15),
        smarts: Math.min(100, prev.smarts + 8),
      }));
      onAddLogMessage('WAEC results came out with 3 passes and F9 in Mathematics. Need to resit.');
      showFeedback('Defeated by WAEC Maths. Boost your smarts and try again.');
    }
  };

  const handleEnrollUniversity = () => {
    soundEngine.playClick();
    if (character.education !== 'waec_passed') {
      showFeedback('You must pass WAEC first before entering University.');
      return;
    }
    const cost = 180000;
    if (character.cashNaira < cost) {
      soundEngine.playSapaWarning();
      showFeedback('You need ₦180,000 for university acceptance and tuition fees.');
      return;
    }

    soundEngine.playFanfare();
    onUpdateCharacter((prev) => ({
      ...prev,
      cashNaira: prev.cashNaira - cost,
      education: 'university',
      degreeName: 'B.Sc Computer Science / Economics',
      smarts: Math.min(100, prev.smarts + 25),
      streetCred: Math.min(100, prev.streetCred + 15),
      happiness: Math.min(100, prev.happiness + 20),
    }));
    onAddLogMessage('Matriculated and graduated from University with a prestigious B.Sc degree!');
    showFeedback('Congratulations! Graduated from University with a B.Sc!');
  };

  const handleAlabaApprenticeship = () => {
    soundEngine.playClick();
    soundEngine.playMoneyChime();
    onUpdateCharacter((prev) => ({
      ...prev,
      education: 'apprentice_graduate',
      streetCred: Math.min(100, prev.streetCred + 35),
      smarts: Math.min(100, prev.smarts + 18),
      cashNaira: prev.cashNaira + 2500000, // Master settlement!
      sapaLevel: Math.max(0, prev.sapaLevel - 35),
      titles: prev.titles.includes('Alaba Merchant') ? prev.titles : [...prev.titles, 'Alaba Merchant'],
    }));
    onAddLogMessage('Completed 5-year apprenticeship. Master settled you with ₦2,500,000 and shop space!');
    showFeedback('Apprenticeship complete! Master blessed you with ₦2,500,000 cash settlement.');
  };

  // ================= ASSETS HANDLERS =================
  const handleBuyGenerator = (gen: typeof GENERATORS[0]) => {
    soundEngine.playClick();
    if (character.cashNaira < gen.buyPrice) {
      soundEngine.playSapaWarning();
      showFeedback(`Sapa alert! You need ₦${gen.buyPrice.toLocaleString()} to purchase ${gen.name}.`);
      return;
    }
    soundEngine.playGeneratorStart();
    const asset: GeneratorAsset = {
      id: gen.id,
      name: gen.name,
      fuelCostPerYear: gen.fuelCostPerYear,
      maintenanceRisk: gen.maintenanceRisk,
      status: 'working',
    };
    onUpdateCharacter((prev) => ({
      ...prev,
      cashNaira: prev.cashNaira - gen.buyPrice,
      generator: asset,
      happiness: Math.min(100, prev.happiness + 20),
    }));
    onAddLogMessage(`Purchased ${gen.name}! Immunity against national grid blackout gained.`);
    showFeedback(`Purchased ${gen.name}! Light is guaranteed.`);
  };

  const handleBuyVehicle = (veh: typeof VEHICLES[0]) => {
    soundEngine.playClick();
    if (character.cashNaira < veh.buyPrice) {
      soundEngine.playSapaWarning();
      showFeedback(`You need ₦${veh.buyPrice.toLocaleString()} to purchase this ${veh.name}.`);
      return;
    }
    soundEngine.playFanfare();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    const asset: VehicleAsset = {
      id: veh.id,
      name: veh.name,
      resaleValue: Math.round(veh.buyPrice * 0.8),
      maintenanceCostPerYear: veh.maintenanceCostPerYear,
      trafficEscapeFactor: veh.trafficEscapeFactor,
    };
    onUpdateCharacter((prev) => ({
      ...prev,
      cashNaira: prev.cashNaira - veh.buyPrice,
      vehicle: asset,
      streetCred: Math.min(100, prev.streetCred + veh.streetCredBonus),
      happiness: Math.min(100, prev.happiness + 25),
    }));
    onAddLogMessage(`Bought ${veh.name}! Cruising through the city with street respect.`);
    showFeedback(`Congratulations on your new ride: ${veh.name}!`);
  };

  const handleMoveHousing = (h: typeof HOUSING_OPTIONS[0]) => {
    soundEngine.playClick();
    if (character.cashNaira < h.cost) {
      soundEngine.playSapaWarning();
      showFeedback(`You need ₦${h.cost.toLocaleString()} for this property.`);
      return;
    }
    soundEngine.playMoneyChime();
    const asset: PropertyAsset = {
      id: h.id,
      name: h.name,
      type: h.isRental ? 'rental' : 'owned',
      yearlyRentOrMaintenance: h.isRental ? h.cost : Math.round(h.cost * 0.02),
      propertyValue: h.isRental ? undefined : h.cost,
    };
    onUpdateCharacter((prev) => ({
      ...prev,
      cashNaira: prev.cashNaira - h.cost,
      home: asset,
      happiness: Math.min(100, prev.happiness + h.comfortBonus),
      sapaLevel: Math.max(0, prev.sapaLevel - (h.isRental ? 0 : 25)),
    }));
    onAddLogMessage(`Relocated home to: ${h.name}! Comfort and status upgraded.`);
    showFeedback(`Relocated to ${h.name}!`);
  };

  const handleStartBusiness = (b: typeof BUSINESS_OPTIONS[0]) => {
    soundEngine.playClick();
    if (character.cashNaira < b.startupCapital) {
      soundEngine.playSapaWarning();
      showFeedback(`You need ₦${b.startupCapital.toLocaleString()} startup capital.`);
      return;
    }
    soundEngine.playFanfare();
    const asset: BusinessAsset = {
      id: b.id,
      name: b.name,
      capitalInvested: b.startupCapital,
      yearlyProfit: b.baseYearlyProfit,
      managerHired: false,
    };
    onUpdateCharacter((prev) => ({
      ...prev,
      cashNaira: prev.cashNaira - b.startupCapital,
      businesses: [...prev.businesses, asset],
      streetCred: Math.min(100, prev.streetCred + 20),
      happiness: Math.min(100, prev.happiness + 18),
    }));
    onAddLogMessage(`Opened new enterprise: ${b.name}! Earning ₦${b.baseYearlyProfit.toLocaleString()}/yr.`);
    showFeedback(`Enterprise launched: ${b.name}!`);
  };

  // ================= JAPA HANDLERS =================
  const handleIELTS = () => {
    soundEngine.playClick();
    const cost = 220000;
    if (character.cashNaira < cost) {
      soundEngine.playSapaWarning();
      showFeedback('You need ₦220,000 for British Council IELTS registration.');
      return;
    }

    const score = character.smarts >= 60 ? 8.5 : character.smarts >= 40 ? 7.0 : 6.0;
    if (score >= 7.0) {
      soundEngine.playFanfare();
      onUpdateCharacter((prev) => ({
        ...prev,
        cashNaira: prev.cashNaira - cost,
        japa: { ...prev.japa, ieltsScore: score, applicationStage: 'documents_ready' },
        happiness: Math.min(100, prev.happiness + 20),
      }));
      onAddLogMessage(`Sat for IELTS exam. Scored a remarkable Band ${score}! Document stage ready.`);
      showFeedback(`IELTS Score: Band ${score}! You are eligible for Canadian & UK visas.`);
    } else {
      soundEngine.playFailure();
      onUpdateCharacter((prev) => ({
        ...prev,
        cashNaira: prev.cashNaira - cost,
        japa: { ...prev.japa, ieltsScore: score },
        happiness: Math.max(10, prev.happiness - 10),
      }));
      onAddLogMessage(`Sat for IELTS. Scored Band ${score}. Grammar and vocabulary need work.`);
      showFeedback(`IELTS Score: Band ${score}. Minimum 7.0 recommended.`);
    }
  };

  const handleApplyVisa = (country: 'uk' | 'canada' | 'usa' | 'germany') => {
    soundEngine.playClick();
    const pofNeeded = country === 'canada' ? 18000000 : country === 'uk' ? 15000000 : 25000000;

    if (character.cashNaira < pofNeeded) {
      soundEngine.playSapaWarning();
      showFeedback(`Proof of funds insufficient! The ${country.toUpperCase()} embassy demands ₦${pofNeeded.toLocaleString()} in your account.`);
      return;
    }

    soundEngine.playFanfare();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    onUpdateCharacter((prev) => ({
      ...prev,
      japa: {
        ...prev.japa,
        targetCountry: country,
        proofOfFundsSaved: pofNeeded,
        applicationStage: 'approved',
        isRelocated: true,
      },
      happiness: 100,
      sapaLevel: 0,
      titles: prev.titles.includes('Japa Pioneer') ? prev.titles : [...prev.titles, 'Japa Pioneer'],
    }));
    onAddLogMessage(`VISA APPROVED! Packed bags at Murtala Muhammed Airport and boarded flight to ${country.toUpperCase()}! JAPA SUCCESS!`);
    showFeedback(`VISA GRANTED! You have successfully relocated to ${country.toUpperCase()}!`);
  };

  // ================= LEISURE HANDLERS =================
  const handleAmalaShitta = () => {
    soundEngine.playClick();
    soundEngine.playMoneyChime();
    const cost = 4500;
    if (character.cashNaira < cost) {
      showFeedback('You cannot afford Amala Shitta right now. Sapa is real!');
      return;
    }
    onUpdateCharacter((prev) => ({
      ...prev,
      cashNaira: prev.cashNaira - cost,
      happiness: Math.min(100, prev.happiness + 14),
      health: Math.min(100, prev.health + 6),
      streetCred: Math.min(100, prev.streetCred + 4),
      sapaLevel: Math.max(0, prev.sapaLevel - 4),
    }));
    onAddLogMessage('Ate piping hot Amala with Gbegiri, Ewedu, and tender goat meat at Amala Shitta.');
    showFeedback('Piping hot Amala and goat meat consumed! Pure bliss.');
  };

  const handleQuiloxClub = () => {
    soundEngine.playClick();
    const cost = 120000;
    if (character.cashNaira < cost) {
      soundEngine.playSapaWarning();
      showFeedback('Quilox bouncers will not even let you past the gate without ₦120k spending budget.');
      return;
    }
    soundEngine.playFanfare();
    onUpdateCharacter((prev) => ({
      ...prev,
      cashNaira: prev.cashNaira - cost,
      happiness: Math.min(100, prev.happiness + 22),
      streetCred: Math.min(100, prev.streetCred + 25),
      health: Math.max(10, prev.health - 5),
    }));
    onAddLogMessage('VIP night out at Quilox Victoria Island. Sparklers, chilled drinks, and Afrobeats.');
    showFeedback('Nightclub VIP experience! Street cred and social stature boosted.');
  };

  const handleSundayChurchVigil = () => {
    soundEngine.playClick();
    onUpdateCharacter((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 16),
      smarts: Math.min(100, prev.smarts + 5),
      sapaLevel: Math.max(0, prev.sapaLevel - 5),
    }));
    onAddLogMessage('Attended powerful prayer vigil. Spirit uplifted with renewed hope and tranquility.');
    showFeedback('Peace of mind restored. You feel blessed.');
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col">
      {/* Category Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-x-auto mb-5">
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('career');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === 'career' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Hustle & Jobs</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('education');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === 'education' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>School & Trades</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('assets');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === 'assets' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Assets & Power</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('japa');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === 'japa' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>Japa Portal</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('wealth');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === 'wealth' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Wealth Tracker</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('arcade');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === 'arcade' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Arcade & Gigs</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('leisure');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === 'leisure' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Lifestyle</span>
        </button>
      </div>

      {/* Floating Action Feedback Toast */}
      {actionFeedback && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* TAB CONTENT 1: CAREER & HUSTLE */}
      {activeTab === 'career' && (
        <div className="space-y-4">
          {/* Current Job Box */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Current Occupation</div>
              <div className="text-base font-display font-bold text-slate-100">
                {character.currentJob ? character.currentJob.title : 'Unemployed (Job Hunting)'}
              </div>
              {character.currentJob && (
                <div className="text-xs text-emerald-400 font-mono-numbers mt-0.5">
                  Salary: ₦{character.currentJob.salary.toLocaleString()}/yr
                  {character.currentJob.dollarSalary && ` ($${character.currentJob.dollarSalary.toLocaleString()} USD)`}
                </div>
              )}
            </div>
            {character.currentJob && (
              <button
                onClick={handleWorkOvertime}
                className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                Work Overtime (+Bonus)
              </button>
            )}
          </div>

          {/* Job Market */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Available Jobs in {character.city.toUpperCase()}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {AVAILABLE_JOBS.map((job) => {
                const isCurrent = character.currentJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-2 ${
                      isCurrent ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-200">{job.title}</div>
                      <div className="text-xs text-emerald-400 font-mono-numbers mt-0.5">
                        ₦{job.salary.toLocaleString()}/yr {job.dollarSalary ? `($${job.dollarSalary.toLocaleString()})` : ''}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Req: Smarts {job.minSmarts} · Cred {job.minStreetCred}
                      </div>
                    </div>
                    <button
                      disabled={isCurrent}
                      onClick={() => handleApplyJob(job)}
                      className={`w-full py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
                        isCurrent
                          ? 'bg-emerald-800/40 text-emerald-300 cursor-default'
                          : 'bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30'
                      }`}
                    >
                      {isCurrent ? 'Current Position' : 'Apply for Job'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Hustles */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Side Hustles (Second Income)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SIDE_HUSTLES.map((hustle) => {
                const isActive = character.sideHustle?.id === hustle.id;
                return (
                  <div key={hustle.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{hustle.name}</div>
                      <div className="text-xs text-amber-400 font-mono-numbers">
                        +₦{hustle.annualIncome.toLocaleString()}/yr
                      </div>
                    </div>
                    <button
                      disabled={isActive}
                      onClick={() => handleStartSideHustle(hustle)}
                      className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
                        isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isActive ? 'Active' : 'Start Gig'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: EDUCATION */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Education Status</div>
            <div className="text-base font-display font-bold text-slate-100">
              {character.education === 'university'
                ? `University Graduate (${character.degreeName || 'B.Sc'})`
                : character.education === 'waec_passed'
                ? 'Senior Secondary Certificate (WAEC Passed)'
                : character.education === 'apprentice_graduate'
                ? 'Certified Alaba Trade Master'
                : 'Primary / Secondary Student'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* WAEC Option */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">Sit for WAEC Exam</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Required milestone for higher education and corporate careers. Registration: ₦25,000.
                </p>
              </div>
              <button
                disabled={character.education === 'waec_passed' || character.education === 'university'}
                onClick={handleTakeWAEC}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                {character.education === 'waec_passed' || character.education === 'university' ? 'Completed' : 'Write WAEC Exam'}
              </button>
            </div>

            {/* University Option */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">University (B.Sc)</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Four years of campus hustle, lectures, and academic honors. Tuition: ₦180,000.
                </p>
              </div>
              <button
                disabled={character.education === 'university'}
                onClick={handleEnrollUniversity}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-lg transition-colors"
              >
                {character.education === 'university' ? 'Degree Earned' : 'Enroll in University'}
              </button>
            </div>

            {/* Alaba Apprenticeship */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">Alaba Apprenticeship</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Learn wholesale commerce directly from market titans. Guaranteed settlement grant!
                </p>
              </div>
              <button
                disabled={character.education === 'apprentice_graduate'}
                onClick={handleAlabaApprenticeship}
                className="py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-lg transition-colors"
              >
                {character.education === 'apprentice_graduate' ? 'Master Settled' : 'Begin Apprenticeship'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ASSETS & LIVING */}
      {activeTab === 'assets' && (
        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
          {/* Generators */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Power Generators (NEPA Defense)
              </h3>
              {character.generator && (
                <span className="text-xs text-emerald-400 font-medium">Equipped: {character.generator.name}</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GENERATORS.map((gen) => (
                <div key={gen.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm text-slate-200">{gen.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{gen.description}</div>
                    <div className="text-xs text-amber-400 font-mono-numbers mt-1">
                      Buy: ₦{gen.buyPrice.toLocaleString()} · Fuel: ₦{gen.fuelCostPerYear.toLocaleString()}/yr
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyGenerator(gen)}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Purchase Generator
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicles */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicles & Transport</h3>
              {character.vehicle && (
                <span className="text-xs text-emerald-400 font-medium">Driving: {character.vehicle.name}</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {VEHICLES.map((veh) => (
                <div key={veh.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm text-slate-200">{veh.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{veh.description}</div>
                    <div className="text-xs text-amber-400 font-mono-numbers mt-1">
                      Buy: ₦{veh.buyPrice.toLocaleString()} · Street Cred +{veh.streetCredBonus}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyVehicle(veh)}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Buy Ride
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Housing */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Housing & Real Estate</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HOUSING_OPTIONS.map((h) => (
                <div key={h.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm text-slate-200">{h.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{h.description}</div>
                    <div className="text-xs text-emerald-400 font-mono-numbers mt-1">
                      {h.isRental ? `Rent: ₦${h.cost.toLocaleString()}/yr` : `Buy Price: ₦${h.cost.toLocaleString()}`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleMoveHousing(h)}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-emerald-600 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                  >
                    {h.isRental ? 'Rent Flat' : 'Buy Outright'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Businesses */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Commercial Ventures</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BUSINESS_OPTIONS.map((biz) => (
                <div key={biz.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm text-slate-200">{biz.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{biz.description}</div>
                    <div className="text-xs text-amber-400 font-mono-numbers mt-1">
                      Capital: ₦{biz.startupCapital.toLocaleString()} · Profit: ~₦{biz.baseYearlyProfit.toLocaleString()}/yr
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartBusiness(biz)}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Invest in Enterprise
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: JAPA PORTAL */}
      {activeTab === 'japa' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Relocation Status</span>
              <span className="text-xs text-amber-400 font-bold">
                {character.japa.isRelocated ? 'Japa Achieved! Expatriate Living' : character.japa.applicationStage.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              The grand quest to relocate abroad. Pass the English exams, save verified Proof of Funds, and secure your entry visa.
            </p>
            {character.japa.ieltsScore > 0 && (
              <div className="mt-2 text-xs text-emerald-400 font-mono-numbers">
                IELTS Overall Score: Band {character.japa.ieltsScore}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Step 1: IELTS */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">Step 1: Write IELTS Exam</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Test your English proficiency. High scores unlock Canada Express Entry and UK visas. Fee: ₦220,000.
                </p>
              </div>
              <button
                onClick={handleIELTS}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                Take IELTS Test
              </button>
            </div>

            {/* Step 2: Embassy Applications */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">Step 2: Embassy Visa Routes</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Submit verified proof of funds and attend the consulate interview at Walter Carrington Crescent.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleApplyVisa('canada')}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                >
                  Canada (₦18M)
                </button>
                <button
                  onClick={() => handleApplyVisa('uk')}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                >
                  UK Visa (₦15M)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: WEALTH TRACKER */}
      {activeTab === 'wealth' && (
        <WealthTracker character={character} logs={logs} />
      )}

      {/* TAB CONTENT: ARCADE & MINI-GAMES */}
      {activeTab === 'arcade' && (
        <div>
          {activeMinigame === 'danfo' && (
            <DanfoDodger
              character={character}
              onGameComplete={({ cashEarned, streetCredBonus, happinessBonus }) => {
                onUpdateCharacter((prev) => ({
                  ...prev,
                  cashNaira: prev.cashNaira + cashEarned,
                  streetCred: Math.min(100, prev.streetCred + streetCredBonus),
                  happiness: Math.min(100, prev.happiness + happinessBonus),
                }));
                onAddLogMessage(`Navigated Third Mainland Bridge traffic! Collected ₦${cashEarned.toLocaleString()} in fares.`);
                setActiveMinigame(null);
                showFeedback(`Trip complete! Earned ₦${cashEarned.toLocaleString()} in fares!`);
              }}
              onClose={() => setActiveMinigame(null)}
            />
          )}

          {activeMinigame === 'generator' && (
            <GeneratorRepair
              character={character}
              onComplete={({ success, happinessGain, smartsGain, cashSaved }) => {
                onUpdateCharacter((prev) => ({
                  ...prev,
                  cashNaira: prev.cashNaira + cashSaved,
                  happiness: Math.min(100, prev.happiness + happinessGain),
                  smarts: Math.min(100, prev.smarts + smartsGain),
                }));
                onAddLogMessage(`Repaired generator spark plug and kicked engine to life! Saved ₦${cashSaved.toLocaleString()}.`);
                setActiveMinigame(null);
                showFeedback('Generator humming smoothly! Electricity restored.');
              }}
              onClose={() => setActiveMinigame(null)}
            />
          )}

          {activeMinigame === 'owambe' && (
            <OwambeSprayer
              character={character}
              onComplete={({ cashSprayed, streetCredBonus, happinessBonus, titleAwarded }) => {
                onUpdateCharacter((prev) => ({
                  ...prev,
                  cashNaira: Math.max(0, prev.cashNaira - cashSprayed),
                  streetCred: Math.min(100, prev.streetCred + streetCredBonus),
                  happiness: Math.min(100, prev.happiness + happinessBonus),
                  titles: titleAwarded && !prev.titles.includes(titleAwarded) ? [...prev.titles, titleAwarded] : prev.titles,
                }));
                onAddLogMessage(`Partied at Surulere Owambe! Sprayed ₦${cashSprayed.toLocaleString()} mint notes to live Fuji praises.`);
                setActiveMinigame(null);
                showFeedback('Owambe concluded! Gained massive street respect & family praise.');
              }}
              onClose={() => setActiveMinigame(null)}
            />
          )}

          {!activeMinigame && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Interactive Nigerian Minigames</h3>
                <p className="text-xs text-slate-400 mb-3">
                  Step onto the Lagos streets to earn extra cash, master survival skills, or spray money at high-society events!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Card 1: Danfo Dodger */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-3">
                  <div>
                    <div className="text-2xl mb-1">🚌</div>
                    <h4 className="font-semibold text-sm text-slate-100">Danfo Expressway Dodger</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Dodge potholes, trailers, and LASTMA officers across Third Mainland Bridge. Collect fares and ₦5,000 cash drops!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveMinigame('danfo');
                    }}
                    className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow"
                  >
                    Drive Highway
                  </button>
                </div>

                {/* Card 2: Generator Repair */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-3">
                  <div>
                    <div className="text-2xl mb-1">⚡</div>
                    <h4 className="font-semibold text-sm text-slate-100">Generator Recoil Starter</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Scrub the oily spark plug and time the recoil pull rope to rescue your home from darkness!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveMinigame('generator');
                    }}
                    className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow"
                  >
                    Start Generator
                  </button>
                </div>

                {/* Card 3: Owambe Sprayer */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-3">
                  <div>
                    <div className="text-2xl mb-1">🎉</div>
                    <h4 className="font-semibold text-sm text-slate-100">Owambe Fuji Spraying Party</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Paste crisp mint notes on dancers to the rhythm of live Fuji drums. Win the praise of elders!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveMinigame('owambe');
                    }}
                    className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow"
                  >
                    Enter Owambe
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 5: LIFESTYLE & LEISURE */}
      {activeTab === 'leisure' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">Amala Shitta & Suya</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Feast on hot Amala with gbegiri, ewedu, and tender goat meat. Instant health & happiness boost! (₦4,500)
                </p>
              </div>
              <button
                onClick={handleAmalaShitta}
                className="py-2 px-3 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold rounded-lg transition-colors border border-amber-500/40"
              >
                Eat Amala Shitta
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">Quilox VIP Nightclub</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Pop chilled bottles in Victoria Island with top musicians and influencers. Massive street cred! (₦120,000)
                </p>
              </div>
              <button
                onClick={handleQuiloxClub}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700"
              >
                Hit the Club
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">Spiritual Vigil / Prayer</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Spend midnight in deep contemplation and prayers for divine guidance and peace. (Free)
                </p>
              </div>
              <button
                onClick={handleSundayChurchVigil}
                className="py-2 px-3 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-bold rounded-lg transition-colors border border-cyan-800/50"
              >
                Attend Prayers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

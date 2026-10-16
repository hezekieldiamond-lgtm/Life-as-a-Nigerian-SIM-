import React, { useState } from 'react';
import { CharacterState, CityId, Gender, BackgroundOrigin } from '../types/game';
import { CITIES } from '../data/cities';
import { Avatar, SKIN_TONES, HAIR_STYLES, OUTFITS, ACCESSORIES } from './Avatar';
import { HOUSING_OPTIONS } from '../data/assets';
import { soundEngine } from '../utils/audio';
import { Dices, Sparkles, MapPin, Award } from 'lucide-react';

interface NewGameModalProps {
  onStartGame: (character: CharacterState) => void;
  onCancel?: () => void;
  canCancel?: boolean;
}

const NIGERIAN_MALE_NAMES = [
  'Babatunde Adeleke',
  'Chinedu Okafor',
  'Emeka Nwosu',
  'Olumide Bakare',
  'Ibrahim Bello',
  'Tariq Danjuma',
  'Femi Alabi',
  'Uche Okonkwo',
  'Yakubu Garba',
  'Kayode Ojo',
];

const NIGERIAN_FEMALE_NAMES = [
  'Amina Bello',
  'Ngozi Okonjo',
  'Folashade Alakija',
  'Zainab Ibrahim',
  'Chioma Eze',
  'Funmilayo Ransome',
  'Adanna Nwachukwu',
  'Blessing Okagbare',
  'Khadijah Sanusi',
  'Simi Phillips',
];

export const NewGameModal: React.FC<NewGameModalProps> = ({ onStartGame, onCancel, canCancel }) => {
  const [gender, setGender] = useState<Gender>('male');
  const [name, setName] = useState<string>('Babatunde Adeleke');
  const [city, setCity] = useState<CityId>('lagos');
  const [background, setBackground] = useState<BackgroundOrigin>('middle_class');

  // Avatar customization
  const [skin, setSkin] = useState<string>('rich_chocolate');
  const [hair, setHair] = useState<string>('fade');
  const [outfit, setOutfit] = useState<string>('agbada');
  const [accessory, setAccessory] = useState<string>('gold_chain');

  const handleRandomizeName = () => {
    soundEngine.playClick();
    const list = gender === 'male' ? NIGERIAN_MALE_NAMES : NIGERIAN_FEMALE_NAMES;
    const picked = list[Math.floor(Math.random() * list.length)];
    setName(picked);
  };

  const handleCreate = () => {
    soundEngine.playFanfare();

    let startingCash = 250000;
    let startingSmarts = 50;
    let startingCred = 40;
    let startingSapa = 20;

    if (background === 'silver_spoon') {
      startingCash = 5000000;
      startingSmarts = 65;
      startingCred = 20;
      startingSapa = 5;
    } else if (background === 'trench_kid') {
      startingCash = 5000;
      startingSmarts = 40;
      startingCred = 70;
      startingSapa = 65;
    }

    const defaultHome =
      background === 'silver_spoon'
        ? {
            id: 'three_bedroom_rental',
            name: '3-Bedroom Apartment (Surulere / Gwarinpa)',
            type: 'rental' as const,
            yearlyRentOrMaintenance: 2400000,
          }
        : {
            id: 'face_me_face_you',
            name: 'Face-Me-I-Face-You Room (Mushin)',
            type: 'rental' as const,
            yearlyRentOrMaintenance: 180000,
          };

    const newChar: CharacterState = {
      name: name.trim() || (gender === 'male' ? 'Chinedu Okafor' : 'Chioma Eze'),
      gender,
      city,
      background,
      age: 18,
      year: 2026,
      health: 85,
      happiness: 75,
      smarts: startingSmarts,
      streetCred: startingCred,
      sapaLevel: startingSapa,
      cashNaira: startingCash,
      cashUSD: 0,
      debtNaira: 0,
      usdExchangeRate: 1520,
      education: 'secondary_sss',
      currentJob: null,
      sideHustle: null,
      maritalStatus: 'single',
      partner: null,
      children: [],
      generator: null,
      vehicle: null,
      home: defaultHome,
      businesses: [],
      japa: {
        hasPassport: true,
        ieltsScore: 0,
        proofOfFundsNeeded: 18000000,
        proofOfFundsSaved: 0,
        applicationStage: 'not_started',
        isRelocated: false,
      },
      avatarSkin: skin,
      avatarHair: hair,
      avatarOutfit: outfit,
      avatarAccessory: accessory,
      titles: [],
      achievements: ['New Citizen of Nigeria'],
      isAlive: true,
    };

    onStartGame(newChar);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Character Creation
          </span>
          <h2 className="text-2xl font-display font-extrabold text-slate-100 mt-1">
            Birth Your Nigerian Avatar
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your origin, destiny, and street identity in the federation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Live Avatar Preview & Styling */}
          <div className="flex flex-col items-center justify-start space-y-4">
            <Avatar
              character={{
                gender,
                avatarSkin: skin,
                avatarHair: hair,
                avatarOutfit: outfit,
                avatarAccessory: accessory,
                happiness: 80,
                sapaLevel: 10,
                health: 90,
              }}
              size="xl"
            />

            {/* Styling selectors */}
            <div className="w-full space-y-2 text-left">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Skin Tone</label>
                <div className="flex gap-2">
                  {SKIN_TONES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSkin(s.id)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        skin === s.id ? 'border-amber-400 scale-110 shadow' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: s.color }}
                      title={s.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Hair / Gele</label>
                <select
                  value={hair}
                  onChange={(e) => setHair(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
                >
                  {HAIR_STYLES.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Attire</label>
                <select
                  value={outfit}
                  onChange={(e) => setOutfit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
                >
                  {OUTFITS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Accessories</label>
                <select
                  value={accessory}
                  onChange={(e) => setAccessory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
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

          {/* Column 2 & 3: Identity & Background Details */}
          <div className="md:col-span-2 space-y-4">
            {/* Gender Toggle */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGender('male');
                    if (hair === 'gele') setHair('fade');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    gender === 'male' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGender('female');
                    if (hair === 'fade') setHair('braids');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    gender === 'female' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Name Input with Randomize Button */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Full Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Babatunde Adeleke"
                />
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 flex items-center justify-center transition-colors"
                  title="Randomize Nigerian name"
                >
                  <Dices className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Birth City Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Birth City
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.values(CITIES).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCity(c.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      city === c.id
                        ? 'bg-amber-500/15 border-amber-400 text-slate-100 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{c.name}</div>
                    <div className="text-[10px] text-amber-400/80 truncate">{c.tagline}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Origin */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Family Background</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBackground('silver_spoon')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    background === 'silver_spoon'
                      ? 'bg-amber-500/15 border-amber-400 text-slate-100'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-300">Silver Spoon</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">₦5M cash, private school</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBackground('middle_class')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    background === 'middle_class'
                      ? 'bg-amber-500/15 border-amber-400 text-slate-100'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">Middle Class</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">₦250k cash, steady study</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBackground('trench_kid')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    background === 'trench_kid'
                      ? 'bg-amber-500/15 border-amber-400 text-slate-100'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-rose-300">Trench Kid</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">₦5k cash, max street grit</div>
                </button>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-2 flex items-center gap-3">
              {canCancel && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleCreate}
                className="flex-1 py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Begin Life in Nigeria</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

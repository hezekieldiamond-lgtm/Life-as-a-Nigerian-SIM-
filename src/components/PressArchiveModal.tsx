import React, { useState } from 'react';
import { CharacterState } from '../types/game';
import { Avatar } from './Avatar';
import { soundEngine } from '../utils/audio';
import { Newspaper, Award, Printer, X, Download, Sparkles, CheckCircle2 } from 'lucide-react';

interface PressArchiveModalProps {
  character: CharacterState;
  onClose: () => void;
}

type ArchiveTab = 'newspaper' | 'degree' | 'chieftaincy';

export const PressArchiveModal: React.FC<PressArchiveModalProps> = ({ character, onClose }) => {
  const [activeTab, setActiveTab] = useState<ArchiveTab>('newspaper');

  const handlePrint = () => {
    soundEngine.playClick();
    window.print();
  };

  // Determine dynamic newspaper headline based on character milestones
  const getHeadline = () => {
    if (character.japa.isRelocated) {
      return `${character.name.toUpperCase()} SECURES HISTORIC VISA TO ${character.japa.targetCountry?.toUpperCase()} AFTER TOP IELTS SCORE!`;
    }
    if (character.currentJob?.isDollarIncome) {
      return `${character.name.toUpperCase()} PULLS OFF SENSATIONAL $50,000 REMOTE TECH CONTRACT FROM SILICON VALLEY!`;
    }
    if (character.titles.includes('High Chief Otunba')) {
      return `ROYALTY: ${character.name.toUpperCase()} CONFERRED WITH COVETED HIGH CHIEFTAINCY TITLE!`;
    }
    if (character.education === 'university') {
      return `ACADEMIC EXCELLENCE: ${character.name.toUpperCase()} RECEIVES HIGHEST HONORS IN NIGERIAN UNIVERSITY!`;
    }
    if (character.sapaLevel > 60) {
      return `HEROIC SURVIVAL: ${character.name.toUpperCase()} MASTERS THE NAIJA HUSTLE AMID ECONOMIC CRUNCH!`;
    }
    return `RISING ICON: ${character.name.toUpperCase()} BUILDS INSPIRING LIFE ACROSS ${character.city.toUpperCase()}!`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-display font-bold text-slate-100">
                National Press & Archive Bureau
              </h2>
              <p className="text-xs text-slate-400">
                Official newspaper clippings and authenticated certificates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              title="Print / Save PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print / PDF</span>
            </button>
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
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 my-3">
          <button
            onClick={() => setActiveTab('newspaper')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'newspaper' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400'
            }`}
          >
            The Daily Times Newspaper
          </button>
          <button
            onClick={() => setActiveTab('degree')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'degree' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400'
            }`}
          >
            University Degree Diploma
          </button>
          <button
            onClick={() => setActiveTab('chieftaincy')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chieftaincy' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400'
            }`}
          >
            Royal Chieftaincy Decree
          </button>
        </div>

        {/* Printable Canvas Section */}
        <div className="flex-1 overflow-y-auto p-1">
          {activeTab === 'newspaper' && (
            <div className="bg-[#fcfbf7] text-[#1c1917] p-6 rounded-2xl shadow-xl border-4 border-[#292524] font-serif">
              {/* Newspaper Masthead */}
              <div className="border-b-4 border-double border-black pb-2 text-center">
                <div className="text-[10px] uppercase tracking-widest font-sans font-bold text-stone-600 mb-0.5">
                  Nigeria's Premier Independent National Daily · Founded 1925
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-black">
                  THE DAILY TIMES
                </h1>
                <div className="flex justify-between border-t border-black text-[10px] font-sans font-semibold pt-1 mt-1 text-stone-700">
                  <span>VOL. XLVIII NO. 14,289</span>
                  <span>LAGOS, NIGERIA · {character.year}</span>
                  <span>PRICE: ₦150</span>
                </div>
              </div>

              {/* Main Headline */}
              <div className="my-4 text-center">
                <h2 className="text-xl sm:text-2xl font-black leading-tight text-stone-900 uppercase">
                  {getHeadline()}
                </h2>
                <p className="text-xs italic text-stone-600 mt-1 font-serif">
                  Exclusive Special Investigation from our Special Correspondents in {character.city.toUpperCase()}
                </p>
              </div>

              {/* Article Content with Portrait */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-300">
                <div className="sm:col-span-1 flex flex-col items-center">
                  <div className="p-1.5 bg-stone-200 border border-stone-400 rounded-xl shadow">
                    <Avatar character={character} size="lg" />
                  </div>
                  <span className="text-[10px] text-stone-600 italic text-center mt-1 font-sans">
                    {character.name}, photographed in traditional majesty.
                  </span>
                </div>

                <div className="sm:col-span-2 text-xs leading-relaxed text-stone-800 space-y-2">
                  <p>
                    <strong>{character.city.toUpperCase()} —</strong> In what many are hailing as a defining testament to the indomitable Nigerian spirit, {character.name} has continued to captivate family, peers, and observers across the nation.
                  </p>
                  <p>
                    Starting from {character.background.replace('_', ' ')} roots, {character.name} has withstood grid collapses, Sapa trials, and high-stakes hustles to attain an estimated net worth of <strong>₦{character.cashNaira.toLocaleString()}</strong>.
                  </p>
                  <p>
                    Community elders and market leaders noted: <em>"This is what happens when resilience meets opportunity. They never surrendered to the challenges of the street."</em>
                  </p>
                </div>
              </div>

              {/* Bottom Humor Column */}
              <div className="mt-4 pt-2 border-t border-stone-400 grid grid-cols-2 text-[10px] text-stone-600 font-sans">
                <div>
                  <strong>WEATHER:</strong> Lagos Humidity 88% · Occasional grid blackouts
                </div>
                <div className="text-right">
                  <strong>EXCHANGE RATE:</strong> ₦{character.usdExchangeRate.toLocaleString()} / $1 USD
                </div>
              </div>
            </div>
          )}

          {activeTab === 'degree' && (
            <div className="bg-[#fffdfa] text-slate-900 p-8 rounded-2xl shadow-xl border-8 border-double border-amber-600/60 font-serif text-center relative overflow-hidden">
              <div className="w-16 h-16 mx-auto mb-2 text-amber-600 flex items-center justify-center">
                <Award className="w-14 h-14" />
              </div>

              <h2 className="text-xl font-black uppercase tracking-wider text-slate-900 font-display">
                Federal University of the Republic of Nigeria
              </h2>
              <p className="text-xs uppercase tracking-widest text-slate-600 mb-4">
                By the authority of the Senate & Governing Council
              </p>

              <p className="text-xs text-slate-700 italic mb-2">Be it known to all that</p>
              <h3 className="text-2xl font-black text-amber-900 border-b-2 border-amber-500/40 pb-1 mb-3 inline-block">
                {character.name}
              </h3>

              <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed mb-6">
                having satisfied all academic prerequisites, examinations, and university regulations has this day been conferred with the degree of
              </p>

              <h4 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-6">
                Bachelor of Science ({character.degreeName || 'Economics & Enterprise'})
              </h4>

              <div className="flex justify-between items-end border-t border-slate-300 pt-4 text-[10px] text-slate-600">
                <div className="text-left">
                  <div className="font-serif italic text-slate-800">Prof. A. O. Balogun</div>
                  <div>Vice Chancellor</div>
                </div>
                <div className="p-2 border-2 border-amber-600 rounded-full text-amber-700 font-black text-[9px] uppercase tracking-tighter">
                  OFFICIAL SEAL
                </div>
                <div className="text-right">
                  <div className="font-mono-numbers">MATRIC: NG/{character.year}/8421</div>
                  <div>Registrar</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chieftaincy' && (
            <div className="bg-gradient-to-b from-amber-50 to-stone-100 text-stone-900 p-8 rounded-2xl shadow-xl border-8 border-double border-amber-700/80 font-serif text-center relative">
              <div className="text-amber-700 text-2xl mb-2">👑</div>
              <h2 className="text-xl font-black uppercase tracking-widest text-amber-950 font-display">
                Royal Palace Chieftaincy Decree
              </h2>
              <p className="text-xs uppercase tracking-wider text-amber-800 mb-4 font-sans">
                The Traditional Council of Elders and Kingship
              </p>

              <p className="text-xs text-stone-700 italic mb-2">Know ye all persons by these royal seals that</p>
              <h3 className="text-2xl font-black text-amber-950 border-b-2 border-amber-600 pb-1 mb-3 inline-block">
                {character.name}
              </h3>

              <p className="text-xs text-stone-800 max-w-md mx-auto leading-relaxed mb-6">
                in glorious acknowledgment of boundless generosity, philanthropic defense of the weak, and elevating the honored name of our ancestral land, is hereby conferred the sacred title of:
              </p>

              <div className="p-3 bg-amber-600/15 border-2 border-amber-700 rounded-xl max-w-xs mx-auto mb-6">
                <span className="text-base font-black text-amber-950 uppercase tracking-widest font-display block">
                  {character.titles[0] || 'High Chief Otunba Bobagunwa'}
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px] text-stone-600 pt-3 border-t border-amber-300">
                <span>Conferred at the Royal Palace</span>
                <span className="text-amber-800 font-black">KABIYESI OBA ALAAFIN</span>
                <span>Year {character.year}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

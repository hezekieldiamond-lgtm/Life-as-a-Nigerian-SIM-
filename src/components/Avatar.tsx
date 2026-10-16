import React from 'react';
import { CharacterState } from '../types/game';

interface AvatarProps {
  character?: Pick<CharacterState, 'gender' | 'avatarSkin' | 'avatarHair' | 'avatarOutfit' | 'avatarAccessory' | 'happiness' | 'sapaLevel' | 'health'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SKIN_TONES = [
  { id: 'dark_ebony', name: 'Ebony', color: '#3c2415', shadow: '#28170c' },
  { id: 'rich_chocolate', name: 'Chocolate', color: '#593822', shadow: '#402412' },
  { id: 'warm_caramel', name: 'Caramel', color: '#7a4e2d', shadow: '#5b361a' },
  { id: 'golden_bronze', name: 'Bronze', color: '#9d683e', shadow: '#774c28' },
];

export const HAIR_STYLES = [
  { id: 'afro', name: 'Afro' },
  { id: 'fade', name: 'Clean Fade' },
  { id: 'braids', name: 'Braids / Dreads' },
  { id: 'gele', name: 'Traditional Gele' },
  { id: 'bald', name: 'Clean Shaven' },
];

export const OUTFITS = [
  { id: 'agbada', name: 'Royal Agbada' },
  { id: 'ankara', name: 'Ankara Print' },
  { id: 'tech_hoodie', name: 'Tech Bro Hoodie' },
  { id: 'corporate', name: 'Corporate Suit' },
  { id: 'casual', name: 'Streetwear' },
];

export const ACCESSORIES = [
  { id: 'none', name: 'None' },
  { id: 'gold_chain', name: 'Gold Cuban Chain' },
  { id: 'sunglasses', name: 'Cool Shades' },
  { id: 'coral_beads', name: 'Royal Coral Beads' },
  { id: 'traditional_cap', name: 'Embroidered Fila Cap' },
];

export const Avatar: React.FC<AvatarProps> = ({ character, size = 'lg', className = '' }) => {
  const skin = character?.avatarSkin || 'rich_chocolate';
  const hair = character?.avatarHair || 'fade';
  const outfit = character?.avatarOutfit || 'agbada';
  const accessory = character?.avatarAccessory || 'gold_chain';
  const happiness = character?.happiness ?? 70;
  const sapa = character?.sapaLevel ?? 20;

  const currentSkin = SKIN_TONES.find((s) => s.id === skin) || SKIN_TONES[1];

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-28 h-28',
    xl: 'w-44 h-44',
  }[size];

  // Dynamic emotional expression
  const isSadOrStressed = sapa > 65 || happiness < 35;
  const isSuperHappy = happiness >= 70 && sapa < 40;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 shadow-md flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="agbadaEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="ankaraPattern" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="geleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c026d3" />
            <stop offset="50%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
        </defs>

        {/* Background glow circle */}
        <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" />

        {/* Neck */}
        <rect x="42" y="58" width="16" height="15" rx="3" fill={currentSkin.shadow} />

        {/* Clothing / Outfits */}
        {outfit === 'agbada' && (
          <g>
            {/* Broad Agbada Robe shoulders */}
            <path d="M12 100 Q15 65 36 68 Q50 78 64 68 Q85 65 88 100 Z" fill="url(#agbadaEmerald)" />
            {/* Gold embroidery center */}
            <path d="M44 68 Q50 82 56 68 L53 100 L47 100 Z" fill="url(#goldGradient)" />
            <circle cx="50" cy="74" r="2.5" fill="#fef08a" />
            <circle cx="50" cy="84" r="2.5" fill="#fef08a" />
          </g>
        )}

        {outfit === 'ankara' && (
          <g>
            <path d="M15 100 Q20 66 38 70 Q50 77 62 70 Q80 66 85 100 Z" fill="url(#ankaraPattern)" />
            <line x1="28" y1="75" x2="38" y2="95" stroke="#fef08a" strokeWidth="2" />
            <line x1="72" y1="75" x2="62" y2="95" stroke="#fef08a" strokeWidth="2" />
            <circle cx="50" cy="86" r="3" fill="#14b8a6" />
          </g>
        )}

        {outfit === 'tech_hoodie' && (
          <g>
            <path d="M18 100 Q20 68 36 71 Q50 78 64 71 Q80 68 82 100 Z" fill="#1e293b" />
            <path d="M42 74 Q50 82 58 74" fill="none" stroke="#64748b" strokeWidth="2" />
            <circle cx="46" cy="85" r="1.5" fill="#94a3b8" />
            <circle cx="54" cy="85" r="1.5" fill="#94a3b8" />
          </g>
        )}

        {outfit === 'corporate' && (
          <g>
            <path d="M16 100 Q20 66 36 70 L50 88 L64 70 Q80 66 84 100 Z" fill="#0f172a" />
            <polygon points="44,70 56,70 53,88 47,88" fill="#f8fafc" />
            <polygon points="49,72 51,72 52,86 48,86" fill="#dc2626" />
          </g>
        )}

        {outfit === 'casual' && (
          <g>
            <path d="M20 100 Q22 69 40 71 Q50 76 60 71 Q78 69 80 100 Z" fill="#3b82f6" />
            <path d="M44 71 Q50 78 56 71" fill="none" stroke="#2563eb" strokeWidth="2" />
          </g>
        )}

        {/* Head Base */}
        <ellipse cx="50" cy="46" rx="19" ry="22" fill={currentSkin.color} />

        {/* Ears */}
        <circle cx="30" cy="46" r="4.5" fill={currentSkin.shadow} />
        <circle cx="70" cy="46" r="4.5" fill={currentSkin.shadow} />

        {/* Hair Styles */}
        {hair === 'afro' && (
          <path
            d="M26 44 C22 30 32 15 50 15 C68 15 78 30 74 44 C72 38 68 32 60 30 C53 28 47 28 40 30 C32 32 28 38 26 44 Z"
            fill="#171717"
          />
        )}

        {hair === 'fade' && (
          <path
            d="M31 38 C32 26 40 23 50 23 C60 23 68 26 69 38 C65 32 58 30 50 30 C42 30 35 32 31 38 Z"
            fill="#171717"
          />
        )}

        {hair === 'braids' && (
          <g fill="#171717">
            <path d="M30 40 C31 25 40 22 50 22 C60 22 69 25 70 40 Z" />
            <rect x="29" y="38" width="4" height="24" rx="2" />
            <rect x="35" y="40" width="4" height="26" rx="2" />
            <rect x="61" y="40" width="4" height="26" rx="2" />
            <rect x="67" y="38" width="4" height="24" rx="2" />
          </g>
        )}

        {hair === 'gele' && (
          <g>
            <path
              d="M18 36 C16 16 34 8 50 8 C66 8 84 16 82 36 C80 24 68 20 50 20 C32 20 20 24 18 36 Z"
              fill="url(#geleGradient)"
            />
            <path d="M22 26 Q50 12 78 26 Q50 18 22 26 Z" fill="#f43f5e" opacity="0.8" />
          </g>
        )}

        {/* Eyes */}
        {isSadOrStressed ? (
          <g stroke="#f8fafc" strokeWidth="1.8" fill="none">
            {/* Tired down-curved eyes */}
            <path d="M39 44 Q43 41 47 44" />
            <path d="M53 44 Q57 41 61 44" />
          </g>
        ) : (
          <g>
            <ellipse cx="43" cy="44" rx="3.5" ry="2.5" fill="#f8fafc" />
            <circle cx="43.5" cy="44" r="1.8" fill="#171717" />
            <circle cx="44.2" cy="43.5" r="0.6" fill="#ffffff" />

            <ellipse cx="57" cy="44" rx="3.5" ry="2.5" fill="#f8fafc" />
            <circle cx="56.5" cy="44" r="1.8" fill="#171717" />
            <circle cx="57.2" cy="43.5" r="0.6" fill="#ffffff" />
          </g>
        )}

        {/* Eyebrows */}
        <path d="M38 39 Q43 37 48 39" fill="none" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M52 39 Q57 37 62 39" fill="none" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" />

        {/* Nose */}
        <path d="M47 48 Q50 51 53 48" fill="none" stroke={currentSkin.shadow} strokeWidth="2" strokeLinecap="round" />

        {/* Mouth */}
        {isSuperHappy ? (
          <path d="M42 54 Q50 64 58 54 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
        ) : isSadOrStressed ? (
          <path d="M43 57 Q50 52 57 57" fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M43 54 Q50 59 57 54" fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Accessories */}
        {accessory === 'sunglasses' && (
          <g>
            <rect x="36" y="41" width="13" height="7" rx="2" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
            <rect x="51" y="41" width="13" height="7" rx="2" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
            <line x1="49" y1="44" x2="51" y2="44" stroke="#d97706" strokeWidth="1.5" />
          </g>
        )}

        {accessory === 'gold_chain' && (
          <path d="M38 68 Q50 82 62 68" fill="none" stroke="url(#goldGradient)" strokeWidth="3" strokeLinecap="round" />
        )}

        {accessory === 'coral_beads' && (
          <g fill="#ea580c">
            <circle cx="40" cy="70" r="2.2" />
            <circle cx="44" cy="74" r="2.2" />
            <circle cx="50" cy="76" r="2.6" />
            <circle cx="56" cy="74" r="2.2" />
            <circle cx="60" cy="70" r="2.2" />
          </g>
        )}

        {accessory === 'traditional_cap' && (
          <g>
            <path d="M30 30 Q50 18 70 30 Q68 25 50 20 Q32 25 30 30 Z" fill="#b91c1c" />
            <line x1="32" y1="28" x2="68" y2="28" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3,2" />
          </g>
        )}
      </svg>
    </div>
  );
};

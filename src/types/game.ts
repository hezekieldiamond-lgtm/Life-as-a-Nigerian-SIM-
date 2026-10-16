export type CityId = 'lagos' | 'abuja' | 'portharcourt' | 'enugu' | 'kano';

export interface CityInfo {
  id: CityId;
  name: string;
  tagline: string;
  description: string;
  costOfLivingMultiplier: number;
  hustleBonus: number;
  trafficIntensity: 'insane' | 'moderate' | 'chill';
  vibe: string;
}

export type Gender = 'male' | 'female';

export type BackgroundOrigin = 'silver_spoon' | 'middle_class' | 'trench_kid';

export type EducationStage =
  | 'none'
  | 'primary'
  | 'secondary_jss'
  | 'secondary_sss'
  | 'waec_passed'
  | 'polytechnic'
  | 'university'
  | 'apprentice_graduate'
  | 'masters';

export type MaritalStatus = 'single' | 'dating' | 'engaged' | 'married' | 'divorced' | 'widowed';

export interface Partner {
  name: string;
  age: number;
  occupation: string;
  affection: number; // 0-100
  wealthLevel: 'sapa' | 'comfortable' | 'loaded';
}

export interface Child {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  health: number;
}

export interface GeneratorAsset {
  id: string;
  name: string; // e.g., 'Tiger 1kVA (I better pass my neighbor)', 'Firman 3.5kVA', 'Lister / Diesel 15kVA', 'Solar Inverter 5kVA'
  fuelCostPerYear: number;
  maintenanceRisk: number; // probability of spark plug or coil breakdown
  status: 'working' | 'faulty' | 'no_fuel';
}

export interface VehicleAsset {
  id: string;
  name: string; // 'Okada Motorcycle', 'Danfo Bus', 'Toyota Corolla (Pencil Light)', 'Mercedes-Benz C300', 'Range Rover Velar'
  resaleValue: number;
  maintenanceCostPerYear: number;
  trafficEscapeFactor: number; // e.g. Okada beats traffic, Danfo gets impounded by LASTMA
}

export interface PropertyAsset {
  id: string;
  name: string; // 'Face-me-I-face-you Room (Mushin)', '2-Bedroom Flat (Surulere)', 'Duplex (Lekki Phase 1)', 'Mansion (Banana Island)', 'Half Plot (Ibeju-Lekki)'
  type: 'rental' | 'owned';
  yearlyRentOrMaintenance: number;
  propertyValue?: number;
}

export interface BusinessAsset {
  id: string;
  name: string; // 'POS Terminal Shop', 'Barbershop & Salon', 'Shawarma & Grills Joint', 'Logistics Dispatch Fleet', 'Tech Startup'
  yearlyProfit: number;
  capitalInvested: number;
  managerHired: boolean;
}

export interface SideHustle {
  id: string;
  name: string;
  annualIncome: number;
  energyCost: number; // reduces health or happiness slightly
  streetCredBonus: number;
}

export interface Job {
  id: string;
  title: string;
  industry: 'tech' | 'trade' | 'civil_service' | 'entertainment' | 'finance' | 'street' | 'corporate';
  salary: number; // annual Naira
  minEducation: EducationStage;
  minSmarts: number;
  minStreetCred: number;
  isDollarIncome?: boolean; // remote US / offshore contract
  dollarSalary?: number;
}

export interface JapaStatus {
  hasPassport: boolean;
  ieltsScore: number; // 0-9
  targetCountry?: 'uk' | 'canada' | 'usa' | 'germany';
  route?: 'study' | 'tech_work' | 'care_worker' | 'express_entry';
  proofOfFundsNeeded: number; // in Naira
  proofOfFundsSaved: number;
  applicationStage: 'not_started' | 'documents_ready' | 'visa_applied' | 'interview_scheduled' | 'approved' | 'rejected';
  rejectionReason?: string;
  isRelocated: boolean;
}

export interface CharacterState {
  name: string;
  gender: Gender;
  city: CityId;
  background: BackgroundOrigin;
  age: number;
  year: number; // starts e.g. at 2002 or 2026

  // Vitals (0 - 100)
  health: number;
  happiness: number;
  smarts: number;
  streetCred: number;
  sapaLevel: number; // 0 = Balling wealthy, 100 = Supreme Sapa hunger strike

  // Financials
  cashNaira: number;
  cashUSD: number;
  debtNaira: number;
  usdExchangeRate: number; // e.g. 1500 Naira per Dollar, fluctuates!

  // Life Milestones
  education: EducationStage;
  degreeName?: string;
  currentJob: Job | null;
  sideHustle: SideHustle | null;
  maritalStatus: MaritalStatus;
  partner: Partner | null;
  children: Child[];

  // Assets
  generator: GeneratorAsset | null;
  vehicle: VehicleAsset | null;
  home: PropertyAsset;
  businesses: BusinessAsset[];

  // Japa quest
  japa: JapaStatus;

  // Customization
  avatarSkin: string; // color hex or index
  avatarHair: string; // 'afro' | 'braids' | 'fade' | 'dreads' | 'bald' | 'gele'
  avatarOutfit: string; // 'casual' | 'agbada' | 'ankara' | 'corporate' | 'tech_hoodie'
  avatarAccessory: string; // 'none' | 'sunglasses' | 'gold_chain' | 'bead_necklace' | 'cap'

  // Titles & Achievements
  titles: string[]; // e.g. "Otunba of Lekki", "Senior Agba Dev", "Chief Sapa Survivor", "Japa Pioneer"
  achievements: string[];
  isAlive: boolean;
  causeOfDeath?: string;
}

export interface EventOutcome {
  text: string;
  healthChange?: number;
  happinessChange?: number;
  smartsChange?: number;
  streetCredChange?: number;
  sapaChange?: number;
  cashNairaChange?: number;
  cashUSDChange?: number;
  debtNairaChange?: number;
  jobChange?: Job | null;
  addTitle?: string;
  addAchievement?: string;
  japaProgress?: Partial<JapaStatus>;
  customAction?: 'trigger_nepa' | 'trigger_police' | 'fuel_scarcity' | 'asuu_strike';
  deathTrigger?: boolean;
}

export interface EventChoice {
  text: string;
  description?: string;
  requireCondition?: (char: CharacterState) => { allowed: boolean; reason?: string };
  outcome: EventOutcome | ((char: CharacterState) => EventOutcome);
}

export interface LifeEvent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: 'childhood' | 'school' | 'hustle' | 'street' | 'nepa_fuel' | 'family' | 'japa' | 'owambe' | 'economy';
  minAge: number;
  maxAge: number;
  condition?: (char: CharacterState) => boolean;
  choices: EventChoice[];
}

export interface YearLog {
  age: number;
  year: number;
  summary: string;
  events: string[];
  netWorthNaira: number;
  sapaLevel: number;
}

export interface HallOfFameEntry {
  id: string;
  name: string;
  gender: Gender;
  city: string;
  finalAge: number;
  netWorthNaira: number;
  netWorthUSD: number;
  highestCareer: string;
  titles: string[];
  causeOfDeath: string;
  avatarSnapshot: {
    skin: string;
    hair: string;
    outfit: string;
    accessory: string;
  };
  japaAchieved: boolean;
  achievementsCount: number;
  dateRecorded: string;
}

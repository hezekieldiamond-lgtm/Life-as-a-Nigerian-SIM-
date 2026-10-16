import { Job } from '../types/game';

export const AVAILABLE_JOBS: Job[] = [
  // Street & Informal
  {
    id: 'danfo_conductor',
    title: 'Danfo Bus Conductor',
    industry: 'street',
    salary: 720000, // ₦60k / mo
    minEducation: 'none',
    minSmarts: 10,
    minStreetCred: 30,
  },
  {
    id: 'pos_operator',
    title: 'POS Terminal Operator',
    industry: 'trade',
    salary: 960000, // ₦80k / mo
    minEducation: 'primary',
    minSmarts: 25,
    minStreetCred: 20,
  },
  {
    id: 'market_apprentice',
    title: 'Alaba Market Apprentice (Boy-Boy)',
    industry: 'trade',
    salary: 480000, // Low stipend during training, massive settlement future!
    minEducation: 'primary',
    minSmarts: 20,
    minStreetCred: 35,
  },

  // Corporate & Education
  {
    id: 'school_teacher',
    title: 'Secondary School Teacher',
    industry: 'corporate',
    salary: 1440000, // ₦120k / mo
    minEducation: 'waec_passed',
    minSmarts: 45,
    minStreetCred: 15,
  },
  {
    id: 'civil_servant_officer',
    title: 'Civil Service Admin Officer (Level 08)',
    industry: 'civil_service',
    salary: 1800000, // ₦150k / mo + allowances
    minEducation: 'university',
    minSmarts: 40,
    minStreetCred: 20,
  },
  {
    id: 'bank_teller',
    title: 'Commercial Bank Customer Service',
    industry: 'finance',
    salary: 2400000, // ₦200k / mo
    minEducation: 'university',
    minSmarts: 50,
    minStreetCred: 25,
  },

  // Entertainment & Creative
  {
    id: 'nollywood_extra',
    title: 'Nollywood Extra & Skit Actor',
    industry: 'entertainment',
    salary: 1200000,
    minEducation: 'secondary_sss',
    minSmarts: 30,
    minStreetCred: 40,
  },
  {
    id: 'afrobeats_producer',
    title: 'Afrobeats Beatmaker & Sound Engineer',
    industry: 'entertainment',
    salary: 3600000,
    minEducation: 'secondary_sss',
    minSmarts: 55,
    minStreetCred: 50,
  },
  {
    id: 'nollywood_producer',
    title: 'Executive Nollywood Film Director',
    industry: 'entertainment',
    salary: 18000000,
    minEducation: 'university',
    minSmarts: 70,
    minStreetCred: 75,
  },

  // Tech & High-Hustle
  {
    id: 'junior_dev',
    title: 'Junior Web Developer (Yaba Tech Hub)',
    industry: 'tech',
    salary: 3000000, // ₦250k / mo
    minEducation: 'waec_passed',
    minSmarts: 55,
    minStreetCred: 25,
  },
  {
    id: 'senior_remote_dev',
    title: 'Senior Fullstack Engineer (Remote US Contract)',
    industry: 'tech',
    salary: 75000000, // Equivalent in Naira
    isDollarIncome: true,
    dollarSalary: 50000, // $50,000 USD / year!
    minEducation: 'waec_passed',
    minSmarts: 80,
    minStreetCred: 45,
  },

  // Oil & Commerce
  {
    id: 'oil_engineer',
    title: 'Offshore Petroleum Drilling Specialist',
    industry: 'finance',
    salary: 32000000, // ₦2.6M / mo
    minEducation: 'university',
    minSmarts: 75,
    minStreetCred: 40,
  },
  {
    id: 'major_importer',
    title: 'Alaba Container Importer & Wholesaler',
    industry: 'trade',
    salary: 28000000,
    minEducation: 'apprentice_graduate',
    minSmarts: 65,
    minStreetCred: 85,
  },
  {
    id: 'distinguished_senator',
    title: 'Distinguished Federal Lawmaker',
    industry: 'civil_service',
    salary: 60000000, // ₦5M / mo + constituency project allowances
    minEducation: 'university',
    minSmarts: 60,
    minStreetCred: 90,
  },
];

export const SIDE_HUSTLES = [
  {
    id: 'crypto_p2p',
    name: 'Binance P2P Crypto Arbitrage',
    annualIncome: 1800000,
    energyCost: 6,
    streetCredBonus: 10,
    minSmarts: 40,
  },
  {
    id: 'thrift_okrika',
    name: 'Instagram Thrift & Yaba Vintage Clothes',
    annualIncome: 1200000,
    energyCost: 8,
    streetCredBonus: 15,
    minSmarts: 25,
  },
  {
    id: 'event_mc',
    name: 'Weekend Owambe MC & Hype Man',
    annualIncome: 2400000,
    energyCost: 10,
    streetCredBonus: 25,
    minSmarts: 30,
  },
  {
    id: 'shawarma_grill',
    name: 'Evening Street Shawarma & Suya Stand',
    annualIncome: 3000000,
    energyCost: 12,
    streetCredBonus: 20,
    minSmarts: 25,
  },
];

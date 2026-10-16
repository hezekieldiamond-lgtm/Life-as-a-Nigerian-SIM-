export interface CatalogGenerator {
  id: string;
  name: string;
  buyPrice: number;
  fuelCostPerYear: number;
  maintenanceRisk: number;
  description: string;
}

export interface CatalogVehicle {
  id: string;
  name: string;
  buyPrice: number;
  maintenanceCostPerYear: number;
  streetCredBonus: number;
  trafficEscapeFactor: number;
  description: string;
}

export interface CatalogHousing {
  id: string;
  name: string;
  isRental: boolean;
  cost: number; // yearly rent or outright buy price
  comfortBonus: number;
  description: string;
}

export interface CatalogBusiness {
  id: string;
  name: string;
  startupCapital: number;
  baseYearlyProfit: number;
  description: string;
}

export const GENERATORS: CatalogGenerator[] = [
  {
    id: 'tiger_1kva',
    name: "Tiger 1kVA ('I pass my neighbor')",
    buyPrice: 95000,
    fuelCostPerYear: 240000,
    maintenanceRisk: 0.35,
    description: 'The national anthem of small generators. Powers 2 bulbs, fan, and phone charger. Watch out for dirty spark plugs!',
  },
  {
    id: 'firman_35kva',
    name: 'Firman 3.5kVA Key-Starter',
    buyPrice: 380000,
    fuelCostPerYear: 650000,
    maintenanceRisk: 0.18,
    description: 'Pumps water, powers freezer and television. Solid mid-class survival machine.',
  },
  {
    id: 'diesel_15kva',
    name: 'Mikano 15kVA Soundproof Diesel',
    buyPrice: 4800000,
    fuelCostPerYear: 2200000,
    maintenanceRisk: 0.08,
    description: 'Big boy estate equipment. Can power 3 air conditioners simultaneously. Pure peace of mind.',
  },
  {
    id: 'solar_inverter_5kva',
    name: '5kVA Solar Inverter + Lithium Battery',
    buyPrice: 5600000,
    fuelCostPerYear: 40000,
    maintenanceRisk: 0.02,
    description: 'Zero noise, zero fuel queues at filling stations. True energetic independence from the national grid.',
  },
];

export const VEHICLES: CatalogVehicle[] = [
  {
    id: 'bajaj_okada',
    name: 'Bajaj Boxer Motorcycle (Okada)',
    buyPrice: 450000,
    maintenanceCostPerYear: 90000,
    streetCredBonus: 5,
    trafficEscapeFactor: 0.9,
    description: 'Weaves between stationary trailers on Oshodi-Apapa expressway. Always wear a helmet!',
  },
  {
    id: 'danfo_bus',
    name: 'Yellow Commercial Bus (Danfo)',
    buyPrice: 3200000,
    maintenanceCostPerYear: 450000,
    streetCredBonus: 20,
    trafficEscapeFactor: 0.3,
    description: 'Legendary yellow bus with dual black stripes. Yields street respect, but watch out for union agberos.',
  },
  {
    id: 'corolla_pencil',
    name: "Toyota Corolla 'Pencil Light' (2005)",
    buyPrice: 3800000,
    maintenanceCostPerYear: 200000,
    streetCredBonus: 15,
    trafficEscapeFactor: 0.5,
    description: 'Every mechanic from Ikeja to Nyanya can fix this blindfolded. Ladipo market parts are virtually free.',
  },
  {
    id: 'benz_c300',
    name: 'Mercedes-Benz C300 (4Matic Red Leather)',
    buyPrice: 15500000,
    maintenanceCostPerYear: 1200000,
    streetCredBonus: 40,
    trafficEscapeFactor: 0.5,
    description: 'The unofficial car of Lekki tech bros and young hustlers. High chance of police stop & search diplomacy.',
  },
  {
    id: 'range_rover',
    name: 'Range Rover Autobiography (V8)',
    buyPrice: 52000000,
    maintenanceCostPerYear: 3500000,
    streetCredBonus: 65,
    trafficEscapeFactor: 0.6,
    description: 'Escorted by sirens through traffic. Club bouncers clear the VIP gate before you even step on the brake.',
  },
];

export const HOUSING_OPTIONS: CatalogHousing[] = [
  {
    id: 'face_me_face_you',
    name: 'Face-Me-I-Face-You Room (Mushin)',
    isRental: true,
    cost: 180000,
    comfortBonus: 5,
    description: 'Shared queue for single toilet at 6am. Neighbors arguing loudly over who burnt the morning beans.',
  },
  {
    id: 'self_contain',
    name: '1-Room Self-Contain (Yaba / Fadeyi)',
    isRental: true,
    cost: 650000,
    comfortBonus: 20,
    description: 'Your own private bathroom and mini-kitchen. Perfect sanctuary for studying or coding remote gigs.',
  },
  {
    id: 'three_bedroom_rental',
    name: '3-Bedroom Apartment (Surulere / Gwarinpa)',
    isRental: true,
    cost: 2400000,
    comfortBonus: 40,
    description: 'Spacious flat, running borehole water, gated security compound with adequate parking.',
  },
  {
    id: 'lekki_duplex_buy',
    name: '4-Bedroom Duplex in Lekki Phase 1',
    isRental: false,
    cost: 115000000,
    comfortBonus: 75,
    description: 'Interlocked paved compound, 24/7 private estate security, close to Admiralty Way lounges.',
  },
  {
    id: 'banana_island_villa',
    name: 'Waterfront Villa on Banana Island',
    isRental: false,
    cost: 550000000,
    comfortBonus: 95,
    description: 'Helipad access, private boat jetty, neighborhood with billionaires, oil magnates, and ambassadors.',
  },
];

export const BUSINESS_OPTIONS: CatalogBusiness[] = [
  {
    id: 'pos_kiosk',
    name: 'Busy Corner POS Withdrawal Kiosk',
    startupCapital: 450000,
    baseYearlyProfit: 750000,
    description: 'Cash-in, cash-out. High transaction volumes especially during bank app downtime.',
  },
  {
    id: 'salon_barber',
    name: 'Barbershop & Premium Hair Salon',
    startupCapital: 1900000,
    baseYearlyProfit: 1800000,
    description: 'Play Premier League matches on TV and serve chilled soft drinks to customers while waiting.',
  },
  {
    id: 'shawarma_spot',
    name: 'Hot Spot Shawarma & Grilled Catfish',
    startupCapital: 3600000,
    baseYearlyProfit: 3400000,
    description: 'Irresistible smoky aroma by the roadside from 6pm till midnight. High margins!',
  },
  {
    id: 'logistics_fleet',
    name: 'Express Dispatch Courier Fleet (4 Bikes)',
    startupCapital: 5500000,
    baseYearlyProfit: 4600000,
    description: 'Deliver e-commerce parcels, food orders, and documents across the city in record time.',
  },
];

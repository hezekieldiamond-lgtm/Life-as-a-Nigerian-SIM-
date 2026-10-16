import { LifeEvent } from '../types/game';

export const LIFE_EVENTS: LifeEvent[] = [
  // ================= CHILDHOOD (0 - 11) =================
  {
    id: 'child_nepa_cartoon',
    title: 'Up NEPA!',
    subtitle: 'Saturday Morning Cartoons Disrupted',
    description: 'You were watching your favorite cartoon when the television suddenly snapped black and the ceiling fan ground to a halt. The national power grid strikes again!',
    category: 'childhood',
    minAge: 4,
    maxAge: 11,
    choices: [
      {
        text: 'Run outside and scream "UP NEPA!" with neighborhood kids',
        outcome: {
          text: 'The entire street echoes with laughter. Your street cred rises, but the light is not coming back soon.',
          happinessChange: 10,
          streetCredChange: 8,
          healthChange: 2,
        },
      },
      {
        text: 'Pick up your primary school textbook and study by candle',
        outcome: {
          text: 'Your mother notices your discipline and nods in approval: "You will not suffer like us." You gain smarts!',
          smartsChange: 12,
          happinessChange: -4,
        },
      },
      {
        text: 'Help dad pull the starter rope of the "I better pass my neighbor" generator',
        outcome: {
          text: 'The two-stroke engine sputters to life with thick white smoke. The cartoon resumes, and you learn basic mechanics!',
          smartsChange: 6,
          happinessChange: 12,
          streetCredChange: 5,
        },
      },
    ],
  },
  {
    id: 'child_pepper_grind',
    title: 'Sunday Jollof Duty',
    subtitle: 'Kitchen Hazards',
    description: 'Mom hands you a basin of scotch bonnet peppers (ata rodo) and fresh tomatoes to grind for Sunday rice. As you wash them, you accidentally rub your eyes with peppery fingers!',
    category: 'childhood',
    minAge: 6,
    maxAge: 12,
    choices: [
      {
        text: 'Scream and wash eyes with tap water',
        outcome: {
          text: 'Water makes the burning twice as fierce! Mom pours milk in your eyes while shouting "Pele! Don’t touch anything!"',
          healthChange: -5,
          happinessChange: -10,
          smartsChange: 5,
        },
      },
      {
        text: 'Bravely endure it like a grown child',
        outcome: {
          text: 'Tears roll down your cheeks silently. Mom notices and rewards you with the giant chicken gizzard during lunch!',
          happinessChange: 15,
          streetCredChange: 5,
          healthChange: 5,
        },
      },
    ],
  },
  {
    id: 'child_water_trek',
    title: 'The Yellow Gallon Expedition',
    subtitle: 'Neighborhood Borehole Quest',
    description: 'The street borehole tap has run dry. You are given two bright yellow 25-litre jerrycans to walk 4 streets down to Mama Nkechi’s compound to fetch clean water.',
    category: 'childhood',
    minAge: 8,
    maxAge: 13,
    choices: [
      {
        text: 'Balance one gallon on your head and carry one by hand',
        outcome: {
          text: 'Impressive core strength! Neighbors cheer your posture. Your physical stamina increases.',
          healthChange: 12,
          streetCredChange: 10,
          happinessChange: 2,
        },
      },
      {
        text: 'Make friends in the borehole queue and play rubber-band games',
        outcome: {
          text: 'You win 15 rubber bands and meet your best neighborhood friend. Mom scolds you for taking 2 hours, but it was worth it.',
          happinessChange: 14,
          streetCredChange: 12,
        },
      },
    ],
  },
  {
    id: 'child_common_entrance',
    title: 'National Common Entrance Exam',
    subtitle: 'Primary 6 High Stakes',
    description: 'Your father sits you down with a cane on the table: "Who came first in your mock exam? Does that boy have two heads?" The entrance exam into Federal Unity Secondary School is tomorrow.',
    category: 'school',
    minAge: 10,
    maxAge: 12,
    choices: [
      {
        text: 'Cram Quantitative and Verbal Aptitude past questions till 2am',
        outcome: {
          text: 'You score in the top 5th percentile! Father buys you new Bata school shoes and a stainless steel water flask.',
          smartsChange: 18,
          happinessChange: 15,
          healthChange: -4,
          addAchievement: 'Common Entrance Whizkid',
        },
      },
      {
        text: 'Rely on divine favor and prayer from your Sunday School teacher',
        outcome: {
          text: 'You pass with a modest average. Father sighs: "Manageable, but you will not waste my school fees."',
          smartsChange: 6,
          happinessChange: 2,
        },
      },
    ],
  },

  // ================= TEEN & SECONDARY SCHOOL (12 - 17) =================
  {
    id: 'teen_boarding_senior',
    title: 'Boarding House Night Inspection',
    subtitle: 'Senior Prefect Command',
    description: 'It is 10:15pm in the hostel. Senior Segun bursts into the junior dormitory with a leather belt: "Who hid my charcoal iron? Junior boy, kneel on the bare gravel!"',
    category: 'school',
    minAge: 12,
    maxAge: 16,
    choices: [
      {
        text: 'Fast-talk your way out with diplomatic respect ("Senior, let me wash your plates tomorrow")',
        outcome: {
          text: 'Senior Segun smirks: "You have sense." You escape punishment and earn a reputation as a hostel diplomat.',
          streetCredChange: 15,
          smartsChange: 8,
          happinessChange: 5,
        },
      },
      {
        text: 'Endure the frog jump punishment quietly without crying',
        outcome: {
          text: 'Your thigh muscles burn for three days, but your fellow junior boys view you as a resilient legend.',
          healthChange: 6,
          streetCredChange: 18,
          happinessChange: -6,
        },
      },
      {
        text: 'Report Senior Segun to the Housemaster the next morning',
        outcome: {
          text: 'The Housemaster gives a warning to the senior, but the seniors mark you as a whistle-blower. You need to watch your back.',
          streetCredChange: -12,
          smartsChange: 5,
          happinessChange: -8,
        },
      },
    ],
  },
  {
    id: 'teen_waec_choice',
    title: 'The WAEC Examination',
    subtitle: 'West African Examinations Council Trial',
    description: 'The chemistry and mathematics papers are in 3 days. Rumors spread that the school principal has arranged a "Special Cooperation Center" for students willing to contribute ₦15,000.',
    category: 'school',
    minAge: 15,
    maxAge: 17,
    choices: [
      {
        text: 'Reject malpractice: Burn midnight oil studying Ugo C. Ugo past papers',
        outcome: {
          text: 'You earn 5 Distinctions (A1 in Maths and English) completely on merit! Your academic pride is unshakable.',
          smartsChange: 25,
          happinessChange: 20,
          streetCredChange: 5,
          addAchievement: 'WAEC Scholar',
        },
      },
      {
        text: 'Pay for "expo" and miracle center assistance',
        outcome: {
          text: 'The results are released, but the exam board flags your center for "withheld results"! The anxiety takes years off your life.',
          smartsChange: -5,
          happinessChange: -20,
          streetCredChange: -10,
          cashNairaChange: -15000,
        },
      },
    ],
  },
  {
    id: 'teen_jamb_meltdown',
    title: 'JAMB CBT Exam Day',
    subtitle: 'Joint Admissions and Matriculation Board',
    description: 'You arrive at the Computer-Based Test center at 6:30am. The biometrics scanner rejects your right thumb twice, and while typing question 42, the computer monitor flickers off!',
    category: 'school',
    minAge: 16,
    maxAge: 19,
    choices: [
      {
        text: 'Stay calm, call the technical supervisor, and resume without panicking',
        outcome: {
          text: 'The system reboots with 12 minutes saved. You finish strong and score 285 on 400! University doors swing wide open.',
          smartsChange: 20,
          happinessChange: 22,
          streetCredChange: 8,
          addAchievement: 'JAMB High Flyer',
        },
      },
      {
        text: 'Sweat profusely and start arguing loudly with the center invigilator',
        outcome: {
          text: 'You lose 15 minutes of precious test time. You scrape together a 192 score — enough for polytechnic, but borderline for federal uni.',
          smartsChange: 5,
          happinessChange: -12,
          healthChange: -5,
        },
      },
    ],
  },

  // ================= YOUNG ADULT & HIGHER EDUCATION (18 - 24) =================
  {
    id: 'adult_asuu_strike',
    title: 'ASUU Declares 8-Month Strike!',
    subtitle: 'University Shutdown Chaos',
    description: 'The Academic Staff Union of Universities (ASUU) has officially embarked on an indefinite national strike over unpaid allowances and campus funding. University gates are locked!',
    category: 'school',
    minAge: 18,
    maxAge: 23,
    choices: [
      {
        text: 'Use the 8 months to learn frontend coding and design on YouTube',
        outcome: {
          text: 'You master HTML, CSS, JavaScript, and React while sitting in your bedroom! A new tech career opens up.',
          smartsChange: 24,
          streetCredChange: 15,
          happinessChange: 14,
          addTitle: 'Self-Taught Tech Prodigy',
        },
      },
      {
        text: 'Apprentice at Computer Village / Alaba electronics market',
        outcome: {
          text: 'You learn phone repairs, UK-used laptop swapping, and sharp negotiation. You pocket ₦450,000 in personal profit!',
          streetCredChange: 25,
          cashNairaChange: 450000,
          smartsChange: 12,
          sapaChange: -20,
        },
      },
      {
        text: 'Sleep, play video games, and binge Nigerian movies while waiting',
        outcome: {
          text: 'Eight months vanish into thin air. Your parents look at you with intense disappointment every breakfast.',
          happinessChange: -15,
          smartsChange: -8,
          streetCredChange: -5,
        },
      },
    ],
  },
  {
    id: 'adult_nysc_posting',
    title: 'National Youth Service Corps (NYSC)',
    subtitle: 'The Green Card & Khaki Calling',
    description: 'The NYSC portal has opened. You enter your call-up number with trembling hands. You have been posted to a rural community secondary school in Kaura Namoda!',
    category: 'school',
    minAge: 21,
    maxAge: 25,
    choices: [
      {
        text: 'Embrace the adventure: Pack white shorts and jungle boots and go to camp',
        outcome: {
          text: 'Camp drills at 5am are brutal, but the evening Mammy Market suya and friendships are unforgettable. You serve the nation with honor!',
          healthChange: 10,
          streetCredChange: 20,
          happinessChange: 15,
          cashNairaChange: 396000, // 1 year allawee
          addAchievement: 'Ex-Corper Extraordinaire',
        },
      },
      {
        text: 'Pay a contact ₦120,000 to "work" your redeployment back to Lagos / Abuja',
        outcome: {
          text: 'Your redeployment letter comes through based on "marital/medical grounds". You serve comfortably in a corporate bank office.',
          cashNairaChange: -120000,
          streetCredChange: 10,
          happinessChange: 12,
          smartsChange: 10,
        },
      },
    ],
  },

  // ================= DAILY NAIJA REALITIES & SURVIVAL (20 - 70) =================
  {
    id: 'nepa_blackout_interview',
    title: 'Remote Job Interview vs NEPA',
    subtitle: 'Crisis at 3:55 PM',
    description: 'You have a high-stakes final interview with a US tech client scheduled for 4:00 PM. At 3:55 PM, the grid collapses and the room plunges into pitch darkness!',
    category: 'nepa_fuel',
    minAge: 20,
    maxAge: 55,
    choices: [
      {
        text: 'Dash outside, yank the generator starter rope, and switch the changeover box',
        outcome: {
          text: 'The generator roars! You rejoin Zoom with 30 seconds to spare. The interviewer compliments your dedication and offers you the role!',
          happinessChange: 25,
          streetCredChange: 15,
          cashNairaChange: 1200000,
          sapaChange: -30,
          addAchievement: 'Generator Whisperer',
        },
      },
      {
        text: 'Hotspot your phone, step into the car with the AC blowing, and take the call',
        outcome: {
          text: 'The interviewer hears faint Lagos horns in the background, but loves your crisp presentation. You land the freelance contract!',
          smartsChange: 15,
          happinessChange: 18,
          cashNairaChange: 750000,
        },
      },
      {
        text: 'Send an apology email: "Power grid failure in my area"',
        outcome: {
          text: 'The foreign HR manager replies with condolences, but gives the job to someone in Poland. Sapa knocks aggressively on your door.',
          happinessChange: -25,
          sapaChange: 25,
        },
      },
    ],
  },
  {
    id: 'police_checkpoint_diplomacy',
    title: 'Checkpoint at Victoria Island / Third Mainland',
    subtitle: 'Stop and Search Encounter',
    description: 'You are driving home past 9:00 PM. Officers with neon yellow reflective vests flag your vehicle down with batons: "Park well! Off the engine! Wetin dey inside that backpack?"',
    category: 'street',
    minAge: 20,
    maxAge: 65,
    choices: [
      {
        text: 'Turn on the cabin light, greet them with warmth: "Good evening officers, well done sir"',
        outcome: {
          text: 'Your calm respect disarms the officer. He smiles: "Ah, senior man! Weekend is coming, anything for the boys?" You slip ₦2,000 for pure water and drive off peacefully.',
          cashNairaChange: -2000,
          streetCredChange: 15,
          happinessChange: 5,
        },
      },
      {
        text: 'Argue constitutional rights and demand their service identification numbers',
        outcome: {
          text: 'The mood turns freezing cold. You are ordered to step out, empty every pocket, and sit on a plastic stool for 2 grueling hours while they verify your vehicle license.',
          happinessChange: -20,
          healthChange: -5,
          streetCredChange: -5,
        },
      },
      {
        text: 'Show your company staff ID card and explain you are coming from late shift',
        outcome: {
          text: 'The officer inspects your ID, nods with respect: "Oga carry on, drive safe." Zero cost, zero hassle.',
          streetCredChange: 12,
          happinessChange: 10,
        },
      },
    ],
  },
  {
    id: 'fuel_scarcity_queue',
    title: 'Mega Station Fuel Scarcity',
    subtitle: 'The 4-Hour Queue',
    description: 'Petrol has become scarce overnight. The queue at the NNPC station stretches for 3 kilometers into the highway. Roadside black-market boys are selling 10 litres in yellow kegs for triple the price.',
    category: 'nepa_fuel',
    minAge: 21,
    maxAge: 70,
    choices: [
      {
        text: 'Buy black market petrol right now and save your time',
        outcome: {
          text: 'The fuel gets you moving immediately, but your car engine coughs twice — it seems they mixed the fuel with a little kerosene. Costly convenience!',
          cashNairaChange: -25000,
          happinessChange: 5,
          healthChange: -2,
        },
      },
      {
        text: 'Queue patiently for 4 hours listening to Nigerian radio gossip and podcasts',
        outcome: {
          text: 'You finally reach the pump and fill your tank at official government price! You saved ₦40,000 and caught up on all the political news.',
          cashNairaChange: -22000,
          happinessChange: 8,
          smartsChange: 6,
        },
      },
      {
        text: 'Leave the car parked, take an Okada motorcycle, and cut through the traffic',
        outcome: {
          text: 'The motorcycle driver weaves past 400 stalled cars in 15 minutes flat. The adrenaline rush is unmatched!',
          cashNairaChange: -1500,
          streetCredChange: 14,
          happinessChange: 12,
        },
      },
    ],
  },
  {
    id: 'owambe_spraying_culture',
    title: 'Grand Owambe Wedding in Surulere',
    subtitle: 'King Sunny Ade on Stage',
    description: 'You are at your cousin’s wedding. The live Fuji band spots you, mentions your mother’s praise name (oriki), and starts chanting: "Chief! The Chairman! Gbogbo Big Boys!" Everyone looks at you.',
    category: 'owambe',
    minAge: 22,
    maxAge: 75,
    choices: [
      {
        text: 'Bring out a crisp bundle of mint ₦500 notes and spray the couple rhythmically',
        outcome: {
          text: 'The crowd goes wild! Relatives take pictures and shower you with royal blessings. Your social standing sky-rockets across the extended family!',
          cashNairaChange: -100000,
          streetCredChange: 35,
          happinessChange: 25,
          addTitle: 'Owambe Baller',
        },
      },
      {
        text: 'Dance with high energy, paste two symbolic notes on the groom’s forehead, and step back',
        outcome: {
          text: 'Classy, fun, and budget-friendly. You get two plates of small chops and a giant souvenir flask.',
          cashNairaChange: -10000,
          streetCredChange: 10,
          happinessChange: 15,
        },
      },
      {
        text: 'Pretend to answer an urgent phone call and retreat to the souvenir tent',
        outcome: {
          text: 'You saved your cash, but your aunties gossip behind your back that "Sapa is touching that boy."',
          streetCredChange: -15,
          happinessChange: -5,
          sapaChange: 5,
        },
      },
    ],
  },
  {
    id: 'family_whatsapp_ponzi',
    title: 'Uncle Chidi’s "Guaranteed" Scheme',
    subtitle: 'Family WhatsApp Broadcast',
    description: 'Uncle Chidi sends a broadcast to the Family WhatsApp group: "Praise the Lord family! A new crypto-agriculture platform called AgroWealth Yield is paying 45% return every 14 days. Put ₦500k to get ₦725k!"',
    category: 'family',
    minAge: 22,
    maxAge: 65,
    choices: [
      {
        text: 'Politely warn the family that this is a classic Ponzi pyramid scheme',
        outcome: {
          text: 'Uncle Chidi calls you "a negative child of little faith," but two cousins heed your advice. Three weeks later, the website disappears with everyone’s money! You are vindicated.',
          smartsChange: 20,
          streetCredChange: 15,
          happinessChange: 10,
        },
      },
      {
        text: 'Get tempted by the returns and invest ₦250,000',
        outcome: {
          text: 'The platform pays the first week to build trust, then freezes all withdrawals. Your ₦250k is gone forever. Sapa laughs at you.',
          cashNairaChange: -250000,
          happinessChange: -25,
          sapaChange: 30,
        },
      },
    ],
  },
  {
    id: 'sapa_emergency_garri',
    title: 'The Sapa Supreme Trial',
    subtitle: 'Five Days to Payday',
    description: 'You check your bank account balance: ₦1,420. There are five days left before your salary arrives. Your stomach begins to make acoustic rumbles.',
    category: 'hustle',
    minAge: 20,
    maxAge: 60,
    choices: [
      {
        text: 'Deploy the sacred formula: Ice water, Ijebu Garri, roasted groundnuts, and milk',
        outcome: {
          text: 'The garri swells to three times its volume. You are satisfied, resilient, and unbreakable. True Naija spirit!',
          healthChange: 2,
          happinessChange: 8,
          streetCredChange: 12,
          sapaChange: -5,
          addAchievement: 'Garri Connoisseur',
        },
      },
      {
        text: 'Download a quick loan app and borrow ₦25,000',
        outcome: {
          text: 'You buy good food, but on day four, the loan app sends abusive WhatsApp messages to all your phone contacts calling you a chronic debtor! Maximum shame.',
          happinessChange: -30,
          streetCredChange: -25,
          debtNairaChange: 35000,
          cashNairaChange: 25000,
        },
      },
      {
        text: 'Call a wealthy friend and pitch a quick freelance graphic / writing gig',
        outcome: {
          text: 'Your friend needs a flyer for his sister’s cake business and sends you ₦30,000 advance on the spot. Pure hustle triumph!',
          cashNairaChange: 30000,
          smartsChange: 12,
          happinessChange: 18,
          sapaChange: -15,
        },
      },
    ],
  },

  // ================= JAPA ODYSSEY (22 - 50) =================
  {
    id: 'japa_ielts_exam',
    title: 'The IELTS English Exam',
    subtitle: 'Gate 1 to Relocation',
    description: 'You have paid ₦220,000 for the British Council IELTS exam. You are sitting in the exam hall with headphones for the Listening and Speaking tests. The examiner asks: "Describe a public park in your hometown."',
    category: 'japa',
    minAge: 22,
    maxAge: 45,
    choices: [
      {
        text: 'Deliver a fluent, articulate answer with Queen’s English grammar',
        outcome: {
          text: 'The examiner nods warmly. Two weeks later, the SMS arrives: Overall Band 8.5! Canadian and UK immigration doors swing open!',
          smartsChange: 15,
          happinessChange: 25,
          japaProgress: { ieltsScore: 8.5, applicationStage: 'documents_ready' },
          addAchievement: 'IELTS Band 8+ Master',
        },
      },
      {
        text: 'Mix in pidgin expressions ("You see, the place sweet well well")',
        outcome: {
          text: 'The examiner chuckles but marks you down on formal lexical variety. You score Band 6.0 — barely acceptable for some visas.',
          smartsChange: 5,
          happinessChange: -5,
          japaProgress: { ieltsScore: 6.0 },
        },
      },
    ],
  },
  {
    id: 'japa_proof_of_funds',
    title: 'Proof of Funds (POF) Drama',
    subtitle: 'The ₦20 Million Question',
    description: 'The embassy requires a stamped bank statement showing ₦20,000,000 held untouched for 28 consecutive days to prove you will not become a public burden abroad.',
    category: 'japa',
    minAge: 23,
    maxAge: 45,
    choices: [
      {
        text: 'Borrow the funds from family and trusted mentors to hold in account',
        outcome: {
          text: 'After endless phone calls and family guarantees, the funds sit intact for 28 days! The bank statement is officially stamped and sealed.',
          happinessChange: 20,
          streetCredChange: 10,
          japaProgress: { proofOfFundsSaved: 20000000, applicationStage: 'visa_applied' },
        },
      },
      {
        text: 'Use an online "statement agent" to forge a bank statement',
        outcome: {
          text: 'DISASTER! The consular officer calls the bank headquarters directly. The visa is denied with a 10-YEAR BAN from entering the country!',
          happinessChange: -40,
          streetCredChange: -20,
          japaProgress: { applicationStage: 'rejected', rejectionReason: 'Document discrepancy / fraud flag' },
          addTitle: 'Blacklisted by the Embassy',
        },
      },
    ],
  },
  {
    id: 'japa_embassy_interview',
    title: 'The Walter Carrington Interview',
    subtitle: 'Moment of Truth at the Consulate',
    description: 'You are standing in line on Victoria Island at 6:30 AM. After passing 3 security scanners, you face the visa officer through the bulletproof glass window: "Why should we grant you this visa?"',
    category: 'japa',
    minAge: 23,
    maxAge: 50,
    condition: (char) => char.japa.applicationStage === 'visa_applied' || char.japa.applicationStage === 'interview_scheduled',
    choices: [
      {
        text: 'Speak with calm confidence, show your verified admission and job prospects',
        outcome: {
          text: 'The officer picks up the green stamp: "Your visa has been approved. Welcome!" Tears of joy well up in your eyes. JAPA HAS LANDED!',
          happinessChange: 50,
          streetCredChange: 30,
          sapaChange: -50,
          japaProgress: { applicationStage: 'approved', isRelocated: true },
          addTitle: 'International Japa Expatriate',
          addAchievement: 'Japa Dream Achieved',
        },
      },
      {
        text: 'Start stammering and over-explaining how bad the Nigerian power grid is',
        outcome: {
          text: 'The officer frowns and slides a blue 214(b) rejection paper under the glass: "Unfortunately, you have not demonstrated sufficient ties." Heartbreak!',
          happinessChange: -35,
          japaProgress: { applicationStage: 'rejected', rejectionReason: 'Failure to demonstrate ties' },
        },
      },
    ],
  },

  // ================= WEALTH & CHIEFTAINCY (35 - 80) =================
  {
    id: 'chieftaincy_title_offer',
    title: 'Offer of Chieftaincy Title',
    subtitle: 'Royal Palace Invitation',
    description: 'The King (Kabiyesi / Igwe / Emir) of your ancestral hometown has sent a royal delegation with a letter: "In recognition of your community investments and philanthropy, the palace wishes to confer on you the title of Otunba Bobagunwa!"',
    category: 'owambe',
    minAge: 35,
    maxAge: 85,
    choices: [
      {
        text: 'Accept with humility: Donate ₦5,000,000 for the community hospital generator',
        outcome: {
          text: 'During the coronation, you are robed in royal beads, gold embroidery, and handed a traditional horsetail flywhisk. You are now officially High Chief!',
          cashNairaChange: -5000000,
          streetCredChange: 50,
          happinessChange: 35,
          addTitle: 'High Chief Otunba',
          addAchievement: 'Titled Aristocrat',
        },
      },
      {
        text: 'Decline politely: "I prefer to serve our people in quiet anonymity"',
        outcome: {
          text: 'The elders respect your modesty. Your reputation as a sincere leader grows throughout the state.',
          smartsChange: 15,
          streetCredChange: 20,
          happinessChange: 15,
        },
      },
    ],
  },
  {
    id: 'lekki_real_estate_flip',
    title: 'Ibeju-Lekki Land Speculation',
    subtitle: 'The Dangote Refinery Corridor',
    description: 'A surveyor friend brings a deal for two dry plots of land along the coastal road in Ibeju-Lekki for ₦12,000,000. He whispers: "The airport and new seaport are coming this way. In 4 years, this will be worth ₦80M!"',
    category: 'hustle',
    minAge: 28,
    maxAge: 70,
    choices: [
      {
        text: 'Conduct due diligence at Alausa Land Registry and buy the plots',
        outcome: {
          text: 'The Governor’s Consent is verified! Three years later, a multinational logistics hub buys the land from you for ₦65,000,000! Pure generational wealth.',
          cashNairaChange: 53000000,
          smartsChange: 25,
          happinessChange: 40,
          sapaChange: -50,
          addTitle: 'Real Estate Mogul',
          addAchievement: 'Alausa Land Master',
        },
      },
      {
        text: 'Pass on the deal and keep your money safe in fixed deposit',
        outcome: {
          text: 'You earn steady 12% interest, avoiding any risk of "Omo Onile" family land dispute.',
          cashNairaChange: 1400000,
          happinessChange: 5,
        },
      },
    ],
  },
];

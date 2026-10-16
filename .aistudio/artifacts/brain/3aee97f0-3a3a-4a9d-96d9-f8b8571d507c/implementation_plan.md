# Naija Life SIM: The Grand Elevation

An expansive gameplay and immersion update introducing three interactive Nigerian mini-games, a multi-station procedural Afrobeats Web Audio radio player, and downloadable viral press clippings, certificates, and burial posters.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The elevation features directly fulfill the confirmed preferences from Phase 1:
> - **Playable Mini-Games**: Danfo Expressway Traffic Dodger, "I Better Pass My Neighbor" Generator Repair/Pull minigame, and Owambe Fuji Spraying Rhythm Party.
> - **Naija Radio FM**: Procedural Web Audio Afrobeats radio with 3 distinct channels (Lagos Hustle Amapiano, Fuji & Juju Groove, Sunday Highlife) with station switching and volume control.
> - **Media & Keepsake Archive**: Exportable/downloadable graphic front-page newspaper headlines ("The Daily Times"), authentic University/Alaba certificates, and burial posters.

- **Confirmed Decision 1**: Mini-games are integrated into both annual random events and can be played on-demand via a dedicated **"Arcade & Gigs"** drawer to earn extra cash and street cred.
- **Confirmed Decision 2**: Procedural audio uses Web Audio API oscillators and noise buffers for zero external network latency and zero broken audio stream risks.
- **Confirmed Decision 3**: Graphic keepsakes render crisp visual DOM nodes that can be saved directly as image/PDF or shared.

---

## 1. Overview & Core Concept

### What It Does
Transforms **Naija Life SIM** from a text-and-stat simulator into a fully playable audiovisual playground. Players don't just read about Lagos traffic or generator breakdowns—they actively maneuver a Danfo through highway potholes, time their pull-cord to kickstart an engine during blackouts, paste mint notes on dancing couples at an Owambe party to Fuji beats, listen to authentic live Afrobeats radio, and export front-page newspaper articles documenting their triumphs and scandals.

---

## 2. User Experience & Visual Design

### 1. Interactive Mini-Games Arcade
- **Danfo Expressway Dodger**:
  - High-speed 3-lane highway game across Third Mainland Bridge.
  - Player controls a yellow Danfo bus or Okada using arrow keys or tap buttons (`[Left]` / `[Right]`).
  - Dodge potholes, stationary trucks, and LASTMA traffic officers while collecting ₦1,000 cash bundles and passenger fare.
  - Reaching the toll gate yields cash bonuses and street cred; crashing triggers vehicle repairs or traffic bribes.
- **Generator Starter & Spark Plug Mechanic**:
  - Interactive timing bar: Click/tap to pull the starter cord when the oscillation needle enters the green compression zone.
  - If spark plug is flooded, use an interactive wire-brush scraper to scrub the carbon deposit clean.
  - Restores power immediately, saving food in freezer and granting happiness.
- **Owambe Fuji Spraying Rhythm Party**:
  - Dancing couples, Aunties in purple Gele, and Fuji drummers move across the stage.
  - The live singer shouts your praises: *"Otunba! Spend the money!"*
  - Tap the spray trigger on beat to paste mint crisp notes. High rhythm accuracy maximizes family respect and titles without draining your entire bank account.

### 2. Naija FM 99.9 Procedural Radio Station
- Docked audio player in the top HUD or floating corner with a retro Lagos radio look.
- Three procedural channels generated via Web Audio API:
  - **Station 1: Lagos Hustle FM** (BPM 118 Amapiano log drum bass, shaker rhythms, upbeat chord progressions).
  - **Station 2: Fuji Groove 105.5** (Talking drum polyrhythms, bell percussion, pentatonic leads).
  - **Station 3: Sunday Highlife & Afro-Jazz** (Chill brass melodies, soft electric piano, Sunday morning vibe).
- Station selector, live audio visualizer bars, and dedicated volume / mute slider.

### 3. Newspaper Press Clippings & Keepsake Archive
- **"The Daily Times" Front Page Generator**:
  - Automatically chronicles breaking life milestones into a vintage Nigerian newspaper front page with photos, headlines, date, volume number, and satirical gossip columns.
  - Examples:
    - *"TECH BRO IN LEKKI SIGNS $50K US CONTRACT"*
    - *"DISASTROUS SIGHT AS MAN SOAKS 5TH BOWL OF GARRI IN ONE DAY"*
    - *"OTUNBA SPRAYS ₦500,000 AT SURULERE OWAMBE AS FUJI BAND HYPES FAMILY"*
- **University Degree & Alaba Trade Diploma**:
  - Authentic Nigerian university certificate with ornate seal, Vice Chancellor signature line, and classification.
- **Download / Share Actions**:
  - Export cards as clean PNGs or print format for instant social sharing.

---

## 3. Technical Architecture & Component Breakdown

```
┌───────────────────────────────────────────────────────────────┐
│                       Naija Life SIM                          │
└───────────────┬───────────────────────────────┬───────────────┘
                │                               │
        ┌───────┴───────┐               ┌───────┴───────┐
        ▼               ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Naija Radio │ │ Danfo Dodger │ │ Gen Starter  │ │ Press & Card │
│  - Amapiano  │ │ - Canvas 2D  │ │ - Timing bar │ │ - Newspapers │
│  - Fuji      │ │ - 3 lanes    │ │ - Spark plug │ │ - Diplomas   │
│  - Highlife  │ │ - Collision  │ │ - Sound FX   │ │ - PNG Export │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### New Components
1. `src/utils/radio.ts`: Web Audio procedural Afrobeats rhythm synthesizer with 3 selectable styles, tempo clocks, and filter nodes.
2. `src/components/NaijaRadio.tsx`: Sleek Lagos radio receiver UI with live animated frequency bars, channel presets, and volume dial.
3. `src/components/minigames/DanfoDodger.tsx`: Responsive 2D highway runner mini-game with score, coin collection, and stat payouts.
4. `src/components/minigames/GeneratorRepair.tsx`: Rhythm pull-cord and spark plug mechanic mini-game.
5. `src/components/minigames/OwambeSprayer.tsx`: Rhythm Fuji spraying game with tempo meter and crowd excitement bar.
6. `src/components/PressArchiveModal.tsx`: Newspaper front page and certificate generator with printable/downloadable format.

---

## 4. Implementation Steps

1. **Phase 1: Web Audio Procedural Radio Engine**:
   - Build `src/utils/radio.ts` and `src/components/NaijaRadio.tsx` with 3 channels and visualizer.
2. **Phase 2: Playable Mini-Games Module**:
   - Build Danfo Dodger, Generator Repair, and Owambe Spraying games.
   - Connect win/loss conditions to character cash, sapa, health, and street cred.
3. **Phase 3: Keepsake Archive & Press Generator**:
   - Build `PressArchiveModal` with "The Daily Times" news generator and Degree certificate.
4. **Phase 4: Navigation & HUD Integration**:
   - Add Radio toggle and "Arcade & Gigs" tab to `ActionHub`, plus "Press Headlines" button to HUD.
5. **Phase 5: Verification**:
   - Verify zero lint and build errors with `lint_applet` and `compile_applet`.

# CLAUDE.md — BMW Fluid Privacy Architecture (Showcase Demo)

## 0. Purpose of this document

This is the source of truth for building the showcase demo of the BMW Fluid Privacy Architecture concept. The demo runs on a single laptop, browser-based, and is shown on a table at a design showcase. It is not a functional product. It is a 30–60 second looping visual argument that communicates the concept: the cabin is a shared data environment, and privacy is fluid.

If a decision is not covered here, bias toward: minimal BMW-like restraint for the base UI, organic fluid motion for data merging, zero user friction at the showcase.

---

## 1. Concept summary (for context, not for implementation)

The vehicle is a shared data environment. Privacy and personalization are fluid states that shift based on who is inside the cabin. The system detects presence, reads situational context, ingests data from occupants, and produces a blended output (lighting, audio, navigation). The UI explains these shifts conversationally and visualizes them as overlapping abstract shapes.

The demo makes this concept legible in under a minute.

---

## 2. Demo specification

### 2.1 Format
- Single-page web app, runs fully local, offline-capable
- Opens in fullscreen on a laptop (the "CID", Central Information Display)
- Controlled via a swipe-up gesture on the CID itself that reveals a hidden control panel ("Deep Dive" view). No second device, no keyboard shortcuts visible to the public
- Auto-plays a 45-second loop. After the loop completes, resets to idle and waits. Any interaction (swipe up, click) pauses the loop and exposes controls for manual walkthroughs
- Designed for a ~13–16" laptop screen, landscape, 16:9

### 2.2 Hero moments (what the 20-second viewer should take away)
1. **Merge moment**: A guest joins. Their circle ripples in, overlaps the owner's, and an intersection zone lights up with blended data (media, climate, biometrics).
2. **Conflict + neutral blend**: An unknown guest joins with clashing preferences. The system visibly defaults to a neutral middle ground.
3. **Purge moment**: Guest disconnects. Their data visibly dissolves from the intersection and clears from memory.

### 2.3 Scenario arc (45-second loop)

| Time | State | What happens on screen |
|---|---|---|
| 0–5s | Dylan alone | Single circle centered. Ambient personal settings visible (his music, his climate, his biometrics). Calm, minimal. |
| 5–15s | Dylan + Sarah | Sarah's circle ripples in from the right. Moves toward Dylan's. Circles overlap. Intersection zone blooms, fills with blended data. Microcopy: "Merging media preferences for Dylan and Sarah." |
| 15–25s | Context shift | GPS indicator shifts to "Approaching BMW HQ." Corporate zone activates. Some data streams visibly retract (biometrics dim, personal calendar hides). Microcopy: "Corporate zone detected. Tightening privacy boundary." |
| 25–35s | + Alex (unknown) | Third circle appears, smaller, sandboxed (dashed stroke). Music preference clashes. System resolves to neutral blend. Microcopy: "Preferences conflict. Defaulting to neutral mix." |
| 35–45s | Alex disconnects | Alex's circle dissolves. Their contribution to the intersection visibly clears. Microcopy: "Guest connection ended. Clearing temporary data." |
| 45s | Loop | Fade to Dylan alone. Restart. |

### 2.4 Personas

**Dylan** — owner, driver
- Music: electronic (Bonobo, Jon Hopkins, Four Tet)
- Calendar: "BMW HQ — Design Review, 9:00"
- Wearable: Apple Watch, HR 68 bpm, cabin temp preference 21°C
- Profile color: cool blue `#4A90E2`

**Sarah** — known guest, frequent passenger
- Music: indie folk (Phoebe Bridgers, Big Thief)
- Navigation history: yoga studio in Mitte, farmers market
- Wearable: Oura ring, HR 72 bpm, cabin temp preference 22°C
- Profile color: warm coral `#E89B7A`

**Alex** — unknown guest, one-time connection
- Music: loud hip-hop (clashes with both)
- No calendar access, minimal data shared
- No wearable
- Profile color: neutral amber `#D4A547`, dashed stroke to signal sandboxed state

### 2.5 Visual language
- Base UI: BMW-restrained. Muted dark background (`#0A0E14` to `#141922` gradient), thin sans-serif type (Inter or IBM Plex Sans), precise geometric alignment, generous negative space
- Data shapes: organic SVG metaballs that genuinely merge (use marching squares or a simpler `feGaussianBlur` + `feColorMatrix` threshold trick on SVG circles). Must feel fluid, not like stacked transparent circles
- Motion: smooth, eased, 400–800ms transitions. Framer Motion spring defaults are too bouncy, use custom easing curves (`[0.22, 1, 0.36, 1]` is a good default)
- Typography: one weight for data labels (regular), one for microcopy (medium), one for timestamps/meta (mono, small)

### 2.6 Audio
- Ambient pad underneath entire loop, very low volume
- Soft whoosh on circle merge
- Subtle chime on guest join
- Dissolve / particle sound on purge
- All sounds mutable from the Deep Dive panel (showcase rooms are often loud)
- Use Howler.js or native Web Audio API

---

## 3. Technical architecture

### 3.1 Stack
- **Vite + React + TypeScript**
- **Framer Motion** for component-level animations and transitions
- **SVG + `<filter>`** for the metaball merging effect (circles with gaussian blur + color matrix threshold)
- **Zustand** for global state (simulation clock, occupants, context, conflicts)
- **Howler.js** for audio
- **Tailwind CSS** for layout utility, with a small custom design token file
- No backend, no external APIs, no network calls

### 3.2 Project structure
```
/src
  /components
    CID.tsx                 # Fullscreen container, main stage
    TrustCircles.tsx        # SVG metaball renderer
    IntersectionZone.tsx    # Center panel showing active blended data
    Microcopy.tsx           # Conversational transparency text
    ContextBar.tsx          # Top bar: time, location, zone status
    DeepDive.tsx            # Swipe-up overlay, debug/control view
    ControlPanel.tsx        # Inside DeepDive, manual state triggers
    DataStream.tsx          # Animated pill showing a data source (Spotify, HR, etc)
  /state
    store.ts                # Zustand store
    scenario.ts             # 45s scripted timeline
    personas.ts             # Dylan, Sarah, Alex data objects
  /lib
    metaballs.ts            # SVG filter setup
    audio.ts                # Howler instances
    easing.ts               # Shared easing curves
  /assets
    /audio
    /fonts
  App.tsx
  main.tsx
  index.css
```

### 3.3 State model (Zustand)

```ts
type Persona = {
  id: 'dylan' | 'sarah' | 'alex'
  name: string
  role: 'owner' | 'known_guest' | 'unknown_guest'
  color: string
  data: {
    music: { genre: string; tracks: string[] }
    biometrics?: { hr: number; tempPref: number }
    calendar?: { event: string; time: string }
    navigation?: string[]
  }
  sandboxed: boolean
  connectedAt: number
}

type Context = {
  location: string
  zone: 'personal' | 'corporate' | 'weekend'
  time: string
}

type AppState = {
  mode: 'auto' | 'manual'
  loopTime: number // 0–45s
  occupants: Persona[]
  context: Context
  activeBlend: BlendOutput
  microcopy: string
  conflicts: Conflict[]
  audioEnabled: boolean
  // actions
  addOccupant, removeOccupant, setContext, setMicrocopy, reset, pause, resume
}
```

### 3.4 The scenario engine

`scenario.ts` exports a timeline: an array of `{ time: number, action: (store) => void }` entries. A `useScenarioLoop` hook advances a clock in `requestAnimationFrame`, fires actions when their time is hit, and loops at 45s. Manual mode pauses the clock and hands control to the Deep Dive panel.

This keeps the demo deterministic and testable. The scenario file is the one place to edit timing.

### 3.5 State machine for presence (from the brief)

Implement as a derived value from `occupants` length and composition:
- `S0` Owner Only → `occupants = [dylan]`
- `S1` Owner + Known Guest → `occupants = [dylan, sarah]`
- `S2` Owner + Unknown Guest → any `unknown_guest` present

Transitions trigger microcopy updates and data ingestion animations. The brief calls for this architecture for the CS-audience pitch, so keep the state names visible in the Deep Dive view.

### 3.6 Conflict resolution (visualized, not real)
- **Rule 1 Owner baseline**: Dylan's profile is always rendered as the base layer. Guest circles visually ride on top.
- **Rule 2 Lowest common denominator**: When Alex joins with clashing music, the intersection zone's "music" pill morphs to `neutral ambient` with a soft animation. Show the clash first (split, flicker), then resolve.
- **Rule 3 Ephemeral**: On disconnect, guest-specific data elements fade and shrink to nothing over ~1.2s. Use a subtle particle dissolve if time permits (canvas overlay, 20–40 particles per data pill).

### 3.7 The metaball effect (non-trivial, worth getting right)

The circles must *genuinely merge* when they overlap, not just visually stack. SVG approach:

```html
<svg>
  <filter id="goo">
    <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
    <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" />
  </filter>
  <g filter="url(#goo)">
    <circle ... />
    <circle ... />
  </g>
</svg>
```

The color matrix threshold sharpens the blurred edges back to crisp shapes, producing the merge effect. Tune `stdDeviation` and the last two matrix values for the look. Color handling: use `feComposite` with `SourceGraphic` to preserve per-circle colors after the merge.

---

## 4. UI layout

```
┌──────────────────────────────────────────────────────────────┐
│  ContextBar: 09:47 · Approaching BMW HQ · Corporate Zone    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│         (Dylan)        ◉◉◉        (Sarah)                    │
│           ◯─────────IntersectionZone─────────◯                │
│                                                              │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  "Merging media preferences for Dylan and Sarah."            │
│                                                              │
│                    ▲ swipe up for Deep Dive                 │
└──────────────────────────────────────────────────────────────┘
```

- **ContextBar** (top, thin): time, location string, active zone badge
- **Stage** (center, largest region): metaball circles + intersection zone
- **Intersection zone**: not a separate shape, but the overlapping region rendered with active data pills (music, climate, nav) floating inside or beside it
- **Microcopy** (below stage): single line, animated in/out, 500ms crossfade on change
- **Deep Dive hint** (bottom): chevron + thin text, subtle, always visible
- **Deep Dive** (swipe-up overlay): state machine current state, full data log, manual triggers for every scenario event, audio toggle, reset button, loop pause/resume

### 4.1 Deep Dive panel contents
- Current state: `S1 — Owner + Known Guest`
- Active occupants list with all their data
- Active context
- Active blend output (what lighting/audio/nav is doing)
- Recent events log (last 10 state transitions)
- Manual triggers: `Dylan alone`, `+ Sarah`, `+ Alex`, `Remove Alex`, `Enter corporate zone`, `Exit corporate zone`, `Trigger purge`
- Audio: on/off toggle
- Loop: play/pause/reset

---

## 5. Microcopy library

Keep short, calm, declarative. No exclamation marks. No jargon. Present tense.

- `Dylan connected. Personal profile active.`
- `Sarah connected. Blending shared preferences.`
- `Merging media preferences for Dylan and Sarah.`
- `Adjusting cabin climate based on shared passenger data.`
- `Approaching BMW HQ. Corporate zone active.`
- `Personal biometrics hidden in corporate context.`
- `Guest detected. Limited data access granted.`
- `Preferences conflict. Defaulting to neutral mix.`
- `Guest connection ended. Clearing temporary data.`
- `Cabin returned to personal profile.`

Microcopy swaps trigger on state changes. Use `AnimatePresence` with a 400ms crossfade.

---

## 6. Build order (for Claude Code)

Build in this sequence. Do not skip ahead. Get each stage working visually before moving on.

1. **Scaffold**: Vite + React + TS + Tailwind + Zustand + Framer Motion. Confirm dev server runs.
2. **Static CID layout**: ContextBar, empty stage, microcopy slot, deep dive hint. No animation yet.
3. **Single circle**: Render Dylan's circle in the stage with his color and label. Static.
4. **Metaball filter**: Add the SVG goo filter. Render two circles overlapping to prove the merge works.
5. **Persona system**: Build the store, personas file, and render occupants from state.
6. **Intersection zone content**: When two circles overlap, show blended data pills between them.
7. **Microcopy system**: Animated text swap on state change.
8. **Scenario engine**: Build the 45s timeline with requestAnimationFrame loop. Fire state changes at correct times.
9. **Context shifts**: Corporate zone visual treatment, data retraction animation.
10. **Conflict resolution**: Alex joining, clash visual, neutral resolution.
11. **Purge animation**: Particle dissolve or equivalent on disconnect.
12. **Deep Dive overlay**: Swipe-up gesture, panel content, manual controls.
13. **Audio layer**: Ambient pad, interaction sounds, mute toggle.
14. **Polish pass**: Easing curves, timing tuning, color balance, typography details.
15. **Loop + reset**: Full 45s cycle, auto-reset, idle state.
16. **Showcase prep**: Fullscreen launcher, disable context menu, cursor auto-hide after 3s idle, prevent accidental navigation.

---

## 7. Non-negotiable design rules

- No em dashes in UI copy
- No exclamation marks in UI copy
- No hype language
- Do not show raw toggles or checkboxes on the main CID. All settings live in Deep Dive
- Do not use stock iconography that looks generic. Prefer text labels or custom minimal glyphs
- The owner's circle is always rendered first (z-order base)
- Unknown guests always have a dashed stroke until they become known
- Every state change must have microcopy. No silent transitions
- Intersection zone must never feel like a Venn diagram teaching moment. It is a living data space

---

## 8. Showcase-day requirements

- Runs fully offline
- Launches in fullscreen with one command (`npm run demo` or a bundled executable via Tauri if time permits, but not required)
- Does not require internet
- Does not show browser chrome
- Does not show cursor when idle for 3s
- Recovers from sleep/wake without breaking the loop
- Audio defaults to ON but can be muted from Deep Dive
- A single `reset` keyboard shortcut (e.g. `R`) returns everything to the start of the loop in case of unexpected state

---

## 9. What this demo is not

- Not a real privacy system
- Not connected to any real car, API, or device
- Not meant to handle edge cases or errors
- Not meant to be used as a shippable product

It is a 45-second argument, in motion, that the cabin is a fluid data environment. Every technical decision should serve that argument.

---

## 10. Open items to confirm before first build

- Final font choice (Inter vs IBM Plex Sans vs BMW Group type if licensing allows)
- Final background color pair and intersection glow color
- Whether Tauri wrapper is worth the extra build time or whether a Chrome kiosk shortcut is enough
- Audio assets: source or generate?

Resolve these in the first working session with Claude Code, then freeze them.

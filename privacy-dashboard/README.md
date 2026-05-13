# Privacy Dashboard Demo

A browser-based concept demo visualizing a fluid, presence-aware privacy system for a shared vehicle cabin. The interface shows how personal data merges, conflicts, and clears as occupants join and leave — and can optionally respond in real time to people detected via webcam.

---

## What it does

The dashboard simulates a vehicle cabin shared between multiple occupants, each with their own data profile (music preferences, biometrics, calendar, navigation). The UI shows how these profiles blend when people share a space, and how the system handles conflicts and departures.

### Main screen (AutoHMI)

The primary view is a dark automotive-style HMI with several live panels:

- **Map panel** — a fictional city grid with an active route, destination label, and ETA
- **Navigation bar** — current destination and next turn
- **Music player** — current track, artist, playback progress, and a blended queue drawn from active occupants' preferences
- **Shared Experience widget** — a shortcut into the full shared-cabin view

### Shared Experience overlay

A full-screen overlay accessible from the main screen, organized into tabs:

- **Experience** — orbit visualization of all active occupants, blended cabin settings (temperature, lighting), and a per-person inspector showing what data each occupant is contributing
- **Calendar** — merged schedule view across occupants
- **Music** — collaborative queue with each track attributed to the person who contributed it
- **Dining** — shared dining suggestions based on overlapping preferences

Occupants can be added or removed from this view. Each person has an avatar, a trust level, and a data-sharing toggle.

### Trust Circles (metaball visualization)

Organic SVG circles represent each occupant. When circles overlap, they merge visually using a Gaussian blur + color matrix threshold filter — producing a fluid "goo" effect rather than stacked transparencies. The intersection zone between circles shows blended data as floating pills (music, climate, biometrics).

- Owner's circle (Dylan) is always the base layer
- Unknown guests have a dashed stroke indicating sandboxed status
- When a guest disconnects, their circle and data contributions dissolve

---

## Optional: webcam mode

If a webcam is available and camera permission is granted, the demo switches to live mode: the number of people detected in frame drives who is present in the cabin. Detection uses an on-device COCO-SSD model bundled with the project — no internet required.

- 1 person detected = Dylan only
- 2 people = Dylan + Sarah
- 3 people = Dylan + Sarah + Alex

When the webcam detects a count change, the scripted loop pauses and the interface updates based on live input. The scripted loop resumes if the camera is not available or no change is detected.

---

## Stack

- **Vite + React + TypeScript**
- **TensorFlow.js + COCO-SSD** — on-device person detection (optional, bundled offline)
- **Framer Motion** — animations and transitions
- **Zustand** — global state
- **Tailwind CSS** — layout
- **SVG `<filter>`** — metaball goo effect

---

## Project structure

```
src/
  components/
    AutoHMI.tsx             # Main HMI screen (map, music, nav)
    CID.tsx                 # Fullscreen container, gesture handling
    TrustCircles.tsx        # Metaball SVG renderer
    IntersectionZone.tsx    # Blended data pills in the overlap region
    Microcopy.tsx           # Animated narration text
    DeepDive.tsx            # Swipe-up control overlay
    SharedExperience/       # Full shared-cabin overlay (tabs, orbit viz)
  hooks/
    usePersonDetection.ts   # Webcam + COCO-SSD person counting (optional)
  state/
    store.ts                # Zustand store
    scenario.ts             # 45s scripted timeline
    personas.ts             # Dylan, Sarah, Alex data objects
  lib/                      # Metaball filter, easing curves, audio
public/
  models/coco-ssd/          # Bundled detection model (no internet needed)
```

Edit `src/state/scenario.ts` to change timing or events. Edit `src/state/personas.ts` to change persona data.

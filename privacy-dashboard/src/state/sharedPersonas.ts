export type SharedPersonaId = 'dylan' | 'sarah' | 'alex' | 'marcus'

export type TemporalPersona = Omit<SharedPersona, 'id'> & {
  id: string
  connectionState: 'past' | 'future'
  minutesOffset: number    // past: minutes since left; future: ETA in minutes
  echoData: string[]       // data tags to show (echoing or pre-loading)
  reason: string           // why they left / why they are predicted incoming
  reasonDetail?: string    // supporting detail (calendar event, destination, etc.)
}

export type SharedPersona = {
  id: SharedPersonaId
  name: string
  role: 'owner' | 'guest'
  color: string
  device: string
  light: number       // Kelvin
  temp: number        // °C preference
  nav: string
  music: {
    genres: string[]
    queue: string[]
  }
  dining: {
    cuisines: string[]
    dietary: string[]
    budget: '$$' | '$$$'
  }
  biometrics?: {
    hr: number        // heart rate bpm
    device: string    // wearable name
  }
}

// Ring 0 = full access (biometrics, music, climate, calendar, nav, dining)
// Ring 1 = preferences (music, climate, calendar, nav, dining) — no biometrics
// Ring 2 = navigation suggestions only
// Ring 3 = session presence only (no data shared)
export const PERSONA_ORBIT_RING: Record<string, number> = {
  dylan:  0,
  sarah:  1,
  alex:   2,
  marcus: 3,
}

// Influence weight per ring for blending computations
export const RING_INFLUENCE_WEIGHT = [1.0, 0.65, 0.0, 0.0]

// Data categories accessible per ring level
export const RING_DATA_ACCESS: Record<number, string[]> = {
  0: ['biometrics', 'music', 'climate', 'calendar', 'navigation', 'dining'],
  1: ['music', 'climate', 'calendar', 'navigation', 'dining'],
  2: ['navigation'],
  3: [],
}

export const ALL_SHARED_PEOPLE: SharedPersona[] = [
  {
    id: 'dylan',
    name: 'Dylan Rose',
    role: 'owner',
    color: '#4A8FD4',
    device: "Dylan's iPhone",
    light: 3200,
    temp: 21,
    nav: 'BMW HQ',
    music: { genres: ['Indie', 'Electronic', 'Alt-Rock'], queue: ['Beautiful Things', 'As It Was'] },
    dining: { cuisines: ['Italian', 'Japanese', 'Mexican'], dietary: [], budget: '$$' },
    biometrics: { hr: 68, device: 'Apple Watch' },
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    role: 'guest',
    color: '#A07ED6',
    device: "Sarah's iPhone",
    light: 4400,
    temp: 22,
    nav: 'BMW HQ',
    music: { genres: ['Jazz', 'Soul', 'R&B'], queue: ['Midnight Rain', 'All of Me'] },
    dining: { cuisines: ['Japanese', 'Thai', 'Mediterranean'], dietary: ['Vegetarian'], budget: '$$$' },
    biometrics: { hr: 72, device: 'Oura Ring' },
  },
  {
    id: 'alex',
    name: 'Alex Chen',
    role: 'guest',
    color: '#5BC98A',
    device: "Alex's Galaxy S24",
    light: 3800,
    temp: 20,
    nav: 'Tempelhof Park',
    music: { genres: ['Hip-Hop', 'R&B', 'Afrobeats'], queue: ['Many Ways', 'Essence'] },
    dining: { cuisines: ['Chinese', 'Italian', 'BBQ'], dietary: [], budget: '$$' },
  },
  {
    id: 'marcus',
    name: 'Marcus Webb',
    role: 'guest',
    color: '#D4B447',
    device: "Marcus's iPhone",
    light: 5000,
    temp: 23,
    nav: 'Philharmonie',
    music: { genres: ['Classical', 'Jazz', 'Ambient'], queue: ['Clair de Lune', 'Gymnopédie'] },
    dining: { cuisines: ['French', 'Mediterranean', 'Italian'], dietary: ['Gluten-free'], budget: '$$$' },
  },
]

// Default temporal personas ─────────────────────────────────────────────────

export const DEFAULT_PAST_TEMPORAL: TemporalPersona[] = [
  {
    id: 'marcus',
    name: 'Marcus Webb',
    role: 'guest',
    color: '#D4B447',
    device: "Marcus's iPhone",
    light: 5000,
    temp: 23,
    nav: 'Philharmonie',
    music: { genres: ['Classical', 'Jazz', 'Ambient'], queue: ['Clair de Lune', 'Gymnopédie'] },
    dining: { cuisines: ['French', 'Mediterranean', 'Italian'], dietary: ['Gluten-free'], budget: '$$$' },
    connectionState: 'past',
    minutesOffset: 18,
    echoData: ['Clair de Lune', '23°C', 'Philharmonie'],
    reason: 'Journey complete',
    reasonDetail: 'Dropped off at Philharmonie · 20 min session',
  },
]

export const DEFAULT_FUTURE_TEMPORAL: TemporalPersona[] = [
  {
    id: 'emma',
    name: 'Emma Larsson',
    role: 'guest',
    color: '#7EC8A4',
    device: "Emma's iPhone",
    light: 3600,
    temp: 20,
    nav: 'Mitte, Berlin',
    music: { genres: ['Ambient', 'Lo-fi', 'Classical'], queue: ["Comptine d'un autre été", 'Avril 14th'] },
    dining: { cuisines: ['Scandinavian', 'Japanese', 'Mediterranean'], dietary: ['Vegan'], budget: '$$$' },
    connectionState: 'future',
    minutesOffset: 6,
    echoData: ['Ambient mix', '20°C', 'Mitte'],
    reason: 'Predicted via calendar',
    reasonDetail: 'Team Lunch · 11:30 · Restaurant Zum',
  },
]

export const CALENDAR_EVENTS = [
  { id: 1, time: '09:00', title: 'Design Review',  dur: '60m',  ppl: ['dylan'] as SharedPersonaId[],               loc: 'BMW HQ' },
  { id: 2, time: '11:30', title: 'Team Lunch',      dur: '90m',  ppl: ['dylan', 'sarah'] as SharedPersonaId[],     loc: 'Restaurant Zum' },
  { id: 3, time: '13:00', title: 'Client Call',     dur: '30m',  ppl: ['sarah'] as SharedPersonaId[],              loc: 'Remote' },
  { id: 4, time: '15:00', title: 'Gallery Visit',   dur: '120m', ppl: ['dylan', 'sarah', 'alex'] as SharedPersonaId[], loc: 'Neue National.' },
  { id: 5, time: '18:00', title: 'Dinner',          dur: '120m', ppl: ['dylan', 'sarah'] as SharedPersonaId[],     loc: 'Rutz Berlin' },
  { id: 6, time: '20:30', title: 'Concert',         dur: '150m', ppl: ['marcus'] as SharedPersonaId[],             loc: 'Philharmonie' },
]

export const MUSIC_QUEUE = [
  { title: 'Beautiful Things', artist: 'Benson Boone',  by: 'dylan'  as SharedPersonaId, dur: '3:42' },
  { title: 'Midnight Rain',    artist: 'Taylor Swift',  by: 'sarah'  as SharedPersonaId, dur: '5:08' },
  { title: 'Many Ways',        artist: 'Afrobeats Co.', by: 'alex'   as SharedPersonaId, dur: '3:55' },
  { title: 'Clair de Lune',    artist: 'Debussy',       by: 'marcus' as SharedPersonaId, dur: '4:54' },
  { title: 'As It Was',        artist: 'Harry Styles',  by: 'dylan'  as SharedPersonaId, dur: '2:37' },
  { title: 'All of Me',        artist: 'John Legend',   by: 'sarah'  as SharedPersonaId, dur: '4:30' },
]

export const SHARE_CATEGORIES = [
  { id: 'location' as const, label: 'Location' },
  { id: 'calendar' as const, label: 'Calendar' },
  { id: 'music'    as const, label: 'Music Taste' },
  { id: 'dining'   as const, label: 'Dining Prefs' },
  { id: 'climate'  as const, label: 'Climate' },
]

export type SharingState = {
  location: boolean
  calendar: boolean
  music: boolean
  dining: boolean
  climate: boolean
}

export function defaultSharing(): SharingState {
  return { location: true, calendar: true, music: true, dining: true, climate: true }
}

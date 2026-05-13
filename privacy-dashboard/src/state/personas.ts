export type PersonaId = 'dylan' | 'sarah' | 'alex'
export type PersonaRole = 'owner' | 'paired_guest' | 'present_only'

export type Persona = {
  id: PersonaId
  name: string
  role: PersonaRole
  color: string
  linkedVia: string | null  // how they connected — BMW ID, iPhone, etc. null = unrecognized
  seat: string
  data: {
    ambientLight: { kelvin: number; brightness: number }  // 2700 warm → 6500 cool
    climate: { tempPref: number }
    calendar?: { event: string; time: string; location: string }
    navigation?: { destination: string; note?: string }
    focus?: { active: boolean; reason: string }
  } | null  // null = no data available (present_only)
  connectedAt: number
}

export const dylan: Persona = {
  id: 'dylan',
  name: 'Dylan',
  role: 'owner',
  color: '#4A90E2',
  linkedVia: 'BMW ID',
  seat: 'Driver',
  data: {
    ambientLight: { kelvin: 3200, brightness: 70 },
    climate: { tempPref: 21 },
    calendar: {
      event: 'Design Review',
      time: '9:00',
      location: 'BMW HQ',
    },
    navigation: { destination: 'BMW HQ', note: '12 min' },
    focus: { active: true, reason: 'Design Review at 9:00' },
  },
  connectedAt: 0,
}

export const sarah: Persona = {
  id: 'sarah',
  name: 'Sarah',
  role: 'paired_guest',
  color: '#E89B7A',
  linkedVia: 'iPhone — BMW Key',
  seat: 'Passenger',
  data: {
    ambientLight: { kelvin: 4500, brightness: 55 },
    climate: { tempPref: 22 },
    navigation: { destination: 'BMW HQ', note: 'same destination' },
    focus: { active: false, reason: '' },
  },
  connectedAt: 0,
}

export const alex: Persona = {
  id: 'alex',
  name: 'Alex',
  role: 'present_only',
  color: '#8A9BB0',  // neutral grey-blue — not a full persona color
  linkedVia: null,   // no connection
  seat: 'Rear',
  data: null,        // no data available
  connectedAt: 0,
}

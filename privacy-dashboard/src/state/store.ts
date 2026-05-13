import { create } from 'zustand'
import { Persona, PersonaId, dylan } from './personas'

export type ZoneType = 'personal' | 'corporate' | 'weekend'

export type Context = {
  location: string
  zone: ZoneType
  time: string
}

export type AmbientLight = {
  kelvin: number
  brightness: number
  sources: string[]   // which personas contributed
}

export type BlendOutput = {
  ambientLight: AmbientLight
  climate: string       // computed temp e.g. "21.5"
  climateSources: number[]
  navigation: string
  navigationConsensus: boolean
  focusMode: boolean
  focusReason: string
  cabinMode: 'personal' | 'shared' | 'corporate' | 'partial'  // partial = unrecognized occupant present
}

export type Conflict = {
  field: string
  values: string[]
  resolution: string
}

export type EventEntry = {
  id: number
  loopTime: number
  event: string
}

export type AppState = {
  mode: 'auto' | 'manual'
  loopTime: number
  occupants: Persona[]
  context: Context
  activeBlend: BlendOutput
  microcopy: string
  conflicts: Conflict[]
  audioEnabled: boolean
  deepDiveOpen: boolean
  eventLog: EventEntry[]

  addOccupant: (persona: Persona) => void
  removeOccupant: (id: PersonaId) => void
  setContext: (ctx: Partial<Context>) => void
  setMicrocopy: (text: string) => void
  setMode: (mode: 'auto' | 'manual') => void
  setLoopTime: (time: number) => void
  setAudioEnabled: (val: boolean) => void
  setDeepDiveOpen: (val: boolean) => void
  setConflicts: (conflicts: Conflict[]) => void
  setActiveBlend: (blend: Partial<BlendOutput>) => void
  logEvent: (event: string) => void
  reset: () => void
}

const defaultContext: Context = {
  location: 'Schoneberg, Berlin',
  zone: 'personal',
  time: '09:47',
}

const defaultBlend: BlendOutput = {
  ambientLight: { kelvin: 3200, brightness: 70, sources: ['Dylan'] },
  climate: '21.0',
  climateSources: [21],
  navigation: 'BMW HQ',
  navigationConsensus: false,
  focusMode: true,
  focusReason: 'Design Review at 9:00',
  cabinMode: 'personal',
}

let _eventId = 1

export const useStore = create<AppState>((set) => ({
  mode: 'auto',
  loopTime: 0,
  occupants: [{ ...dylan, connectedAt: 0 }],
  context: defaultContext,
  activeBlend: defaultBlend,
  microcopy: 'Dylan connected. Personal profile active.',
  conflicts: [],
  audioEnabled: true,
  deepDiveOpen: false,
  eventLog: [{ id: _eventId++, loopTime: 0, event: 'Dylan connected. Personal profile active.' }],

  addOccupant: (persona) =>
    set((s) => ({
      occupants: s.occupants.find((o) => o.id === persona.id)
        ? s.occupants
        : [...s.occupants, { ...persona, connectedAt: s.loopTime }],
    })),

  removeOccupant: (id) =>
    set((s) => ({ occupants: s.occupants.filter((o) => o.id !== id) })),

  setContext: (ctx) =>
    set((s) => ({ context: { ...s.context, ...ctx } })),

  setMicrocopy: (text) => set({ microcopy: text }),

  setMode: (mode) => set({ mode }),

  setLoopTime: (time) => set({ loopTime: time }),

  setAudioEnabled: (val) => set({ audioEnabled: val }),

  setDeepDiveOpen: (val) => set({ deepDiveOpen: val }),

  setConflicts: (conflicts) => set({ conflicts }),

  setActiveBlend: (blend) =>
    set((s) => ({ activeBlend: { ...s.activeBlend, ...blend } })),

  logEvent: (event) =>
    set((s) => ({
      eventLog: [
        { id: _eventId++, loopTime: Math.round(s.loopTime * 10) / 10, event },
        ...s.eventLog,
      ].slice(0, 20),
    })),

  reset: () =>
    set({
      loopTime: 0,
      occupants: [{ ...dylan, connectedAt: 0 }],
      context: defaultContext,
      activeBlend: defaultBlend,
      microcopy: 'Dylan connected. Personal profile active.',
      conflicts: [],
      mode: 'auto',
      eventLog: [{ id: _eventId++, loopTime: 0, event: 'Loop reset.' }],
    }),
}))

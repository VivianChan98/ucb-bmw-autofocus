import { create } from 'zustand'
import {
  SharedPersona, SharedPersonaId, SharingState, TemporalPersona,
  ALL_SHARED_PEOPLE, defaultSharing,
  DEFAULT_PAST_TEMPORAL, DEFAULT_FUTURE_TEMPORAL,
  PERSONA_ORBIT_RING, RING_INFLUENCE_WEIGHT, RING_DATA_ACCESS,
} from './sharedPersonas'

export type SharedTab = 'experience' | 'calendar' | 'music' | 'dining'

// ─── Blend computation ────────────────────────────────────────────────────────
// The blend is what the cabin actually does based on who is present and at
// which ring level. Ring 0 has full influence (1.0×), ring 1 has 0.65×,
// rings 2-3 contribute navigation suggestions only or nothing.

export type SharedBlend = {
  climate: number
  climateContributors: { personId: string; name: string; temp: number; weight: number }[]
  ambientLight: number
  musicPersonIds: string[]
  navigationMain: string
  navigationSuggestions: { personId: string; personName: string; destination: string }[]
  biometricMode: 'focus' | 'relax' | 'neutral'
  biometricHR?: number
  biometricDevice?: string
}

function computeBlend(
  activePeople: SharedPersona[],
  sharing: Record<string, SharingState>,
): SharedBlend {
  const ring   = (p: SharedPersona) => PERSONA_ORBIT_RING[p.id] ?? 3
  const weight = (p: SharedPersona) => RING_INFLUENCE_WEIGHT[ring(p)] ?? 0

  // Climate: ring 0-1 contributors who have climate sharing on
  const climateContribs = activePeople
    .filter((p) => RING_DATA_ACCESS[ring(p)]?.includes('climate') && sharing[p.id]?.climate !== false)
    .map((p) => ({ personId: p.id, name: p.name.split(' ')[0]!, temp: p.temp, weight: weight(p) }))

  const totalWeight = climateContribs.reduce((s, c) => s + c.weight, 0)
  const blendedClimate = totalWeight > 0
    ? climateContribs.reduce((s, c) => s + c.temp * c.weight, 0) / totalWeight
    : (activePeople[0]?.temp ?? 21)

  // Ambient light: same ring filter
  const lightContribs = activePeople.filter((p) => RING_DATA_ACCESS[ring(p)]?.includes('climate'))
  const totalLightWeight = lightContribs.reduce((s, p) => s + weight(p), 0)
  const blendedLight = totalLightWeight > 0
    ? lightContribs.reduce((s, p) => s + p.light * weight(p), 0) / totalLightWeight
    : (activePeople[0]?.light ?? 3200)

  // Music: ring 0-1 only, with music sharing on
  const musicPersonIds = activePeople
    .filter((p) => RING_DATA_ACCESS[ring(p)]?.includes('music') && sharing[p.id]?.music !== false)
    .map((p) => p.id)

  // Navigation: owner's main destination + ring-2 suggestions
  const owner = activePeople.find((p) => p.role === 'owner')
  const navSuggestions = activePeople
    .filter((p) => ring(p) === 2)
    .map((p) => ({ personId: p.id, personName: p.name.split(' ')[0]!, destination: p.nav }))

  // Biometrics: owner (ring 0) only
  const ownerBio = owner?.biometrics
  const biometricMode: SharedBlend['biometricMode'] =
    ownerBio ? (ownerBio.hr < 70 ? 'focus' : ownerBio.hr > 85 ? 'relax' : 'neutral') : 'neutral'

  return {
    climate: Math.round(blendedClimate * 10) / 10,
    climateContributors: climateContribs,
    ambientLight: Math.round(blendedLight),
    musicPersonIds,
    navigationMain: owner?.nav ?? '',
    navigationSuggestions: navSuggestions,
    biometricMode,
    biometricHR: ownerBio?.hr,
    biometricDevice: ownerBio?.device,
  }
}

// ─── Camera sync ──────────────────────────────────────────────────────────────
// When camera mode is active, the webcam count drives who is in the session.
// Dylan (index 0) is always the driver; camera count - 1 = guest count.
// Guests are filled from the roster in order: Sarah → Alex → Marcus.

const CAMERA_GUESTS = ALL_SHARED_PEOPLE.slice(1) // Sarah, Alex, Marcus

type SetFn = Parameters<Parameters<typeof import('zustand').create>[0]>[0]

function syncFromCount(n: number, set: SetFn) {
  const guestCount = Math.min(Math.max(n - 1, 0), CAMERA_GUESTS.length)
  const newGuests  = CAMERA_GUESTS.slice(0, guestCount)
  const owner      = ALL_SHARED_PEOPLE[0]!
  const newPeople  = [owner, ...newGuests]

  set((s: SharedSessionState) => {
    const newSharing = { ...s.sharing }
    newGuests.forEach((p) => {
      if (!newSharing[p.id]) newSharing[p.id] = defaultSharing()
    })
    return {
      activePeople: newPeople,
      sharing: newSharing as Record<SharedPersonaId, SharingState>,
      blend: computeBlend(newPeople, newSharing),
    }
  })
}

// ─── State shape ──────────────────────────────────────────────────────────────

export type SharedSessionState = {
  activePeople:    SharedPersona[]
  sharing:         Record<SharedPersonaId, SharingState>
  pendingInviteId: SharedPersonaId | null
  selectedPersonId: SharedPersonaId | null
  activeTab:       SharedTab
  pastPeople:      TemporalPersona[]
  futurePeople:    TemporalPersona[]
  blend:           SharedBlend
  cameraMode:      boolean
  lastWebcamCount: number

  setActiveTab:    (tab: SharedTab) => void
  setSelectedPerson: (id: SharedPersonaId | null) => void
  invitePerson:    (id: SharedPersonaId) => void
  acceptInvite:    () => void
  declineInvite:   () => void
  removePerson:    (id: SharedPersonaId) => void
  toggleSharing:   (personId: SharedPersonaId, category: keyof SharingState, value: boolean) => void
  setCameraMode:   (val: boolean) => void
  setWebcamCount:  (n: number) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

const owner          = ALL_SHARED_PEOPLE[0]!
const initialSharing = { [owner.id]: defaultSharing() } as Record<SharedPersonaId, SharingState>

export const useSharedSession = create<SharedSessionState>((set, get) => ({
  activePeople:    [owner],
  sharing:         initialSharing,
  pendingInviteId: null,
  selectedPersonId: null,
  activeTab:       (typeof localStorage !== 'undefined' && localStorage.getItem('bmw_shared_tab') as SharedTab) || 'experience',
  pastPeople:      DEFAULT_PAST_TEMPORAL,
  futurePeople:    DEFAULT_FUTURE_TEMPORAL,
  blend:           computeBlend([owner], initialSharing),
  cameraMode:      false,
  lastWebcamCount: 0,

  setActiveTab: (tab) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('bmw_shared_tab', tab)
    set({ activeTab: tab })
  },

  setSelectedPerson: (id) => set({ selectedPersonId: id }),
  invitePerson:      (id) => set({ pendingInviteId: id }),

  acceptInvite: () => {
    const { pendingInviteId } = get()
    if (!pendingInviteId) return
    const persona = ALL_SHARED_PEOPLE.find((p) => p.id === pendingInviteId)
    if (!persona) return
    set((s) => {
      const newPeople  = [...s.activePeople, persona]
      const newSharing = { ...s.sharing, [pendingInviteId]: defaultSharing() }
      // Move from future zone if they were predicted incoming
      const futurePeople = s.futurePeople.filter((p) => p.id !== pendingInviteId)
      return {
        activePeople:    newPeople,
        sharing:         newSharing,
        pendingInviteId: null,
        futurePeople,
        blend:           computeBlend(newPeople, newSharing),
      }
    })
  },

  declineInvite: () => set({ pendingInviteId: null }),

  removePerson: (id) => {
    const person = get().activePeople.find((p) => p.id === id)
    if (!person || person.role === 'owner') return
    const timeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    // Create an echo record so the person appears in the past-echo zone
    const echo: TemporalPersona = {
      ...person,
      connectionState: 'past',
      minutesOffset:   0,
      echoData: [
        person.music.queue[0] ?? person.music.genres[0] ?? '',
        `${person.temp}°C`,
        person.nav,
      ].filter(Boolean),
      reason:       'Session ended',
      reasonDetail: `Left cabin manually · ${timeStr}`,
    }
    set((s) => {
      const { [id]: _removed, ...rest } = s.sharing
      const newPeople  = s.activePeople.filter((p) => p.id !== id)
      const newSharing = rest as Record<SharedPersonaId, SharingState>
      return {
        activePeople:     newPeople,
        sharing:          newSharing,
        selectedPersonId: s.selectedPersonId === id ? null : s.selectedPersonId,
        pastPeople:       [echo, ...s.pastPeople.filter((p) => p.id !== id)],
        blend:            computeBlend(newPeople, newSharing),
      }
    })
  },

  toggleSharing: (personId, category, value) =>
    set((s) => {
      const newSharing = {
        ...s.sharing,
        [personId]: { ...s.sharing[personId], [category]: value },
      }
      return { sharing: newSharing, blend: computeBlend(s.activePeople, newSharing) }
    }),

  setCameraMode: (val) => {
    if (val) {
      set({ cameraMode: true })
      syncFromCount(get().lastWebcamCount, set)
    } else {
      const people = [ALL_SHARED_PEOPLE[0]!]
      set({
        cameraMode:   false,
        activePeople: people,
        blend:        computeBlend(people, initialSharing),
      })
    }
  },

  setWebcamCount: (n) => {
    set({ lastWebcamCount: n })
    if (!get().cameraMode) return
    syncFromCount(n, set)
  },
}))

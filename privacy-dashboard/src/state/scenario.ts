import { AppState } from './store'
import { sarah, alex } from './personas'

type TimelineEntry = {
  time: number
  label: string
  action: (store: AppState) => void
}

export const LOOP_DURATION = 45

export const TIMELINE: TimelineEntry[] = [
  {
    time: 0,
    label: 'Start',
    action: (s) => { s.reset() },
  },
  {
    time: 5,
    label: 'Sarah',
    action: (s) => {
      s.addOccupant(sarah)
      s.setMicrocopy('Sarah paired. Merging cabin preferences.')
      s.setActiveBlend({
        ambientLight: { kelvin: 3850, brightness: 63, sources: ['Dylan', 'Sarah'] },
        climate: '21.5',
        climateSources: [21, 22],
        navigationConsensus: true,
        cabinMode: 'shared',
      })
      s.logEvent('Sarah joined via iPhone. Light blended to 3850K. Climate 21.5°C.')
    },
  },
  {
    time: 9,
    label: '',
    action: (s) => {
      s.setMicrocopy('Shared destination confirmed. Focus mode on for both.')
      s.logEvent('Navigation consensus: both heading to BMW HQ.')
    },
  },
  {
    time: 15,
    label: 'Corporate',
    action: (s) => {
      s.setContext({ zone: 'corporate', location: 'Approaching BMW HQ' })
      s.setMicrocopy('Corporate zone. Calendar and health data restricted.')
      s.setActiveBlend({
        ambientLight: { kelvin: 5000, brightness: 80, sources: ['Zone policy'] },
        cabinMode: 'corporate',
        focusMode: true,
        focusReason: 'Corporate zone — Design Review at 9:00',
      })
      s.logEvent('Corporate zone entered. Light shifted to 5000K. Biometrics hidden.')
    },
  },
  {
    time: 20,
    label: '',
    action: (s) => {
      s.setMicrocopy('Calendar visible to cabin. Navigation locked to BMW HQ.')
      s.logEvent('Corporate policy active: calendar context shared to display.')
    },
  },
  {
    time: 25,
    label: 'Alex',
    action: (s) => {
      s.addOccupant(alex)
      s.setMicrocopy('Rear seat occupied. No profile linked.')
      s.setActiveBlend({ cabinMode: 'partial' })
      s.setConflicts([
        { field: 'ambientLight', values: ['3850K (Dylan+Sarah)', 'unknown (Alex)'], resolution: 'Maintain current blend — seat 3 defaults' },
      ])
      s.logEvent('Unrecognized occupant in rear seat. No preferences available.')
    },
  },
  {
    time: 30,
    label: '',
    action: (s) => {
      s.setMicrocopy('Seat 3 using cabin defaults. Shared blend unchanged.')
      s.setConflicts([])
      s.logEvent('Seat 3 assigned cabin defaults. Dylan + Sarah blend maintained.')
    },
  },
  {
    time: 35,
    label: 'Purge',
    action: (s) => {
      s.removeOccupant('alex')
      s.setMicrocopy('Rear seat cleared. No data to remove.')
      s.setActiveBlend({ cabinMode: 'shared' })
      s.setConflicts([])
      s.logEvent('Rear seat occupant left. Cabin back to Dylan + Sarah blend.')
    },
  },
  {
    time: 40,
    label: '',
    action: (s) => {
      s.setMicrocopy('Approaching BMW HQ. Focus mode active.')
      s.logEvent('Final approach. Focus mode enforced.')
    },
  },
]

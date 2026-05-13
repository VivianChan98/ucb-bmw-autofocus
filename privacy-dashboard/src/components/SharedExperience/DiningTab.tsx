import { SharedPersona, SharingState } from '../../state/sharedPersonas'

const T = {
  border: 'rgba(255,255,255,0.25)',
  borderMid: 'rgba(255,255,255,0.25)',
  txt: '#FFFFFF',
  txtB: 'rgba(255,255,255,0.85)',
  txtC: 'rgba(255,255,255,0.60)',
  txtD: 'rgba(255,255,255,0.35)',
  green: '#5BC98A',
}

type DiningTabProps = {
  people: SharedPersona[]
  sharing: Record<string, SharingState>
}

export function DiningTab({ people, sharing }: DiningTabProps) {
  const sharingPeople = people.filter((p) => sharing[p.id]?.dining)

  // Count votes per cuisine
  const cuisineVotes: Record<string, SharedPersona[]> = {}
  sharingPeople.forEach((p) => {
    p.dining.cuisines.forEach((c) => {
      if (!cuisineVotes[c]) cuisineVotes[c] = []
      cuisineVotes[c]!.push(p)
    })
  })

  // Sort: shared first, then by vote count
  const sorted = Object.entries(cuisineVotes).sort((a, b) => {
    const aShared = a[1].length > 1 ? 1 : 0
    const bShared = b[1].length > 1 ? 1 : 0
    if (bShared !== aShared) return bShared - aShared
    return b[1].length - a[1].length
  })

  const allDietary = [...new Set(sharingPeople.flatMap((p) => p.dining.dietary))]

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Cuisine votes */}
        <div>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase', display: 'block', marginBottom: 9 }}>
            Cuisine preferences
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sorted.map(([cuisine, voters]) => {
              const isShared = voters.length > 1
              const pct = (voters.length / Math.max(sharingPeople.length, 1)) * 100
              return (
                <div key={cuisine} style={{
                  padding: '8px 11px', borderRadius: 7,
                  background: isShared ? 'rgba(91,201,138,0.04)' : 'rgba(255,255,255,0.012)',
                  border: `1px solid ${isShared ? 'rgba(91,201,138,0.18)' : T.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontSize: 11.5, color: isShared ? T.txt : T.txtB }}>{cuisine}</span>
                      {isShared && (
                        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7, color: T.green, letterSpacing: '.1em' }}>SHARED</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: -2 }}>
                      {voters.map((p, i) => (
                        <div key={p.id} style={{
                          width: 15, height: 15, borderRadius: '50%',
                          background: `${p.color}1e`, border: `1px solid ${p.color}45`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginLeft: i === 0 ? 0 : -4, zIndex: voters.length - i, position: 'relative',
                        }}>
                          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 5.5, color: p.color }}>{p.name[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: isShared ? T.green : 'rgba(255,255,255,0.2)',
                      borderRadius: 1,
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dietary notes */}
        {allDietary.length > 0 && (
          <div>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Dietary notes
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {allDietary.map((d) => {
                const who = sharingPeople.filter((p) => p.dining.dietary.includes(d))
                return (
                  <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 9px', borderRadius: 5, background: 'rgba(255,255,255,0.015)', border: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 11, color: T.txtB }}>{d}</span>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {who.map((p) => (
                        <div key={p.id} style={{ padding: '1px 6px', borderRadius: 3, background: `${p.color}12`, border: `1px solid ${p.color}28` }}>
                          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7, color: p.color }}>{p.name.split(' ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {sharingPeople.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, opacity: 0.35 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtC }}>No dining preferences shared</span>
          </div>
        )}
      </div>

      {/* Per-person panel */}
      <div style={{ width: 188, borderLeft: `1px solid ${T.border}`, padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0, overflow: 'auto' }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase' }}>By person</span>
        {people.map((p) => {
          const on = sharing[p.id]?.dining
          return (
            <div key={p.id} style={{ opacity: on ? 1 : 0.35, transition: 'opacity .2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtB }}>{p.name.split(' ')[0]}</span>
                {!on && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7, color: T.txtD, marginLeft: 'auto' }}>hidden</span>}
              </div>
              {on && (
                <div style={{ paddingLeft: 10 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 4 }}>
                    {p.dining.cuisines.map((c) => (
                      <span key={c} style={{ padding: '2px 6px', borderRadius: 3, background: `${p.color}0d`, border: `1px solid ${p.color}22`, fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: `${p.color}bb`, letterSpacing: '.04em' }}>{c}</span>
                    ))}
                  </div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtD }}>{p.dining.budget}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

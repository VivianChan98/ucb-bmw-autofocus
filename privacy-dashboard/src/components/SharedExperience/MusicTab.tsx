import { useState, useEffect } from 'react'
import { SharedPersona, SharingState, MUSIC_QUEUE } from '../../state/sharedPersonas'
import { useSharedSession } from '../../state/sharedSession'

const T = {
  border: 'rgba(255,255,255,0.25)',
  borderMid: 'rgba(255,255,255,0.25)',
  txt: '#FFFFFF',
  txtB: 'rgba(255,255,255,0.85)',
  txtC: 'rgba(255,255,255,0.60)',
  txtD: 'rgba(255,255,255,0.35)',
  green: '#5BC98A',
}

type MusicTabProps = {
  people: SharedPersona[]
  sharing: Record<string, SharingState>
}

export function MusicTab({ people, sharing: _sharing }: MusicTabProps) {
  const [progress, setProgress] = useState(42)
  const [playing, setPlaying] = useState(true)
  const blend = useSharedSession((s) => s.blend)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.12)), 200)
    return () => clearInterval(id)
  }, [playing])

  const cur = MUSIC_QUEUE[0]!
  // Only include tracks from ring 0-1 people (those in blend.musicPersonIds)
  const queue = MUSIC_QUEUE.filter((t) => blend.musicPersonIds.includes(t.by))
  // People excluded from music due to ring level
  const excludedFromMusic = people.filter((p) => !blend.musicPersonIds.includes(p.id))
  const sharedGenres = people.length > 1
    ? people[0]!.music.genres.filter((g) => people.slice(1).some((p) => p.music.genres.includes(g)))
    : []

  const mins = Math.floor(progress * 3.42 / 100)
  const secs = String(Math.floor((progress * 3.42 / 100 % 1) * 60)).padStart(2, '0')

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 18px', gap: 14, overflow: 'auto' }}>
        {/* Now playing */}
        <div>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase', display: 'block', marginBottom: 9 }}>
            Now playing
          </span>
          <div style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${T.borderMid}`, borderRadius: 10, padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 42, height: 42, borderRadius: 6, flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 17 }}>♫</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12.5, color: T.txt, letterSpacing: '-.01em', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cur.title}</p>
                <p style={{ fontSize: 10.5, color: T.txtB }}>{cur.artist}</p>
              </div>
              {(() => { const c = people.find((p) => p.id === cur.by); return c ? (
                <div style={{ padding: '2px 8px', borderRadius: 3, background: `${c.color}12`, border: `1px solid ${c.color}28`, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: c.color, letterSpacing: '.08em' }}>{c.name.split(' ')[0]}</span>
                </div>
              ) : null })()}
            </div>
            <div>
              <div
                style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden', marginBottom: 4, cursor: 'pointer' }}
                onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setProgress((e.clientX - r.left) / r.width * 100) }}
              >
                <div style={{ height: '100%', width: `${progress}%`, background: 'rgba(255,255,255,0.38)', borderRadius: 1, transition: 'width .18s linear' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>{mins}:{secs}</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>{cur.dur}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 22, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: T.txtC, cursor: 'pointer' }}>⏮</span>
              <button onClick={() => setPlaying((p) => !p)} style={{
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: 5,
                padding: '4px 13px', cursor: 'pointer',
                fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtB, letterSpacing: '.08em', transition: 'all .2s',
              }}>{playing ? '⏸ Pause' : '▶ Play'}</button>
              <span style={{ fontSize: 12, color: T.txtC, cursor: 'pointer' }}>⏭</span>
            </div>
          </div>
        </div>

        {/* Queue */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase' }}>
              Blended queue
            </span>
            {excludedFromMusic.length > 0 && (
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7, color: 'rgba(226,232,244,0.30)', letterSpacing: '.06em' }}>
                {excludedFromMusic.map((p) => p.name.split(' ')[0]).join(', ')} excluded · ring 2
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {queue.slice(1).map((t, i) => {
              const c = people.find((p) => p.id === t.by)
              if (!c) return null
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 9px', borderRadius: 5, background: 'rgba(255,255,255,0.06)', border: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtD, width: 13, flexShrink: 0 }}>{i + 2}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, color: T.txtB, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</p>
                    <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>{t.artist}</p>
                  </div>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC, flexShrink: 0 }}>{t.dur}</span>
                  <div style={{ width: 15, height: 15, borderRadius: '50%', background: `${c.color}15`, border: `1px solid ${c.color}38`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 5.5, color: c.color }}>{c.name[0]}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Taste blend */}
      <div style={{ width: 200, borderLeft: `1px solid ${T.border}`, padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0, overflow: 'auto' }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase' }}>Taste blend</span>
        {sharedGenres.length > 0 && (
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.green, letterSpacing: '.1em', marginBottom: 5 }}>SHARED</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {sharedGenres.map((g) => (
                <span key={g} style={{ padding: '2px 8px', borderRadius: 3, background: `${T.green}12`, border: `1px solid ${T.green}28`, fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.green, letterSpacing: '.05em' }}>{g}</span>
              ))}
            </div>
          </div>
        )}
        <div style={{ height: 1, background: T.border }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {people.map((p) => (
            <div key={p.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtB }}>{p.name.split(' ')[0]}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, paddingLeft: 10 }}>
                {p.music.genres.map((g) => (
                  <span key={g} style={{ padding: '2px 6px', borderRadius: 3, background: `${p.color}0d`, border: `1px solid ${p.color}22`, fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: `${p.color}bb`, letterSpacing: '.04em' }}>{g}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

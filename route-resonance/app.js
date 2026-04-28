// ─── Data ─────────────────────────────────────────────────────
const CATS = {
  weather: ['sunny', 'rain', 'cloud', 'wind', 'snow'],
  time:    ['sunrise', 'day', 'dusk', 'night'],
  place:   ['forest', 'waves', 'ocean', 'mountain', 'city']
};
const ALL_THEMES = [...CATS.weather, ...CATS.time, ...CATS.place];
const CAT_MAP = {};
Object.entries(CATS).forEach(([cat, ids]) => ids.forEach(id => CAT_MAP[id] = cat));
const AUTO_SET   = new Set(['waves', 'sunrise']);

const META = {
  sunny: 'Sunny',   rain: 'Rain',     cloud: 'Overcast', wind: 'Wind',
  snow: 'Snow',     sunrise: 'Sunrise', day: 'Daytime', dusk: 'Dusk',
  night: 'Night',   forest: 'Forest',  waves: 'Coastal', ocean: 'Ocean',
  mountain: 'Mountain', city: 'City'
};

const ICONS = {
  rain:     `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M10 26Q14 19 22 19Q30 19 34 26" fill="rgba(100,140,200,0.12)" stroke="#4A72A8" stroke-width=".9"/><path d="M15 33L14 38M22 33L21 38M29 33L28 38" stroke="#3A62A0" stroke-width="1.2" stroke-linecap="round"/><path d="M10 26Q8 20 13 17Q13 11 18 11Q19 7 24 7Q32 7 32 17Q37 18 36 26" fill="rgba(100,140,200,0.08)" stroke="#4A72A8" stroke-width=".9"/></svg>`,
  cloud:    `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M12 31Q8 31 8 26Q8 21 12 19Q12 13 18 13Q22 13 24 16Q28 14 32 18Q37 18 37 24Q37 28 33 28L12 31" fill="rgba(80,90,110,0.12)" stroke="#4A4A60" stroke-width=".9"/></svg>`,
  wind:     `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M8 17Q17 16 26 17Q31 17.5 33 16Q34 13 32 12.5Q30 12 29.5 14" fill="none" stroke="#6A6A88" stroke-width="1.2" stroke-linecap="round"/><path d="M8 22Q19 21 28 22Q34 22.5 36 21Q38 19 36 18.5Q34 18 33.5 19.5" fill="none" stroke="#6A6A88" stroke-width="1.2" stroke-linecap="round"/><path d="M8 27Q14 26 22 27Q26 27.5 28 29Q29 31 27 33" fill="none" stroke="#6A6A88" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  snow:     `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M22 9L22 35M9 22L35 22M14 14L30 30M30 14L14 30" stroke="rgba(160,200,255,0.4)" stroke-width="1.1" stroke-linecap="round"/><circle cx="22" cy="22" r="3.5" fill="rgba(160,200,255,0.25)" stroke="#88AADD" stroke-width=".9"/><circle cx="14" cy="14" r="2" fill="rgba(160,200,255,0.15)" stroke="#88AADD" stroke-width=".7"/><circle cx="30" cy="30" r="2" fill="rgba(160,200,255,0.15)" stroke="#88AADD" stroke-width=".7"/><circle cx="30" cy="14" r="2" fill="rgba(160,200,255,0.15)" stroke="#88AADD" stroke-width=".7"/><circle cx="14" cy="30" r="2" fill="rgba(160,200,255,0.15)" stroke="#88AADD" stroke-width=".7"/></svg>`,
  sunny:    `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="7" fill="rgba(250,210,80,0.3)" stroke="#D4A020" stroke-width="1.1"/><path d="M22 8L22 12M22 32L22 36M8 22L12 22M32 22L36 22M13 13L15.5 15.5M28.5 28.5L31 31M31 13L28.5 15.5M15.5 28.5L13 31" stroke="#D4A020" stroke-width="1" stroke-linecap="round"/><circle cx="22" cy="22" r="4" fill="rgba(250,220,100,0.35)"/></svg>`,
  sunrise:  `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M22 29A11 11 0 0 1 11 29" fill="rgba(220,160,50,0.1)" stroke="#C88A1A" stroke-width="1"/><path d="M22 29A11 11 0 0 0 33 29" fill="rgba(220,160,50,0.1)" stroke="#C88A1A" stroke-width="1"/><path d="M22 17L22 13M13 20L11 18M31 20L33 18" stroke="#C88A1A" stroke-width=".9" stroke-linecap="round"/><path d="M8 29L36 29" stroke="#2A2A40" stroke-width=".8"/><path d="M8 34Q14 30 22 32Q30 34 36 30" stroke="#2A5080" stroke-width=".7" fill="none" stroke-linecap="round"/></svg>`,
  day:      `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="8" fill="rgba(250,199,80,0.25)" stroke="#C88A1A" stroke-width="1.1"/><path d="M22 7L22 11M22 33L22 37M7 22L11 22M33 22L37 22M12 12L14.8 14.8M29.2 29.2L32 32M32 12L29.2 14.8M14.8 29.2L12 32" stroke="#C88A1A" stroke-width="1.1" stroke-linecap="round"/></svg>`,
  dusk:     `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M22 30A12 12 0 0 1 10 30" fill="rgba(200,120,40,0.1)" stroke="#A86820" stroke-width="1"/><path d="M22 30A12 12 0 0 0 34 30" fill="rgba(200,120,40,0.1)" stroke="#A86820" stroke-width="1"/><path d="M8 30L36 30" stroke="#2A2A40" stroke-width=".8"/><path d="M8 35Q14 31 22 34Q30 37 36 32" stroke="#4A3080" stroke-width=".7" fill="none" stroke-linecap="round"/><circle cx="30" cy="15" r="4" fill="rgba(200,160,255,0.1)" stroke="#6040A0" stroke-width=".8"/></svg>`,
  night:    `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M24 10Q16 11 13 19Q10 27 17 33Q24 39 32 37Q23 38 21 32Q17 24 21 18Q22 13 29 11Q26 10 24 10Z" fill="rgba(50,100,200,0.12)" stroke="#3A62A0" stroke-width=".9"/><circle cx="31" cy="13" r="1.6" fill="#5A7ACC"/><circle cx="34" cy="23" r="1.3" fill="#5A7ACC"/><circle cx="28" cy="31" r="1.8" fill="#5A7ACC"/></svg>`,
  forest:   `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M22 34L22 22L28 22L21 9L14 22L20 22L20 34Z" fill="rgba(60,120,20,0.2)" stroke="#4A9020" stroke-width=".9"/><path d="M12 34L12 24L10 24L17 14L17 18L21 18L13 7L8 18" fill="rgba(50,100,15,0.12)" stroke="#386010" stroke-width=".8"/><path d="M5 34L39 34" stroke="#2A3020" stroke-width=".7"/></svg>`,
  waves:    `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M8 19Q13 13 18 19Q23 25 28 19Q33 13 38 19" stroke="#3A72B8" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M8 27Q13 21 18 27Q23 33 28 27Q33 21 38 27" stroke="#2A62A8" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M8 35Q13 29 18 35Q23 41 28 35Q33 29 38 35" stroke="#1C52A0" stroke-width="1.1" fill="none" stroke-linecap="round"/></svg>`,
  ocean:    `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M8 28Q13 22 18 28Q23 34 28 28Q33 22 38 28" stroke="#2A62A8" stroke-width="1.3" fill="rgba(42,98,168,0.07)" stroke-linecap="round"/><path d="M8 36Q13 30 18 36Q23 42 28 36Q33 30 38 36" stroke="#1C52A0" stroke-width="1.1" fill="none" stroke-linecap="round"/><circle cx="22" cy="16" r="8" fill="rgba(220,160,50,0.08)" stroke="#A87A10" stroke-width=".9"/><path d="M22 7L22 9M22 23L22 25M14 16L16 16M28 16L30 16" stroke="#A87A10" stroke-width=".9" stroke-linecap="round"/></svg>`,
  mountain: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M6 37L18 16L30 37Z" fill="rgba(80,80,100,0.12)" stroke="#5A5A78" stroke-width=".9"/><path d="M23 37L32 19L41 37Z" fill="rgba(65,65,88,0.16)" stroke="#4A4A68" stroke-width=".9"/><path d="M14 24Q17 20 20 24" fill="white" stroke="rgba(200,210,240,0.5)" stroke-width=".5"/><path d="M28 26Q31 22 34 26" fill="white" stroke="rgba(200,210,240,0.5)" stroke-width=".5"/><path d="M5 37L42 37" stroke="#2A2A40" stroke-width=".7"/></svg>`,
  city:     `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><rect x="4" y="26" width="8" height="13" fill="rgba(80,80,105,0.15)" stroke="#4A4A68" stroke-width=".8"/><rect x="14" y="18" width="11" height="21" fill="rgba(80,80,105,0.15)" stroke="#4A4A68" stroke-width=".8"/><rect x="27" y="22" width="8" height="17" fill="rgba(80,80,105,0.15)" stroke="#4A4A68" stroke-width=".8"/><rect x="37" y="25" width="5" height="14" fill="rgba(80,80,105,0.15)" stroke="#4A4A68" stroke-width=".8"/><path d="M3 39L43 39" stroke="#2A2A40" stroke-width=".7"/><rect x="16" y="23" width="3" height="3" fill="#C88A1A" opacity=".5"/><rect x="21" y="23" width="3" height="3" fill="#C88A1A" opacity=".5"/></svg>`
};

// ─── State ────────────────────────────────────────────────────
let API_KEY    = '';
let audioCtx   = null;
let masterGain = null;
let noiseBuffer= null;
let active     = {};
let playing    = false;
let autoMode   = true;
let sel        = new Set(['waves', 'sunrise']);
let moodOpen   = false;

// ─── Audio helpers ────────────────────────────────────────────
function mkN() { const s = audioCtx.createBufferSource(); s.buffer = noiseBuffer; s.loop = true; return s; }
function mkO(t = 'sine', f = 440) { const o = audioCtx.createOscillator(); o.type = t; o.frequency.value = f; return o; }
function mkF(t, f, Q = 1) { const n = audioCtx.createBiquadFilter(); n.type = t; n.frequency.value = f; n.Q.value = Q; return n; }
function mkG(v) { const g = audioCtx.createGain(); g.gain.value = v; return g; }
function ch(...ns) { for (let i = 0; i < ns.length - 1; i++) ns[i].connect(ns[i + 1]); }

function mkPink() {
  const sr = audioCtx.sampleRate, len = sr * 8;
  const buf = audioCtx.createBuffer(1, len, sr);
  const d   = buf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    b0=.99886*b0+w*.0555179; b1=.99332*b1+w*.0750759; b2=.969*b2+w*.153852;
    b3=.8665*b3+w*.310486;   b4=.55*b4+w*.532952;     b5=-.7616*b5-w*.016898;
    d[i] = (b0+b1+b2+b3+b4+b5+b6+w*.5362) * .11;
    b6 = w * .115926;
  }
  return buf;
}

function birds(out, sf, base = 2400, itv = 2000, sp = 2000) {
  function c() {
    if (sf.s) return;
    const now = audioCtx.currentTime;
    const o   = mkO('sine', base + Math.random() * 500);
    const g   = mkG(0);
    const dur = .1 + Math.random() * .15;
    o.frequency.setValueAtTime(base + Math.random() * 300, now);
    o.frequency.linearRampToValueAtTime((base + Math.random() * 300) * 1.3, now + dur * .4);
    o.frequency.linearRampToValueAtTime((base + Math.random() * 200) * 1.1, now + dur);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(.052, now + .03);
    g.gain.exponentialRampToValueAtTime(.001, now + dur + .05);
    o.connect(g); g.connect(out);
    o.start(now); o.stop(now + dur + .1);
    setTimeout(c, itv + Math.random() * sp);
  }
  c();
}

// ─── Sound patches ────────────────────────────────────────────
const patches = {
  rain(out) {
    const n1=mkN(), f1=mkF('bandpass',2000,.4), g1=mkG(.38);
    const n2=mkN(), f2=mkF('lowpass',400),       g2=mkG(.16);
    const n3=mkN(), f3=mkF('highpass',2800),      g3=mkG(.1);
    ch(n1,f1,g1,out); ch(n2,f2,g2,out); ch(n3,f3,g3,out);
    [n1,n2,n3].forEach(n => n.start());
    return () => [n1,n2,n3].forEach(n => n.stop());
  },
  cloud(out) {
    const n=mkN(), f=mkF('lowpass',250),        g=mkG(.09);
    const n2=mkN(),f2=mkF('bandpass',700,.3),   g2=mkG(.03);
    ch(n,f,g,out); ch(n2,f2,g2,out); n.start(); n2.start();
    return () => { n.stop(); n2.stop(); };
  },
  wind(out) {
    const n=mkN(), f=mkF('bandpass',480,.6), g=mkG(.26);
    const lfo=mkO('sine',.07), lg=mkG(190); lfo.connect(lg); lg.connect(f.frequency);
    ch(n,f,g,out); n.start(); lfo.start();
    const n2=mkN(), f2=mkF('bandpass',200,.4), g2=mkG(.12);
    const lfo2=mkO('sine',.13), lg2=mkG(70); lfo2.connect(lg2); lg2.connect(f2.frequency);
    ch(n2,f2,g2,out); n2.start(); lfo2.start();
    return () => { n.stop(); n2.stop(); lfo.stop(); lfo2.stop(); };
  },
  snow(out) {
    const n=mkN(), f=mkF('bandpass',320,.5), g=mkG(.055);
    const lfo=mkO('sine',.04), lg=mkG(.04); lfo.connect(lg); lg.connect(g.gain);
    ch(n,f,g,out); n.start(); lfo.start();
    const sf = { s: false };
    function t() {
      if (sf.s) return;
      const now=audioCtx.currentTime, o=mkO('sine',3800+Math.random()*2200), g2=mkG(0);
      g2.gain.setValueAtTime(0,now); g2.gain.linearRampToValueAtTime(.018,now+.05);
      g2.gain.exponentialRampToValueAtTime(.001,now+.4);
      o.connect(g2); g2.connect(out); o.start(now); o.stop(now+.45);
      setTimeout(t, 700 + Math.random() * 3500);
    }
    t();
    return () => { sf.s = true; n.stop(); lfo.stop(); };
  },
  sunny(out) {
    const sf = { s: false }; birds(out, sf, 2800, 1000, 1400); birds(out, sf, 3400, 1800, 2000);
    const os = [261.6,329.6,392,523.2].map(f => {
      const o=mkO('sine',f), g=mkG(.018); o.connect(g); g.connect(out); o.start(); return o;
    });
    const n=mkN(), f=mkF('lowpass',350), g=mkG(.025); ch(n,f,g,out); n.start();
    return () => { sf.s = true; os.forEach(o => o.stop()); n.stop(); };
  },
  sunrise(out) {
    const sf = { s: false }; birds(out,sf,2700,1200,1600); birds(out,sf,3400,2000,2200);
    const os = [130.8,164.8,196,261.6].map(f => {
      const o=mkO('sine',f), g=mkG(.025); o.connect(g); g.connect(out); o.start(); return o;
    });
    const n=mkN(), f=mkF('lowpass',400), g=mkG(.035); ch(n,f,g,out); n.start();
    return () => { sf.s = true; os.forEach(o => o.stop()); n.stop(); };
  },
  day(out) {
    const sf = { s: false }; birds(out,sf,2900,1600,2000); birds(out,sf,3600,3000,2500);
    const n=mkN(), f=mkF('lowpass',500), g=mkG(.03); ch(n,f,g,out); n.start();
    return () => { sf.s = true; n.stop(); };
  },
  dusk(out) {
    const os = [98,123.5,155.6,196].map(f => {
      const o=mkO('sine',f), g=mkG(.022); o.connect(g); g.connect(out); o.start(); return o;
    });
    const n=mkN(), f=mkF('bandpass',280,.7), g=mkG(.06);
    const lfo=mkO('sine',.055), lg=mkG(.05); lfo.connect(lg); lg.connect(g.gain);
    ch(n,f,g,out); n.start(); lfo.start();
    return () => { os.forEach(o => o.stop()); n.stop(); lfo.stop(); };
  },
  night(out) {
    const os = [3350,3600,3150].map((f, i) => {
      const o=mkO('sine',f), l=mkO('sine',[20,18.5,21.5][i]), lg=mkG(.055), g=mkG(0);
      l.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(out); o.start(); l.start();
      return { o, l };
    });
    const n=mkN(), f=mkF('lowpass',90), g=mkG(.035); ch(n,f,g,out); n.start();
    const owl=mkO('sine',220), ov=mkO('sine',5), ovg=mkG(7), og=mkG(0);
    ov.connect(ovg); ovg.connect(owl.frequency); owl.connect(og); og.connect(out);
    owl.start(); ov.start();
    function ho() {
      const now=audioCtx.currentTime;
      og.gain.setTargetAtTime(.038,now,.25); og.gain.setTargetAtTime(0,now+.7,.18);
      setTimeout(ho, 9000 + Math.random() * 12000);
    }
    ho();
    return () => { os.forEach(({o,l}) => { o.stop(); l.stop(); }); n.stop(); owl.stop(); ov.stop(); };
  },
  forest(out) {
    const sf = { s: false }; birds(out,sf,2500,1400,2000); birds(out,sf,3200,2600,3000);
    const n=mkN(), f=mkF('bandpass',450,.8), g=mkG(.09);
    const lfo=mkO('sine',.16), lg=mkG(.05); lfo.connect(lg); lg.connect(g.gain);
    ch(n,f,g,out); n.start(); lfo.start();
    const n2=mkN(), f2=mkF('lowpass',280), g2=mkG(.05); ch(n2,f2,g2,out); n2.start();
    return () => { sf.s = true; n.stop(); n2.stop(); lfo.stop(); };
  },
  waves(out) {
    function wl(freq,lf,la,gv) {
      const n=mkN(), f=mkF('bandpass',freq,.7), g=mkG(gv);
      const l=mkO('sine',lf), lg=mkG(la); l.connect(lg); lg.connect(g.gain);
      ch(n,f,g,out); n.start(); l.start(); return [n,l];
    }
    const [n1,l1]=wl(380,.12,.22,.26), [n2,l2]=wl(680,.17,.15,.18);
    const n3=mkN(), f3=mkF('lowpass',180), g3=mkG(.09);
    const l3=mkO('sine',.08), lg3=mkG(.07); l3.connect(lg3); lg3.connect(g3.gain);
    ch(n3,f3,g3,out); n3.start(); l3.start();
    return () => [n1,n2,n3,l1,l2,l3].forEach(n => n.stop());
  },
  ocean(out) {
    function wl(freq,lf,la,gv) {
      const n=mkN(), f=mkF('bandpass',freq,.6), g=mkG(gv);
      const l=mkO('sine',lf), lg=mkG(la); l.connect(lg); lg.connect(g.gain);
      ch(n,f,g,out); n.start(); l.start(); return [n,l];
    }
    const [n1,l1]=wl(320,.08,.18,.2), [n2,l2]=wl(550,.13,.12,.16);
    const os = [130.8,164.8,196].map(f => {
      const o=mkO('sine',f), g=mkG(.015); o.connect(g); g.connect(out); o.start(); return o;
    });
    return () => { [n1,n2,l1,l2].forEach(n => n.stop()); os.forEach(o => o.stop()); };
  },
  mountain(out) {
    const n=mkN(), f=mkF('bandpass',380,.5), lfo=mkO('sine',.045), lg=mkG(280), g=mkG(.3);
    lfo.connect(lg); lg.connect(f.frequency); ch(n,f,g,out); n.start(); lfo.start();
    const n2=mkN(), f2=mkF('bandpass',1100,.4), g2=mkG(.22);
    const lfo2=mkO('sine',.1), lg2=mkG(.18); lfo2.connect(lg2); lg2.connect(g2.gain);
    ch(n2,f2,g2,out); n2.start(); lfo2.start();
    const hw=mkO('sine',178), hv=mkO('sine',5.2), hvg=mkG(7), hg=mkG(.025);
    hv.connect(hvg); hvg.connect(hw.frequency); hw.connect(hg); hg.connect(out);
    hw.start(); hv.start();
    return () => { try { [n,n2,lfo,lfo2,hw,hv].forEach(x => x.stop()); } catch(e) {} };
  },
  city(out) {
    const n=mkN(), f=mkF('lowpass',160), g=mkG(.16); ch(n,f,g,out); n.start();
    const sf = { s: false };
    function cp() {
      if (sf.s) return;
      const now=audioCtx.currentTime, cn=audioCtx.createBufferSource();
      cn.buffer = noiseBuffer; cn.loop = true;
      const cf=mkF('bandpass',750+Math.random()*350,1.4), cg=mkG(0);
      cg.gain.setValueAtTime(0,now); cg.gain.linearRampToValueAtTime(.2,now+.55);
      cg.gain.linearRampToValueAtTime(0,now+2.4);
      ch(cn,cf,cg,out); cn.start(now); cn.stop(now+2.7);
      setTimeout(cp, 2800 + Math.random() * 6000);
    }
    cp();
    return () => { sf.s = true; n.stop(); };
  }
};

// ─── Audio engine ─────────────────────────────────────────────
async function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  await audioCtx.resume();
  noiseBuffer = mkPink();
  masterGain  = mkG(.62);
  const comp  = audioCtx.createDynamicsCompressor();
  comp.threshold.value = -18; comp.ratio.value = 4;
  masterGain.connect(comp); comp.connect(audioCtx.destination);
}

async function startActive() {
  await initAudio();
  const cur = autoMode ? AUTO_SET : sel;
  Object.keys(active).forEach(id => {
    if (!cur.has(id)) { try { active[id](); } catch(e) {} delete active[id]; }
  });
  cur.forEach(id => {
    if (!active[id] && patches[id]) active[id] = patches[id](masterGain);
  });
  renderAll(); updateNP();
}

function stopAll() {
  Object.values(active).forEach(s => { try { s(); } catch(e) {} });
  active = {}; renderAll(); updateNP();
}

// ─── UI — playback ────────────────────────────────────────────
async function togglePlay() {
  playing = !playing;
  document.getElementById('pico').innerHTML = playing
    ? '<rect x="3" y="2" width="4" height="14" fill="white"/><rect x="11" y="2" width="4" height="14" fill="white"/>'
    : '<polygon points="4,2 16,9 4,16" fill="white"/>';
  playing ? await startActive() : stopAll();
}

function onAmb(v) {
  document.getElementById('ambV').textContent = Math.round(v) + '%';
  if (masterGain) masterGain.gain.setTargetAtTime(v / 100, audioCtx.currentTime, .05);
}

function onMusic(v) {
  document.getElementById('musV').textContent = Math.round(v) + '%';
}

// ─── UI — auto toggle ─────────────────────────────────────────
function toggleAuto() {
  autoMode = !autoMode;
  document.getElementById('aTrack').className = 'tog-t' + (autoMode ? ' on' : '');
  document.getElementById('aThumb').className = 'tog-h' + (autoMode ? ' on' : '');
  playing ? startActive() : renderAll();
}

// ─── UI — theme selection ─────────────────────────────────────
async function selectTheme(id) {
  if (autoMode) {
    autoMode = false;
    document.getElementById('aTrack').className = 'tog-t';
    document.getElementById('aThumb').className = 'tog-h';
  }
  const cat = CAT_MAP[id];
  if (sel.has(id)) {
    sel.delete(id);
    if (active[id]) { try { active[id](); } catch(e) {} delete active[id]; }
  } else {
    // Remove existing selection in same category
    CATS[cat].forEach(other => {
      if (sel.has(other)) {
        sel.delete(other);
        if (active[other]) { try { active[other](); } catch(e) {} delete active[other]; }
      }
    });
    sel.add(id);
    if (playing) { await initAudio(); if (patches[id]) active[id] = patches[id](masterGain); }
  }
  renderAll(); updateNP();
}

// ─── UI — render ──────────────────────────────────────────────
function renderGrid(containerId, ids) {
  const cur = autoMode ? AUTO_SET : sel;
  document.getElementById(containerId).innerHTML = ids.map(id => {
    const s = cur.has(id), snd = s && playing;
    return `<div class="tile${s?' sel':''}${snd?' snd':''}" onclick="selectTheme('${id}')">
      <div class="tile-ico">${ICONS[id] || ''}</div>
      <div class="tile-lbl">${META[id]}</div>
      <div class="pulse"></div>
    </div>`;
  }).join('');
}

function renderAll() {
  renderGrid('weatherGrid', CATS.weather);
  renderGrid('timeGrid',    CATS.time);
  renderGrid('placeGrid',   CATS.place);
  const cur = autoMode ? AUTO_SET : sel;
  [['weather','wct'], ['time','tct'], ['place','pct']].forEach(([cat, elId]) => {
    const n = CATS[cat].filter(id => cur.has(id)).length;
    document.getElementById(elId).textContent = n ? n + ' active' : '';
  });
}

function updateNP() {
  const cur = autoMode ? AUTO_SET : sel;
  const el  = document.getElementById('npInfo');
  if (!playing || cur.size === 0) {
    el.className = 'np-txt'; el.textContent = '—'; return;
  }
  el.className = 'np-txt live';
  el.textContent = [...cur].map(id => META[id] || id).join(' · ');
}

// ─── UI — mood panel ──────────────────────────────────────────
function toggleMood() {
  moodOpen = !moodOpen;
  document.getElementById('moodPanel').className = 'mood-panel' + (moodOpen ? ' open' : '');
  document.getElementById('moodBtn').style.display = moodOpen ? 'none' : 'flex';
}

function sc(text) {
  document.getElementById('moodText').value = text;
}

// ─── UI — inference ───────────────────────────────────────────
async function infer() {
  const text = document.getElementById('moodText').value.trim();
  if (!text) return;

  if (!API_KEY) {
    const msg = document.getElementById('imsg');
    msg.className = 'imsg show err';
    msg.textContent = 'No API key set. Reload the page to enter your key.';
    return;
  }

  const btn = document.getElementById('ibtn');
  const msg = document.getElementById('imsg');
  btn.disabled = true;
  msg.className = 'imsg show blinking';
  msg.style.color = '#3C5EA0';
  msg.textContent = 'Reading the scene...';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `In-car ambient sound system. Available theme IDs: ${ALL_THEMES.join(', ')}. User description: "${text}". Pick 2-4 matching themes, suggest ambientVol (0-100) and musicVol (0-100). Reply ONLY with JSON, no markdown: {"themes":["id1","id2"],"ambientVol":65,"musicVol":55,"reason":"one sentence"}`
        }]
      })
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const raw    = data.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);

    const newSel = new Set();
    const usedCats = {};
    (parsed.themes || []).filter(id => ALL_THEMES.includes(id)).forEach(id => {
      const cat = CAT_MAP[id];
      if (!usedCats[cat]) { usedCats[cat] = true; newSel.add(id); }
    });
    sel = newSel;
    autoMode = false;
    document.getElementById('aTrack').className = 'tog-t';
    document.getElementById('aThumb').className = 'tog-h';

    if (parsed.ambientVol != null) {
      document.getElementById('ambS').value = parsed.ambientVol;
      onAmb(parsed.ambientVol);
    }
    if (parsed.musicVol != null) {
      document.getElementById('musS').value = parsed.musicVol;
      onMusic(parsed.musicVol);
    }

    msg.className    = 'imsg show';
    msg.style.color  = '#3C5EA0';
    msg.textContent  = parsed.reason || 'Themes applied.';

    playing ? await startActive() : renderAll();

  } catch(e) {
    msg.className   = 'imsg show err';
    msg.textContent = 'Error: ' + (e.message || 'Could not infer themes.');
  }

  btn.disabled = false;
}

// ─── API key overlay ──────────────────────────────────────────
function saveKey() {
  const k = document.getElementById('keyInput').value.trim();
  if (k) API_KEY = k;
  document.getElementById('keyOverlay').style.display = 'none';
}

function skipKey() {
  document.getElementById('keyOverlay').style.display = 'none';
}

// ─── Init ─────────────────────────────────────────────────────
renderAll();

// ─── Driving Scene Animation ──────────────────────────────────
(function() {
  const cv = document.getElementById('driveCanvas');
  if (!cv) return;
  const c = cv.getContext('2d');
  let W, H, fr = 0;
  const WW = 3200;
  const objs = [], lamps = [], pts = [];

  // Generate scenery
  for (let i = 0; i < 30; i++) {
    objs.push({ x: Math.random()*WW, h: 10+Math.random()*14, w: 8+Math.random()*10, v: Math.floor(Math.random()*3), lit: Math.random()>.5 });
  }
  objs.sort((a,b) => a.x - b.x);
  for (let i = 0; i < 16; i++) lamps.push({ x: i*(WW/16) });

  function mtP(seed,n,amp) {
    const p=[]; let s=seed;
    for (let i=0;i<n;i++) { s=(s*16807)%2147483647; p.push(amp*(s/2147483647-0.3)); }
    return p;
  }
  const mt1=mtP(42,80,22), mt2=mtP(137,80,12);

  function resize() {
    const d=window.devicePixelRatio||1;
    W=cv.clientWidth; H=cv.clientHeight;
    cv.width=W*d; cv.height=H*d;
    c.setTransform(d,0,0,d,0,0);
  }

  function wrp(x,off) { return ((x-off)%WW+WW)%WW; }

  function scene() {
    const cur = autoMode ? AUTO_SET : sel;
    let time='day', weather=null, place=null;
    ['sunrise','day','dusk','night'].forEach(t => { if(cur.has(t)) time=t; });
    ['sunny','rain','cloud','wind','snow'].forEach(w => { if(cur.has(w)) weather=w; });
    ['forest','waves','ocean','mountain','city'].forEach(p => { if(cur.has(p)) place=p; });
    return {time,weather,place};
  }

  const SKIES = {
    sunrise: ['#0B0D15','#1A1028','#3A1828','#C85828','#E8A040'],
    day:     ['#0A1830','#1A3858','#2A5878','#4A88A8','#6AA8C0'],
    dusk:    ['#0B0D15','#14102A','#2A1828','#7A3A18','#C87828'],
    night:   ['#040610','#060A14','#080E1A','#0A1220','#0E1828']
  };
  const SUNS = {
    sunrise: {y:.36,r:8,dc:'rgba(255,200,100,0.85)',gc:'rgba(255,160,60,0.5)',gr:55},
    day:     {y:.12,r:9,dc:'rgba(255,250,220,0.9)', gc:'rgba(255,240,180,0.35)',gr:60},
    dusk:    {y:.38,r:7,dc:'rgba(255,215,140,0.85)',gc:'rgba(255,190,80,0.5)',gr:55},
    night:   {y:.2, r:4,dc:'rgba(200,215,240,0.6)', gc:'rgba(150,170,220,0.12)',gr:30}
  };
  // Terrain colors by place
  const TERRAIN = {
    forest:   { band: ['#0E2810','#0A1E0C'], mt: ['#0C200E','#081808'], hill: ['#0A1C0C','#071406'], road: ['#1A1A20','#101014'] },
    waves:    { band: ['#1A3050','#0F1E30'], mt: ['#152030','#0E1820'], hill: ['#0E1820','#0A1418'], road: ['#1A1A24','#111118'] },
    ocean:    { band: ['#122848','#0C1E38'], mt: ['#0E1830','#0A1220'], hill: ['#0C1628','#08101C'], road: ['#181A24','#101118'] },
    mountain: { band: ['#14182A','#0E1220'], mt: ['#1A2038','#121828'], hill: ['#101828','#0C1220'], road: ['#1A1A24','#111118'] },
    city:     { band: ['#101420','#0C1018'], mt: ['#12161E','#0E1218'], hill: ['#0E1218','#0A0E14'], road: ['#1C1C28','#14141C'] }
  };

  // Weather particles
  function updatePts(w) {
    const n = w==='rain'?100 : w==='snow'?60 : 0;
    while(pts.length<n) pts.push({x:Math.random()*W,y:Math.random()*H,s:1+Math.random()*2,d:Math.random()});
    while(pts.length>n) pts.pop();
  }

  function drawWeather(w,hY) {
    if(w==='rain') {
      c.strokeStyle='rgba(140,170,220,0.4)'; c.lineWidth=1;
      pts.forEach(p => {
        c.beginPath(); c.moveTo(p.x,p.y); c.lineTo(p.x-2,p.y+9); c.stroke();
        p.y+=p.s*4.5; p.x-=1.2;
        if(p.y>H){p.y=-10;p.x=Math.random()*W;}
      });
    } else if(w==='snow') {
      c.fillStyle='rgba(220,230,255,0.55)';
      pts.forEach(p => {
        c.beginPath(); c.arc(p.x,p.y,1.3,0,6.28); c.fill();
        p.y+=p.s*0.7; p.x+=Math.sin(fr*0.02+p.d*10)*0.5;
        if(p.y>H){p.y=-5;p.x=Math.random()*W;}
      });
    } else if(w==='wind') {
      c.strokeStyle='rgba(180,190,210,0.15)'; c.lineWidth=0.8;
      for(let i=0;i<10;i++) {
        const wy=H*0.15+(i*31+fr*0.8)%(H*0.75);
        const wx=(i*110+fr*3.5)%(W+120)-60;
        c.beginPath(); c.moveTo(wx,wy); c.lineTo(wx+25+i*3,wy-0.5); c.stroke();
      }
    } else if(w==='cloud') {
      c.fillStyle='rgba(60,70,90,0.3)';
      for(let i=0;i<4;i++) {
        const cx=((i*300+fr*0.3)%(W+200))-100, cy=hY*0.25+i*7;
        c.beginPath(); c.ellipse(cx,cy,45,13,0,0,6.28); c.fill();
        c.beginPath(); c.ellipse(cx+22,cy-7,28,10,0,0,6.28); c.fill();
      }
    } else if(w==='sunny') {
      // Extra sun rays / lens flare effect
      const sx=W*0.73, sy=H*0.18;
      c.save(); c.globalAlpha=0.12;
      for(let i=0;i<8;i++) {
        const a=fr*0.005+i*0.785;
        c.strokeStyle='rgba(255,220,100,0.3)'; c.lineWidth=1.5;
        c.beginPath(); c.moveTo(sx+Math.cos(a)*15,sy+Math.sin(a)*15);
        c.lineTo(sx+Math.cos(a)*(35+Math.sin(fr*0.03+i)*8),sy+Math.sin(a)*(35+Math.sin(fr*0.03+i)*8));
        c.stroke();
      }
      c.restore();
    }
  }

  // BMW car
  function drawCar(cx,cy) {
    const b=Math.sin(fr*0.08)*0.5;
    c.save(); c.translate(cx,cy+b); c.scale(-1,1);
    // Shadow
    c.fillStyle='rgba(0,0,0,0.25)';
    c.beginPath(); c.ellipse(0,4,26,3,0,0,6.28); c.fill();
    // Body
    c.beginPath();
    c.moveTo(-26,0); c.lineTo(-28,-3); c.quadraticCurveTo(-26,-7,-20,-7);
    c.lineTo(-11,-7); c.lineTo(-8,-13); c.quadraticCurveTo(-5,-16,1,-16);
    c.lineTo(11,-16); c.quadraticCurveTo(15,-16,17,-13); c.lineTo(21,-7);
    c.lineTo(26,-7); c.quadraticCurveTo(29,-5,28,-2); c.lineTo(28,0);
    c.closePath();
    c.fillStyle='#1C3A6A'; c.fill();
    c.strokeStyle='rgba(80,130,210,0.25)'; c.lineWidth=0.6; c.stroke();
    // Front window
    c.beginPath();
    c.moveTo(-9,-8); c.lineTo(-6,-14); c.quadraticCurveTo(-4,-15,0,-15);
    c.lineTo(3,-15); c.lineTo(3,-8); c.closePath();
    c.fillStyle='rgba(80,140,220,0.2)'; c.fill();
    // Rear window
    c.beginPath();
    c.moveTo(5,-8); c.lineTo(5,-15); c.lineTo(10,-15);
    c.quadraticCurveTo(13,-15,15,-12); c.lineTo(18,-8); c.closePath();
    c.fillStyle='rgba(80,140,220,0.18)'; c.fill();
    // Wheels
    [[-14,1],[16,1]].forEach(([wx,wy]) => {
      c.beginPath(); c.arc(wx,wy,4.5,0,6.28); c.fillStyle='#0A0A10'; c.fill();
      c.beginPath(); c.arc(wx,wy,3,0,6.28); c.fillStyle='#22222A'; c.fill();
      // Spinning spokes
      for(let s=0;s<5;s++) {
        const a=fr*0.15+s*1.256;
        c.strokeStyle='rgba(160,160,180,0.2)'; c.lineWidth=0.5;
        c.beginPath(); c.moveTo(wx,wy); c.lineTo(wx+Math.cos(a)*2.5,wy+Math.sin(a)*2.5); c.stroke();
      }
    });
    // Headlight beam
    c.fillStyle='rgba(255,230,160,0.08)';
    c.beginPath(); c.moveTo(-28,-4); c.lineTo(-60,-8); c.lineTo(-60,2); c.closePath(); c.fill();
    // Headlight
    c.fillStyle='rgba(255,220,150,0.7)'; c.fillRect(-28,-5,2,2);
    // Tail light
    c.fillStyle='rgba(220,40,40,0.6)'; c.fillRect(27,-5,2,2);
    // BMW grille hint
    c.fillStyle='rgba(0,0,0,0.4)';
    c.fillRect(-27,-5,2,2); c.fillRect(-25,-5,2,2);
    c.restore();
  }

  // Place-specific object drawing
  function drawSceneryObj(x,y,o,place,isNight) {
    const h=o.h, w=o.w;
    if(place==='city') {
      // City buildings - taller, with windows
      const bh=h*1.6, bw=w*1.2;
      c.fillStyle=isNight?'#141824':'#1E2230';
      c.fillRect(x-bw/2,y-bh,bw,bh);
      c.strokeStyle='rgba(255,255,255,0.04)'; c.lineWidth=0.5;
      c.strokeRect(x-bw/2,y-bh,bw,bh);
      // Windows grid
      const wc=o.lit?'rgba(240,200,80,0.55)':'rgba(120,170,240,0.2)';
      const wOff=isNight?'rgba(240,190,80,0.5)':'rgba(120,160,220,0.12)';
      for(let wy=y-bh+3;wy<y-2;wy+=5) {
        for(let wx=x-bw/2+2;wx<x+bw/2-3;wx+=5) {
          c.fillStyle=Math.random()>0.35?wc:wOff;
          c.fillRect(wx,wy,2.5,2.5);
        }
      }
      // Antenna on tall buildings
      if(bh>20) { c.strokeStyle='#3A3A4A'; c.lineWidth=0.8; c.beginPath(); c.moveTo(x,y-bh); c.lineTo(x,y-bh-6); c.stroke(); }
    } else if(place==='forest') {
      // Dense forest trees
      const treeH=h*1.4;
      c.fillStyle='#1A2818'; c.fillRect(x-1.5,y-treeH*0.3,3,treeH*0.3);
      // Layered canopy
      for(let layer=0;layer<3;layer++) {
        const ly=y-treeH+layer*treeH*0.2, lw=4+layer*2.5;
        c.beginPath(); c.moveTo(x,ly); c.lineTo(x-lw,ly+treeH*0.25); c.lineTo(x+lw,ly+treeH*0.25);
        c.closePath(); c.fillStyle=layer===0?'#1E4020':'#2A4828'; c.fill();
      }
    } else if(place==='mountain') {
      // Rocky outcrops and sparse shrubs
      if(o.v%3===0) {
        // Rock
        c.beginPath(); c.moveTo(x-5,y); c.lineTo(x-3,y-h*0.5); c.lineTo(x+1,y-h*0.6);
        c.lineTo(x+4,y-h*0.3); c.lineTo(x+6,y); c.closePath();
        c.fillStyle='#282830'; c.fill();
      } else {
        // Small alpine shrub
        c.beginPath(); c.ellipse(x,y-2,5,3,0,0,6.28);
        c.fillStyle='#1E2C1A'; c.fill();
      }
    } else if(place==='ocean') {
      // Occasional pier post or buoy
      if(o.v%4===0) {
        c.fillStyle='#3A3028'; c.fillRect(x-1,y-12,2.5,12);
        c.fillStyle='#2A2820'; c.fillRect(x-4,y-13,10,2);
      }
    } else {
      // Coastal default - mixed vegetation
      if(o.v%5<2) {
        // Pine
        c.fillStyle='#2A3828'; c.fillRect(x-1,y-h*0.35,2,h*0.35);
        c.beginPath(); c.moveTo(x,y-h); c.lineTo(x-6,y-h*0.2); c.lineTo(x+6,y-h*0.2);
        c.closePath(); c.fillStyle='#2A4828'; c.fill();
      } else if(o.v%5===2) {
        // Cypress
        c.beginPath(); c.moveTo(x,y-h);
        c.quadraticCurveTo(x-3.5,y-h*0.4,x-2.5,y); c.lineTo(x+2.5,y);
        c.quadraticCurveTo(x+3.5,y-h*0.4,x,y-h);
        c.fillStyle='#1E3820'; c.fill();
      } else if(o.v%5===3) {
        // Small building
        c.fillStyle='#1E2230'; c.fillRect(x-w/2,y-h,w,h);
        c.fillStyle=o.lit?'rgba(240,190,80,0.5)':'rgba(120,160,220,0.2)';
        c.fillRect(x-w/4,y-h+3,3,3);
        if(w>10) c.fillRect(x+2,y-h+3,3,3);
      } else {
        // Road sign
        c.fillStyle='#3A3A4A'; c.fillRect(x-0.5,y-16,1.5,16);
        c.fillStyle='#2240A0'; c.fillRect(x-6,y-19,12,8);
        c.fillStyle='rgba(255,255,255,0.2)'; c.fillRect(x-3,y-17,6,4);
      }
    }
  }

  // City skyline (drawn at horizon for city place)
  function drawCitySkyline(hY,rY,isNight) {
    const skyOff=(fr*0.08)%600;
    const rng=[28,18,42,15,35,22,48,20,30,14,38,25,45,16,32,20,40,18,28,35];
    for(let i=0;i<20;i++) {
      const bx=i*52-skyOff;
      if(bx<-60||bx>W+60) continue;
      const bh=rng[i]; const bw=16+i%3*8;
      c.fillStyle=isNight?'#0C1018':'#141822';
      c.fillRect(bx-bw/2,rY-bh,bw,bh+2);
      // Windows
      if(isNight) {
        for(let wy=rY-bh+2;wy<rY-1;wy+=4) {
          for(let wx=bx-bw/2+2;wx<bx+bw/2-2;wx+=4) {
            c.fillStyle=Math.random()>0.4?'rgba(240,200,80,0.35)':'rgba(80,120,180,0.08)';
            c.fillRect(wx,wy,2,2);
          }
        }
      }
    }
  }

  // Ocean waves
  function drawOceanWaves(hY,rY,isNight) {
    c.save();
    const waveCol=isNight?'rgba(40,80,140,0.2)':'rgba(60,120,180,0.15)';
    c.strokeStyle=waveCol; c.lineWidth=1;
    for(let row=0;row<4;row++) {
      const wy=hY+4+row*(rY-hY)/4;
      const wOff=fr*(0.4+row*0.15);
      c.beginPath();
      for(let x=0;x<W;x+=3) {
        const yy=wy+Math.sin((x+wOff)*0.04)*2+Math.sin((x+wOff*0.7)*0.07)*1.5;
        x===0?c.moveTo(x,yy):c.lineTo(x,yy);
      }
      c.stroke();
    }
    c.restore();
  }

  function draw() {
    c.clearRect(0,0,W,H);
    const sc = scene();
    const hY=H*0.38, rY=H*0.52;
    updatePts(sc.weather);

    // Sky
    const skyC = SKIES[sc.time]||SKIES.day;
    const sky = c.createLinearGradient(0,0,0,hY+8);
    [0,0.25,0.5,0.8,1].forEach((s,i) => sky.addColorStop(s,skyC[i]));
    c.fillStyle=sky; c.fillRect(0,0,W,hY+8);

    // Stars (brighter at night/dusk)
    const starA = sc.time==='night'?0.5 : sc.time==='dusk'?0.25 : sc.time==='sunrise'?0.15 : 0.05;
    c.fillStyle=`rgba(255,255,255,${starA})`;
    [[.08,.1],[.22,.18],[.42,.07],[.58,.14],[.78,.2],[.92,.08],[.35,.12],[.65,.06]].forEach(([px,py]) => {
      c.beginPath(); c.arc(W*px,H*py,0.8,0,6.28); c.fill();
    });

    // Moon for night
    if(sc.time==='night') {
      const mx=W*0.78, my=H*0.15;
      const mg=c.createRadialGradient(mx,my,0,mx,my,25);
      mg.addColorStop(0,'rgba(200,215,240,0.15)'); mg.addColorStop(1,'transparent');
      c.fillStyle=mg; c.beginPath(); c.arc(mx,my,25,0,6.28); c.fill();
      c.beginPath(); c.arc(mx,my,5,0,6.28);
      c.fillStyle='rgba(200,215,240,0.6)'; c.fill();
    }

    // Sun (not at night)
    if(sc.time!=='night') {
      const sn=SUNS[sc.time], sx=W*0.73, sy=hY*sn.y/0.38;
      const gl=c.createRadialGradient(sx,sy,0,sx,sy,sn.gr);
      gl.addColorStop(0,sn.gc); gl.addColorStop(0.35,'rgba(255,140,50,0.08)'); gl.addColorStop(1,'transparent');
      c.fillStyle=gl; c.fillRect(sx-sn.gr,sy-sn.gr,sn.gr*2,sn.gr+5);
      c.beginPath(); c.arc(sx,sy,sn.r,0,6.28); c.fillStyle=sn.dc; c.fill();
    }

    // Terrain band - changes per place
    const pl = sc.place||'waves';
    const tr = TERRAIN[pl]||TERRAIN.waves;
    const isNight = sc.time==='night';
    const og=c.createLinearGradient(0,hY,0,rY);
    og.addColorStop(0,isNight?'#080E18':tr.band[0]);
    og.addColorStop(1,isNight?'#060A10':tr.band[1]);
    c.fillStyle=og; c.fillRect(0,hY,W,rY-hY);

    // Place-specific mid-ground
    if(pl==='ocean') {
      drawOceanWaves(hY,rY,isNight);
      // Sun/moon reflection on water
      c.save(); c.globalAlpha=isNight?0.06:0.12;
      c.strokeStyle=isNight?'#4A6080':'#C89040'; c.lineWidth=0.7;
      for(let i=0;i<14;i++) {
        const wy=hY+2+(i%5)*((rY-hY)/5), wx=W*0.7+Math.sin(fr*0.03+i*1.2)*8, ww=22-i;
        if(ww>2){c.beginPath();c.moveTo(wx-ww/2,wy);c.lineTo(wx+ww/2,wy);c.stroke();}
      }
      c.restore();
    } else if(pl==='waves') {
      // Coastal water shimmer
      c.save(); c.globalAlpha=isNight?0.05:0.1;
      c.strokeStyle=isNight?'#4A6080':'#C89040'; c.lineWidth=0.6;
      for(let i=0;i<10;i++) {
        const wy=hY+3+(i%4)*4, wx=W*0.7-15+Math.sin(fr*0.04+i*1.5)*6, ww=18-i*1.5;
        if(ww>2){c.beginPath();c.moveTo(wx-ww/2,wy);c.lineTo(wx+ww/2,wy);c.stroke();}
      }
      c.restore();
    } else if(pl==='city') {
      drawCitySkyline(hY,rY,isNight);
    } else if(pl==='forest') {
      // Dense treeline at horizon
      const tlOff=(fr*0.2)%200;
      c.fillStyle=isNight?'#06120A':'#0E2210';
      for(let i=0;i<40;i++) {
        const tx=i*28-tlOff, th=6+Math.sin(i*2.3)*3+Math.cos(i*1.7)*2;
        c.beginPath(); c.moveTo(tx,hY+2); c.lineTo(tx-4,hY+2);
        c.lineTo(tx-2,hY-th); c.lineTo(tx,hY+2); c.fill();
        c.beginPath(); c.moveTo(tx+6,hY+2); c.lineTo(tx+2,hY+2);
        c.lineTo(tx+4,hY-th*0.8); c.lineTo(tx+6,hY+2); c.fill();
      }
    }

    // Mountains - vary amplitude by place
    const mtAmp = pl==='mountain'?2.2 : pl==='city'?0 : pl==='ocean'?0.4 : pl==='forest'?0.6 : 1;
    if(mtAmp>0) {
      const mOff=(fr*0.12)%300;
      c.beginPath(); c.moveTo(-10,hY+4);
      const mS=(W+320)/mt1.length;
      for(let i=0;i<mt1.length;i++) c.lineTo(i*mS-mOff%mS-10,hY-mt1[i]*mtAmp);
      c.lineTo(W+10,hY+4); c.closePath();
      c.fillStyle=isNight?tr.mt[1]:tr.mt[0]; c.fill();
      // Snow caps for mountain
      if(pl==='mountain') {
        c.save(); c.globalAlpha=0.35;
        const mOff2=(fr*0.12)%300;
        for(let i=0;i<mt1.length;i++) {
          const px=i*mS-mOff2%mS-10, py=hY-mt1[i]*mtAmp;
          if(mt1[i]*mtAmp>12) {
            c.fillStyle='rgba(200,210,230,0.4)';
            c.beginPath(); c.moveTo(px,py); c.lineTo(px-3,py+5); c.lineTo(px+3,py+5); c.closePath(); c.fill();
          }
        }
        c.restore();
      }
    }

    // Near hills
    const hillAmp = pl==='city'?0 : pl==='mountain'?1.5 : pl==='forest'?1.2 : pl==='ocean'?0.3 : 1;
    if(hillAmp>0) {
      const hOff=(fr*0.35)%250;
      c.beginPath(); c.moveTo(-10,rY+2);
      const hS=(W+300)/mt2.length;
      for(let i=0;i<mt2.length;i++) c.lineTo(i*hS-hOff%hS-10,rY-mt2[i]*hillAmp-2);
      c.lineTo(W+10,rY+2); c.closePath();
      c.fillStyle=isNight?tr.hill[1]:tr.hill[0]; c.fill();
    }

    // Road
    const rg=c.createLinearGradient(0,rY,0,H);
    rg.addColorStop(0,isNight?'#101018':tr.road[0]);
    rg.addColorStop(1,isNight?'#0A0A10':tr.road[1]);
    c.fillStyle=rg; c.fillRect(0,rY,W,H-rY);

    // City: highway guardrail
    if(pl==='city') {
      c.strokeStyle='rgba(255,255,255,0.06)'; c.lineWidth=1;
      c.beginPath(); c.moveTo(0,rY+2); c.lineTo(W,rY+2); c.stroke();
      // Guardrail posts
      const grOff=(fr*2.8)%80;
      c.strokeStyle='rgba(255,255,255,0.08)'; c.lineWidth=1;
      for(let x=-grOff;x<W+10;x+=80) {
        c.beginPath(); c.moveTo(x,rY); c.lineTo(x,rY+6); c.stroke();
      }
    }

    // Road edge
    c.strokeStyle='rgba(255,255,255,0.07)'; c.lineWidth=1;
    c.beginPath(); c.moveTo(0,rY); c.lineTo(W,rY); c.stroke();

    // Center dashes
    const dY=rY+(H-rY)*0.38, dOff=(fr*2.8)%55;
    c.strokeStyle='rgba(255,255,255,0.13)'; c.lineWidth=1.5;
    for(let x=-dOff;x<W+30;x+=55){c.beginPath();c.moveTo(x,dY);c.lineTo(x+28,dY);c.stroke();}

    // Scenery objects
    const fOff=(fr*1.4)%WW;
    const objSpacing = pl==='forest'?0.7 : pl==='city'?0.5 : 1;
    objs.forEach(o => {
      const x=wrp(o.x*objSpacing,fOff*objSpacing);
      if(x>W+40) return;
      drawSceneryObj(x,rY,o,pl,isNight);
    });

    // Lamp posts (more in city, fewer in forest/mountain)
    const lOff=(fr*2.8)%WW;
    const lampGlow = isNight?0.45 : sc.time==='dusk'?0.35 : 0.2;
    const showLamps = pl==='ocean' ? false : true;
    if(showLamps) {
      const lampArr = pl==='city' ? [...lamps,...lamps.map(l=>({x:l.x+WW/32}))] : lamps;
      lampArr.forEach(l => {
        const x=wrp(l.x,lOff);
        if(x>W+20) return;
        const py=rY+(H-rY)*0.18;
        c.strokeStyle=pl==='city'?'#4A4A5A':'#3A3A50'; c.lineWidth=1.5;
        c.beginPath(); c.moveTo(x,py); c.lineTo(x,py-18); c.lineTo(x+6,py-20); c.stroke();
        const lg=c.createRadialGradient(x+6,py-20,0,x+6,py-20,14);
        lg.addColorStop(0,`rgba(255,200,100,${lampGlow})`); lg.addColorStop(1,'transparent');
        c.fillStyle=lg; c.beginPath(); c.arc(x+5,py-18,12,0,6.28); c.fill();
      });
    }

    // BMW car
    const carX=W*0.28, carY=rY+(H-rY)*0.55;
    drawCar(carX,carY);

    // Weather overlay
    drawWeather(sc.weather,hY);

    // Vignette
    const vg=c.createLinearGradient(0,0,0,H);
    vg.addColorStop(0,'rgba(7,8,14,0.3)'); vg.addColorStop(0.3,'transparent');
    vg.addColorStop(0.7,'transparent'); vg.addColorStop(1,'rgba(7,8,14,0.5)');
    c.fillStyle=vg; c.fillRect(0,0,W,H);

    fr++;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize',resize);
  draw();
})();


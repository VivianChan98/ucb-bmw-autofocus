// ─── Data ─────────────────────────────────────────────────────
const CATS = {
  weather: ['rain', 'cloud', 'wind', 'snow', 'rainbow'],
  time:    ['sunrise', 'day', 'dusk', 'night'],
  place:   ['forest', 'waves', 'ocean', 'mountain', 'city']
};
const ALL_THEMES = [...CATS.weather, ...CATS.time, ...CATS.place];
const AUTO_SET   = new Set(['waves', 'day', 'sunrise']);

const META = {
  rain: 'Rain',     cloud: 'Overcast', wind: 'Wind',     snow: 'Snow',
  rainbow: 'Rainbow', sunrise: 'Sunrise', day: 'Daytime', dusk: 'Dusk',
  night: 'Night',   forest: 'Forest',  waves: 'Coastal', ocean: 'Ocean',
  mountain: 'Mountain', city: 'City'
};

const ICONS = {
  rain:     `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M10 26Q14 19 22 19Q30 19 34 26" fill="rgba(100,140,200,0.12)" stroke="#4A72A8" stroke-width=".9"/><path d="M15 33L14 38M22 33L21 38M29 33L28 38" stroke="#3A62A0" stroke-width="1.2" stroke-linecap="round"/><path d="M10 26Q8 20 13 17Q13 11 18 11Q19 7 24 7Q32 7 32 17Q37 18 36 26" fill="rgba(100,140,200,0.08)" stroke="#4A72A8" stroke-width=".9"/></svg>`,
  cloud:    `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M12 31Q8 31 8 26Q8 21 12 19Q12 13 18 13Q22 13 24 16Q28 14 32 18Q37 18 37 24Q37 28 33 28L12 31" fill="rgba(80,90,110,0.12)" stroke="#4A4A60" stroke-width=".9"/></svg>`,
  wind:     `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M8 17Q17 16 26 17Q31 17.5 33 16Q34 13 32 12.5Q30 12 29.5 14" fill="none" stroke="#6A6A88" stroke-width="1.2" stroke-linecap="round"/><path d="M8 22Q19 21 28 22Q34 22.5 36 21Q38 19 36 18.5Q34 18 33.5 19.5" fill="none" stroke="#6A6A88" stroke-width="1.2" stroke-linecap="round"/><path d="M8 27Q14 26 22 27Q26 27.5 28 29Q29 31 27 33" fill="none" stroke="#6A6A88" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  snow:     `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M22 9L22 35M9 22L35 22M14 14L30 30M30 14L14 30" stroke="rgba(160,200,255,0.4)" stroke-width="1.1" stroke-linecap="round"/><circle cx="22" cy="22" r="3.5" fill="rgba(160,200,255,0.25)" stroke="#88AADD" stroke-width=".9"/><circle cx="14" cy="14" r="2" fill="rgba(160,200,255,0.15)" stroke="#88AADD" stroke-width=".7"/><circle cx="30" cy="30" r="2" fill="rgba(160,200,255,0.15)" stroke="#88AADD" stroke-width=".7"/><circle cx="30" cy="14" r="2" fill="rgba(160,200,255,0.15)" stroke="#88AADD" stroke-width=".7"/><circle cx="14" cy="30" r="2" fill="rgba(160,200,255,0.15)" stroke="#88AADD" stroke-width=".7"/></svg>`,
  rainbow:  `<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M6 34A16 16 0 0 1 38 34" stroke="#C84040" stroke-width="1.3" fill="none"/><path d="M9.5 34A12.5 12.5 0 0 1 34.5 34" stroke="#D47820" stroke-width="1.3" fill="none"/><path d="M13 34A9 9 0 0 1 31 34" stroke="#88B830" stroke-width="1.3" fill="none"/><path d="M16.5 34A5.5 5.5 0 0 1 27.5 34" stroke="#3878C8" stroke-width="1.3" fill="none"/></svg>`,
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
let sel        = new Set(['waves', 'day', 'sunrise']);
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
  rainbow(out) {
    const os = [261.6,329.6,392,523.2,659.3].map(f => {
      const o=mkO('sine',f), g=mkG(.02); o.connect(g); g.connect(out); o.start(); return o;
    });
    const sf = { s: false }; birds(out, sf, 3000, 2500, 2000);
    return () => { sf.s = true; os.forEach(o => o.stop()); };
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
  if (sel.has(id)) {
    sel.delete(id);
    if (active[id]) { try { active[id](); } catch(e) {} delete active[id]; }
  } else {
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

    sel = new Set((parsed.themes || []).filter(id => ALL_THEMES.includes(id)));
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

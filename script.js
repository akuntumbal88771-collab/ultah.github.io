/* =============================================
   BIRTHDAY BUCIN — SCRIPT.JS
   Modern Redesign
   ============================================= */

'use strict';

// ─── STATE ──────────────────────────────────
let currentScreen = 0;
let musicPlaying  = false;
let audioCtx      = null;
let musicNodes    = {};
let lilinDitiup   = false;

const reasons = [
  { icon:'💖', text:'Senyummu bikin dunia lebih cerah' },
  { icon:'🌸', text:'Kamu sabar banget sama aku' },
  { icon:'⭐', text:'Matamu indah banget' },
  { icon:'🥰', text:'Cara kamu ketawa itu lucu' },
  { icon:'🍓', text:'Kamu mau nerima aku apa adanya' },
  { icon:'🌙', text:'Kamu selalu ada buat aku' },
  { icon:'💫', text:'Kamu tulus & jujur sama aku' },
  { icon:'🎀', text:'Setiap momen sama kamu itu berharga' },
  { icon:'🌹', text:'Kamu cintaku yang sesungguhnya' },
];

// ─── INIT ───────────────────────────────────
window.addEventListener('load', () => {
  initParticles();
  initFloatingHearts();
  buildReasonGrid();
  showScreen('intro-screen');
  document.addEventListener('click', handleSparkle);
});

// ─── SCREEN NAVIGATION ──────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active','exit'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function goToScreen(n) {
  const current = document.querySelector('.screen.active');
  if (current) current.classList.add('exit');
  setTimeout(() => {
    current && current.classList.remove('active','exit');
    showScreen('screen-' + n);
    currentScreen = n;
    if (n === 1) startTyping('Happy Birthday,\nSayangku! 🎂', 'typing-title');
    if (n === 4) setTimeout(() => launchConfetti(90), 200);
  }, 420);
}

// ─── OPEN ENVELOPE ──────────────────────────
function openEnvelope() {
  const flap    = document.getElementById('env-flap');
  const letter  = document.getElementById('env-letter');
  const wrapper = document.getElementById('envelope-wrapper');
  wrapper.style.pointerEvents = 'none';

  flap.classList.add('open');
  letter.style.transform = 'translateY(-60px) scale(0.8)';
  letter.style.opacity   = '0';

  setTimeout(() => {
    const curr = document.getElementById('intro-screen');
    curr.classList.add('exit');
    setTimeout(() => {
      curr.classList.remove('active','exit');
      showScreen('screen-1');
      currentScreen = 1;
      startTyping('Happy Birthday,\nSayangku! 🎂', 'typing-title');
    }, 420);
  }, 750);
}

// ─── TYPING EFFECT ───────────────────────────
function startTyping(text, elId) {
  const el = document.getElementById(elId);
  el.innerHTML = '';
  const lines = text.split('\n');
  let lineIdx = 0, charIdx = 0;

  function typeNext() {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      el.innerHTML = lines.slice(0,lineIdx).join('<br/>') + (lineIdx > 0 ? '<br/>' : '') + line.slice(0, charIdx+1);
      charIdx++;
      setTimeout(typeNext, 55);
    } else {
      lineIdx++; charIdx = 0;
      setTimeout(typeNext, 120);
    }
  }
  typeNext();
}

// ─── TIUP LILIN ──────────────────────────────
function tiupLilin() {
  if (lilinDitiup) return;
  lilinDitiup = true;

  const btn  = document.getElementById('btn-tiup');
  const wish = document.getElementById('wish-bubble');
  const flames = document.querySelectorAll('.flame-g');

  btn.disabled = true;
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 3c-5 2-6 8-6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 12h1m8-9v1M6.2 6.2l.7.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Fuuuh...`;

  flames.forEach((f, i) => {
    setTimeout(() => {
      f.classList.add('blown');
      playBlowSound(i);
    }, i * 150);
  });

  setTimeout(() => {
    wish.classList.remove('hidden');
    launchConfetti(60);
    playWishSound();
  }, flames.length * 150 + 300);
}

// ─── CARD FLIP ───────────────────────────────
function flipCard(card) {
  card.classList.toggle('flipped');
  playFlipSound();
}

// ─── REASON GRID ─────────────────────────────
function buildReasonGrid() {
  const grid = document.getElementById('reasons-grid');
  grid.innerHTML = '';
  reasons.forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'reason-heart';
    div.innerHTML = `<span class="r-icon">${r.icon}</span><div class="reason-text">${r.text}</div>`;
    div.addEventListener('click', () => {
      if (div.classList.contains('revealed')) return;
      div.classList.add('revealed');
      div.style.animation = 'popIn .4s ease';
      playRevealSound();
    });
    grid.appendChild(div);
  });
}

// ─── BURST HEART ─────────────────────────────
function burstHeart() {
  launchConfetti(70);
  playHeartSound();
  for (let i = 0; i < 14; i++) {
    setTimeout(() => spawnHeart(), i * 60);
  }
}

function spawnHeart() {
  const fh = document.getElementById('floating-hearts');
  const el = document.createElement('div');
  el.className = 'floating-heart';
  el.textContent = ['💖','💕','💗','💓','💝','🌸','⭐'][Math.floor(Math.random()*7)];
  el.style.left      = Math.random() * 100 + 'vw';
  el.style.fontSize  = (12 + Math.random() * 22) + 'px';
  const dur = 3 + Math.random() * 3;
  el.style.animationDuration = dur + 's';
  fh.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}

// ─── RESTART ─────────────────────────────────
function restartAll() {
  lilinDitiup = false;

  const btn = document.getElementById('btn-tiup');
  btn.disabled = false;
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12c0-1.5 1-2.5 2.5-2.5S8 10.5 8 12c0 3-5 6-5 6s-5-3-5-6" stroke="currentColor" stroke-width="2"/><path d="M21 3l-9 9M12 12l-3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Tiup Lilin!`;

  document.getElementById('wish-bubble').classList.add('hidden');
  document.querySelectorAll('.flame-g').forEach(f => f.classList.remove('blown'));
  document.querySelectorAll('.msg-card').forEach(c => c.classList.remove('flipped'));
  document.getElementById('typing-title').innerHTML = '';
  buildReasonGrid();

  // Reset envelope
  const flap   = document.getElementById('env-flap');
  const letter = document.getElementById('env-letter');
  const wrap   = document.getElementById('envelope-wrapper');
  flap.classList.remove('open');
  letter.style.transform = '';
  letter.style.opacity   = '';
  wrap.style.pointerEvents = '';

  // Go to intro
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active','exit'));
  showScreen('intro-screen');
  currentScreen = 0;
}

// ─── CONFETTI ────────────────────────────────
function launchConfetti(count) {
  const container = document.getElementById('confetti-container');
  const colors = ['#ff2d78','#e91e8c','#f48fb1','#ffd700','#ffffff','#c2185b','#ff80ab','#9c27b0'];
  const emojis = ['💖','🌸','⭐','🎉','✨','💕','🎀'];

  for (let i = 0; i < count; i++) {
    const isEmoji = Math.random() < 0.28;
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    if (isEmoji) {
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      el.style.fontSize = (12 + Math.random()*16) + 'px';
    } else {
      const w = 5 + Math.random()*9;
      el.style.width  = w + 'px';
      el.style.height = (w*0.5 + Math.random()*8) + 'px';
      el.style.background = colors[Math.floor(Math.random()*colors.length)];
    }
    el.style.left  = Math.random()*100 + 'vw';
    const dur = 2.2 + Math.random()*2.8;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay    = Math.random()*0.7 + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur+1)*1000);
  }
}

// ─── FLOATING HEARTS (ambient) ───────────────
function initFloatingHearts() {
  setInterval(spawnHeart, 3000);
}

// ─── SPARKLE ON CLICK ────────────────────────
function handleSparkle(e) {
  const skip = e.target.closest('button,.msg-card,.reason-heart,#envelope-wrapper,#big-heart,.music-btn');
  if (skip) return;
  const icons = ['✨','💖','🌸','⭐','💫','🎀','💕'];
  const el = document.createElement('div');
  el.className = 'sparkle';
  el.textContent = icons[Math.floor(Math.random()*icons.length)];
  el.style.left = (e.clientX - 10) + 'px';
  el.style.top  = (e.clientY - 10) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 850);
}

// ─── PARTICLE CANVAS ─────────────────────────
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x     = Math.random() * canvas.width;
      this.y     = canvas.height + 20;
      this.r     = 1.5 + Math.random() * 3;
      this.vy    = -(0.3 + Math.random() * 0.7);
      this.vx    = (Math.random() - 0.5) * 0.25;
      this.alpha = 0.3 + Math.random() * 0.4;
      this.color = ['#ff2d78','#f48fb1','#e91e8c','#ff80ab','#fce4ec'][Math.floor(Math.random()*5)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -20) this.init();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({length:55}, () => {
    const p = new Particle();
    p.y = Math.random() * canvas.height;
    return p;
  });

  ;(function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
}

// ─── WEB AUDIO — BIRTHDAY MELODY ─────────────
function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  buildMusicGraph();
}

function buildMusicGraph() {
  const ctx = audioCtx;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.15, ctx.currentTime);
  master.connect(ctx.destination);

  // Reverb
  const reverb  = ctx.createConvolver();
  const revLen  = ctx.sampleRate * 2;
  const revBuf  = ctx.createBuffer(2, revLen, ctx.sampleRate);
  for (let ch=0; ch<2; ch++) {
    const d = revBuf.getChannelData(ch);
    for (let i=0; i<revLen; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/revLen,3);
  }
  reverb.buffer = revBuf;
  reverb.connect(master);

  musicNodes = { master, reverb };
}

/* Happy Birthday melody in C — [freq, dur, delay] */
const MELODY = [
  [261.63,0.35,0],[261.63,0.18,0.40],[293.66,0.50,0.62],[261.63,0.50,1.16],
  [349.23,0.50,1.70],[329.63,1.00,2.24],[261.63,0.35,3.40],[261.63,0.18,3.80],
  [293.66,0.50,4.02],[261.63,0.50,4.56],[392.00,0.50,5.10],[349.23,1.00,5.64],
  [261.63,0.35,6.80],[261.63,0.18,7.20],[523.25,0.50,7.42],[440.00,0.50,7.96],
  [349.23,0.35,8.50],[329.63,0.35,8.88],[293.66,0.35,9.26],[466.16,0.50,9.64],
  [440.00,1.00,10.18],[349.23,0.35,11.35],[349.23,0.18,11.75],[440.00,0.50,11.97],
  [349.23,0.50,12.51],[329.63,0.50,13.05],[261.63,1.20,13.59],
];
const BASS = [
  [65.41,1.7,0],[87.31,1.7,1.7],[65.41,1.7,3.4],[98.00,1.7,5.1],
  [65.41,1.7,6.8],[87.31,1.7,8.5],[65.41,1.7,10.2],[87.31,1.7,11.9],[65.41,1.7,13.6],
];
const SONG_DUR = 15.2;

function scheduleMelody() {
  if (!musicPlaying) return;
  const ctx = audioCtx;
  const now = ctx.currentTime;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.55, now);
  gain.connect(musicNodes.master);
  gain.connect(musicNodes.reverb);
  musicNodes.melGain = gain;

  // Melody
  MELODY.forEach(([freq,dur,del]) => {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now+del);
    g.gain.setValueAtTime(0, now+del);
    g.gain.linearRampToValueAtTime(0.6, now+del+0.06);
    g.gain.setValueAtTime(0.5, now+del+dur-0.06);
    g.gain.linearRampToValueAtTime(0, now+del+dur);
    osc.connect(g); g.connect(gain);
    osc.start(now+del); osc.stop(now+del+dur+0.1);
  });

  // Bass
  const bassGain = ctx.createGain();
  bassGain.gain.setValueAtTime(0.28, now);
  bassGain.connect(musicNodes.master);
  BASS.forEach(([freq,dur,del]) => {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now+del);
    g.gain.setValueAtTime(0, now+del);
    g.gain.linearRampToValueAtTime(0.4, now+del+0.12);
    g.gain.setValueAtTime(0.3, now+del+dur-0.1);
    g.gain.linearRampToValueAtTime(0, now+del+dur);
    osc.connect(g); g.connect(bassGain);
    osc.start(now+del); osc.stop(now+del+dur+0.1);
  });

  musicNodes.loopTimeout = setTimeout(() => {
    if (musicPlaying) scheduleMelody();
  }, SONG_DUR * 1000);
}

function toggleMusic() {
  const disc  = document.getElementById('music-disc');
  const label = document.getElementById('music-label');

  if (!musicPlaying) {
    musicPlaying = true;
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    disc.classList.add('playing');
    label.textContent = 'Pause';
    scheduleMelody();
  } else {
    musicPlaying = false;
    disc.classList.remove('playing');
    label.textContent = 'Musik';
    clearTimeout(musicNodes.loopTimeout);
    if (musicNodes.melGain) {
      musicNodes.melGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime+0.5);
    }
  }
}

// ─── SFX ─────────────────────────────────────
function ensureCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return false; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return true;
}
function tone(freq, dur=0.15, type='sine', vol=0.28) {
  if (!ensureCtx()) return;
  const osc = audioCtx.createOscillator();
  const g   = audioCtx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  g.gain.setValueAtTime(vol, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+dur);
  osc.connect(g); g.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime+dur);
}
function playFlipSound()   { tone(660,.1,'sine',.2); setTimeout(()=>tone(880,.1,'sine',.15),75); }
function playRevealSound() { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.15,'sine',.22),i*55)); }
function playBlowSound(i)  { tone(2500-i*100,.18,'sawtooth',.04); }
function playWishSound()   { [523,587,659,698,784,880,988,1047].forEach((f,i)=>setTimeout(()=>tone(f,.25,'sine',.28),i*95)); }
function playHeartSound()  { tone(523,.2,'sine',.38); setTimeout(()=>tone(659,.3,'sine',.3),140); setTimeout(()=>tone(784,.4,'sine',.25),280); }

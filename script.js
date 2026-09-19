/* ===================================================
   LAÇYN 25 ÝAŞ - INTERACTIVE 3D SCRIPT ENGINE
   3D Tilt Physics, Smooth Particle System, Web Audio,
   Number Counters, Candle Blowing, Grand Gift Try-on
   =================================================== */

// Sound Engine using Web Audio API (Zero external assets, 100% reliable)
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.musicTimeout = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.5, volume = 0.22) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playPop() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playBlow() {
    this.init();
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();

    setTimeout(() => {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.9, 0.22), idx * 95);
      });
    }, 180);
  }

  playGiftOpen() {
    this.init();
    const notes = [392, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.8, 0.2), idx * 80);
    });
  }

  startBirthdayMelody() {
    this.init();
    this.isPlayingMusic = true;

    // "Happy Birthday to you, Happy Birthday dear Laçyn"
    const melody = [
      { note: 261.63, dur: 350 }, // Hap-
      { note: 261.63, dur: 250 }, // py
      { note: 293.66, dur: 600 }, // birth-
      { note: 261.63, dur: 600 }, // day
      { note: 349.23, dur: 600 }, // to
      { note: 329.63, dur: 1100 }, // you

      { note: 261.63, dur: 350 },
      { note: 261.63, dur: 250 },
      { note: 293.66, dur: 600 },
      { note: 261.63, dur: 600 },
      { note: 392.00, dur: 600 },
      { note: 349.23, dur: 1100 },

      { note: 261.63, dur: 350 },
      { note: 261.63, dur: 250 },
      { note: 523.25, dur: 600 },
      { note: 440.00, dur: 600 },
      { note: 349.23, dur: 600 }, // dear
      { note: 329.63, dur: 600 }, // La-
      { note: 293.66, dur: 900 }, // çyn

      { note: 466.16, dur: 350 },
      { note: 466.16, dur: 250 },
      { note: 440.00, dur: 600 },
      { note: 349.23, dur: 600 },
      { note: 392.00, dur: 600 },
      { note: 349.23, dur: 1400 }
    ];

    let noteIdx = 0;
    const playStep = () => {
      if (!this.isPlayingMusic) return;
      const current = melody[noteIdx];
      this.playTone(current.note, 'triangle', (current.dur / 1000) * 0.95, 0.22);
      this.playTone(current.note / 2, 'sine', (current.dur / 1000) * 0.9, 0.12);

      noteIdx = (noteIdx + 1) % melody.length;
      this.musicTimeout = setTimeout(playStep, current.dur);
    };

    playStep();
  }

  stopBirthdayMelody() {
    this.isPlayingMusic = false;
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  playBirthdaySong() {
    const audio = document.getElementById('birthdaySong');
    if (!audio) return;
    this.stopBirthdayMelody();
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlayingMusic = true;
        document.body.classList.add('music-playing');
        const musicLabel = document.getElementById('musicBtnLabel');
        if (musicLabel) musicLabel.textContent = 'Aýdymy Sakla';
      }).catch((err) => {
        console.warn("Song play failed, fallback to synth melody:", err);
        this.startBirthdayMelody();
        document.body.classList.add('music-playing');
        const musicLabel = document.getElementById('musicBtnLabel');
        if (musicLabel) musicLabel.textContent = 'Aýdymy Sakla';
      });
    }
  }

  stopBirthdaySong() {
    const audio = document.getElementById('birthdaySong');
    if (audio) {
      audio.pause();
    }
    this.stopBirthdayMelody();
    this.isPlayingMusic = false;
    document.body.classList.remove('music-playing');
    const musicLabel = document.getElementById('musicBtnLabel');
    if (musicLabel) musicLabel.textContent = 'Aýdymy Başlat';
  }
}

const sounds = new SoundEngine();

/* ===================================================
   CANVAS PARTICLES & FIREWORKS ENGINE
   =================================================== */
class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.rockets = [];
    this.stars = [];
    this.petals = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initBackgroundElements();
    this.loop();

    // Occasional gentle background fireworks
    setInterval(() => {
      if (Math.random() > 0.35) {
        this.launchRocket(
          Math.random() * this.canvas.width,
          this.canvas.height,
          Math.random() * this.canvas.width * 0.8 + this.canvas.width * 0.1,
          Math.random() * this.canvas.height * 0.45 + 90
        );
      }
    }, 2200);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initBackgroundElements() {
    this.stars = [];
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.008
      });
    }

    // Soft floating golden petals
    this.petals = [];
    for (let i = 0; i < 20; i++) {
      this.petals.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 6 + 4,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: Math.random() * 0.5 - 0.25,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        color: Math.random() > 0.5 ? 'rgba(246, 200, 81, 0.45)' : 'rgba(255, 77, 121, 0.4)'
      });
    }
  }

  launchRocket(sx, sy, tx, ty) {
    const angle = Math.atan2(ty - sy, tx - sx);
    const dist = Math.hypot(tx - sx, ty - sy);
    const speed = dist / 38;
    this.rockets.push({
      x: sx,
      y: sy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      targetY: ty,
      color: `hsl(${Math.random() * 60 + 20}, 100%, 65%)` // Warm gold/rose hues
    });
  }

  explode(x, y, count = 80, isGolden = false) {
    const palette = isGolden
      ? ['#ffd700', '#f6c851', '#fff8b8', '#ffae00', '#ffffff', '#ff4d79']
      : ['#ff4d79', '#f6c851', '#38bdf8', '#c084fc', '#f43f5e', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: Math.random() * 5 + 3,
        alpha: 1,
        gravity: 0.12,
        friction: 0.96,
        isConfetti: Math.random() > 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12
      });
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background twinkling stars
    for (const star of this.stars) {
      star.alpha += star.speed;
      const currentAlpha = Math.abs(Math.sin(star.alpha));
      this.ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw soft floating petals
    for (const p of this.petals) {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > this.canvas.height) {
        p.y = -20;
        p.x = Math.random() * this.canvas.width;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Update rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.x += r.vx;
      r.y += r.vy;

      this.ctx.fillStyle = r.color;
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, 3.5, 0, Math.PI * 2);
      this.ctx.fill();

      if (r.y <= r.targetY || r.vy >= 0) {
        this.explode(r.x, r.y, 75, true);
        this.rockets.splice(i, 1);
      }
    }

    // Update particles (Confetti & Fireworks sparks)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.alpha -= 0.012;
      p.rotation += p.rotationSpeed;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(p.alpha, 0);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);

      this.ctx.fillStyle = p.color;
      if (p.isConfetti) {
        this.ctx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }
}

let particles;

/* ===================================================
   3D MOUSE TILT PARALLAX
   =================================================== */
function setup3DTilt() {
  const cards = document.querySelectorAll('.card-tilt');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ===================================================
   ANIMATED NUMBER COUNTERS (SANA URGU BERMEK)
   =================================================== */
function setupNumberCounters() {
  const counters = document.querySelectorAll('.counter-animate');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          const updateCount = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * target);
            counter.textContent = current.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = target.toLocaleString();
            }
          };

          requestAnimationFrame(updateCount);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.getElementById('statsSection');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ===================================================
   FLOATING BALLOONS GENERATOR
   =================================================== */
function setupBalloons() {
  const container = document.getElementById('balloonsContainer');
  const colors = [
    'linear-gradient(135deg, #ff4d79, #e11d48)',
    'linear-gradient(135deg, #f6c851, #d97706)',
    'linear-gradient(135deg, #c084fc, #7e22ce)',
    'linear-gradient(135deg, #38bdf8, #0284c7)',
    'linear-gradient(135deg, #fb923c, #ea580c)'
  ];

  function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'floating-balloon';
    balloon.style.left = `${Math.random() * 88 + 5}%`;
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 8 + 14;
    balloon.style.animationDuration = `${duration}s, ${Math.random() * 2 + 3}s`;

    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = balloon.getBoundingClientRect();
      sounds.playPop();
      particles.explode(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
      balloon.remove();
    });

    balloon.addEventListener('animationend', (e) => {
      if (e.animationName === 'floatBalloon') {
        balloon.remove();
      }
    });

    container.appendChild(balloon);
  }

  for (let i = 0; i < 4; i++) {
    setTimeout(createBalloon, i * 1800);
  }

  setInterval(() => {
    if (document.querySelectorAll('.floating-balloon').length < 7) {
      createBalloon();
    }
  }, 3200);
}

/* ===================================================
   CANDLE BLOWING & RELIGHTING (25 CANDLE)
   =================================================== */
let candlesLit = true;

function toggleCandles() {
  const flame1 = document.getElementById('flame1');
  const flame2 = document.getElementById('flame2');
  const smoke1 = document.getElementById('smoke1');
  const smoke2 = document.getElementById('smoke2');
  const cakeStatusBadge = document.getElementById('cakeStatusBadge');
  const cakeActionText = document.getElementById('cakeActionText');
  const heroBlowBtnText = document.getElementById('blowBtnText');

  if (candlesLit) {
    // Extinguish candles
    candlesLit = false;
    flame1.classList.add('extinguished');
    flame2.classList.add('extinguished');

    [smoke1, smoke2].forEach(s => {
      s.classList.remove('active');
      void s.offsetWidth;
      s.classList.add('active');
    });

    sounds.playBlow();
    cakeStatusBadge.textContent = '✨ Arzuwlaryňyz hasyl bolsun, Laçyn!';
    cakeStatusBadge.style.color = '#4ade80';
    cakeStatusBadge.style.borderColor = '#4ade80';

    if (cakeActionText) cakeActionText.textContent = 'Täzeden Şemi Ýak 🕯️';
    if (heroBlowBtnText) heroBlowBtnText.textContent = 'Täzeden Şemi Ýak 🕯️';

    // Celebrate with double fireworks
    const cakeCard = document.getElementById('cakeCard');
    const rect = cakeCard.getBoundingClientRect();
    particles.explode(rect.left + rect.width / 2, rect.top + rect.height / 3, 110, true);
    particles.launchRocket(rect.left + 50, window.innerHeight, rect.left + 80, 150);
    particles.launchRocket(rect.right - 50, window.innerHeight, rect.right - 80, 150);
  } else {
    // Relight
    candlesLit = true;
    flame1.classList.remove('extinguished');
    flame2.classList.remove('extinguished');

    cakeStatusBadge.textContent = '🕯️ 25 ýaş şemleri ýanyp dur';
    cakeStatusBadge.style.color = 'var(--gold-primary)';
    cakeStatusBadge.style.borderColor = 'var(--glass-border-gold)';

    if (cakeActionText) cakeActionText.textContent = 'Şemleri Üfle & Arzuw Et!';
    if (heroBlowBtnText) heroBlowBtnText.textContent = '25 Ýaş Şemini Üfle & Arzuw Et!';
    sounds.playTone(880, 'sine', 0.3, 0.2);
  }
}

/* ===================================================
   GRAND FINALE SURPRISE GIFT (GEÝIP GÖRMEK)
   =================================================== */
let giftOpened = false;

function toggleGrandGift() {
  const unopenedView = document.getElementById('giftUnopenedView');
  const revealedView = document.getElementById('giftRevealedView');
  const grandCard = document.getElementById('grandGiftCard');

  giftOpened = !giftOpened;

  if (giftOpened) {
    unopenedView.style.display = 'none';
    revealedView.style.display = 'block';

    sounds.playGiftOpen();

    const rect = grandCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 3;
    particles.explode(cx, cy, 120, true);
    particles.launchRocket(cx - 100, window.innerHeight, cx - 100, cy);
    particles.launchRocket(cx + 100, window.innerHeight, cx + 100, cy);

    // Scroll smoothly to revealed view
    revealedView.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    revealedView.style.display = 'none';
    unopenedView.style.display = 'flex';
  }
}

// Virtual Fitting Modes
function toggleFittingMode(mode) {
  const btnDress = document.getElementById('btnShowDress');
  const btnModel = document.getElementById('btnShowModel');
  const overlay = document.getElementById('tryonOverlay');

  if (mode === 'gift') {
    btnDress.classList.add('active');
    btnModel.classList.remove('active');
    overlay.style.opacity = '0.3';
    overlay.style.mixBlendMode = 'overlay';
    sounds.playTone(659, 'sine', 0.2, 0.2);
  } else if (mode === 'tryon') {
    btnModel.classList.add('active');
    btnDress.classList.remove('active');
    overlay.style.opacity = '0.9';
    overlay.style.mixBlendMode = 'hard-light';
    sounds.playTone(880, 'triangle', 0.3, 0.25);
    particles.explode(window.innerWidth / 2, window.innerHeight * 0.6, 40);
  }
}

/* ===================================================
   FULLSCREEN PHOTO VIEWER MODAL
   =================================================== */
function openPhotoViewer(src, caption) {
  const modal = document.getElementById('photoModal');
  const img = document.getElementById('modalViewerImg');
  const cap = document.getElementById('modalViewerCaption');

  img.src = src;
  cap.textContent = caption;
  modal.classList.add('active');
  sounds.playTone(587.33, 'sine', 0.2, 0.15);
}

function closePhotoViewer() {
  const modal = document.getElementById('photoModal');
  modal.classList.remove('active');
}

/* ===================================================
   MICRO-INTERACTION EFFECTS
   =================================================== */
function triggerEffect(btn, type) {
  sounds.playTone(880, 'sine', 0.2, 0.2);

  const rect = btn.getBoundingClientRect();
  const heart = document.createElement('div');
  heart.textContent = type === 'gün' ? '☀️' : (type === 'okuw' ? '🎓' : '💖');
  heart.style.position = 'fixed';
  heart.style.left = `${rect.left + rect.width / 2}px`;
  heart.style.top = `${rect.top}px`;
  heart.style.fontSize = '1.8rem';
  heart.style.zIndex = '1000';
  heart.style.pointerEvents = 'none';
  heart.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.style.transform = 'translateY(-70px) scale(1.4)';
    heart.style.opacity = '0';
  }, 20);

  setTimeout(() => heart.remove(), 950);
}

/* ===================================================
   INITIALIZATION & EVENT BINDINGS
   =================================================== */
window.addEventListener('DOMContentLoaded', () => {
  particles = new ParticleEngine('fireworksCanvas');
  setup3DTilt();
  setupNumberCounters();
  setupBalloons();

  // Song Player Controls
  const musicBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicBtnLabel');
  const birthdaySong = document.getElementById('birthdaySong');
  const songFileInput = document.getElementById('songFileInput');
  const changeSongBtn = document.getElementById('changeSongBtn');

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (sounds.isPlayingMusic || (birthdaySong && !birthdaySong.paused)) {
        sounds.stopBirthdaySong();
      } else {
        sounds.playBirthdaySong();
      }
    });
  }

  if (birthdaySong) {
    birthdaySong.addEventListener('play', () => {
      sounds.isPlayingMusic = true;
      document.body.classList.add('music-playing');
      if (musicLabel) musicLabel.textContent = 'Aýdymy Sakla';
    });

    birthdaySong.addEventListener('pause', () => {
      sounds.isPlayingMusic = false;
      document.body.classList.remove('music-playing');
      if (musicLabel) musicLabel.textContent = 'Aýdymy Başlat';
    });

    birthdaySong.addEventListener('ended', () => {
      sounds.isPlayingMusic = false;
      document.body.classList.remove('music-playing');
      if (musicLabel) musicLabel.textContent = 'Aýdymy Başlat';
    });
  }

  // Choose custom song file
  if (changeSongBtn && songFileInput && birthdaySong) {
    changeSongBtn.addEventListener('click', () => {
      songFileInput.click();
    });

    songFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        birthdaySong.src = fileUrl;
        sounds.playBirthdaySong();
      }
    });
  }

  // Candle Blowing Action Buttons
  const heroBlowBtn = document.getElementById('blowCandlesBtn');
  if (heroBlowBtn) heroBlowBtn.addEventListener('click', toggleCandles);

  const cakeActionBtn = document.getElementById('blowCandlesActionBtn');
  if (cakeActionBtn) cakeActionBtn.addEventListener('click', toggleCandles);

  const cakeCard = document.getElementById('cakeCard');
  if (cakeCard) {
    cakeCard.addEventListener('click', (e) => {
      if (e.target.closest('#cakeElement') || e.target.classList.contains('candle')) {
        toggleCandles();
      }
    });
  }

  // Confetti Burst Button
  const confettiBurstBtn = document.getElementById('confettiBurstBtn');
  if (confettiBurstBtn) {
    confettiBurstBtn.addEventListener('click', () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight * 0.45;
      particles.explode(cx, cy, 90, true);
      sounds.playTone(784, 'triangle', 0.4, 0.25);
    });
  }

  // Grand Surprise Gift Opening
  const openSurpriseGiftBtn = document.getElementById('openSurpriseGiftBtn');
  if (openSurpriseGiftBtn) openSurpriseGiftBtn.addEventListener('click', toggleGrandGift);

  const mainGiftBox = document.getElementById('mainGiftBox');
  if (mainGiftBox) mainGiftBox.addEventListener('click', toggleGrandGift);

  // Keyboard shortcut: Escape to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePhotoViewer();
  });

  // Initial greeting fireworks burst
  setTimeout(() => {
    particles.explode(window.innerWidth / 2, window.innerHeight * 0.35, 90, true);
  }, 700);
});

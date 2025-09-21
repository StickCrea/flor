
onload = () => {
    document.body.classList.remove("container");
  };

  // ELEMENTOS
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('play');
  const progress = document.getElementById('progress');
  const progressBar = document.getElementById('progress-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const barElems = document.querySelectorAll('.bar');
  const lines = document.querySelectorAll('.line');

  // OFFSET
  let lyricsOffset = 0.0;
  const offsetValueEl = document.getElementById('offsetValue');
  document.getElementById('incOffset').addEventListener('click', () => {
    lyricsOffset = +(lyricsOffset + 0.5).toFixed(1);
    offsetValueEl.textContent = lyricsOffset.toFixed(1);
  });
  document.getElementById('decOffset').addEventListener('click', () => {
    lyricsOffset = +(lyricsOffset - 0.5).toFixed(1);
    offsetValueEl.textContent = lyricsOffset.toFixed(1);
  });

  // Play / Pause
  let isPlaying = false;
  playBtn.addEventListener('click', () => {
    if (isPlaying) { audio.pause(); playBtn.textContent = '▶️'; }
    else { audio.play(); playBtn.textContent = '⏸️'; }
    isPlaying = !isPlaying;
    setBarsActive(isPlaying);
  });

  function setBarsActive(active) {
    barElems.forEach(b => {
      if (active) b.classList.remove('paused');
      else b.classList.add('paused');
    });
  }

  function updateBars(currentTime) {
    barElems.forEach((b, i) => {
      const base = 12 + Math.abs(Math.sin((currentTime + i) * 2.2)) * 36;
      b.style.height = `${Math.round(base)}px`;
    });
  }

  // Progreso + letras
  audio.addEventListener('timeupdate', () => {
    const current = audio.currentTime || 0;
    const dur = audio.duration || 0;
    if (dur > 0) {
      progress.style.width = `${(current / dur) * 100}%`;
    }
    currentTimeEl.textContent = formatTime(current);
    if (audio.duration) durationEl.textContent = formatTime(audio.duration);

    updateBars(current);
    syncLyricsWithOffset(current);
  });

  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    if (audio.duration) audio.currentTime = pct * audio.duration;
  });

  function syncLyricsWithOffset(currentTime) {
    lines.forEach(el => {
      const start = parseFloat(el.dataset.start || '0');
      const showTime = start + lyricsOffset;
      if (currentTime >= showTime) {
        lines.forEach(l => l.classList.remove('active'));
        el.classList.add('active');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  audio.addEventListener('loadedmetadata', () => {
    if (audio.duration) durationEl.textContent = formatTime(audio.duration);
  });

  document.getElementById('prev').addEventListener('click', () => { audio.currentTime = 0; });
  document.getElementById('next').addEventListener('click', () => {
    audio.currentTime = audio.duration ? Math.max(0, audio.duration - 3) : 0;
  });

  setBarsActive(false);
  offsetValueEl.textContent = lyricsOffset.toFixed(1);

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); playBtn.click(); }
  });

  // --- CORAZONES flotando ---
  function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart-float");
    heart.textContent = "💜";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 18 + Math.random() * 16 + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }

  // Cada 10s lanzamos entre 2-4 corazones
  setInterval(() => {
    if (!audio.paused) {
      const qty = Math.floor(Math.random() * 50) + 2;
      for (let i = 0; i < qty; i++) {
        setTimeout(createHeart, i * 400);
      }
    }
  }, 10000);
   // --- REDIRECCIÓN AL TERMINAR ---
  audio.addEventListener("ended", () => {
    window.location.href = "rosas.html";
  });

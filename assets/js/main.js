/**
 * HARSATH ALI A - MAIN PORTFOLIO CONTROLLER
 * Splash Screen Timeline, Project Data Registry, Certificate Lightbox & Interactive Sandboxes
 */

// ================= CENTRALIZED PROJECT DATA REGISTRY =================
// Easily update repository URLs from this single configuration object:
const projectLinks = {
  calculator: "https://github.com/harsathali/Calculator",
  musicPlayer: "https://github.com/harsathali/Music-Player",
  imageGallery: "https://github.com/harsathali/Image-Gallery"
};
window.projectLinks = projectLinks;

window.PORTFOLIO_PROJECTS = {
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    tech: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: projectLinks.calculator,
    liveDemoUrl: '#calculator-demo',
    description: 'Developed a web-based calculator performing addition, subtraction, multiplication, and division with a clean, responsive layout and real-time result display.'
  },
  music: {
    id: 'music',
    title: 'Music Player',
    tech: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: projectLinks.musicPlayer,
    liveDemoUrl: '#music-demo',
    description: 'Built a browser-based music player with play, pause, skip, and track-switching controls and an interactive UI.'
  },
  gallery: {
    id: 'gallery',
    title: 'Image Gallery',
    tech: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: projectLinks.imageGallery,
    liveDemoUrl: '#gallery-demo',
    description: 'Created a responsive, grid-based image gallery with image preview functionality for an enhanced user experience.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. CINEMATIC SPLASH SCREEN (4-5 SECONDS) =================
  const splashScreen = document.getElementById('splashScreen');
  const splashLoaderFill = document.getElementById('splashLoaderFill');
  const splashStatus = document.getElementById('splashStatus');

  if (splashScreen) {
    const hasVisited = sessionStorage.getItem('harsath_portfolio_visited');

    if (hasVisited) {
      splashScreen.remove();
    } else {
      const statusSequence = [
        { text: 'INITIALIZING PORTFOLIO...', progress: 15, delay: 0 },
        { text: 'LOADING EXPERIENCE...', progress: 35, delay: 800 },
        { text: 'LOADING PROJECTS...', progress: 58, delay: 1600 },
        { text: 'LOADING CERTIFICATES...', progress: 80, delay: 2400 },
        { text: 'HARSATH ALI — READY', progress: 95, delay: 3200 },
        { text: 'SYSTEM READY', progress: 100, delay: 3800 }
      ];

      statusSequence.forEach(({ text, progress, delay }) => {
        setTimeout(() => {
          if (splashStatus) splashStatus.textContent = text;
          if (splashLoaderFill) splashLoaderFill.style.width = `${progress}%`;
        }, delay);
      });

      setTimeout(() => {
        sessionStorage.setItem('harsath_portfolio_visited', 'true');
        if (typeof gsap !== 'undefined') {
          gsap.to(splashScreen, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => splashScreen.remove()
          });
        } else {
          splashScreen.style.transition = 'opacity 0.8s ease';
          splashScreen.style.opacity = '0';
          setTimeout(() => splashScreen.remove(), 800);
        }
      }, 4300);
    }
  }

  // ================= 2. BIND GITHUB URLS & ACTIONS =================
  document.querySelectorAll('[data-project-github]').forEach(btn => {
    const projectId = btn.getAttribute('data-project-github');
    const projectData = window.PORTFOLIO_PROJECTS[projectId];
    if (projectData && projectData.githubUrl) {
      btn.setAttribute('href', projectData.githubUrl);
    }
  });

  // ================= 3. TOAST NOTIFICATION UTILITY =================
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  function showToast(message, duration = 3500) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, duration);
  }
  window.showToast = showToast;

  // Copy to Clipboard Buttons
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          btn.classList.add('copied');
          showToast(`Copied to clipboard: ${textToCopy}`);
          setTimeout(() => btn.classList.remove('copied'), 2000);
        }).catch(() => {
          showToast('Failed to copy. Please copy manually.');
        });
      }
    });
  });

  // ================= 4. GENERIC MODAL CONTROLLER =================
  function setupModal(modalId, triggerSelector, closeSelector, backdropSelector) {
    const modal = document.getElementById(modalId);
    if (!modal) return null;

    const triggers = document.querySelectorAll(triggerSelector);
    const closeBtns = document.querySelectorAll(closeSelector);
    const backdrop = document.getElementById(backdropSelector);

    function openModal() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    triggers.forEach(trigger => trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    }));

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    return { open: openModal, close: closeModal };
  }

  // Modals for Resume & Demos
  setupModal('resumeModal', '.resume-trigger-btn', '#resumeCloseBtn', 'resumeBackdrop');
  setupModal('calculatorModal', '[data-demo="calculator"], [data-project="calculator"]', '#calcCloseBtn', 'calcBackdrop');
  setupModal('musicModal', '[data-demo="music"], [data-project="music"]', '#musicCloseBtn', 'musicBackdrop');
  setupModal('galleryModal', '[data-demo="gallery"], [data-project="gallery"]', '#galleryCloseBtn', 'galleryBackdrop');

  // ================= 5. CERTIFICATE FULLSCREEN LIGHTBOX CONTROLLER =================
  const certLightboxModal = document.getElementById('certLightboxModal');
  const certLightboxMedia = document.getElementById('certLightboxMedia');
  const certLightboxTitle = document.getElementById('certLightboxTitle');
  const certLightboxOrg = document.getElementById('certLightboxOrg');
  const certLightboxCloseBtn = document.getElementById('certLightboxCloseBtn');
  const certZoomBtn = document.getElementById('certZoomBtn');
  const certPrevBtn = document.getElementById('certPrevBtn');
  const certNextBtn = document.getElementById('certNextBtn');

  const certificatesData = [
    {
      org: 'Skill India',
      title: 'Unlocking AI for Everyone',
      src: 'assets/certificates/skill-india-unlocking-ai.svg'
    },
    {
      org: 'Skill India',
      title: 'AI for All',
      src: 'assets/certificates/skill-india-ai-for-all.svg'
    },
    {
      org: 'IBM SkillsBuild',
      title: 'Getting Started with Generative AI',
      src: 'assets/certificates/ibm-generative-ai.svg'
    },
    {
      org: 'ASKAN Technologies Pvt Ltd.',
      title: 'IV Certificate',
      src: 'assets/certificates/askan-iv-certificate.svg'
    },
    {
      org: 'CodeAlpha',
      title: 'Frontend Developer Internship Certificate',
      src: 'assets/certificates/codealpha-frontend-internship.svg'
    }
  ];

  let currentCertIndex = 0;
  let isZoomed = false;

  function openCertLightbox(index) {
    if (!certLightboxModal || !certLightboxMedia) return;
    currentCertIndex = index;
    const cert = certificatesData[currentCertIndex];
    if (!cert) return;

    certLightboxMedia.src = cert.src;
    certLightboxMedia.alt = `${cert.org} — ${cert.title}`;
    if (certLightboxTitle) certLightboxTitle.textContent = cert.title;
    if (certLightboxOrg) certLightboxOrg.textContent = cert.org.toUpperCase();

    isZoomed = false;
    certLightboxMedia.classList.remove('zoomed');

    certLightboxModal.classList.add('open');
    certLightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCertLightbox() {
    if (!certLightboxModal) return;
    certLightboxModal.classList.remove('open');
    certLightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function nextCert() {
    currentCertIndex = (currentCertIndex + 1) % certificatesData.length;
    openCertLightbox(currentCertIndex);
  }

  function prevCert() {
    currentCertIndex = (currentCertIndex - 1 + certificatesData.length) % certificatesData.length;
    openCertLightbox(currentCertIndex);
  }

  // Bind certificate cards
  document.querySelectorAll('.open-cert-btn, .cert-preview-frame').forEach((el) => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-cert-index') || '0', 10);
      openCertLightbox(idx);
    });
  });

  if (certLightboxCloseBtn) certLightboxCloseBtn.addEventListener('click', closeCertLightbox);
  if (certNextBtn) certNextBtn.addEventListener('click', nextCert);
  if (certPrevBtn) certPrevBtn.addEventListener('click', prevCert);
  if (certZoomBtn) {
    certZoomBtn.addEventListener('click', () => {
      isZoomed = !isZoomed;
      certLightboxMedia.classList.toggle('zoomed', isZoomed);
    });
  }

  if (certLightboxModal) {
    certLightboxModal.addEventListener('click', (e) => {
      if (e.target === certLightboxModal) closeCertLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!certLightboxModal.classList.contains('open')) return;
      if (e.key === 'Escape') closeCertLightbox();
      if (e.key === 'ArrowRight') nextCert();
      if (e.key === 'ArrowLeft') prevCert();
    });
  }

  // ================= 6. INTERACTIVE CALCULATOR ENGINE =================
  const calcDisplay = document.getElementById('calcDisplay');
  const calcFormula = document.getElementById('calcFormula');
  const calcButtons = document.querySelectorAll('.calc-btn');

  if (calcDisplay) {
    let currentVal = '0';
    let prevVal = null;
    let operator = null;
    let shouldResetDisplay = false;

    function updateCalcDisplay() {
      if (calcDisplay) calcDisplay.textContent = currentVal;
      if (calcFormula) {
        if (prevVal !== null && operator !== null) {
          calcFormula.textContent = `${prevVal} ${operator}`;
        } else {
          calcFormula.textContent = '';
        }
      }
    }

    calcButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const val = btn.getAttribute('data-val');

        if (action === 'num') {
          if (currentVal === '0' || shouldResetDisplay) {
            currentVal = val;
            shouldResetDisplay = false;
          } else {
            if (currentVal.length < 12) currentVal += val;
          }
        } else if (action === 'decimal') {
          if (shouldResetDisplay) {
            currentVal = '0.';
            shouldResetDisplay = false;
          } else if (!currentVal.includes('.')) {
            currentVal += '.';
          }
        } else if (action === 'clear') {
          currentVal = '0';
          prevVal = null;
          operator = null;
          shouldResetDisplay = false;
        } else if (action === 'backspace') {
          if (currentVal.length > 1) {
            currentVal = currentVal.slice(0, -1);
          } else {
            currentVal = '0';
          }
        } else if (action === 'percent') {
          const num = parseFloat(currentVal);
          currentVal = (num / 100).toString();
        } else if (action === 'operator') {
          if (operator !== null && !shouldResetDisplay) {
            calculate();
          }
          prevVal = currentVal;
          operator = val === '*' ? '×' : val === '/' ? '÷' : val;
          shouldResetDisplay = true;
        } else if (action === 'equals') {
          if (operator !== null && prevVal !== null) {
            calculate();
            operator = null;
            prevVal = null;
            shouldResetDisplay = true;
          }
        }
        updateCalcDisplay();
      });
    });

    function calculate() {
      const a = parseFloat(prevVal);
      const b = parseFloat(currentVal);
      let result = 0;

      if (operator === '+') result = a + b;
      else if (operator === '-') result = a - b;
      else if (operator === '×' || operator === '*') result = a * b;
      else if (operator === '÷' || operator === '/') {
        if (b === 0) {
          currentVal = 'Error';
          return;
        }
        result = a / b;
      }

      result = Math.round(result * 10000000) / 10000000;
      currentVal = result.toString();
    }
  }

  // ================= 7. INTERACTIVE MUSIC PLAYER WITH WEB AUDIO SYNTHESIZER =================
  const playerDisc = document.getElementById('playerDisc');
  const visualizerCanvas = document.getElementById('audioVisualizerCanvas');
  const playerTrackName = document.getElementById('playerTrackName');
  const playerArtistName = document.getElementById('playerArtistName');
  const playerCurrentTime = document.getElementById('playerCurrentTime');
  const playerProgressFill = document.getElementById('playerProgressFill');
  const playerProgressTrack = document.getElementById('playerProgressTrack');
  const playerPlayBtn = document.getElementById('playerPlayBtn');
  const playIcon = playerPlayBtn?.querySelector('.play-icon');
  const pauseIcon = playerPlayBtn?.querySelector('.pause-icon');
  const playerPrevBtn = document.getElementById('playerPrevBtn');
  const playerNextBtn = document.getElementById('playerNextBtn');
  const playlistItems = document.querySelectorAll('.playlist-item');

  if (playerPlayBtn) {
    const tracks = [
      { title: 'Cyber Synthwave Pulse', artist: 'Harsath Web Audio Synthesizer', bpm: 120, key: 'synth' },
      { title: 'Lo-Fi Study Beats', artist: 'Harsath Web Audio Synthesizer', bpm: 84, key: 'lofi' },
      { title: 'Upbeat Ambient Flow', artist: 'Harsath Web Audio Synthesizer', bpm: 105, key: 'ambient' }
    ];

    let currentTrackIdx = 0;
    let isPlaying = false;
    let trackTime = 0;
    const trackDuration = 30;
    let playbackTimer = null;

    let audioCtx = null;
    let synthInterval = null;

    function initAudioContext() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtx = new AudioContext();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function playTone(freq, type = 'sine', duration = 0.35, gainVal = 0.08) {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        // Fallback
      }
    }

    const melodies = {
      synth: [261.63, 329.63, 392.00, 523.25, 493.88, 392.00, 329.63, 293.66],
      lofi: [220.00, 261.63, 329.63, 349.23, 329.63, 261.63, 196.00, 220.00],
      ambient: [174.61, 220.00, 261.63, 329.63, 392.00, 440.00, 392.00, 329.63]
    };

    let noteIdx = 0;
    function startSynthEngine() {
      clearInterval(synthInterval);
      const track = tracks[currentTrackIdx];
      const scale = melodies[track.key] || melodies.synth;
      const intervalMs = (60 / track.bpm) * 500;

      synthInterval = setInterval(() => {
        if (!isPlaying) return;
        const freq = scale[noteIdx % scale.length];
        playTone(freq, 'triangle', 0.4, 0.07);
        noteIdx++;
      }, intervalMs);
    }

    function stopSynthEngine() {
      clearInterval(synthInterval);
    }

    // Canvas visualizer loop
    function drawVisualizer() {
      if (!visualizerCanvas) return;
      const ctx = visualizerCanvas.getContext('2d');
      const width = visualizerCanvas.width;
      const height = visualizerCanvas.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = 20;
      const barWidth = (width / barCount) - 2;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isPlaying) {
          barHeight = Math.sin((Date.now() / 150) + i * 0.4) * 18 + 20;
        }
        const x = i * (barWidth + 2);
        const y = height - barHeight;

        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, '#38bdf8');
        gradient.addColorStop(1, '#6366f1');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      requestAnimationFrame(drawVisualizer);
    }
    drawVisualizer();

    function updateTrackInfo() {
      const track = tracks[currentTrackIdx];
      if (playerTrackName) playerTrackName.textContent = track.title;
      if (playerArtistName) playerArtistName.textContent = track.artist;

      playlistItems.forEach((item, idx) => {
        item.classList.toggle('active', idx === currentTrackIdx);
      });
    }

    function togglePlay() {
      initAudioContext();
      isPlaying = !isPlaying;

      if (isPlaying) {
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
        if (playerDisc) playerDisc.classList.add('playing');
        startSynthEngine();

        clearInterval(playbackTimer);
        playbackTimer = setInterval(() => {
          trackTime++;
          if (trackTime >= trackDuration) {
            nextTrack();
          } else {
            updateProgressBar();
          }
        }, 1000);
      } else {
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
        if (playerDisc) playerDisc.classList.remove('playing');
        stopSynthEngine();
        clearInterval(playbackTimer);
      }
    }

    function updateProgressBar() {
      const minutes = Math.floor(trackTime / 60);
      const seconds = trackTime % 60;
      if (playerCurrentTime) {
        playerCurrentTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }
      const percent = (trackTime / trackDuration) * 100;
      if (playerProgressFill) {
        playerProgressFill.style.width = `${percent}%`;
      }
    }

    function nextTrack() {
      currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
      trackTime = 0;
      updateTrackInfo();
      updateProgressBar();
      if (isPlaying) startSynthEngine();
    }

    function prevTrack() {
      currentTrackIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
      trackTime = 0;
      updateTrackInfo();
      updateProgressBar();
      if (isPlaying) startSynthEngine();
    }

    playerPlayBtn.addEventListener('click', togglePlay);
    if (playerNextBtn) playerNextBtn.addEventListener('click', nextTrack);
    if (playerPrevBtn) playerPrevBtn.addEventListener('click', prevTrack);

    if (playerProgressTrack) {
      playerProgressTrack.addEventListener('click', (e) => {
        const rect = playerProgressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        trackTime = Math.floor(percent * trackDuration);
        updateProgressBar();
      });
    }

    playlistItems.forEach(item => {
      item.addEventListener('click', () => {
        const trackIdx = parseInt(item.getAttribute('data-track'), 10);
        currentTrackIdx = trackIdx;
        trackTime = 0;
        updateTrackInfo();
        updateProgressBar();
        if (!isPlaying) togglePlay();
        else startSynthEngine();
      });
    });
  }

  // ================= 8. INTERACTIVE IMAGE GALLERY & LIGHTBOX =================
  const galleryGrid = document.getElementById('galleryDynamicGrid');
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxMediaWrapper = document.getElementById('lightboxMediaWrapper');
  const lightboxCaption = document.getElementById('lightboxCaption');

  if (galleryGrid) {
    const galleryItems = [
      {
        id: 1,
        title: 'Modern Code IDE Interface',
        category: 'dev',
        catLabel: 'Development',
        svgIcon: '<svg viewBox="0 0 100 100" class="gallery-thumb-svg"><rect width="100" height="100" fill="#0f172a"/><path d="M25 35 L40 50 L25 65" stroke="#38bdf8" stroke-width="6" fill="none" stroke-linecap="round"/><line x1="48" y1="65" x2="70" y2="65" stroke="#818cf8" stroke-width="6" stroke-linecap="round"/></svg>'
      },
      {
        id: 2,
        title: 'Glassmorphism UI Architecture',
        category: 'ui',
        catLabel: 'UI & Architecture',
        svgIcon: '<svg viewBox="0 0 100 100" class="gallery-thumb-svg"><rect width="100" height="100" fill="#181829"/><rect x="20" y="20" width="60" height="60" rx="12" fill="#6366f1" opacity="0.3" stroke="#818cf8" stroke-width="2"/><circle cx="50" cy="50" r="16" fill="#38bdf8" opacity="0.7"/></svg>'
      },
      {
        id: 3,
        title: 'Abstract Neural Circuit',
        category: 'abstract',
        catLabel: 'Abstract Art',
        svgIcon: '<svg viewBox="0 0 100 100" class="gallery-thumb-svg"><rect width="100" height="100" fill="#1c1917"/><circle cx="50" cy="50" r="30" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 4" fill="none"/><circle cx="50" cy="50" r="8" fill="#f59e0b"/><line x1="50" y1="10" x2="50" y2="90" stroke="#d97706" stroke-width="2"/><line x1="10" y1="50" x2="90" y2="50" stroke="#d97706" stroke-width="2"/></svg>'
      },
      {
        id: 4,
        title: 'Database Relational Nodes',
        category: 'dev',
        catLabel: 'Development',
        svgIcon: '<svg viewBox="0 0 100 100" class="gallery-thumb-svg"><rect width="100" height="100" fill="#062d25"/><ellipse cx="50" cy="30" rx="30" ry="12" fill="none" stroke="#10b981" stroke-width="3"/><path d="M20 30 V70 C20 80 80 80 80 70 V30" fill="none" stroke="#10b981" stroke-width="3"/><path d="M20 50 C20 60 80 60 80 50" fill="none" stroke="#34d399" stroke-width="2"/></svg>'
      },
      {
        id: 5,
        title: 'Interactive Waveform Design',
        category: 'abstract',
        catLabel: 'Abstract Art',
        svgIcon: '<svg viewBox="0 0 100 100" class="gallery-thumb-svg"><rect width="100" height="100" fill="#200d17"/><path d="M10 50 Q 25 15, 40 50 T 70 50 T 100 50" fill="none" stroke="#f43f5e" stroke-width="4"/><path d="M10 50 Q 30 85, 50 50 T 90 50" fill="none" stroke="#fb7185" stroke-width="3" opacity="0.6"/></svg>'
      },
      {
        id: 6,
        title: 'Responsive Dashboard Frame',
        category: 'ui',
        catLabel: 'UI & Architecture',
        svgIcon: '<svg viewBox="0 0 100 100" class="gallery-thumb-svg"><rect width="100" height="100" fill="#0d1117"/><rect x="15" y="15" width="70" height="70" rx="6" fill="none" stroke="#6366f1" stroke-width="2"/><line x1="15" y1="35" x2="85" y2="35" stroke="#6366f1" stroke-width="2"/><line x1="38" y1="35" x2="38" y2="85" stroke="#6366f1" stroke-width="2"/></svg>'
      }
    ];

    function renderGallery(filter = 'all') {
      galleryGrid.innerHTML = '';
      const filtered = filter === 'all' 
        ? galleryItems 
        : galleryItems.filter(item => item.category === filter);

      filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'gallery-interactive-card';
        card.setAttribute('data-id', item.id);
        card.innerHTML = `
          ${item.svgIcon}
          <div class="gallery-card-overlay">
            <span class="gallery-card-cat">${item.catLabel}</span>
            <h4 class="gallery-card-title">${item.title}</h4>
          </div>
        `;

        card.addEventListener('click', () => {
          openLightbox(item);
        });

        galleryGrid.appendChild(card);
      });
    }

    function openLightbox(item) {
      if (!lightboxModal || !lightboxMediaWrapper || !lightboxCaption) return;
      lightboxMediaWrapper.innerHTML = item.svgIcon;
      lightboxCaption.innerHTML = `<strong>${item.title}</strong> — <span style="color:var(--accent-cyan);">${item.catLabel}</span>`;
      lightboxModal.classList.add('open');
      lightboxModal.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
      if (lightboxModal) {
        lightboxModal.classList.remove('open');
        lightboxModal.setAttribute('aria-hidden', 'true');
      }
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }

    galleryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        galleryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');
        renderGallery(filter);
      });
    });

    renderGallery('all');
  }

  // ================= 9. CONTACT FORM HANDLER (FORMSPREE INTEGRATION) =================
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  function setFormStatus(type, message) {
    if (!formStatus) return;
    formStatus.className = `form-status ${type}`;
    const iconSvg = type === 'success'
      ? `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    formStatus.innerHTML = `${iconSvg}<span>${message}</span>`;
  }

  function clearFormStatus() {
    if (!formStatus) return;
    formStatus.className = 'form-status';
    formStatus.innerHTML = '';
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormStatus();
      let isValid = true;

      // Validate Name
      const nameGroup = nameInput.closest('.form-group');
      if (!nameInput.value.trim()) {
        nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        nameGroup.classList.remove('has-error');
      }

      // Validate Email
      const emailGroup = emailInput.closest('.form-group');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }

      // Validate Message
      const messageGroup = messageInput.closest('.form-group');
      if (!messageInput.value.trim()) {
        messageGroup.classList.add('has-error');
        isValid = false;
      } else {
        messageGroup.classList.remove('has-error');
      }

      if (isValid) {
        submitBtn.disabled = true;
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `
          <svg class="icon-sm animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-linecap="round"></path>
          </svg>
          <span>Sending...</span>
        `;

        const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/xvkggpdg';
        const formData = new FormData(contactForm);

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            const senderName = nameInput.value.trim();
            contactForm.reset();
            const successMsg = `Thank you, ${senderName}! Your message has been sent successfully.`;
            setFormStatus('success', successMsg);
            showToast(successMsg, 5000);

            submitBtn.innerHTML = `
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Message Sent!</span>
            `;

            setTimeout(() => {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalHtml;
            }, 3500);
          } else {
            const data = await response.json().catch(() => ({}));
            let errorMsg = 'Oops! There was a problem submitting your form. Please try again.';
            if (data && data.errors && data.errors.length > 0) {
              errorMsg = data.errors.map(err => err.message).join(', ');
            }
            setFormStatus('error', errorMsg);
            showToast(errorMsg, 5000);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
          }
        } catch (error) {
          console.error('Form submission error:', error);
          const errorMsg = 'Network error: Unable to reach the server. Please check your internet connection.';
          setFormStatus('error', errorMsg);
          showToast(errorMsg, 5000);
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;
        }
      }
    });

    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          const group = input.closest('.form-group');
          if (group) group.classList.remove('has-error');
          clearFormStatus();
        });
      }
    });
  }
});

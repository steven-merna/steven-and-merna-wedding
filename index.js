// ---------- Background music ----------
(function () {
  const audio = document.getElementById('bg-audio');
  const toggle = document.getElementById('music-toggle');
  const gate = document.getElementById('gate');

  audio.volume = 0.55;

  gate.addEventListener('click', startMusic, { once: true });
  gate.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      startMusic();
      gate.removeEventListener('keydown', onKey);
    }
  });

  function startMusic() {
    audio.play().then(() => {
      toggle.classList.add('visible');
    }).catch(() => {
      toggle.classList.add('visible');
    });
  }

  toggle.addEventListener('click', () => {
    if (audio.muted) {
      audio.muted = false;
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', 'Mute music');
    } else {
      audio.muted = true;
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Unmute music');
    }
  });
})();

// ---------- Envelope gate + cinematic reveal ----------
(function () {
  const gate = document.getElementById('gate');
  const reveal = document.getElementById('reveal');
  const site = document.getElementById('site');
  const body = document.body;

  const slides = reveal.querySelectorAll('.reveal-slide');
  const artSlide = reveal.querySelector('.reveal-slide--art');
  const bars = reveal.querySelectorAll('.reveal-progress .bar');
  const DURATION = 5600;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function playBar() {
    const bar = bars[0];
    const fill = bar.querySelector('i');
    fill.style.transition = 'none';
    fill.style.width = '0%';
    requestAnimationFrame(() => {
      bar.classList.add('active');
      requestAnimationFrame(() => {
        fill.style.transition = `width linear ${DURATION}ms`;
        fill.style.width = '100%';
      });
    });
  }

  function runReveal(onDone) {
    if (prefersReducedMotion) {
      onDone();
      return;
    }
    reveal.classList.add('active');
    slides[0].classList.add('show');
    artSlide.classList.remove('play');
    requestAnimationFrame(() => artSlide.classList.add('play'));
    playBar();

    setTimeout(() => {
      reveal.classList.add('hide');
      setTimeout(() => {
        reveal.classList.remove('active', 'hide');
        onDone();
      }, 500);
    }, DURATION);
  }

  function openInvitation() {
    if (gate.classList.contains('opening')) return;
    gate.classList.add('opening');

    setTimeout(() => {
      gate.classList.add('hidden');
      runReveal(() => {
        body.classList.remove('locked');
        site.classList.add('revealed');
      });
    }, 2100);
  }

  gate.addEventListener('click', openInvitation);
  gate.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openInvitation();
    }
  });
})();

// ---------- Gallery dots sync ----------
(function () {
  const scroller = document.getElementById('gallery-scroll');
  const dots = document.querySelectorAll('#gallery-dots .dot');
  if (!scroller || !dots.length) return;

  let ticking = false;

  function updateActiveDot() {
    const index = Math.round(scroller.scrollLeft / scroller.clientWidth);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    ticking = false;
  }

  scroller.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateActiveDot);
      ticking = true;
    }
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      scroller.scrollTo({ left: i * scroller.clientWidth, behavior: 'smooth' });
    });
  });
})();

// ---------- Countdown ----------
(function () {
  // Wedding day: October 10, 2026 — counting down to the ceremony at 2:00 PM
  const WEDDING_DATE = new Date('2026-10-10T14:00:00');

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    const now = new Date();
    let diff = WEDDING_DATE - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);
    const secs = Math.floor(diff / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

// ---------- RSVP form ----------
(function () {
  const form = document.getElementById('rsvp-form');
  const success = document.getElementById('rsvp-success');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // NOTE: This demo just shows a thank-you message locally.
    // To actually receive RSVPs by email with no backend of your own,
    // hook this form up to a free service such as Formspree or FormSubmit —
    // then replace this handler with a normal fetch()/POST to that endpoint.

    form.style.display = 'none';
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();

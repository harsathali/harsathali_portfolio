/**
 * HARSATH ALI - ANIMATIONS & GSAP MOTION ENGINE
 * Reusable animation systems, ScrollTrigger integrations, Page transitions & Custom Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ================= 1. CUSTOM CURSOR (DESKTOP ONLY) =================
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouch && !prefersReducedMotion) {
    let dot = document.querySelector('.custom-cursor-dot');
    let ring = document.querySelector('.custom-cursor-ring');

    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'custom-cursor-dot';
      document.body.appendChild(dot);
    }

    if (!ring) {
      ring = document.createElement('div');
      ring.className = 'custom-cursor-ring';
      document.body.appendChild(ring);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    // Hoverable elements expansion
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .glass-card, .project-card, .cert-card-premium, .interactive-calc-wrapper, .gallery-interactive-card');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      target.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }

  // ================= 2. PAGE TRANSITIONS =================
  if (!prefersReducedMotion) {
    document.body.classList.add('page-enter');
  }

  const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && (href.endsWith('.html') || href === '/' || href.startsWith('./'))) {
        if (prefersReducedMotion) return;
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(() => {
          window.location.href = href;
        }, 220);
      }
    });
  });

  // ================= 3. GSAP & SCROLLTRIGGER MOTION SYSTEM =================
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (!prefersReducedMotion) {
      // Animate Section Headings
      gsap.utils.toArray('.section-header, .page-banner').forEach(header => {
        gsap.from(header.querySelectorAll('.section-tag, .page-header-title, .section-title, .section-line, .section-subtitle, .page-header-subtitle'), {
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out'
        });
      });

      // Animate Skill Cards Stagger
      if (document.querySelector('.skills-grid')) {
        gsap.from('.skills-grid .skill-category-card', {
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%'
          },
          y: 40,
          opacity: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: 'power3.out'
        });
      }

      // Animate Project Cards
      if (document.querySelector('.projects-grid')) {
        gsap.from('.projects-grid .project-card', {
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%'
          },
          y: 45,
          opacity: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: 'power3.out'
        });
      }

      // Animate Experience Timeline Line & Items
      if (document.querySelector('.timeline-wrapper')) {
        gsap.from('.timeline-item', {
          scrollTrigger: {
            trigger: '.timeline-wrapper',
            start: 'top 80%'
          },
          x: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.25,
          ease: 'power2.out'
        });
      }

      // Animate Education Timeline & Metric Cards
      if (document.querySelector('.education-container')) {
        gsap.from('.education-card', {
          scrollTrigger: {
            trigger: '.education-container',
            start: 'top 80%'
          },
          y: 35,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }

      // About Profile Image Subtle Parallax
      const profileFrame = document.querySelector('.about-profile-frame');
      if (profileFrame) {
        gsap.from(profileFrame, {
          scale: 0.94,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });

        window.addEventListener('scroll', () => {
          const scrollY = window.scrollY;
          profileFrame.style.transform = `translateY(${scrollY * 0.04}px)`;
        }, { passive: true });
      }
    }
  }

  // ================= 4. FALLBACK INTERSECTION OBSERVER =================
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-scale, .reveal-slide-left, .timeline-item');
  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('active'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }
});

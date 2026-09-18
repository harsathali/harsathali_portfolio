/**
 * HARSATH ALI - SHARED NAVIGATION SCRIPT
 * Handles active page state, animated hamburger menu, mobile drawer, scroll progress & back-to-top
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. ACTIVE NAVIGATION DETECTION =================
  const currentPath = window.location.pathname;
  let pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1).toLowerCase();
  
  // Default to index.html if root or empty
  if (!pageName || pageName === '' || pageName === '/') {
    pageName = 'index.html';
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function markActiveLink(link) {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const targetFile = href.split('#')[0].split('?')[0].toLowerCase();
    
    if (targetFile === pageName) {
      link.classList.add('active');
    } else if ((pageName === 'certificates.html' || pageName === 'certification.html') && (targetFile === 'certificates.html' || targetFile === 'certification.html')) {
      link.classList.add('active');
    } else if ((pageName === 'index.html' || pageName === '') && (targetFile === 'index.html' || targetFile === './' || targetFile === '')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  }

  navLinks.forEach(markActiveLink);
  drawerLinks.forEach(markActiveLink);

  // ================= 2. MOBILE HAMBURGER MENU & DRAWER =================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  function openDrawer() {
    if (!mobileDrawer || !mobileMenuToggle) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer || !mobileMenuToggle) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // ================= 3. SCROLL PROGRESS & HEADER STATE =================
  const scrollProgress = document.getElementById('scrollProgress');
  const mainHeader = document.getElementById('mainHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent}%`;
    }

    if (mainHeader) {
      if (scrollTop > 30) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 320) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

/**
 * HARSATH ALI - DUAL THEME ENGINE (DARK / LIGHT MODE)
 * Provides seamless, cinematic theme switching (400-700ms) with localStorage persistence
 * and zero Flash of Unstyled Theme (FOUC).
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'harsath_portfolio_theme';
  const DEFAULT_THEME = 'dark';

  // Get current active theme
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    // Check OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return DEFAULT_THEME;
  }

  // Apply theme to document element
  function applyTheme(theme, animate = true) {
    if (animate) {
      document.documentElement.classList.add('theme-transitioning');
    }

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update all theme toggle buttons
    updateToggleButtons(theme);

    // Dispatch custom event for 3D canvas and dynamic components
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

    if (animate) {
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 700);
    }
  }

  // Update UI state of all theme toggle buttons
  function updateToggleButtons(theme) {
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('data-current-theme', theme);

      const sunIcon = btn.querySelector('.theme-icon-sun');
      const moonIcon = btn.querySelector('.theme-icon-moon');
      const textLabel = btn.querySelector('.theme-text-label');

      if (theme === 'dark') {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
        if (textLabel) textLabel.textContent = 'Light Mode';
      } else {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
        if (textLabel) textLabel.textContent = 'Dark Mode';
      }
    });
  }

  // Toggle between dark and light
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
  }

  // Attach event listeners once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    updateToggleButtons(currentTheme);

    // Attach click handlers to all theme buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });

    // Listen to OS color scheme changes if user hasn't explicitly set a preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'light' : 'dark', true);
        }
      });
    }
  });

  // Expose global methods
  window.ThemeManager = {
    getPreferredTheme,
    applyTheme,
    toggleTheme
  };
})();

(() => {
  const storageKey = 'mathjr_theme';

  function readTheme() {
    const linkedTheme = new URLSearchParams(location.hash.slice(1)).get('mathjr-theme');
    if (linkedTheme === 'light' || linkedTheme === 'dark') return linkedTheme;

    const cookie = document.cookie.match(/(?:^|; )mathjr_theme=(light|dark)(?:;|$)/);
    if (cookie) return cookie[1];

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}

    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}

    return null;
  }

  function writeTheme(theme) {
    try { localStorage.setItem(storageKey, theme); } catch (_) {}
    try { sessionStorage.setItem(storageKey, theme); } catch (_) {}
    try { document.cookie = `${storageKey}=${theme}; path=/; max-age=31536000; samesite=lax`; } catch (_) {}
  }

  function applyTheme(theme) {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    const color = document.querySelector('meta[name="theme-color"]');
    if (color) color.setAttribute('content', theme === 'light' ? '#f0fdf4' : '#0f172a');
  }

  function syncThemeIcon() {
    const button = document.getElementById('theme-icon');
    if (!button) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    button.textContent = isLight ? '🌙' : '☀️';
  }

  window.toggleTheme = function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    writeTheme(next);
    syncThemeIcon();
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || event.defaultPrevented) return;
    const destination = new URL(link.href, location.href);
    if (destination.protocol !== location.protocol || destination.host !== location.host) return;
    const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    destination.hash = `mathjr-theme=${theme}`;
    link.href = destination.href;
  }, true);

  const preference = readTheme();
  if (preference) applyTheme(preference);
  if (new URLSearchParams(location.hash.slice(1)).has('mathjr-theme')) {
    try { history.replaceState(null, '', `${location.pathname}${location.search}`); } catch (_) {}
    writeTheme(preference);
  }
  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', syncThemeIcon, { once: true });
  else syncThemeIcon();
})();

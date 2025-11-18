// THEME TOGGLE (persisted)
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('themeToggle');

  // apply saved theme or default to dark
  const saved = localStorage.getItem('siteTheme');
  const initial = saved || 'dark';
  document.body.setAttribute('data-theme', initial);

  // update button display (simple emoji)
  function updateButton(theme) {
    if (!themeBtn) return;
    themeBtn.textContent = theme === 'dark' ? '🌗' : '🌞';
    themeBtn.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  }
  updateButton(initial);

  // toggle handler
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const curr = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = curr === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', next);
      localStorage.setItem('siteTheme', next);
      updateButton(next);
    });
  }
});

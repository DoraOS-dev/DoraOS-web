function formatTime(date) {
  const d = date || new Date();
  return d.toLocaleTimeString('hr-HR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function initClock() {
  const el = document.querySelector('[data-clock]');
  if (!el) return;
  const update = () => el.textContent = formatTime();
  update();
  setInterval(update, 30_000);
}

document.addEventListener('DOMContentLoaded', () => {
  initClock();
});

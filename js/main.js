function pad(num) {
  return num.toString().padStart(2, "0");
}

function updateMetaClock() {
  const now = new Date();
  const dateEl = document.getElementById("meta-date");
  const timeEl = document.getElementById("meta-time");
  if (!dateEl || !timeEl) return;

  const days = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
  const months = ["sij", "velj", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro"];

  const dayName = days[now.getDay()];
  const dateStr = `${dayName}, ${pad(now.getDate())}. ${months[now.getMonth()]}. ${now.getFullYear()}.`;
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  dateEl.textContent = dateStr;
  timeEl.textContent = timeStr;
}

setInterval(updateMetaClock, 30_000);
document.addEventListener("DOMContentLoaded", updateMetaClock);

function navigate(url) {
  window.location.href = url;
}

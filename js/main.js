// Dora Asistent – glavna logika (sat + lijekovi + zvuk)

const DAY_KEYS = ["pon", "uto", "sri", "cet", "pet", "sub", "ned"];
const STORAGE_KEY = "dora_meds_v1";
const SOUND_KEY = "dora_sound_enabled";

function updateClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  el.textContent = `${hh}:${mm}:${ss}`;
}
setInterval(updateClock, 1000);
updateClock();

function getTodayKey() {
  const d = new Date().getDay(); // 0 ned, 1 pon...
  const map = ["ned", "pon", "uto", "sri", "cet", "pet", "sub"];
  return map[d];
}

function loadMeds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Ne mogu učitati meds iz localStorage", e);
    return {};
  }
}

function saveMeds(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function renderMeds() {
  const data = loadMeds();
  const todayKey = getTodayKey();
  ["bozo", "kristina"].forEach((person) => {
    const row = document.querySelector(`tr[data-person-row="${person}"]`);
    if (!row) return;
    const cells = Array.from(row.querySelectorAll("td"));
    cells.forEach((cell, index) => {
      cell.innerHTML = "";
      const dayKey = DAY_KEYS[index];
      const status = (data[person] && data[person][dayKey]) || "none";

      const dot = document.createElement("span");
      dot.classList.add("dot");

      if (status === "taken") {
        dot.classList.add("dot--green");
      } else {
        dot.classList.add("dot--red");
      }

      if (dayKey === todayKey) {
        const wrapper = document.createElement("span");
        wrapper.classList.add("dot", "dot--yellow");
        wrapper.style.display = "inline-block";
        wrapper.style.position = "relative";
        wrapper.style.width = "0.9rem";
        wrapper.style.height = "0.9rem";

        dot.style.position = "absolute";
        dot.style.top = "2px";
        dot.style.left = "2px";
        dot.style.width = "0.5rem";
        dot.style.height = "0.5rem";

        wrapper.appendChild(dot);
        cell.appendChild(wrapper);
      } else {
        cell.appendChild(dot);
      }
    });
  });
}

function markToday(person) {
  const data = loadMeds();
  const today = getTodayKey();
  if (!data[person]) data[person] = {};
  data[person][today] = "taken";
  saveMeds(data);
  renderMeds();
}

document.querySelectorAll(".confirm-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const person = btn.dataset.person;
    markToday(person);
  });
});

renderMeds();

// Zvuk toggle
const soundToggle = document.getElementById("soundToggle");
if (soundToggle) {
  const saved = localStorage.getItem(SOUND_KEY);
  if (saved !== null) {
    soundToggle.checked = saved === "true";
  }
  soundToggle.addEventListener("change", () => {
    localStorage.setItem(SOUND_KEY, soundToggle.checked ? "true" : "false");
  });
}

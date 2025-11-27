// DoraOS V6.7.2 main logic for index.html

const PIN_CODE = "0000";

function updateClock() {
  const clockEl = document.getElementById("clock");
  if (!clockEl) return;
  const now = new Date();
  const time = now.toLocaleTimeString("hr-HR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const date = now.toLocaleDateString("hr-HR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  clockEl.textContent = `${time}  ·  ${date}`;
}

function initNavigation() {
  document.querySelectorAll("[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (target) window.location.href = target;
    });
  });
}

function getWeekKey() {
  const now = new Date();
  const year = now.getFullYear();
  const firstJan = new Date(year, 0, 1);
  const days = Math.floor((now - firstJan) / 86400000);
  const week = Math.floor((days + firstJan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

function loadMedsState() {
  const key = getWeekKey();
  const raw = localStorage.getItem("dora_meds_" + key);
  let data = {
    bozo: Array(7).fill(0),
    kristina: Array(7).fill(0)
  };
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.bozo && parsed.kristina) data = parsed;
    } catch (e) {
      console.warn("Ne mogu parsirati podatke o lijekovima", e);
    }
  }
  return data;
}

function saveMedsState(data) {
  const key = getWeekKey();
  localStorage.setItem("dora_meds_" + key, JSON.stringify(data));
}

function renderMedsTable(data) {
  const todayIndex = new Date().getDay(); // 0=Sun
  const mapIdx = {1:0, 2:1, 3:2, 4:3, 5:4, 6:5, 0:6};
  const d = mapIdx[todayIndex];

  document.querySelectorAll(".meds-table tbody tr").forEach(row => {
    const person = row.getAttribute("data-person");
    const arr = data[person] || [];
    row.querySelectorAll("td").forEach(td => {
      const day = parseInt(td.getAttribute("data-day"), 10);
      td.innerHTML = "";
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (day === d) dot.classList.add("dot-yellow");
      if (arr[day] === 1) {
        dot.classList.add("dot-green");
      } else {
        dot.classList.add("dot-red");
      }
      td.appendChild(dot);
    });
  });
}

function initConfirmButtons(data) {
  const todayIndex = new Date().getDay();
  const mapIdx = {1:0, 2:1, 3:2, 4:3, 5:4, 6:5, 0:6};
  const d = mapIdx[todayIndex];

  document.querySelectorAll(".big-confirm").forEach(btn => {
    btn.addEventListener("click", () => {
      const person = btn.getAttribute("data-person");
      if (!person) return;
      data[person][d] = 1;
      saveMedsState(data);
      renderMedsTable(data);
    });
  });
}

function initSettingsModal() {
  const modal = document.getElementById("settings-modal");
  const btnOpen = document.getElementById("settings-button");
  const btnCancel = document.getElementById("settings-cancel");
  const btnConfirm = document.getElementById("settings-confirm");
  const input = document.getElementById("settings-pin");
  const error = document.getElementById("settings-error");

  if (!modal || !btnOpen) return;

  function openModal() {
    modal.classList.remove("hidden");
    error.textContent = "";
    input.value = "";
    setTimeout(() => input.focus(), 50);
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  btnOpen.addEventListener("click", openModal);
  btnCancel.addEventListener("click", closeModal);

  btnConfirm.addEventListener("click", () => {
    if (input.value === PIN_CODE) {
      localStorage.setItem("dora_settings_last_ok", new Date().toISOString());
      window.location.href = "settings.html";
    } else {
      error.textContent = "Pogrešan PIN. Pokušajte ponovno.";
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      btnConfirm.click();
    } else if (e.key === "Escape") {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);
  initNavigation();
  initSettingsModal();

  const medsData = loadMedsState();
  renderMedsTable(medsData);
  initConfirmButtons(medsData);
});

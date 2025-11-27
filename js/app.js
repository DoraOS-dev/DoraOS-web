// Dora Asistent – glavna logika

const PIN_CODE = "0038";

// Datum i vrijeme
function updateDateTime() {
  const now = new Date();
  const days = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
  const months = [
    "siječnja",
    "veljače",
    "ožujka",
    "travnja",
    "svibnja",
    "lipnja",
    "srpnja",
    "kolovoza",
    "rujna",
    "listopada",
    "studenoga",
    "prosinca"
  ];

  const dayName = days[now.getDay()];
  const date = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  const dateText = `${dayName}, ${date}. ${monthName} ${year}.`;
  const timeText = `${h}:${m}:${s}`;

  document.getElementById("date-text").textContent = dateText;
  document.getElementById("time-text").textContent = timeText;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Navigacija
document.querySelectorAll(".nav-button[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    if (target) {
      window.location.href = target;
    }
  });
});

// Tjedni pregled – localStorage
const STORAGE_KEY = "doraMedicationWeek";

function loadWeekState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        bozo: {},
        kristina: {}
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Cannot parse week state", e);
    return {
      bozo: {},
      kristina: {}
    };
  }
}

function saveWeekState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderWeekTable(state) {
  const today = new Date().getDay(); // 0 ned...6 sub
  document.querySelectorAll(".week-table td").forEach((td) => {
    const person = td.dataset.person;
    const day = Number(td.dataset.day);
    const isToday = day === today;

    const taken = !!(state[person] && state[person][day]);
    td.innerHTML = "";
    const dot = document.createElement("span");
    dot.className = "dot " + (taken ? "dot--on" : "dot--off");
    td.appendChild(dot);

    if (isToday) {
      td.style.outline = "1px solid rgba(248, 250, 252, 0.6)";
      td.style.outlineOffset = "2px";
      td.title = "Danas";
    } else {
      td.style.outline = "none";
      td.title = "";
    }
  });
}

const weekState = loadWeekState();
renderWeekTable(weekState);

function markToday(person) {
  const today = new Date().getDay();
  if (!weekState[person]) weekState[person] = {};
  weekState[person][today] = true;
  saveWeekState(weekState);
  renderWeekTable(weekState);
}

document.getElementById("btnBozo").addEventListener("click", () => {
  markToday("bozo");
});

document.getElementById("btnKristina").addEventListener("click", () => {
  markToday("kristina");
});

// PIN modal i postavke
const pinModal = document.getElementById("pinModal");
const settingsBtn = document.getElementById("settingsBtn");
const pinInput = document.getElementById("pinInput");
const pinError = document.getElementById("pinError");
const pinOk = document.getElementById("pinOk");
const pinCancel = document.getElementById("pinCancel");

function openPinModal() {
  pinModal.hidden = false;
  pinError.hidden = true;
  pinInput.value = "";
  pinInput.focus();
}

function closePinModal() {
  pinModal.hidden = true;
}

settingsBtn.addEventListener("click", openPinModal);

pinCancel.addEventListener("click", closePinModal);

pinOk.addEventListener("click", () => {
  if (pinInput.value === PIN_CODE) {
    pinError.hidden = true;
    window.location.href = "settings.html";
  } else {
    pinError.hidden = false;
    pinInput.focus();
    pinInput.select();
  }
});

pinInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    pinOk.click();
  } else if (e.key === "Escape") {
    closePinModal();
  }
});

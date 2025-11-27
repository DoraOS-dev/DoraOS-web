// Dora Asistent – PIN i postavke

const PIN_CODE = "0038";
const PIN_STORAGE_KEY = "dora_pin_ok"; // rezervirano za buduće zaključavanje po sesiji

function initPinGate() {
  const inputs = Array.from(document.querySelectorAll("#pinGate .pin-inputs input"));
  const submitBtn = document.getElementById("pinSubmit");
  const errorEl = document.getElementById("pinError");
  const content = document.getElementById("settingsContent");

  if (!inputs.length || !submitBtn) return;

  inputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });
  });

  function checkPin() {
    const entered = inputs.map((i) => i.value).join("");
    if (entered === PIN_CODE) {
      document.getElementById("pinGate").hidden = true;
      content.hidden = false;
      localStorage.setItem(PIN_STORAGE_KEY, "ok");
    } else {
      errorEl.textContent = "Netočan PIN. Pokušajte ponovno.";
      inputs.forEach((i) => (i.value = ""));
      inputs[0].focus();
    }
  }

  submitBtn.addEventListener("click", checkPin);
  inputs[0].focus();
}

function initSettingsForm() {
  const nameEl = document.getElementById("displayName");
  const soundEl = document.getElementById("settingsSound");
  const notesEl = document.getElementById("notes");
  const saveBtn = document.getElementById("saveSettings");
  const savedLabel = document.getElementById("settingsSaved");

  if (!saveBtn) return;

  // Učitaj postojeće
  try {
    const raw = localStorage.getItem("dora_settings");
    if (raw) {
      const data = JSON.parse(raw);
      if (data.displayName) nameEl.value = data.displayName;
      if (typeof data.soundEnabled === "boolean") soundEl.checked = data.soundEnabled;
      if (data.notes) notesEl.value = data.notes;
    }
  } catch (e) {
    console.warn("Ne mogu učitati settings", e);
  }

  saveBtn.addEventListener("click", () => {
    const next = {
      displayName: nameEl.value.trim(),
      soundEnabled: soundEl.checked,
      notes: notesEl.value.trim(),
    };
    localStorage.setItem("dora_settings", JSON.stringify(next));
    savedLabel.hidden = false;
    setTimeout(() => (savedLabel.hidden = true), 2500);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPinGate();
  initSettingsForm();
});

// Dora Asistent - glavna logika (početna stranica)

const CORRECT_PIN = "0038";

// Helper: format date key (YYYY-MM-DD)
function dateKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
}

// CLOCK
function startClock() {
    const dateEl = document.getElementById("clock-date");
    const timeEl = document.getElementById("clock-time");
    if (!dateEl || !timeEl) return;

    function update() {
        const now = new Date();
        const formatterDate = new Intl.DateTimeFormat("hr-HR", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const formatterTime = new Intl.DateTimeFormat("hr-HR", {
            hour: "2-digit",
            minute: "2-digit",
        });
        dateEl.textContent = formatterDate.format(now);
        timeEl.textContent = formatterTime.format(now);
    }
    update();
    setInterval(update, 1000 * 30);
}

// SOUND TOGGLE (samo zapis u localStorage za buduće zvukove)
function initSoundToggle() {
    const toggle = document.getElementById("soundToggle");
    if (!toggle) return;

    const saved = localStorage.getItem("dora_sound");
    if (saved === "on") toggle.checked = true;

    toggle.addEventListener("change", () => {
        localStorage.setItem("dora_sound", toggle.checked ? "on" : "off");
    });
}

// MEDS LOG

function loadMeds() {
    try {
        const raw = localStorage.getItem("dora_meds");
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveMeds(data) {
    localStorage.setItem("dora_meds", JSON.stringify(data));
}

function setTakenFor(person) {
    const meds = loadMeds();
    const key = dateKey();
    meds[key] = meds[key] || { bozo: false, kristina: false };
    meds[key][person] = true;
    saveMeds(meds);
    renderMedsTable();
    updateMedStatusText();
}

function updateMedStatusText() {
    const el = document.getElementById("medStatusText");
    if (!el) return;
    const meds = loadMeds();
    const key = dateKey();
    const today = meds[key] || { bozo: false, kristina: false };
    let text = "Za danas još nije zabilježeno.";
    if (today.bozo && today.kristina) {
        text = "Za danas je zabilježeno da su Božo i Kristina popili lijek.";
    } else if (today.bozo) {
        text = "Za danas je zabilježeno da je Božo popio lijek.";
    } else if (today.kristina) {
        text = "Za danas je zabilježeno da je Kristina popila lijek.";
    }
    el.textContent = text;
}

function renderMedsTable() {
    const rowBozo = document.getElementById("rowBozo");
    const rowKristina = document.getElementById("rowKristina");
    if (!rowBozo || !rowKristina) return;

    const meds = loadMeds();
    rowBozo.querySelectorAll("td").forEach(td => td.remove());
    rowKristina.querySelectorAll("td").forEach(td => td.remove());

    const today = new Date();
    const weekdayNames = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];

    // Show last 7 days starting Monday style but keep data aligned
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        days.push(d);
    }

    days.forEach(d => {
        const key = d.toISOString().slice(0, 10);
        const data = meds[key] || {};
        const isToday = dateKey() === key;

        const tdBozo = document.createElement("td");
        const tdKristina = document.createElement("td");

        const dotBozo = document.createElement("span");
        const dotKristina = document.createElement("span");

        dotBozo.classList.add("dot");
        dotKristina.classList.add("dot");

        if (data.bozo === true) dotBozo.classList.add("dot-taken");
        else if (data.bozo === false && key in meds) dotBozo.classList.add("dot-missing");
        else dotBozo.classList.add("dot-empty");

        if (data.kristina === true) dotKristina.classList.add("dot-taken");
        else if (data.kristina === false && key in meds) dotKristina.classList.add("dot-missing");
        else dotKristina.classList.add("dot-empty");

        if (!(key in meds)) {
            // if there is no entry at all, keep it "empty"
        }

        tdBozo.appendChild(dotBozo);
        tdKristina.appendChild(dotKristina);

        if (isToday) {
            tdBozo.style.outline = "2px solid rgba(250,250,250,0.6)";
            tdBozo.style.outlineOffset = "1px";
            tdKristina.style.outline = "2px solid rgba(250,250,250,0.6)";
            tdKristina.style.outlineOffset = "1px";
        }

        rowBozo.appendChild(tdBozo);
        rowKristina.appendChild(tdKristina);
    });
}

// SETTINGS / PIN

function initSettingsModal() {
    const btnSettings = document.getElementById("settingsButton");
    const modal = document.getElementById("settingsModal");
    const pinInput = document.getElementById("pinInput");
    const pinError = document.getElementById("pinError");
    const btnOk = document.getElementById("btnPinOk");
    const btnCancel = document.getElementById("btnPinCancel");
    const settingsContent = document.getElementById("settingsContent");
    const btnClearData = document.getElementById("btnClearData");

    if (!btnSettings || !modal) return;

    function closeModal() {
        modal.classList.add("hidden");
        settingsContent.classList.add("hidden");
        pinInput.value = "";
        pinError.textContent = "";
    }

    btnSettings.addEventListener("click", () => {
        modal.classList.remove("hidden");
        settingsContent.classList.add("hidden");
        pinInput.value = "";
        pinError.textContent = "";
        pinInput.focus();
    });

    btnCancel.addEventListener("click", closeModal);

    btnOk.addEventListener("click", () => {
        const val = pinInput.value.trim();
        if (val === CORRECT_PIN) {
            pinError.textContent = "";
            settingsContent.classList.remove("hidden");
        } else {
            pinError.textContent = "Netočan PIN. Pokušajte ponovno.";
            settingsContent.classList.add("hidden");
        }
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    btnClearData.addEventListener("click", () => {
        if (!confirm("Jeste li sigurni da želite obrisati sve lokalne podatke?")) return;
        const keysToRemove = [
            "dora_meds",
            "dora_sound",
            "dora_messages",
            "dora_reminders",
            "dora_photos",
            "dora_family",
            "dora_video"
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));
        alert("Lokalni podaci su obrisani.");
        closeModal();
        // osvježi početnu
        renderMedsTable();
        updateMedStatusText();
    });
}

// BOOTSTRAP

document.addEventListener("DOMContentLoaded", () => {
    startClock();
    initSoundToggle();
    initSettingsModal();

    const btnBozo = document.getElementById("btnBozo");
    const btnKristina = document.getElementById("btnKristina");
    if (btnBozo) btnBozo.addEventListener("click", () => setTakenFor("bozo"));
    if (btnKristina) btnKristina.addEventListener("click", () => setTakenFor("kristina"));

    renderMedsTable();
    updateMedStatusText();
});

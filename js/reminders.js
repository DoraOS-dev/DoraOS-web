
import { renderHeaderBasics, loadJSON, saveJSON, showToast } from "./app.js";

const KEY = "dora-reminders";

function init() {
    renderHeaderBasics();
    const form = document.querySelector("#reminders-form");
    const morningEl = document.querySelector("#rem-morning");
    const eveningEl = document.querySelector("#rem-evening");
    const noteEl = document.querySelector("#rem-note");

    const stored = loadJSON(KEY, {
        morning: "10:00",
        evening: "18:00",
        note: ""
    });

    if (morningEl) morningEl.value = stored.morning;
    if (eveningEl) eveningEl.value = stored.evening;
    if (noteEl) noteEl.value = stored.note;

    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const payload = {
            morning: morningEl?.value || "",
            evening: eveningEl?.value || "",
            note: noteEl?.value || ""
        };
        saveJSON(KEY, payload);
        showToast("Podsjetnik je spremljen.");
    });

    renderSummary(stored);
}

function renderSummary(data) {
    const el = document.querySelector("#reminders-summary");
    if (!el) return;
    el.innerHTML = `
        <strong>Danas:</strong> lijek u ${data.morning || "--:--"} i ${data.evening || "--:--"}.<br/>
        <span style="font-size:12px;color:#9ca3af;">Napomena: ${data.note || "nema posebne napomene."}</span>
    `;
}

window.addEventListener("DOMContentLoaded", init);

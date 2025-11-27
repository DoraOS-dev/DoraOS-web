
import { renderHeaderBasics, loadJSON, saveJSON, showToast } from "./app.js";

const KEY = "dora-family-messages";

function init() {
    renderHeaderBasics();
    const form = document.querySelector("#family-form");
    const area = document.querySelector("#family-text");
    const preview = document.querySelector("#family-preview");

    const stored = loadJSON(KEY, "");
    if (area) area.value = stored;

    function render(val) {
        preview.innerHTML = "";
        if (!val) {
            const p = document.createElement("p");
            p.className = "photo-empty";
            p.textContent = "Obitelj još nije pripremila posebnu poruku.";
            preview.appendChild(p);
            return;
        }
        const block = document.createElement("div");
        block.style.borderRadius = "18px";
        block.style.padding = "16px";
        block.style.background = "rgba(15,23,42,0.95)";
        block.style.border = "1px solid rgba(148,163,184,0.5)";
        block.style.fontSize = "20px";
        block.textContent = val;
        preview.appendChild(block);
    }

    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = area.value.trim();
        saveJSON(KEY, val);
        showToast("Poruka obitelji je spremljena.");
        render(val);
    });

    render(stored);
}

window.addEventListener("DOMContentLoaded", init);

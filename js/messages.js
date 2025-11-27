
import { renderHeaderBasics, loadJSON, saveJSON, showToast } from "./app.js";

const KEY = "dora-messages";

function init() {
    renderHeaderBasics();
    const form = document.querySelector("#messages-form");
    const textEls = Array.from(document.querySelectorAll("[data-msg-index]"));
    const previewContainer = document.querySelector("#messages-preview");

    const stored = loadJSON(KEY, ["", "", ""]);
    textEls.forEach((el) => {
        const idx = Number(el.dataset.msgIndex);
        el.value = stored[idx] ?? "";
    });

    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const values = textEls.map(el => el.value.trim());
        saveJSON(KEY, values);
        showToast("Poruke su spremljene.");
        renderPreview(values);
    });

    renderPreview(stored);
}

function renderPreview(values) {
    const container = document.querySelector("#messages-preview");
    if (!container) return;
    container.innerHTML = "";
    values.forEach((val, i) => {
        if (!val) return;
        const block = document.createElement("div");
        block.style.borderRadius = "18px";
        block.style.padding = "14px 16px";
        block.style.background = "rgba(15,23,42,0.95)";
        block.style.border = "1px solid rgba(148,163,184,0.5)";
        block.style.fontSize = "20px";
        block.style.marginBottom = "10px";
        block.textContent = val;
        container.appendChild(block);
    });
    if (!container.children.length) {
        const empty = document.createElement("p");
        empty.className = "photo-empty";
        empty.textContent = "Još nema spremljenih poruka. Upišite ih iznad i pritisnite Spremi.";
        container.appendChild(empty);
    }
}

window.addEventListener("DOMContentLoaded", init);

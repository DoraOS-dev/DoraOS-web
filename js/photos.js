
import { renderHeaderBasics, loadJSON, saveJSON, showToast } from "./app.js";

const KEY = "dora-photos";

function init() {
    renderHeaderBasics();
    const input = document.querySelector("#photo-input");
    const grid = document.querySelector("#photo-grid");

    let photos = loadJSON(KEY, []);

    function render() {
        grid.innerHTML = "";
        if (!photos.length) {
            const p = document.createElement("p");
            p.className = "photo-empty";
            p.textContent = "Nema spremljenih fotografija. Dodajte ih pomoću gumba gore.";
            grid.appendChild(p);
            return;
        }
        photos.forEach((src, idx) => {
            const wrap = document.createElement("div");
            wrap.className = "photo-item";
            const img = document.createElement("img");
            img.src = src;
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "photo-remove";
            btn.textContent = "Obriši";
            btn.addEventListener("click", () => {
                photos.splice(idx, 1);
                saveJSON(KEY, photos);
                render();
            });
            wrap.appendChild(img);
            wrap.appendChild(btn);
            grid.appendChild(wrap);
        });
    }

    input?.addEventListener("change", (e) => {
        const files = Array.from(input.files || []);
        if (!files.length) return;

        const limit = 20;
        if (photos.length + files.length > limit) {
            alert(`Maksimalno ${limit} fotografija. Trenutno je spremljeno ${photos.length}.`);
        }

        files.slice(0, limit - photos.length).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                photos.push(reader.result);
                saveJSON(KEY, photos);
                render();
            };
            reader.readAsDataURL(file);
        });

        input.value = "";
        showToast("Fotografije se spremaju na uređaj.");
    });

    render();
}

window.addEventListener("DOMContentLoaded", init);

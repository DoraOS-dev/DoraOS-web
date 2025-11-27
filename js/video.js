
import { renderHeaderBasics } from "./app.js";

function init() {
    renderHeaderBasics();
    const info = document.querySelector("#video-info");
    if (!info) return;
    info.innerHTML = `
        Ovdje možete upisati upute kako pokrenuti video poziv (npr. WhatsApp, Viber, Messenger)
        ili dodati poveznice na omiljene kontakte.<br/><br/>
        U ovoj verziji aplikacije ne radimo pravi video‑poziv, nego samo pomažemo da osoba
        jednostavno pronađe upute od obitelji.
    `;
}

window.addEventListener("DOMContentLoaded", init);

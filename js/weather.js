
import { renderHeaderBasics } from "./app.js";

function init() {
    renderHeaderBasics();
    // Detaljna vremenska prognoza se za sada prikazuje samo na glavnoj stranici.
    // Ovdje ostavljamo kratak tekst.
    const box = document.querySelector("#weather-info");
    if (box) {
        box.textContent = "Detaljna prognoza za Vrbnik prikazana je na glavnoj stranici. U sljedećim verzijama ovdje ćemo dodati prošireni prikaz.";
    }
}

window.addEventListener("DOMContentLoaded", init);

// Poruke - spremanje u localStorage

function loadMessages() {
    try {
        const raw = localStorage.getItem("dora_messages");
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveMessages(data) {
    localStorage.setItem("dora_messages", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", () => {
    const msgBozo = document.getElementById("msgBozo");
    const msgKristina = document.getElementById("msgKristina");
    const msgGeneral = document.getElementById("msgGeneral");
    const btnSave = document.getElementById("btnSaveMessages");
    const savedLabel = document.getElementById("msgSaved");

    const data = loadMessages();
    if (msgBozo && data.bozo) msgBozo.value = data.bozo;
    if (msgKristina && data.kristina) msgKristina.value = data.kristina;
    if (msgGeneral && data.general) msgGeneral.value = data.general;

    btnSave?.addEventListener("click", () => {
        saveMessages({
            bozo: msgBozo?.value || "",
            kristina: msgKristina?.value || "",
            general: msgGeneral?.value || ""
        });
        if (savedLabel) {
            savedLabel.textContent = "Poruke su spremljene.";
            setTimeout(() => (savedLabel.textContent = ""), 2500);
        }
    });
});

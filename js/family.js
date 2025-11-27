// Poruke od obitelji

function loadFamily() {
    try {
        const raw = localStorage.getItem("dora_family");
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveFamily(data) {
    localStorage.setItem("dora_family", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", () => {
    const famShort = document.getElementById("famShort");
    const famLong = document.getElementById("famLong");
    const famNote = document.getElementById("famNote");
    const btnSave = document.getElementById("btnSaveFamily");
    const saved = document.getElementById("familySaved");

    const data = loadFamily();
    if (famShort && data.short) famShort.value = data.short;
    if (famLong && data.long) famLong.value = data.long;
    if (famNote && data.note) famNote.value = data.note;

    btnSave?.addEventListener("click", () => {
        saveFamily({
            short: famShort?.value || "",
            long: famLong?.value || "",
            note: famNote?.value || ""
        });
        if (saved) {
            saved.textContent = "Poruke su spremljene.";
            setTimeout(() => (saved.textContent = ""), 2500);
        }
    });
});

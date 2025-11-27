// Podsjetnici - jutarnji i večernji lijek

function loadReminders() {
    try {
        const raw = localStorage.getItem("dora_reminders");
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveReminders(data) {
    localStorage.setItem("dora_reminders", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", () => {
    const tMorning = document.getElementById("timeMorning");
    const tEvening = document.getElementById("timeEvening");
    const note = document.getElementById("reminderNote");
    const btnSave = document.getElementById("btnSaveReminders");
    const saved = document.getElementById("reminderSaved");

    const data = loadReminders();
    if (tMorning && data.morning) tMorning.value = data.morning;
    if (tEvening && data.evening) tEvening.value = data.evening;
    if (note && data.note) note.value = data.note;

    btnSave?.addEventListener("click", () => {
        saveReminders({
            morning: tMorning?.value || "",
            evening: tEvening?.value || "",
            note: note?.value || ""
        });
        if (saved) {
            saved.textContent = "Podsjetnici su spremljeni.";
            setTimeout(() => (saved.textContent = ""), 2500);
        }
    });
});

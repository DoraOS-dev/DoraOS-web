document.addEventListener("DOMContentLoaded", () => {
  const morning = document.getElementById("reminder-morning");
  const evening = document.getElementById("reminder-evening");
  const btn = document.getElementById("save-reminders");

  const raw = localStorage.getItem("dora_reminders");
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (data.morning) morning.value = data.morning;
      if (data.evening) evening.value = data.evening;
    } catch {}
  }

  btn.addEventListener("click", () => {
    const data = { morning: morning.value, evening: evening.value };
    localStorage.setItem("dora_reminders", JSON.stringify(data));
    btn.textContent = "Spremljeno ✔";
    setTimeout(() => (btn.textContent = "Spremi podsjetnike"), 1500);
  });
});

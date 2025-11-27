document.addEventListener("DOMContentLoaded", () => {
  const notes = document.getElementById("ai-notes");
  const btn = document.getElementById("save-ai-notes");
  const raw = localStorage.getItem("dora_ai_notes");
  if (raw) notes.value = raw;
  btn.addEventListener("click", () => {
    localStorage.setItem("dora_ai_notes", notes.value);
    btn.textContent = "Spremljeno ✔";
    setTimeout(() => (btn.textContent = "Spremi bilješke"), 1500);
  });
});

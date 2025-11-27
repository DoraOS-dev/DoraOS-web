document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("family-messages");
  const btn = document.getElementById("save-family-messages");

  const raw = localStorage.getItem("dora_family_messages");
  if (raw) textarea.value = raw;

  btn.addEventListener("click", () => {
    localStorage.setItem("dora_family_messages", textarea.value);
    btn.textContent = "Spremljeno ✔";
    setTimeout(() => (btn.textContent = "Spremi poruke"), 1500);
  });
});

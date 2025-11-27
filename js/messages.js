document.addEventListener("DOMContentLoaded", () => {
  const bozo = document.getElementById("msg-bozo");
  const kristina = document.getElementById("msg-kristina");
  const btn = document.getElementById("save-messages");

  const raw = localStorage.getItem("dora_messages");
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (data.bozo) bozo.value = data.bozo;
      if (data.kristina) kristina.value = data.kristina;
    } catch {}
  }

  btn.addEventListener("click", () => {
    const data = {
      bozo: bozo.value,
      kristina: kristina.value
    };
    localStorage.setItem("dora_messages", JSON.stringify(data));
    btn.textContent = "Spremljeno ✔";
    setTimeout(() => (btn.textContent = "Spremi poruke"), 1500);
  });
});

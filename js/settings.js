document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("clear-local-data");
  btn.addEventListener("click", () => {
    if (!confirm("Obriši sve lokalne podatke (lijekovi, poruke, fotografije)?")) return;
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith("dora_")) localStorage.removeItem(k);
    });
    alert("Lokalni podaci obrisani.");
  });
});

function loadPhotos() {
  const gallery = document.getElementById("photo-gallery");
  gallery.innerHTML = "";
  const raw = localStorage.getItem("dora_photos");
  if (!raw) return;
  try {
    const items = JSON.parse(raw);
    items.forEach(dataUrl => {
      const img = document.createElement("img");
      img.src = dataUrl;
      gallery.appendChild(img);
    });
  } catch {}
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("photo-input");
  const btnSave = document.getElementById("save-photos");
  const btnClear = document.getElementById("clear-photos");

  loadPhotos();

  btnSave.addEventListener("click", () => {
    const files = Array.from(input.files || []);
    if (!files.length) return;

    const raw = localStorage.getItem("dora_photos");
    let items = [];
    if (raw) {
      try {
        items = JSON.parse(raw);
      } catch {}
    }

    let remaining = files.length;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        items.push(e.target.result);
        remaining -= 1;
        if (remaining === 0) {
          localStorage.setItem("dora_photos", JSON.stringify(items));
          loadPhotos();
          input.value = "";
        }
      };
      reader.readAsDataURL(file);
    });
  });

  btnClear.addEventListener("click", () => {
    if (confirm("Obrisati sve lokalne fotografije?")) {
      localStorage.removeItem("dora_photos");
      loadPhotos();
    }
  });
});

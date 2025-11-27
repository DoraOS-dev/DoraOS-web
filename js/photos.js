const PHOTO_KEY = "dora_photos_v1";

function loadPhotos() {
  try {
    const raw = localStorage.getItem(PHOTO_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePhotos(list) {
  try {
    localStorage.setItem(PHOTO_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function renderPhotos() {
  const grid = document.getElementById("photo-grid");
  if (!grid) return;
  const photos = loadPhotos();

  grid.innerHTML = "";
  if (photos.length === 0) {
    const empty = document.createElement("p");
    empty.style.marginTop = "14px";
    empty.style.color = "var(--text-soft)";
    empty.style.fontSize = "0.86rem";
    empty.textContent = "Još nema spremljenih fotografija. Dodaj prvu sliku gumbom iznad.";
    grid.appendChild(empty);
    return;
  }

  for (const p of photos) {
    const tile = document.createElement("div");
    tile.className = "photo-tile";
    tile.innerHTML = `
      <img src="${p.data}" alt="Porodična fotografija" />
      <div class="photo-tile__meta">
        <div>${p.label || "Fotografija"}</div>
        <div style="opacity:0.7;">${p.date || ""}</div>
      </div>
    `;
    grid.appendChild(tile);
  }
}

function addPhotoFromFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const photos = loadPhotos();
    const now = new Date();
    const stamp = `${now.getDate().toString().padStart(2,"0")}.${(now.getMonth()+1).toString().padStart(2,"0")}.${now.getFullYear()}. ${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    photos.unshift({
      data: reader.result,
      label: file.name,
      date: stamp
    });
    savePhotos(photos);
    renderPhotos();
  };
  reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("btn-add-photo");
  const clearBtn = document.getElementById("btn-clear-photos");
  const fileInput = document.getElementById("file-input");

  if (addBtn && fileInput) {
    addBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (ev) => {
      const file = ev.target.files?.[0];
      if (!file) return;
      addPhotoFromFile(file);
      fileInput.value = "";
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!confirm("Obrisati sve spremljene fotografije s ovog uređaja?")) return;
      savePhotos([]);
      renderPhotos();
    });
  }

  renderPhotos();
});

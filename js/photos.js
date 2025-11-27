// Dora Asistent – lokalni foto album (localStorage)

const PHOTOS_KEY = "dora_photos_v1";

function loadPhotos() {
  try {
    const raw = localStorage.getItem(PHOTOS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Ne mogu učitati fotografije", e);
    return [];
  }
}

function savePhotos(list) {
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(list));
}

function renderPhotos() {
  const grid = document.getElementById("photoGrid");
  if (!grid) return;
  const photos = loadPhotos();
  grid.innerHTML = "";
  if (!photos.length) {
    grid.innerHTML = '<p style="color:#9ca3af;font-size:0.9rem;">Još nema spremljenih fotografija.</p>';
    return;
  }
  photos.forEach((src, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "photo-item";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Fotografija ${index + 1}`;
    const del = document.createElement("button");
    del.textContent = "✕";
    del.addEventListener("click", () => {
      const arr = loadPhotos();
      arr.splice(index, 1);
      savePhotos(arr);
      renderPhotos();
    });
    wrapper.appendChild(img);
    wrapper.appendChild(del);
    grid.appendChild(wrapper);
  });
}

function handleFiles(files) {
  if (!files || !files.length) return;
  const existing = loadPhotos();
  const readers = [];
  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    readers.push(
      new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      })
    );
  });

  Promise.all(readers).then((results) => {
    const next = existing.concat(results);
    savePhotos(next);
    renderPhotos();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("photoInput");
  const clearBtn = document.getElementById("clearPhotos");
  if (input) {
    input.addEventListener("change", () => {
      handleFiles(input.files);
      input.value = "";
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Obrisati sve fotografije iz albuma?")) {
        savePhotos([]);
        renderPhotos();
      }
    });
  }
  renderPhotos();
});

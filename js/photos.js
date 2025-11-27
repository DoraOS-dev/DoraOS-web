// Jednostavan lokalni foto-album
const INPUT = document.getElementById("photoInput");
const GRID = document.getElementById("photoGrid");
const CLEAR = document.getElementById("clearPhotos");
const KEY = "doraPhotos";

function loadPhotos() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function savePhotos(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function renderPhotos() {
  const list = loadPhotos();
  GRID.innerHTML = "";
  if (!list.length) {
    GRID.innerHTML =
      '<p style="font-size:0.9rem;color:var(--text-soft);margin:4px 0;">Još nema spremljenih fotografija.</p>';
    return;
  }

  const frag = document.createDocumentFragment();
  list.forEach((dataUrl, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "photo-thumb";
    const img = document.createElement("img");
    img.src = dataUrl;
    img.alt = "Fotografija " + (index + 1);
    wrapper.appendChild(img);
    frag.appendChild(wrapper);
  });
  GRID.appendChild(frag);
}

INPUT.addEventListener("change", () => {
  const files = Array.from(INPUT.files || []);
  if (!files.length) return;
  const existing = loadPhotos();

  let pending = files.length;
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      existing.push(e.target.result);
      pending -= 1;
      if (pending === 0) {
        savePhotos(existing);
        renderPhotos();
        INPUT.value = "";
      }
    };
    reader.readAsDataURL(file);
  });
});

CLEAR.addEventListener("click", () => {
  if (confirm("Sigurno obrisati sve spremljene fotografije?")) {
    localStorage.removeItem(KEY);
    renderPhotos();
  }
});

renderPhotos();

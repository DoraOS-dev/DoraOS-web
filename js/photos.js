const PHOTOS_KEY = 'dora_photos_v1';

function loadPhotos() {
  try {
    const raw = localStorage.getItem(PHOTOS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}

function savePhotos(list) {
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(list));
}

function renderPhotos() {
  const grid = document.querySelector('[data-gallery-grid]');
  const counter = document.querySelector('[data-photo-count]');
  if (!grid) return;

  const photos = loadPhotos();
  grid.innerHTML = '';

  if (counter) counter.textContent = photos.length.toString();

  if (!photos.length) {
    const empty = document.createElement('div');
    empty.className = 'gallery-empty';
    empty.textContent = 'Još nema spremljenih fotografija. Dodajte prve slike za mamu i tatu ❤️';
    grid.appendChild(empty);
    return;
  }

  photos.forEach((p, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${p.data}" alt="${p.label || 'Fotografija'}" loading="lazy" />
      <div class="gallery-meta">
        <span class="gallery-badge">${p.label || 'Bez opisa'}</span>
        <button class="gallery-delete" data-index="${index}">Obriši</button>
      </div>
    `;
    grid.appendChild(item);
  });

  grid.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.gallery-delete');
    if (!btn) return;
    const idx = Number(btn.dataset.index);
    const list = loadPhotos();
    list.splice(idx, 1);
    savePhotos(list);
    renderPhotos();
  }, { once: true });
}

function handleFiles(files) {
  const maxPhotos = 48;
  const existing = loadPhotos();
  if (existing.length >= maxPhotos) {
    alert('Dosegnut je maksimalan broj fotografija (' + maxPhotos + '). Obrišite neke stare da bi dodali nove.');
    return;
  }

  const slice = Array.from(files).slice(0, maxPhotos - existing.length);
  if (!slice.length) return;

  let remaining = slice.length;
  const newItems = [];

  slice.forEach(file => {
    if (!file.type.startsWith('image/')) {
      remaining--;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      newItems.push({
        data: reader.result,
        label: file.name
      });
      remaining--;
      if (remaining === 0) {
        const merged = existing.concat(newItems);
        savePhotos(merged);
        renderPhotos();
      }
    };
    reader.onerror = () => {
      remaining--;
      if (remaining === 0) {
        const merged = existing.concat(newItems);
        savePhotos(merged);
        renderPhotos();
      }
    };
    reader.readAsDataURL(file);
  });
}

function initGallery() {
  const fileInput = document.querySelector('#photo-input');
  const drop = document.querySelector('[data-drop-zone]');
  const clearBtn = document.querySelector('[data-clear-photos]');

  if (!fileInput || !drop) return;

  drop.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (ev) => {
    if (ev.target.files?.length) {
      handleFiles(ev.target.files);
      fileInput.value = '';
    }
  });

  ['dragenter','dragover'].forEach(evt => {
    drop.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      drop.style.borderColor = 'rgba(52,211,153,0.95)';
    });
  });

  ['dragleave','drop'].forEach(evt => {
    drop.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      drop.style.borderColor = 'rgba(148,163,184,0.55)';
    });
  });

  drop.addEventListener('drop', (e) => {
    const files = e.dataTransfer?.files;
    if (files?.length) {
      handleFiles(files);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Obrisati sve spremljene fotografije iz uređaja?')) {
        localStorage.removeItem(PHOTOS_KEY);
        renderPhotos();
      }
    });
  }

  renderPhotos();
}

document.addEventListener('DOMContentLoaded', initGallery);

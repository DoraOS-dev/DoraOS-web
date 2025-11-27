// Foto album - localStorage (samo na ovom uređaju)

function loadPhotos() {
    try {
        const raw = localStorage.getItem("dora_photos");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function savePhotos(arr) {
    localStorage.setItem("dora_photos", JSON.stringify(arr));
}

function renderPhotos() {
    const grid = document.getElementById("photoGrid");
    if (!grid) return;
    const photos = loadPhotos();
    grid.innerHTML = "";
    photos.forEach(p => {
        const item = document.createElement("div");
        item.className = "photo-item";
        item.innerHTML = `
            <img src="${p.data}" alt="Obiteljska fotografija" />
            <span>${p.label || ""}</span>
        `;
        grid.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("photoInput");
    const btnClear = document.getElementById("btnClearPhotos");
    renderPhotos();

    input?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const photos = loadPhotos();
            photos.push({
                data: reader.result,
                label: new Date().toLocaleString("hr-HR")
            });
            savePhotos(photos);
            renderPhotos();
        };
        reader.readAsDataURL(file);
        input.value = "";
    });

    btnClear?.addEventListener("click", () => {
        if (!confirm("Obrisati sve slike iz lokalnog albuma?")) return;
        savePhotos([]);
        renderPhotos();
    });
});

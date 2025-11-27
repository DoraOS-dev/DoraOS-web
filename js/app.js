
// Shared Dora Asistent helpers

export const PIN_CODE = "0000";

export function $(selector, root = document) {
    return root.querySelector(selector);
}

export function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}

export function getTodayKey() {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        console.warn("loadJSON failed", key, e);
        return fallback;
    }
}

export function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn("saveJSON failed", key, e);
    }
}

export function formatDayShort(idx) {
    // Monday-first labels in Croatian
    const labels = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
    return labels[idx] ?? "?";
}

export function formatDayLong(date) {
    return date.toLocaleDateString("hr-HR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

export function showToast(message) {
    let el = document.querySelector(".toast");
    if (!el) {
        el = document.createElement("div");
        el.className = "toast";
        el.style.position = "fixed";
        el.style.bottom = "18px";
        el.style.left = "50%";
        el.style.transform = "translateX(-50%)";
        el.style.padding = "8px 14px";
        el.style.borderRadius = "999px";
        el.style.background = "rgba(15,23,42,0.95)";
        el.style.border = "1px solid rgba(148,163,184,0.6)";
        el.style.color = "#f9fafb";
        el.style.fontSize = "13px";
        el.style.zIndex = "50";
        document.body.appendChild(el);
    }
    el.textContent = message;
    el.style.opacity = "1";
    setTimeout(() => {
        el.style.transition = "opacity 0.4s ease";
        el.style.opacity = "0";
    }, 2000);
}

export function renderHeaderBasics() {
    // sound toggle restore
    const soundToggle = document.querySelector("#sound-toggle");
    if (soundToggle) {
        const stored = localStorage.getItem("dora-sound-enabled");
        if (stored !== null) {
            soundToggle.checked = stored === "true";
        } else {
            soundToggle.checked = true;
        }
        soundToggle.addEventListener("change", () => {
            localStorage.setItem("dora-sound-enabled", String(soundToggle.checked));
        });
    }

    // clock
    const timeEl = document.querySelector("[data-clock-time]");
    const dateEl = document.querySelector("[data-clock-date]");
    function updateClock() {
        const now = new Date();
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString("hr-HR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        }
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString("hr-HR", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
}

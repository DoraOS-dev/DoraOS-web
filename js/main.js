
import { $, $all, getTodayKey, loadJSON, saveJSON, formatDayShort, renderHeaderBasics, showToast } from "./app.js";

const MED_KEY = "dora-medications";

function initMedications() {
    const todayKey = getTodayKey();
    let data = loadJSON(MED_KEY, {});
    if (!data[todayKey]) {
        data[todayKey] = { bozo: false, kristina: false };
        saveJSON(MED_KEY, data);
    }

    const btnBozo = $("#btn-med-bozo");
    const btnKristina = $("#btn-med-kristina");

    function markTaken(person) {
        const d = loadJSON(MED_KEY, {});
        const today = getTodayKey();
        if (!d[today]) d[today] = { bozo: false, kristina: false };
        d[today][person] = true;
        saveJSON(MED_KEY, d);
        updateWeekGrid();
        showToast(person === "bozo" ? "Zabilježeno za Božu." : "Zabilježeno za Kristinu.");
    }

    if (btnBozo) {
        btnBozo.addEventListener("click", () => markTaken("bozo"));
    }
    if (btnKristina) {
        btnKristina.addEventListener("click", () => markTaken("kristina"));
    }

    updateWeekGrid();
}

function updateWeekGrid() {
    const container = document.querySelector("[data-week-grid]");
    if (!container) return;

    const ALL = loadJSON("dora-medications", {});
    const today = new Date();
    const weekRows = [];

    for (let offset = 0; offset < 7; offset++) {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - offset)); // show Mon..Sun approx
        const key = d.toISOString().slice(0, 10);
        const weekdayIdx = (d.getDay() + 6) % 7; // convert Sunday=0 to Monday=0
        const entry = ALL[key] || { bozo: false, kristina: false };

        weekRows.push({
            label: formatDayShort(weekdayIdx),
            isToday: key === today.toISOString().slice(0, 10),
            bozo: !!entry.bozo,
            kristina: !!entry.kristina
        });
    }

    container.innerHTML = "";
    weekRows.forEach((row) => {
        const el = document.createElement("div");
        el.className = "week-row";
        el.innerHTML = `
            <div>${row.label}</div>
            <div class="dot-row">
                <div class="dot ${row.bozo ? "dot--taken" : ""} ${row.isToday ? "dot--today" : ""}" title="Božo"></div>
                <div class="dot ${row.kristina ? "dot--taken" : ""} ${row.isToday ? "dot--today" : ""}" title="Kristina"></div>
            </div>
        `;
        container.appendChild(el);
    });
}

async function initWeather() {
    const tempEl = $("[data-weather-temp]");
    const descEl = $("[data-weather-desc]");
    const feelsEl = $("[data-weather-feels]");
    const windEl = $("[data-weather-wind]");
    const humEl = $("[data-weather-humidity]");
    const updatedEl = $("[data-weather-updated]");
    const forecastEl = $("[data-weather-forecast]");
    const btnRefresh = $("#btn-weather-refresh");

    async function fetchWeather() {
        try {
            const lat = 45.083; // approximate Vrbnik
            const lon = 14.666;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.current_weather && tempEl && descEl) {
                const t = Math.round(data.current_weather.temperature);
                tempEl.textContent = `${t}°C`;
                descEl.textContent = codeToDescription(data.current_weather.weathercode);
            }

            if (feelsEl && data.current_weather) {
                feelsEl.textContent = `${Math.round(data.current_weather.temperature)}°C`;
            }
            if (windEl && data.current_weather) {
                windEl.textContent = `${Math.round(data.current_weather.windspeed)} km/h`;
            }
            if (humEl && data.hourly && data.hourly.relativehumidity_2m && data.hourly.time) {
                const idx = data.hourly.time.indexOf(data.current_weather.time);
                const h = idx >= 0 ? data.hourly.relativehumidity_2m[idx] : data.hourly.relativehumidity_2m[0];
                humEl.textContent = `${Math.round(h)} %`;
            }
            if (updatedEl && data.current_weather) {
                const dt = new Date(data.current_weather.time);
                updatedEl.textContent = dt.toLocaleString("hr-HR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                });
            }

            if (forecastEl && data.daily) {
                forecastEl.innerHTML = "";
                for (let i = 0; i < 3; i++) {
                    const dt = new Date(data.daily.time[i]);
                    const dayLabel = dt.toLocaleDateString("hr-HR", { weekday: "short" });
                    const max = Math.round(data.daily.temperature_2m_max[i]);
                    const min = Math.round(data.daily.temperature_2m_min[i]);
                    const code = data.daily.weathercode[i];

                    const row = document.createElement("div");
                    row.className = "forecast-day";
                    row.innerHTML = `
                        <span>${dayLabel}</span>
                        <span>${min}–${max}°C</span>
                        <span>${codeToIcon(code)} ${codeToDescription(code)}</span>
                    `;
                    forecastEl.appendChild(row);
                }
            }
        } catch (e) {
            console.error("Weather load failed", e);
        }
    }

    if (btnRefresh) {
        btnRefresh.addEventListener("click", () => {
            fetchWeather().then(() => showToast("Vrijeme osvježeno."));
        });
    }

    fetchWeather();
}

function codeToIcon(code) {
    if (code === 0) return "☀️";
    if ([1,2,3].includes(code)) return "⛅";
    if ([45,48].includes(code)) return "🌫️";
    if ([51,53,55,61,63,65,80,81,82].includes(code)) return "🌧️";
    if ([71,73,75,77,85,86].includes(code)) return "❄️";
    if ([95,96,99].includes(code)) return "⛈️";
    return "☁️";
}

function codeToDescription(code) {
    const map = {
        0: "Vedro",
        1: "Pretežno vedro",
        2: "Djelomično oblačno",
        3: "Oblačno",
        45: "Magla",
        48: "Iznad prizemne magle",
        51: "Slaba rosulja",
        53: "Umjerena rosulja",
        55: "Intenzivna rosulja",
        61: "Slaba kiša",
        63: "Umjerena kiša",
        65: "Jaka kiša",
        71: "Slab snijeg",
        73: "Umjeren snijeg",
        75: "Jak snijeg",
        80: "Pljuskovi kiše",
        81: "Umjereni pljuskovi",
        82: "Jaki pljuskovi",
        95: "Grmljavina",
        96: "Grmljavina s tučom",
        99: "Jaka grmljavina s tučom"
    };
    return map[code] || "Promjenjivo";
}

function initSettingsModal() {
    const openBtn = document.querySelector("[data-open-settings]");
    const backdrop = document.querySelector("[data-settings-backdrop]");
    const pinInput = document.querySelector("#settings-pin");
    const cancelBtn = document.querySelector("#settings-cancel");
    const confirmBtn = document.querySelector("#settings-confirm");
    const clearBtn = document.querySelector("#settings-clear");
    const body = document.querySelector("[data-settings-body]");

    if (!openBtn || !backdrop || !pinInput || !cancelBtn || !confirmBtn || !body) return;

    function open() {
        backdrop.classList.add("modal-backdrop--visible");
        body.classList.remove("settings-locked--visible");
        pinInput.value = "";
        pinInput.focus();
    }

    function close() {
        backdrop.classList.remove("modal-backdrop--visible");
        pinInput.value = "";
    }

    openBtn.addEventListener("click", open);
    cancelBtn.addEventListener("click", close);

    confirmBtn.addEventListener("click", () => {
        const val = pinInput.value.trim();
        if (val === "0000") {
            body.classList.add("settings-locked--visible");
        } else {
            showToast("Netočan PIN.");
            body.classList.remove("settings-locked--visible");
        }
    });

    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
            close();
        }
    });

    clearBtn?.addEventListener("click", () => {
        if (!confirm("Stvarno obrisati sve lokalne podatke (lijekovi, poruke, fotografije)?")) return;
        const keys = [
            "dora-medications",
            "dora-messages",
            "dora-reminders",
            "dora-photos",
            "dora-family-messages"
        ];
        keys.forEach(k => localStorage.removeItem(k));
        showToast("Lokalni podaci su obrisani.");
        // refresh views
        updateWeekGrid();
    });
}

window.addEventListener("DOMContentLoaded", () => {
    renderHeaderBasics();
    initMedications();
    initWeather();
    initSettingsModal();
});

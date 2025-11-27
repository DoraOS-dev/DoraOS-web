// Jednostavna integracija s Open-Meteo za Vrbnik

const VRBNIK_COORDS = {
    latitude: 45.072,   // približno
    longitude: 14.674
};

function buildWeatherUrl() {
    const { latitude, longitude } = VRBNIK_COORDS;
    const params = new URLSearchParams({
        latitude,
        longitude,
        current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
        daily: "weather_code,temperature_2m_max,temperature_2m_min",
        timezone: "auto"
    });
    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
}

function codeToDesc(code) {
    const map = {
        0: "Vedro",
        1: "Pretežno vedro",
        2: "Djelomično oblačno",
        3: "Oblačno",
        45: "Magla",
        48: "Inje / smrzavajuća magla",
        51: "Rominjanje",
        53: "Umjereno rominjanje",
        55: "Jako rominjanje",
        61: "Slaba kiša",
        63: "Umjerena kiša",
        65: "Jaka kiša",
        71: "Slab snijeg",
        73: "Umjeren snijeg",
        75: "Jak snijeg",
        80: "Pljuskovi",
        95: "Grmljavina"
    };
    return map[code] || "Vrijeme";
}

async function loadWeather() {
    const url = buildWeatherUrl();
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderWeatherMain(data);
        renderWeatherDetail(data);
    } catch (err) {
        console.error("Weather error", err);
    }
}

function renderWeatherMain(data) {
    const tempEl = document.getElementById("weather-temp");
    const descEl = document.getElementById("weather-desc");
    const feelsEl = document.getElementById("weather-feels");
    const windEl = document.getElementById("weather-wind");
    const humEl = document.getElementById("weather-humidity");
    const updEl = document.getElementById("weather-updated");
    const nextEl = document.getElementById("weatherNext");

    if (!data || !data.current) return;

    const c = data.current;
    const d = data.daily;

    if (tempEl) tempEl.textContent = Math.round(c.temperature_2m) + "°C";
    if (feelsEl) feelsEl.textContent = Math.round(c.apparent_temperature) + "°C";
    if (windEl) windEl.textContent = Math.round(c.wind_speed_10m) + " km/h";
    if (humEl) humEl.textContent = Math.round(c.relative_humidity_2m) + " %";
    if (descEl) descEl.textContent = codeToDesc(c.weather_code);

    if (updEl && data.current_units && data.current.time) {
        const dt = new Date(data.current.time);
        const fmt = new Intl.DateTimeFormat("hr-HR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
        updEl.textContent = fmt.format(dt);
    }

    if (nextEl && d) {
        nextEl.innerHTML = "";
        for (let i = 0; i < Math.min(3, d.time.length); i++) {
            const day = document.createElement("div");
            day.className = "weather-day";
            const date = new Date(d.time[i]);
            const label = new Intl.DateTimeFormat("hr-HR", { weekday: "short", day: "2-digit", month: "2-digit" }).format(date);
            day.innerHTML = `
                <span><strong>${label}</strong></span>
                <span>${codeToDesc(d.weather_code[i])}</span>
                <span>${Math.round(d.temperature_2m_min[i])}–${Math.round(d.temperature_2m_max[i])}°C</span>
            `;
            nextEl.appendChild(day);
        }
    }
}

function renderWeatherDetail(data) {
    const nowEl = document.getElementById("weather-detail-now");
    const daysEl = document.getElementById("weather-detail-days");
    if (!data || !data.current || (!nowEl && !daysEl)) return;

    if (nowEl) {
        const c = data.current;
        nowEl.innerHTML = `
            <div class="weather-temp">${Math.round(c.temperature_2m)}°C</div>
            <div class="weather-desc">
                <div>${codeToDesc(c.weather_code)}</div>
                <div class="weather-meta">
                    <span>Osjećaj: ${Math.round(c.apparent_temperature)}°C</span>
                    <span>Vjetar: ${Math.round(c.wind_speed_10m)} km/h</span>
                    <span>Vlaga: ${Math.round(c.relative_humidity_2m)} %</span>
                </div>
            </div>
        `;
    }

    if (daysEl && data.daily) {
        const d = data.daily;
        daysEl.innerHTML = "";
        for (let i = 0; i < d.time.length; i++) {
            const div = document.createElement("div");
            div.className = "weather-day";
            const date = new Date(d.time[i]);
            const label = new Intl.DateTimeFormat("hr-HR", { weekday: "short", day: "2-digit", month: "2-digit" }).format(date);
            div.innerHTML = `
                <span><strong>${label}</strong></span>
                <span>${codeToDesc(d.weather_code[i])}</span>
                <span>${Math.round(d.temperature_2m_min[i])}–${Math.round(d.temperature_2m_max[i])}°C</span>
            `;
            daysEl.appendChild(div);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // pokreće se i na index.html i na weather.html
    loadWeather();
});

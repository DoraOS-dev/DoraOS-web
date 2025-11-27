const WEATHER_CACHE_KEY = "dora_weather_cache_v1";
const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minuta

const WEATHER_CONFIG = {
  latitude: 45.076,
  longitude: 14.675,
  timezone: "Europe/Berlin"
};

function resolveSkyIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if ([3].includes(code)) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 61, 63, 65].includes(code)) return "🌧️";
  if ([80, 81, 82].includes(code)) return "🌦️";
  if ([71, 73, 75, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "☁️";
}

function resolveSkyText(code) {
  const map = {
    0: "Vedro",
    1: "Pretežno vedro",
    2: "Djelomično oblačno",
    3: "Oblačno",
    45: "Magla",
    48: "Magla",
    51: "Slaba kiša",
    53: "Kiša",
    55: "Jača kiša",
    61: "Slaba kiša",
    63: "Kiša",
    65: "Jaka kiša",
    71: "Snijeg",
    73: "Snijeg",
    75: "Gust snijeg",
    80: "Pljuskovi",
    81: "Pljuskovi",
    82: "Jaki pljuskovi",
    85: "Snijeg",
    86: "Snijeg",
    95: "Grmljavina",
    96: "Grmljavina",
    99: "Grmljavina"
  };
  return map[code] || "Promjenjivo";
}

function readWeatherCache() {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.timestamp || !parsed.data) return null;
    const age = Date.now() - parsed.timestamp;
    if (age > WEATHER_CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeWeatherCache(data) {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch {
    // ignore
  }
}

async function fetchWeatherFromApi() {
  const { latitude, longitude, timezone } = WEATHER_CONFIG;
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("timezone", timezone);
  url.searchParams.set("current_weather", "true");
  url.searchParams.set("hourly", "relative_humidity_2m,apparent_temperature,wind_speed_10m");
  url.searchParams.set("daily", "weathercode,temperature_2m_max,temperature_2m_min");
  url.searchParams.set("forecast_days", "4");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Ne mogu dohvatiti podatke o vremenu.");
  return res.json();
}

function formatUpdated(iso) {
  const dt = new Date(iso);
  const day = dt.getDate().toString().padStart(2, "0");
  const month = (dt.getMonth() + 1).toString().padStart(2, "0");
  const hour = dt.getHours().toString().padStart(2, "0");
  const min = dt.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}. ${hour}:${min}`;
}

function applyWeatherToUi(payload) {
  const current = payload.current_weather;
  const daily = payload.daily;

  const iconEl = document.getElementById("weather-icon");
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
  const feelsEl = document.getElementById("weather-feels");
  const windEl = document.getElementById("weather-wind");
  const humEl = document.getElementById("weather-humidity");
  const minEl = document.getElementById("weather-min");
  const maxEl = document.getElementById("weather-max");
  const updEl = document.getElementById("weather-updated");

  if (!current || !daily) return;

  const icon = resolveSkyIcon(current.weathercode);
  const text = resolveSkyText(current.weathercode);

  if (iconEl) iconEl.textContent = icon;
  if (tempEl) tempEl.textContent = `${Math.round(current.temperature)}°C`;
  if (descEl) descEl.textContent = text;

  const humidity = payload.hourly?.relative_humidity_2m?.[0];
  const feels = payload.hourly?.apparent_temperature?.[0];
  const wind = payload.hourly?.wind_speed_10m?.[0] ?? current.windspeed;

  if (feelsEl && typeof feels === "number") feelsEl.textContent = `${Math.round(feels)}°C`;
  if (windEl && typeof wind === "number") windEl.textContent = `${Math.round(wind)} km/h`;
  if (humEl && typeof humidity === "number") humEl.textContent = `${Math.round(humidity)} %`;

  if (Array.isArray(daily.temperature_2m_min)) {
    minEl.textContent = `${Math.round(daily.temperature_2m_min[0])}°C`;
  }
  if (Array.isArray(daily.temperature_2m_max)) {
    maxEl.textContent = `${Math.round(daily.temperature_2m_max[0])}°C`;
  }

  if (updEl) updEl.textContent = formatUpdated(current.time);

  const listEl = document.getElementById("forecast-list");
  if (!listEl) return;

  const days = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
  listEl.innerHTML = "";

  for (let i = 1; i <= 3; i++) {
    const dateIso = daily.time[i];
    const tMin = daily.temperature_2m_min[i];
    const tMax = daily.temperature_2m_max[i];
    const code = daily.weathercode[i];

    const dt = new Date(dateIso);
    const label = days[dt.getDay()];

    const li = document.createElement("li");
    li.className = "d3-item";
    li.innerHTML = `
      <div class="d3-label">
        <span class="day">${label}</span>
        <span class="icon">${resolveSkyIcon(code)}</span>
      </div>
      <div class="d3-temp">${Math.round(tMin)}°C / ${Math.round(tMax)}°C</div>
    `;
    listEl.appendChild(li);
  }
}

async function refreshWeather(options = { force: false }) {
  const cached = !options.force && readWeatherCache();
  if (cached) {
    applyWeatherToUi(cached);
    return;
  }

  try {
    const data = await fetchWeatherFromApi();
    writeWeatherCache(data);
    applyWeatherToUi(data);
  } catch (err) {
    console.error(err);
    const descEl = document.getElementById("weather-desc");
    if (descEl) descEl.textContent = "Ne mogu dohvatiti prognozu (provjeri mrežu).";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  refreshWeather();
  const btn = document.getElementById("refresh-weather");
  if (btn) {
    btn.addEventListener("click", () => refreshWeather({ force: true }));
  }
});

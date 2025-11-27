// Dora Asistent – vrijeme za Vrbnik (Open-Meteo)

const VRBNIK_LAT = 45.078;
const VRBNIK_LON = 14.674;

function iconForCode(code) {
  if ([0].includes(code)) return "☀️ Vedro";
  if ([1, 2, 3].includes(code)) return "⛅ Oblačno";
  if ([45, 48].includes(code)) return "🌫 Magla";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧 Kiša";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄ Snijeg";
  if ([95, 96, 99].includes(code)) return "⛈ Oluja";
  return "☁ Nepoznato";
}

async function fetchWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${VRBNIK_LAT}&longitude=${VRBNIK_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Greška pri dohvaćanju podataka");
  return res.json();
}

function formatTemp(t) {
  return `${Math.round(t)}°C`;
}

function renderWeather(data) {
  const current = data.current;
  const daily = data.daily;

  const tempEl = document.getElementById("weatherTemp");
  const descEl = document.getElementById("weatherDesc");
  const feelsEl = document.getElementById("weatherFeels");
  const windEl = document.getElementById("weatherWind");
  const humEl = document.getElementById("weatherHumidity");
  const updEl = document.getElementById("weatherUpdated");

  if (tempEl) tempEl.textContent = formatTemp(current.temperature_2m);
  if (descEl) {
    const label = iconForCode(current.weather_code);
    descEl.textContent = label.replace(/^[^ ]+\s?/, ""); // samo opis
  }
  if (feelsEl) feelsEl.textContent = formatTemp(current.apparent_temperature);
  if (windEl) windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  if (humEl) humEl.textContent = `${current.relative_humidity_2m} %`;
  if (updEl) updEl.textContent = new Date(current.time).toLocaleString("hr-HR");

  const fcEl = document.getElementById("weatherForecast");
  if (!fcEl) return;
  fcEl.innerHTML = "";

  for (let i = 1; i <= 3; i++) {
    const day = document.createElement("div");
    day.className = "forecast-day";
    const date = new Date(daily.time[i]);
    const name = date.toLocaleDateString("hr-HR", { weekday: "short" });
    const label = iconForCode(daily.weather_code[i]).split(" ")[1] || "";
    day.innerHTML = `
      <div>${name}</div>
      <div style="font-size:1.2rem;margin-top:0.1rem;">${label}</div>
      <div class="forecast-day__temp">${formatTemp(daily.temperature_2m_min[i])} – ${formatTemp(
      daily.temperature_2m_max[i]
    )}</div>
    `;
    fcEl.appendChild(day);
  }
}

async function loadWeather() {
  const card = document.getElementById("weatherCurrent");
  if (card) card.classList.add("loading");

  try {
    const data = await fetchWeather();
    renderWeather(data);
  } catch (e) {
    console.error(e);
    const descEl = document.getElementById("weatherDesc");
    if (descEl) descEl.textContent = "Ne mogu dohvatiti podatke.";
  } finally {
    if (card) card.classList.remove("loading");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadWeather();
  const refreshBtn = document.getElementById("weatherRefresh");
  if (refreshBtn) refreshBtn.addEventListener("click", loadWeather);
});

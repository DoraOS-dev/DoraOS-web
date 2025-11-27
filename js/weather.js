const VRBNIK_COORDS = { latitude: 45.078, longitude: 14.674 };

async function fetchWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${VRBNIK_COORDS.latitude}&longitude=${VRBNIK_COORDS.longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Greška pri dohvaćanju podataka");
  return res.json();
}

function weatherIcon(code) {
  if ([0].includes(code)) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if ([3].includes(code)) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "☁️";
}

async function loadWeather() {
  const iconEl = document.getElementById("weather-icon");
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
  const feelsEl = document.getElementById("weather-feels");
  const windEl = document.getElementById("weather-wind");
  const humEl = document.getElementById("weather-humidity");
  const updEl = document.getElementById("weather-updated");
  const listEl = document.getElementById("forecast-list");

  listEl.innerHTML = "";
  descEl.textContent = "Učitavanje...";
  try {
    const data = await fetchWeather();
    const cur = data.current_weather;
    iconEl.textContent = weatherIcon(cur.weathercode);
    tempEl.textContent = `${Math.round(cur.temperature)}°C`;
    descEl.textContent = "Trenutna temperatura";
    feelsEl.textContent = `${Math.round(cur.temperature)}°C`;
    windEl.textContent = `${Math.round(cur.windspeed)} km/h`;
    humEl.textContent = "-- %";
    updEl.textContent = new Date().toLocaleString("hr-HR");

    const days = data.daily.time.slice(1, 4);
    const codes = data.daily.weathercode.slice(1, 4);
    const tmax = data.daily.temperature_2m_max.slice(1, 4);
    const tmin = data.daily.temperature_2m_min.slice(1, 4);

    days.forEach((d, idx) => {
      const item = document.createElement("div");
      item.className = "forecast-item";
      const date = new Date(d);
      const dayLabel = date.toLocaleDateString("hr-HR", { weekday: "short" });
      const icon = weatherIcon(codes[idx]);
      item.innerHTML = `<span>${dayLabel.toUpperCase()}</span>
        <span>${icon}</span>
        <span>${Math.round(tmin[idx])}–${Math.round(tmax[idx])}°C</span>`;
      listEl.appendChild(item);
    });
  } catch (e) {
    descEl.textContent = "Greška pri učitavanju prognoze.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("refresh-weather");
  if (btn) btn.addEventListener("click", loadWeather);
  loadWeather();
});

// Jednostavna prognoza za Vrbnik putem Open-Meteo
const CURRENT_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=45.078&longitude=14.674&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=4&timezone=Europe%2FBerlin";

const weatherCurrent = document.getElementById("weather-current");
const weatherForecast = document.getElementById("weather-forecast");

const WMO = {
  0: "Vedro",
  1: "Pretežno vedro",
  2: "Djelomično oblačno",
  3: "Oblačno",
  45: "Magla",
  48: "Magla s mrazom",
  51: "Slaba rosulja",
  61: "Slaba kiša",
  63: "Umjerena kiša",
  65: "Jaka kiša",
  71: "Slab snijeg",
  80: "Pljusak",
  95: "Grmljavina"
};

function codeToText(code) {
  return WMO[code] || "Promjenjivo";
}

function formatDayLabel(dateStr) {
  const d = new Date(dateStr);
  const days = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
  return days[d.getDay()];
}

async function loadWeather() {
  try {
    const res = await fetch(CURRENT_URL);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    const c = data.current;
    const desc = codeToText(c.weather_code);

    weatherCurrent.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <div style="font-size:2.4rem;">${Math.round(c.temperature_2m)}°C</div>
        <div style="display:flex;flex-direction:column;gap:2px;font-size:0.95rem;">
          <strong>${desc}</strong>
          <span>Osjećaj: ${Math.round(c.apparent_temperature)}°C</span>
          <span>Vjetar: ${Math.round(c.wind_speed_10m)} km/h</span>
          <span>Vlaga: ${Math.round(c.relative_humidity_2m)} %</span>
        </div>
      </div>
      <p class="card-subtitle" style="margin-top:10px;">
        Ažurirano: ${data.current_units.time ? "" : ""}${data.current.time.replace("T", " u ")}
      </p>
    `;

    const days = data.daily;
    let html = '<h3 style="margin:18px 0 8px;">Sljedeća 3 dana</h3>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';

    for (let i = 1; i <= 3; i++) {
      html += `
        <div style="flex:1 1 120px;padding:10px 12px;border-radius:14px;background:#020617;border:1px solid rgba(148,163,184,0.35);">
          <div style="font-size:0.9rem;margin-bottom:4px;">${formatDayLabel(days.time[i])}</div>
          <div style="font-size:0.85rem;color:var(--text-soft);margin-bottom:4px;">${codeToText(
            days.weather_code[i]
          )}</div>
          <div style="font-weight:600;">${Math.round(days.temperature_2m_min[i])}–${Math.round(
        days.temperature_2m_max[i]
      )}°C</div>
        </div>
      `;
    }

    html += "</div>";
    weatherForecast.innerHTML = html;
  } catch (e) {
    console.error(e);
    weatherCurrent.textContent = "Ne mogu dohvatiti podatke o vremenu. Pokušajte kasnije.";
  }
}

loadWeather();

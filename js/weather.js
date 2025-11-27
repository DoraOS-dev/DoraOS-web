const WEATHER_KEY = 'dora_weather_cache_v1';

async function fetchWeather() {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=45.078&longitude=14.674&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Ne mogu dohvatiti podatke o vremenu.');
  const data = await res.json();
  const now = new Date();
  const payload = { fetchedAt: now.toISOString(), data };
  localStorage.setItem(WEATHER_KEY, JSON.stringify(payload));
  return payload;
}

function loadCachedWeather(maxAgeMinutes = 30) {
  try {
    const raw = localStorage.getItem(WEATHER_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    const age = (Date.now() - new Date(obj.fetchedAt).getTime()) / 60000;
    if (age > maxAgeMinutes) return null;
    return obj;
  } catch {
    return null;
  }
}

function decodeWeatherCode(code) {
  const map = {
    0: 'Vedro',
    1: 'Pretežno vedro',
    2: 'Djelomično oblačno',
    3: 'Oblačno',
    45: 'Magla',
    48: 'Magla',
    51: 'Slaba kiša',
    53: 'Kiša',
    55: 'Jaka kiša',
    61: 'Pljuskovi',
    80: 'Pljuskovi',
    95: 'Grmljavina'
  };
  return map[code] || 'Promjenjivo';
}

function renderWeather(payload) {
  const { data, fetchedAt } = payload;
  const current = data.current;
  const daily = data.daily;

  const tempEl = document.querySelector('[data-weather-temp]');
  const descEl = document.querySelector('[data-weather-desc]');
  const feelsEl = document.querySelector('[data-weather-feels]');
  const windEl = document.querySelector('[data-weather-wind]');
  const humidEl = document.querySelector('[data-weather-humid]');
  const timeEl = document.querySelector('[data-weather-time]');
  const forecastWrap = document.querySelector('[data-forecast-list]');

  if (!tempEl) return;

  tempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
  feelsEl.textContent = `${Math.round(current.apparent_temperature)}°`;
  windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  humidEl.textContent = `${Math.round(current.relative_humidity_2m)} %`;

  const dailyCode = daily.weathercode?.[0] ?? 0;
  descEl.textContent = decodeWeatherCode(dailyCode);

  const t = new Date(fetchedAt);
  timeEl.textContent = t.toLocaleString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (forecastWrap) {
    forecastWrap.innerHTML = '';
    for (let i = 0; i < Math.min(3, daily.time.length); i++) {
      const d = new Date(daily.time[i]);
      const label = d.toLocaleDateString('hr-HR', { weekday: 'short' });
      const tMin = Math.round(daily.temperature_2m_min[i]);
      const tMax = Math.round(daily.temperature_2m_max[i]);
      const span = Math.max(1, tMax - tMin);

      const row = document.createElement('div');
      row.className = 'forecast-row';
      row.innerHTML = `
        <span>${label}</span>
        <span>
          <div class="forecast-bar-track">
            <div class="forecast-bar-fill" style="width:${Math.min(100, span * 8)}%"></div>
          </div>
        </span>
        <span>${tMin}–${tMax}°C</span>
      `;
      forecastWrap.appendChild(row);
    }
  }
}

async function initWeatherPage() {
  const refreshBtn = document.querySelector('[data-refresh-weather]');
  const setLoading = (loading) => {
    if (refreshBtn) refreshBtn.disabled = loading;
    document.body.dataset.loadingWeather = loading ? '1' : '';
  };

  const showError = (msg) => {
    const el = document.querySelector('[data-weather-error]');
    if (el) {
      el.textContent = msg;
      el.style.display = 'block';
    } else {
      alert(msg);
    }
  };

  const usePayload = (payload) => {
    renderWeather(payload);
  };

  const cached = loadCachedWeather();
  if (cached) usePayload(cached);

  const doFetch = async () => {
    try {
      setLoading(true);
      const payload = await fetchWeather();
      usePayload(payload);
    } catch (err) {
      console.error(err);
      showError(err.message || 'Dogodila se greška.');
    } finally {
      setLoading(false);
    }
  };

  if (!cached) {
    doFetch();
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => doFetch());
  }
}

document.addEventListener('DOMContentLoaded', initWeatherPage);

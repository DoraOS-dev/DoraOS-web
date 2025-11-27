async function loadWeather(){
 const url="https://api.open-meteo.com/v1/forecast?latitude=45.07&longitude=14.67&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto";
 const r=await fetch(url); const d=await r.json();
 document.getElementById('current').innerHTML =
   d.current_weather.temperature+"°C "+d.current_weather.windspeed+" km/h";
 let out="";
 for(let i=1;i<=3;i++){
   out+= `<div>${d.daily.temperature_2m_min[i]}–${d.daily.temperature_2m_max[i]}°C (code ${d.daily.weathercode[i]})</div>`;
 }
 document.getElementById('forecast').innerHTML=out;
}
loadWeather();
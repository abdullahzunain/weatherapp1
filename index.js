const key = "8ea0c0494db24ca8abcc390bb4aaefc5";

async function fetchWeather(cityInput) {
  if (!cityInput) {
    document.getElementById('weather-result').textContent = "Please enter a city name.";
    return;
  }

  document.getElementById('weather-result').innerHTML = `<p style="color:#0077b6;">Please wait... Fetching weather data for <strong>${cityInput}</strong></p>`;

  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityInput)}&limit=1&appid=${key}`;

  try {
    const geoRes = await fetch(geoURL);
    const geoData = await geoRes.json();

    if (!geoData.length) {
      document.getElementById('weather-result').textContent = "City not found!";
      return;
    }

    const { lat, lon, name, country } = geoData[0];

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    const temp = weatherData.main.temp;
    const desc = weatherData.weather[0].description;

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
    const forecastRes = await fetch(forecastURL);
    const forecastData = await forecastRes.json();

    const dailyForecasts = forecastData.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    ).slice(0, 5);

    let html = `
      <h2>${name}, ${country}</h2>
      <p><strong>Now:</strong> ${temp}°C, ${desc}</p>
      <h3>5-Day Forecast</h3>
      <ol type="1">
    `;

    dailyForecasts.forEach(day => {
      const date = new Date(day.dt_txt).toLocaleDateString();
      const fTemp = day.main.temp;
      const fDesc = day.weather[0].description;
      html += `<li>${date}: ${fTemp}°C, ${fDesc}</li>`;
    });

    html += `</ol>`;
    document.getElementById('weather-result').innerHTML = html;

  } catch (error) {
    console.error(error);
    document.getElementById('weather-result').textContent = "Error fetching weather.";
  }
}


document.getElementById('manual-search').addEventListener('click', () => {
  const city = document.getElementById('city-input').value.trim();
  fetchWeather(city);
});


document.getElementById('city-input').addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    const city = event.target.value.trim();
    fetchWeather(city);
  }
});

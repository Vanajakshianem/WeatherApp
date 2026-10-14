function getWeatherCondition(code) {
  if (code === 0) {
    return "☀️ Clear Sky";
  }

  if (code >= 1 && code <= 3) {
    return "🌤️ Partly Cloudy";
  }

  if (code >= 45 && code <= 48) {
    return "🌫️ Foggy";
  }

  if (code >= 51 && code <= 67) {
    return "🌧️ Rainy";
  }

  if (code >= 71 && code <= 77) {
    return "❄️ Snowy";
  }

  if (code >= 80 && code <= 82) {
    return "🌦️ Rain Showers";
  }

  if (code >= 95) {
    return "⛈️ Thunderstorm";
  }

  return "🌥️ Cloudy";
}

function WeatherCard({ weather }) {
  if (!weather) {
    return (
      <div className="weather-card">
        <h3>Search for a city</h3>
        <p>Enter a city name to see weather information.</p>
      </div>
    );
  }

  return (
    <div className="weather-card">

      <h2>
        {weather.city}, {weather.country}
      </h2>

      <div className="temperature">
        {weather.temperature}°C
      </div>

      <h3>
        {getWeatherCondition(weather.weatherCode)}
      </h3>

      <div className="weather-info">

        <p>
          💧 Humidity: {weather.humidity}%
        </p>

        <p>
          💨 Wind Speed: {weather.wind} km/h
        </p>

      </div>

    </div>
  );
}

export default WeatherCard;
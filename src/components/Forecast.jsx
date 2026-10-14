function getWeatherCondition(code) {
  if (code === 0) {
    return "☀️ Clear";
  }

  if (code >= 1 && code <= 3) {
    return "🌤️ Cloudy";
  }

  if (code >= 45 && code <= 48) {
    return "🌫️ Fog";
  }

  if (code >= 51 && code <= 67) {
    return "🌧️ Rain";
  }

  if (code >= 71 && code <= 77) {
    return "❄️ Snow";
  }

  if (code >= 80 && code <= 82) {
    return "🌦️ Showers";
  }

  if (code >= 95) {
    return "⛈️ Storm";
  }

  return "🌥️ Cloudy";
}

function Forecast({ forecast }) {
  if (!forecast) {
    return null;
  }

  return (
    <div className="forecast-section">

      <h2>6-Day Forecast</h2>

      <div className="forecast-container">

        {forecast.map((day, index) => (
          <div className="forecast-card" key={day.date}>

            <h3>
              {index === 0
                ? "Today"
                : new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short"
                  })}
            </h3>

            <div className="forecast-icon">
              {getWeatherCondition(day.weatherCode)}
            </div>

            <p>
              <strong>{day.maxTemp}°C</strong>
            </p>

            <p>{day.minTemp}°C</p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Forecast;
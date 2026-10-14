function WeatherInfo({ weather }) {
  if (!weather) {
    return null;
  }

  return (
    <div className="weather-info-section">

      <h2>Weather Details</h2>

      <div className="details-container">

        <div className="detail-card">
          <span>🌡️</span>
          <h3>Temperature</h3>
          <p>{weather.temperature}°C</p>
        </div>

        <div className="detail-card">
          <span>💧</span>
          <h3>Humidity</h3>
          <p>{weather.humidity}%</p>
        </div>

        <div className="detail-card">
          <span>💨</span>
          <h3>Wind Speed</h3>
          <p>{weather.wind} km/h</p>
        </div>

      </div>

    </div>
  );
}

export default WeatherInfo;
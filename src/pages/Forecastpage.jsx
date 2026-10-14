import { useState } from "react";
import { useWeather } from "../context/WeatherContext";
import "./Forecastpage.css";

function getValue(day, keys) {
  for (const key of keys) {
    const value = day?.[key];

    if (value !== null && value !== undefined && value !== "") {
      const number = Number(value);
      if (Number.isFinite(number)) return number;
    }
  }

  return null;
}

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌤️";
}

function getWeatherText(code) {
  if (code === 0) return "Clear Sky";
  if ([1, 2].includes(code)) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code))
    return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Variable Weather";
}

function formatDate(date, options) {
  if (!date) return "Date unavailable";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", options);
}

function ForecastPage() {
  const { weather, city } = useWeather();
  const [selectedDay, setSelectedDay] = useState(null);

  const forecast = (weather?.forecast || []).map((day) => ({
    ...day,
    temperature: getValue(day, [
      "temperature",
      "temp",
      "maxTemperature",
      "tempMax",
      "temperature_2m_max",
      "temperatureMax",
    ]),
    wind: getValue(day, [
      "wind",
      "windSpeed",
      "windspeed",
      "wind_speed_10m_max",
    ]),
    weatherCode: getValue(day, [
      "weatherCode",
      "weather_code",
      "weathercode",
    ]),
    rainProbability: getValue(day, [
      "rainProbability",
      "precipitationProbability",
      "precipitation_probability_max",
      "rain_probability",
    ]),
  }));

  const availableTemps = forecast
    .map((day) => day.temperature)
    .filter((value) => value !== null);

  const availableWinds = forecast
    .map((day) => day.wind)
    .filter((value) => value !== null);

  if (!weather) {
    return (
      <main className="forecast-page">
        <section className="forecast-empty">
          <div className="forecast-empty-icon">🌦️</div>
          <h1>Weather Forecast</h1>
          <h2>No City Selected</h2>
          <p>Please go to Home and search for a city first.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="forecast-page">
      <section className="forecast-hero">
        <p className="forecast-eyebrow">🌤️ YOUR WEATHER OUTLOOK</p>
        <h1>{city || weather.city || "Weather Forecast"}</h1>
        <p>
          Plan ahead with daily weather conditions and temperature updates.
        </p>

        <div className="forecast-summary">
          <div>
            <span>📅</span>
            <strong>{forecast.length}</strong>
            <small>Forecast Days</small>
          </div>

          <div>
            <span>🌡️</span>
            <strong>
              {availableTemps.length
                ? `${Math.round(Math.max(...availableTemps))}°C`
                : "Not available"}
            </strong>
            <small>Highest Listed Temperature</small>
          </div>

          <div>
            <span>💨</span>
            <strong>
              {availableWinds.length
                ? `${Math.round(Math.max(...availableWinds))} km/h`
                : "Not available"}
            </strong>
            <small>Maximum Wind Speed</small>
          </div>
        </div>
      </section>

      <section className="forecast-section">
        <div className="forecast-section-heading">
          <div>
            <h2>Daily Forecast</h2>
            <p>Select a day to see more details.</p>
          </div>

          <span className="forecast-count">
            {forecast.length} days
          </span>
        </div>

        {forecast.length === 0 ? (
          <div className="forecast-empty">
            <h2>Forecast unavailable</h2>
            <p>
              No daily forecast data is available. Return to Home and
              search for a city again.
            </p>
          </div>
        ) : (
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <button
                type="button"
                className={`forecast-card ${
                  selectedDay === index ? "selected-forecast" : ""
                }`}
                key={day.date || index}
                onClick={() => setSelectedDay(index)}
              >
                <span className="forecast-date">
                  {formatDate(day.date, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>

                <span className="forecast-icon">
                  {getWeatherIcon(day.weatherCode)}
                </span>

                <strong className="forecast-condition">
                  {getWeatherText(day.weatherCode)}
                </strong>

                <span className="forecast-temperature">
                  🌡️{" "}
                  {day.temperature !== null
                    ? `${Math.round(day.temperature)}°C`
                    : "Temperature unavailable"}
                </span>

                <span className="forecast-wind">
                  💨{" "}
                  {day.wind !== null
                    ? `${Math.round(day.wind)} km/h`
                    : "Wind unavailable"}
                </span>

                {day.rainProbability !== null && (
                  <span className="forecast-rain">
                    🌧️ {Math.round(day.rainProbability)}% rain
                  </span>
                )}

                <span className="forecast-view-details">
                  View Details →
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedDay !== null && forecast[selectedDay] && (
        <section className="forecast-details">
          {(() => {
            const day = forecast[selectedDay];

            return (
              <>
                <div className="details-header">
                  <div>
                    <p>DAILY WEATHER DETAILS</p>
                    <h2>
                      {formatDate(day.date, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="close-details"
                    onClick={() => setSelectedDay(null)}
                    aria-label="Close forecast details"
                  >
                    ✕
                  </button>
                </div>

                <div className="details-content">
                  <span className="details-weather-icon">
                    {getWeatherIcon(day.weatherCode)}
                  </span>

                  <div>
                    <h2>{getWeatherText(day.weatherCode)}</h2>
                    <p className="details-temperature">
                      {day.temperature !== null
                        ? `${Math.round(day.temperature)}°C`
                        : "Temperature unavailable"}
                    </p>
                  </div>
                </div>

                <div className="details-grid">
                  <div>
                    <span>🌡️ Temperature</span>
                    <strong>
                      {day.temperature !== null
                        ? `${Math.round(day.temperature)}°C`
                        : "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>💨 Wind Speed</span>
                    <strong>
                      {day.wind !== null
                        ? `${Math.round(day.wind)} km/h`
                        : "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>🌧️ Rain Probability</span>
                    <strong>
                      {day.rainProbability !== null
                        ? `${Math.round(day.rainProbability)}%`
                        : "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>☁️ Conditions</span>
                    <strong>{getWeatherText(day.weatherCode)}</strong>
                  </div>
                </div>
              </>
            );
          })()}
        </section>
      )}
    </main>
  );
}

export default ForecastPage;
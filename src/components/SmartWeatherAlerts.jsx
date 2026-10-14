
import { useMemo } from "react";
import { useWeather } from "../context/WeatherContext";

function SmartWeatherAlerts() {
  const { weather, city } = useWeather();

  const alerts = useMemo(() => {
    if (!weather?.forecast?.length) {
      return [];
    }

    const forecast = weather.forecast;
    const results = [];

    const rainyDay = forecast.find((day) =>
      [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(
        Number(day.weatherCode)
      )
    );

    const hotDay = forecast.find(
      (day) => Number(day.temperature) >= 35
    );

    const windyDay = forecast.find(
      (day) => Number(day.wind) >= 30
    );

    if (rainyDay) {
      results.push({
        type: "rain",
        icon: "🌧️",
        title: "Rain Expected",
        message: `Rain may occur on ${rainyDay.date}. Carry an umbrella and check the latest forecast.`,
      });
    }

    if (hotDay) {
      results.push({
        type: "heat",
        icon: "🌡️",
        title: "High Temperature",
        message: `Temperature may reach ${hotDay.temperature}°C on ${hotDay.date}. Stay hydrated and avoid prolonged exposure to heat.`,
      });
    }

    if (windyDay) {
      results.push({
        type: "wind",
        icon: "💨",
        title: "Strong Wind",
        message: `Wind speeds may reach ${windyDay.wind} km/h on ${windyDay.date}. Be cautious during outdoor activities.`,
      });
    }

    return results;
  }, [weather]);

  return (
    <section className="smart-alerts-section">
      <div className="smart-alerts-heading">
        <span>⚡ SMART WEATHER MONITOR</span>
        <h2>Weather Alerts for {city || "Your Location"}</h2>
        <p>
          Important conditions detected from the available forecast.
        </p>
      </div>

      {!weather ? (
        <div className="smart-alert-empty">
          Search for a city to view weather alerts.
        </div>
      ) : alerts.length === 0 ? (
        <div className="smart-alert-safe">
          <span>✅</span>
          <div>
            <h3>No Major Conditions Detected</h3>
            <p>
              No rain, high-temperature, or strong-wind conditions
              matching these alert thresholds were found in the forecast.
            </p>
          </div>
        </div>
      ) : (
        <div className="smart-alert-grid">
          {alerts.map((alert) => (
            <article
              key={alert.type}
              className={`smart-alert-card alert-${alert.type}`}
            >
              <span className="smart-alert-icon">{alert.icon}</span>
              <div>
                <h3>{alert.title}</h3>
                <p>{alert.message}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="smart-alert-disclaimer">
        These are forecast-based notices, not official emergency warnings.
        Check local weather authority alerts for safety decisions.
      </p>
    </section>
  );
}

export default SmartWeatherAlerts;

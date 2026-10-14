
import { useState } from "react";
import { useWeather } from "../context/WeatherContext";
import "./Alerts.css";

function Alerts() {
  const { weather, city } = useWeather();
  const [filter, setFilter] = useState("all");

  if (!weather) {
    return (
      <main className="alerts-page">
        <section className="alerts-hero">
          <p className="alerts-eyebrow">⚠️ WEATHER SAFETY CENTER</p>
          <h1>Weather Alerts</h1>
          <p>Stay informed about upcoming weather risks.</p>
        </section>

        <div className="alerts-empty">
          <div className="alerts-empty-icon">🌦️</div>
          <h2>No Weather Data</h2>
          <p>Please go to Home and search for a city first.</p>
        </div>
      </main>
    );
  }

  const forecast = weather.forecast || [];
  const alerts = [];

  const createAlert = (type, title, message, severity, date, icon) => {
    alerts.push({ type, title, message, severity, date, icon });
  };

  forecast.forEach((day) => {
    const temperature = Number(day.temperature);
    const wind = Number(day.wind);
    const code = Number(day.weatherCode);

    const formattedDate = new Date(
      `${day.date}T12:00:00`
    ).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    if (temperature >= 40) {
      createAlert(
        "heat",
        "Extreme Heat",
        `Temperature may reach ${temperature}°C. Avoid direct sunlight and stay hydrated.`,
        "high",
        formattedDate,
        "🔥"
      );
    } else if (temperature >= 35) {
      createAlert(
        "heat",
        "High Temperature",
        `Temperature may reach ${temperature}°C. Drink plenty of water and limit prolonged outdoor activity.`,
        "medium",
        formattedDate,
        "🌡️"
      );
    }

    if (wind >= 50) {
      createAlert(
        "wind",
        "Heavy Wind Warning",
        `Wind speed may reach ${wind} km/h. Take care around trees and loose outdoor objects.`,
        "high",
        formattedDate,
        "💨"
      );
    } else if (wind >= 30) {
      createAlert(
        "wind",
        "Strong Wind",
        `Winds around ${wind} km/h may occur. Take care while travelling outdoors.`,
        "medium",
        formattedDate,
        "🌬️"
      );
    }

    if (code >= 80 && code <= 82) {
      createAlert(
        "rain",
        "Rain Showers Expected",
        "Rain showers may occur. Carry an umbrella and take care while travelling.",
        "high",
        formattedDate,
        "🌧️"
      );
    } else if (code >= 51 && code <= 67) {
      createAlert(
        "rain",
        "Rain Expected",
        "Rain is possible. Carry an umbrella when going outside.",
        "medium",
        formattedDate,
        "☔"
      );
    }

    if (code >= 95) {
      createAlert(
        "storm",
        "Thunderstorm Risk",
        "Thunderstorms may occur. Stay indoors during lightning and follow local safety advice.",
        "high",
        formattedDate,
        "⛈️"
      );
    }

    if (temperature <= 10) {
      createAlert(
        "cold",
        "Very Low Temperature",
        `Temperature may fall to ${temperature}°C. Wear warm clothing.`,
        "medium",
        formattedDate,
        "🥶"
      );
    }
  });

  const highAlerts = alerts.filter((a) => a.severity === "high");
  const mediumAlerts = alerts.filter((a) => a.severity === "medium");

  const filteredAlerts =
    filter === "all"
      ? alerts
      : alerts.filter((alert) => alert.severity === filter);

  return (
    <main className="alerts-page">
      <section className="alerts-hero">
        <p className="alerts-eyebrow">⚠️ WEATHER SAFETY CENTER</p>
        <h1>Weather Alerts</h1>
        <p>
          Weather outlook for <strong>{city || weather.city}</strong>.
          Check possible risks in the available forecast.
        </p>
      </section>

      <section className="alert-summary">
        <article className="alert-summary-card high-summary">
          <span>🚨</span>
          <strong>{highAlerts.length}</strong>
          <p>High Risk</p>
        </article>

        <article className="alert-summary-card medium-summary">
          <span>⚠️</span>
          <strong>{mediumAlerts.length}</strong>
          <p>Medium Risk</p>
        </article>

        <article className="alert-summary-card total-summary">
          <span>📅</span>
          <strong>{alerts.length}</strong>
          <p>Total Alerts</p>
        </article>
      </section>

      <section className="alerts-results">
        <div className="alerts-results-heading">
          <div>
            <h2>Weather Safety Updates</h2>
            <p>Review forecast-based weather risks.</p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter alerts by severity"
          >
            <option value="all">All Alerts</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
          </select>
        </div>

        {alerts.length === 0 ? (
          <div className="alerts-empty">
            <div className="alerts-empty-icon">✅</div>
            <h2>No Risky Conditions Detected</h2>
            <p>
              No conditions matched this page's alert thresholds in the
              available forecast.
            </p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="alerts-empty">
            <div className="alerts-empty-icon">🔎</div>
            <h2>No Alerts in This Category</h2>
            <p>Try selecting another alert filter.</p>
          </div>
        ) : (
          <div className="alerts-list">
            {filteredAlerts.map((alert, index) => (
              <article
                key={`${alert.type}-${alert.date}-${index}`}
                className={`weather-alert-card ${alert.severity}`}
              >
                <div className="alert-icon">{alert.icon}</div>

                <div className="alert-content">
                  <div className="alert-top">
                    <h3>{alert.title}</h3>
                    <span className={`severity-badge ${alert.severity}`}>
                      {alert.severity === "high"
                        ? "HIGH RISK"
                        : "MEDIUM RISK"}
                    </span>
                  </div>

                  <p className="alert-date">📅 {alert.date}</p>
                  <p className="alert-message">{alert.message}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="alerts-disclaimer">
          These are automated forecast-based indicators, not official
          government warnings. Follow local authorities during severe weather.
        </p>
      </section>
    </main>
  );
}

export default Alerts;

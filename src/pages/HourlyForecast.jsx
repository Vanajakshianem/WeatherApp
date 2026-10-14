import { useEffect, useState } from "react";
import "./HourlyForecast.css";

export default function HourlyForecast() {
  const [city] = useState(
    localStorage.getItem("selectedCity") || ""
  );
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city) {
      setError("Please search for a city on the Home page first.");
      return;
    }

    const loadHourlyForecast = async () => {
      setLoading(true);
      setError("");

      try {
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            city
          )}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
          throw new Error("Unable to find the selected city.");
        }

        const geoData = await geoResponse.json();
        const place = geoData.results?.[0];

        if (!place) {
          throw new Error("City not found.");
        }

        const params = new URLSearchParams({
          latitude: place.latitude,
          longitude: place.longitude,
          hourly: "temperature_2m",
          forecast_days: "2",
          timezone: "auto",
        });

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Unable to load hourly weather.");
        }

        const data = await response.json();
        const hourly = data.hourly;

        if (!hourly?.time?.length) {
          throw new Error("Hourly forecast is unavailable.");
        }

        // Select the current hour and the next 23 hours.
        const now = new Date();
        now.setMinutes(0, 0, 0);

        const currentIndex = hourly.time.findIndex(
          (time) => new Date(time).getTime() >= now.getTime()
        );

        const start = currentIndex === -1 ? 0 : currentIndex;

        const result = hourly.time
          .slice(start, start + 24)
          .map((time, index) => ({
            time,
            temperature: hourly.temperature_2m[start + index],
          }))
          .filter((hour) => hour.temperature !== null);

        if (result.length === 0) {
          throw new Error("No hourly temperature data available.");
        }

        setHours(result);
      } catch (err) {
        setError(err.message || "Something went wrong.");
        setHours([]);
      } finally {
        setLoading(false);
      }
    };

    loadHourlyForecast();
  }, [city]);

  const temperatures = hours.map((hour) => hour.temperature);
  const minTemp = temperatures.length
    ? Math.floor(Math.min(...temperatures) - 2)
    : 0;
  const maxTemp = temperatures.length
    ? Math.ceil(Math.max(...temperatures) + 2)
    : 40;
  const tempRange = maxTemp - minTemp || 1;

  const chartWidth = 1000;
  const chartHeight = 400;
  const left = 65;
  const right = 25;
  const top = 35;
  const bottom = 65;
  const plotWidth = chartWidth - left - right;
  const plotHeight = chartHeight - top - bottom;

  const points = hours.map((hour, index) => {
    const x =
      left +
      (index / Math.max(hours.length - 1, 1)) * plotWidth;

    const y =
      top +
      ((maxTemp - hour.temperature) / tempRange) * plotHeight;

    return { x, y, hour };
  });

  const linePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <main className="hourly-page">
      <section className="hourly-header">
        <p className="hourly-eyebrow">WEATHER FORECAST</p>
        <h1>Hourly Temperature Forecast</h1>
        <p>
          Next 24 hours for{" "}
          <strong>{city || "your selected city"}</strong>
        </p>
      </section>

      {loading && (
        <p className="hourly-message">Loading hourly forecast...</p>
      )}

      {error && <p className="hourly-error">{error}</p>}

      {!loading && !error && hours.length > 0 && (
        <section className="hourly-graph">
          <div className="graph-heading">
            <h2>Temperature Trend</h2>
            <span>
              {Math.round(Math.max(...temperatures))}°C max ·{" "}
              {Math.round(Math.min(...temperatures))}°C min
            </span>
          </div>

          <div className="temperature-chart">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              role="img"
              aria-label={`Temperature graph for the next ${hours.length} hours in ${city}`}
            >
              {/* Horizontal grid lines and temperature labels */}
              {Array.from({ length: 5 }, (_, index) => {
                const y = top + (plotHeight / 4) * index;
                const temperature =
                  maxTemp - (tempRange / 4) * index;

                return (
                  <g key={index}>
                    <line
                      x1={left}
                      y1={y}
                      x2={chartWidth - right}
                      y2={y}
                      stroke="#dbeafe"
                      strokeWidth="1"
                    />
                    <text
                      x={left - 12}
                      y={y + 5}
                      textAnchor="end"
                      fontSize="13"
                      fill="#64748b"
                    >
                      {Math.round(temperature)}°
                    </text>
                  </g>
                );
              })}

              {/* Temperature line */}
              {points.length > 1 && (
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Temperature points and time labels */}
              {points.map((point, index) => (
                <g key={point.hour.time}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth="3"
                  >
                    <title>
                      {new Date(
                        point.hour.time
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      — {Math.round(point.hour.temperature)}°C
                    </title>
                  </circle>

                  {index % 3 === 0 && (
                    <text
                      x={point.x}
                      y={chartHeight - 25}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#475569"
                    >
                      {new Date(
                        point.hour.time
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                      })}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          <p className="graph-caption">
            Time → · Temperature (°C) ↑
          </p>
        </section>
      )}
    </main>
  );
}

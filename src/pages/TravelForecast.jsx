import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TravelForecast.css";

const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast";

function getWeatherDescription(code) {
  if (code === 0) return "Clear Sky";
  if ([1, 2].includes(code)) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain Showers";
  if ([85, 86].includes(code)) return "Snow Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Weather Update";
}

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if ([3, 45, 48].includes(code)) return "☁️";

  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)
  ) {
    return "🌧️";
  }

  if ([95, 96, 99].includes(code)) return "⛈️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "🌨️";

  return "🌦️";
}

function getTravelAdvice(code, rain, maxTemp, wind) {
  if ([95, 96, 99].includes(code)) {
    return "Thunderstorms possible. Check official local advisories before travelling.";
  }

  if (rain >= 60 || [65, 67, 82].includes(code)) {
    return "Rain is likely. Carry rain protection and check local travel conditions.";
  }

  if (wind >= 40) {
    return "Strong winds possible. Check conditions before outdoor activities.";
  }

  if (maxTemp >= 35) {
    return "Hot weather expected. Stay hydrated and plan outdoor activities carefully.";
  }

  return "Conditions may be suitable for sightseeing. Check updates before departure.";
}

function getSuitability(day) {
  let score = 100;

  if ([95, 96, 99].includes(day.code)) score -= 55;
  else if ([65, 67, 82, 86].includes(day.code)) score -= 35;
  else if ([61, 63, 80, 81, 85].includes(day.code)) score -= 25;
  else if ([51, 53, 55, 56, 57].includes(day.code)) score -= 12;
  else if ([45, 48].includes(day.code)) score -= 15;

  if (day.rain != null) {
    if (day.rain >= 70) score -= 20;
    else if (day.rain >= 40) score -= 10;
  }

  if (day.maxTemp >= 38) score -= 20;
  else if (day.maxTemp >= 35) score -= 12;

  if (day.minTemp <= 0) score -= 10;

  if (day.wind != null) {
    if (day.wind >= 50) score -= 20;
    else if (day.wind >= 35) score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

function getSuitabilityLabel(score) {
  if (score >= 80) return "Very Good";
  if (score >= 60) return "Good";
  if (score >= 40) return "Plan Carefully";
  return "Check Conditions";
}

function getActivities(day) {
  if ([95, 96, 99].includes(day.code)) {
    return [
      "Indoor museums or galleries",
      "Indoor cafes and local food",
      "Postpone exposed outdoor activities",
    ];
  }

  if (
    (day.rain ?? 0) >= 60 ||
    [61, 63, 65, 66, 67, 80, 81, 82].includes(day.code)
  ) {
    return [
      "Indoor attractions",
      "Local food and shopping",
      "Carry an umbrella for short outdoor visits",
    ];
  }

  if (day.maxTemp >= 35) {
    return [
      "Indoor attractions during peak heat",
      "Early-morning sightseeing",
      "Relax in shaded areas and stay hydrated",
    ];
  }

  if ((day.wind ?? 0) >= 40) {
    return [
      "Indoor sightseeing",
      "Explore local cafes and markets",
      "Check conditions before outdoor excursions",
    ];
  }

  if ([0, 1, 2].includes(day.code)) {
    return [
      "Outdoor sightseeing",
      "Photography and scenic walks",
      "Explore local landmarks",
    ];
  }

  return [
    "Visit local attractions",
    "Explore indoor and outdoor sights",
    "Check local conditions before excursions",
  ];
}

/* Generate a weather-based daily itinerary */
function getDailyItinerary(day) {
  const code = day.code;
  const rain = day.rain ?? 0;
  const temp = day.maxTemp;
  const wind = day.wind ?? 0;

  if ([95, 96, 99].includes(code)) {
    return {
      title: "Indoor and Relaxed Day",
      morning: "Visit indoor museums or explore local cafes.",
      afternoon: "Enjoy local food and indoor attractions.",
      evening: "Relax at your accommodation and check weather alerts.",
      tip: "Thunderstorms are possible. Avoid exposed outdoor activities.",
    };
  }

  if (
    rain >= 60 ||
    [61, 63, 65, 67, 80, 81, 82].includes(code)
  ) {
    return {
      title: "Rain-Friendly Travel Day",
      morning: "Explore indoor attractions and local markets.",
      afternoon: "Try local cuisine and visit covered sightseeing spots.",
      evening: "Choose an indoor activity or relax.",
      tip: "Carry an umbrella or raincoat and check road conditions.",
    };
  }

  if (wind >= 40) {
    return {
      title: "Wind-Aware Travel Day",
      morning: "Choose nearby attractions with sheltered areas.",
      afternoon: "Explore indoor attractions and local food spots.",
      evening: "Enjoy a relaxed evening indoors if winds remain strong.",
      tip: "Check local wind advisories before outdoor excursions.",
    };
  }

  if (temp >= 35) {
    return {
      title: "Warm Weather Travel Day",
      morning: "Plan outdoor sightseeing early in the morning.",
      afternoon: "Visit indoor attractions during peak heat.",
      evening: "Explore local markets or enjoy a relaxed evening walk.",
      tip: "Carry water, sunscreen and a hat. Stay hydrated.",
    };
  }

  return {
    title: "Sightseeing and Exploration Day",
    morning: "Visit popular attractions and scenic viewpoints.",
    afternoon: "Explore nearby landmarks and enjoy local food.",
    evening: "Enjoy photography, shopping or a relaxed local walk.",
    tip: "Check local conditions and attraction timings before departure.",
  };
}

function buildPackingChecklist(results) {
  const availableDays = results
    .filter((result) => !result.unavailable)
    .flatMap((result) => result.days);

  const items = [
    { id: "documents", label: "Travel documents and ID" },
    { id: "charger", label: "Phone charger and power bank" },
    { id: "water", label: "Water bottle" },
    { id: "medicines", label: "Personal medicines and essentials" },
  ];

  if (availableDays.length === 0) {
    return [
      ...items,
      { id: "clothes", label: "Comfortable clothes" },
      { id: "shoes", label: "Comfortable walking shoes" },
    ];
  }

  if (
    availableDays.some(
      (day) =>
        (day.rain ?? 0) >= 40 ||
        [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(day.code)
    )
  ) {
    items.push({ id: "umbrella", label: "Umbrella or raincoat" });
  }

  if (
    availableDays.some(
      (day) => day.maxTemp >= 30 || [0, 1, 2].includes(day.code)
    )
  ) {
    items.push({
      id: "sunscreen",
      label: "Sunscreen, sunglasses and a hat",
    });
  }

  if (availableDays.some((day) => day.minTemp <= 15)) {
    items.push({
      id: "jacket",
      label: "Light jacket or warm clothing",
    });
  }

  if (availableDays.some((day) => (day.wind ?? 0) >= 35)) {
    items.push({
      id: "wind",
      label: "Wind-resistant outer layer",
    });
  }

  items.push(
    { id: "clothes", label: "Comfortable clothes" },
    { id: "shoes", label: "Comfortable walking shoes" }
  );

  return items;
}

function TravelForecast() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem("weatherTravelPlan");

      if (!savedPlan) {
        setError("No trip found. Please create a travel plan first.");
        return;
      }

      const parsedPlan = JSON.parse(savedPlan);

      if (
        !parsedPlan.startDate ||
        !parsedPlan.endDate ||
        !Array.isArray(parsedPlan.destinations) ||
        parsedPlan.destinations.length === 0
      ) {
        setError("Your saved trip is incomplete. Please create it again.");
        return;
      }

      if (parsedPlan.startDate > parsedPlan.endDate) {
        setError("The trip end date must be on or after the start date.");
        return;
      }

      setPlan(parsedPlan);
    } catch {
      setError("Unable to read your saved trip. Please create it again.");
    }
  }, []);

  useEffect(() => {
    if (!plan) return;

    let cancelled = false;

    async function loadForecasts() {
      setLoading(true);
      setError("");
      setResults([]);
      setCheckedItems([]);

      try {
        const start = new Date(`${plan.startDate}T00:00:00`);
        const end = new Date(`${plan.endDate}T00:00:00`);
        const tripDays = Math.floor((end - start) / 86400000) + 1;

        if (tripDays < 1) {
          throw new Error("Please select valid trip dates.");
        }

        const allResults = await Promise.all(
          plan.destinations.map(async (place) => {
            try {
              const geoResponse = await fetch(
                `${GEOCODING_URL}?name=${encodeURIComponent(
                  place
                )}&count=1&language=en&format=json`
              );

              if (!geoResponse.ok) {
                throw new Error(`Could not search for ${place}.`);
              }

              const geoData = await geoResponse.json();
              const location = geoData.results?.[0];

              if (!location) {
                return {
                  place,
                  unavailable: true,
                  message: "Location not found. Check the destination name.",
                  days: [],
                };
              }

              const forecastResponse = await fetch(
                `${FORECAST_URL}?latitude=${location.latitude}&longitude=${location.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=16`
              );

              if (!forecastResponse.ok) {
                throw new Error(`Could not load forecast for ${place}.`);
              }

              const forecast = await forecastResponse.json();

              const days = (forecast.daily?.time || [])
                .map((date, index) => {
                  const code = forecast.daily.weather_code[index];
                  const rain =
                    forecast.daily.precipitation_probability_max?.[index] ??
                    null;
                  const maxTemp =
                    forecast.daily.temperature_2m_max[index];
                  const minTemp =
                    forecast.daily.temperature_2m_min[index];
                  const wind =
                    forecast.daily.wind_speed_10m_max?.[index] ?? null;

                  return {
                    date,
                    code,
                    rain,
                    maxTemp,
                    minTemp,
                    wind,
                    description: getWeatherDescription(code),
                    icon: getWeatherIcon(code),
                  };
                })
                .filter(
                  (day) =>
                    day.date >= plan.startDate &&
                    day.date <= plan.endDate
                )
                .map((day) => ({
                  ...day,
                  advice: getTravelAdvice(
                    day.code,
                    day.rain ?? 0,
                    day.maxTemp,
                    day.wind ?? 0
                  ),
                  suitability: getSuitability(day),
                  activities: getActivities(day),
                  itinerary: getDailyItinerary(day),
                }));

              return {
                place,
                location: location.name,
                country: location.country,
                days,
              };
            } catch (err) {
              return {
                place,
                unavailable: true,
                message:
                  err.message || `Could not load weather for ${place}.`,
                days: [],
              };
            }
          })
        );

        if (!cancelled) {
          setResults(allResults);

          if (allResults.every((item) => item.unavailable)) {
            setError(
              "We couldn't load forecasts for the selected destinations. Check your internet connection and destination names."
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load travel forecasts. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadForecasts();

    return () => {
      cancelled = true;
    };
  }, [plan]);

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const packingItems = useMemo(
    () => buildPackingChecklist(results),
    [results]
  );

  const allDays = results
    .filter((result) => !result.unavailable)
    .flatMap((result) => result.days);

  const averageScore = allDays.length
    ? Math.round(
        allDays.reduce((sum, day) => sum + day.suitability, 0) /
          allDays.length
      )
    : null;

  function togglePackingItem(id) {
    setCheckedItems((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  return (
    <main className="travel-forecast-page">
      <button
        className="back-to-planner"
        onClick={() => navigate("/travel-planner")}
      >
        ← Back to Travel Planner
      </button>

      <section className="travel-forecast-hero">
        <span>✈️ YOUR JOURNEY WEATHER</span>
        <h1>Travel Forecast</h1>
        <p>
          Weather insights, travel suitability, packing suggestions and a
          daily travel itinerary for your trip.
        </p>

        {plan && (
          <div className="trip-date-badge">
            🗓️ {formatDate(plan.startDate)} — {formatDate(plan.endDate)}
          </div>
        )}
      </section>

      {loading && (
        <p className="travel-forecast-status">
          🌤️ Loading destination forecasts...
        </p>
      )}

      {error && (
        <div className="travel-forecast-error">
          <p>{error}</p>
          <button onClick={() => navigate("/travel-planner")}>
            Create or Edit Trip
          </button>
        </div>
      )}

      {!loading && averageScore !== null && (
        <section className="traveler-insights">
          <article className="traveler-insight-card">
            <span>🧭</span>
            <h2>Trip Weather Score</h2>
            <p className="traveler-score">{averageScore}/100</p>
            <strong>{getSuitabilityLabel(averageScore)}</strong>
            <p>
              Average estimate across available destination days. Check each
              day's conditions before making plans.
            </p>
          </article>

          <article className="traveler-insight-card">
            <span>🎒</span>
            <h2>Smart Packing Checklist</h2>
            <p>
              {checkedItems.length} of {packingItems.length} items packed
            </p>

            <div className="packing-progress">
              <div
                className="packing-progress-fill"
                style={{
                  width: `${
                    packingItems.length
                      ? (checkedItems.length / packingItems.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="packing-checklist">
              {packingItems.map((item) => (
                <label key={item.id} className="packing-item">
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.id)}
                    onChange={() => togglePackingItem(item.id)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </article>
        </section>
      )}

      {!loading && results.length > 0 && (
        <section className="destination-forecast-grid">
          {results.map((result) => (
            <article
              className="destination-forecast-card"
              key={result.place}
            >
              <div className="destination-forecast-header">
                <span>📍 {result.place}</span>
                <span>🌍</span>
              </div>

              {result.unavailable ? (
                <p>{result.message}</p>
              ) : (
                <>
                  <p className="destination-location">
                    {result.location}, {result.country}
                  </p>

                  {result.days.length === 0 && (
                    <p className="forecast-unavailable">
                      No forecast available for the selected trip dates.
                      Forecast data may not cover dates far in the future.
                    </p>
                  )}

                  {result.days.map((day) => (
                    <div className="destination-day" key={day.date}>
                      <div className="destination-day-heading">
                        <strong>{formatDate(day.date)}</strong>
                        <span className="destination-weather-icon">
                          {day.icon}
                        </span>
                      </div>

                      <h3>{day.description}</h3>

                      <p className="destination-temperature">
                        {Math.round(day.maxTemp)}°C
                        <span> / {Math.round(day.minTemp)}°C</span>
                      </p>

                      <div className="destination-weather-stats">
                        <span>
                          💧 Rain:{" "}
                          {day.rain == null ? "N/A" : `${day.rain}%`}
                        </span>
                        <span>
                          💨 Wind:{" "}
                          {day.wind == null
                            ? "N/A"
                            : `${Math.round(day.wind)} km/h`}
                        </span>
                      </div>

                      <div className="travel-suitability">
                        <strong>🧭 Travel Suitability</strong>
                        <span>
                          {day.suitability}/100 —{" "}
                          {getSuitabilityLabel(day.suitability)}
                        </span>
                        <div className="suitability-progress">
                          <div
                            className="suitability-progress-fill"
                            style={{ width: `${day.suitability}%` }}
                          />
                        </div>
                      </div>

                      <p className="destination-advice">
                        💡 {day.advice}
                      </p>

                      <div className="activity-recommendations">
                        <h4>✨ Suggested Activities</h4>
                        <ul>
                          {day.activities.map((activity) => (
                            <li key={activity}>{activity}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Daily Travel Itinerary */}
                      <div className="daily-itinerary">
                        <h4>🗓️ Daily Travel Itinerary</h4>
                        <h5>{day.itinerary.title}</h5>

                        <div className="itinerary-schedule">
                          <div className="itinerary-time">
                            <span>🌅</span>
                            <div>
                              <strong>Morning</strong>
                              <p>{day.itinerary.morning}</p>
                            </div>
                          </div>

                          <div className="itinerary-time">
                            <span>☀️</span>
                            <div>
                              <strong>Afternoon</strong>
                              <p>{day.itinerary.afternoon}</p>
                            </div>
                          </div>

                          <div className="itinerary-time">
                            <span>🌆</span>
                            <div>
                              <strong>Evening</strong>
                              <p>{day.itinerary.evening}</p>
                            </div>
                          </div>
                        </div>

                        <p className="itinerary-tip">
                          💡 <strong>Travel Tip:</strong>{" "}
                          {day.itinerary.tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </article>
          ))}
        </section>
      )}

      <p className="forecast-disclaimer">
        Forecasts and suitability scores are estimates, not safety guarantees.
        Weather data may not be available for dates beyond the provider's
        forecast range. Itinerary suggestions are general recommendations,
        not verified attraction bookings or opening hours. Always check
        official weather advisories and local conditions before travel.
      </p>
    </main>
  );
}

export default TravelForecast;
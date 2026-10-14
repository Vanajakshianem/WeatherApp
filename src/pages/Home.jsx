
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import WeatherInfo from "../components/WeatherInfo";
import WeatherMap from "../components/WeatherMap";
import WeatherTips from "../components/WeatherTips";
import SmartWeatherAlerts from "../components/SmartWeatherAlerts";

import {
  getWeather,
  getWeatherByCoordinates,
} from "../services/weatherApi";

import { useWeather } from "../context/WeatherContext";

// Smart Weather Assistant profiles
const roleOptions = [
  {
    value: "STUDENT",
    label: "Student",
    emoji: "🎓",
    subtitle: "Campus and study weather",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  },
  {
    value: "FARMER",
    label: "Farmer",
    emoji: "🌾",
    subtitle: "Rainfall and farming updates",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80",
  },
  {
    value: "EMPLOYEE",
    label: "Employee",
    emoji: "💼",
    subtitle: "Daily commute weather",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80",
  },
  {
    value: "TRAVELER",
    label: "Traveler",
    emoji: "🧳",
    subtitle: "Destination and travel safety",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80",
  },
];

// Recommendations for each profile
const roleRecommendations = {
  STUDENT: {
    title: "Student Weather Assistant",
    description:
      "Plan your college day with personalized weather insights.",
    tips: [
      "Carry an umbrella when rain is forecast.",
      "Stay hydrated during hot weather.",
      "Avoid outdoor activities during thunderstorms.",
    ],
  },
  FARMER: {
    title: "Smart Farming Assistant",
    description:
      "Make informed farming decisions using weather forecasts.",
    tips: [
      "Adjust irrigation schedules when rainfall is expected.",
      "Protect crops during strong winds.",
      "Store harvested grains safely before heavy rainfall.",
    ],
  },
  EMPLOYEE: {
    title: "Smart Commute Assistant",
    description:
      "Prepare for your daily commute with weather updates.",
    tips: [
      "Carry an umbrella when rain is forecast.",
      "Stay hydrated during high temperatures.",
      "Check weather conditions before travelling.",
    ],
  },
  TRAVELER: {
    title: "Travel Weather Assistant",
    description:
      "Plan safer and more comfortable trips with weather insights.",
    tips: [
      "Adjust sightseeing plans when heavy rain is expected.",
      "Check local safety advisories during thunderstorms.",
      "Pack suitable clothing for your destination.",
    ],
  },
};

function Home() {
  const [searchParams] = useSearchParams();
  const cityFromUrl = searchParams.get("city");

  const [cityInput, setCityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [selectedRole, setSelectedRole] = useState(
    () => localStorage.getItem("weatherAssistantRole") || ""
  );

  const { weather, setWeather, setCity } = useWeather();

  // Load weather when opening a saved place
  useEffect(() => {
    if (!cityFromUrl) return;

    let cancelled = false;

    const loadSavedCityWeather = async () => {
      setCityInput(cityFromUrl);
      setLoading(true);
      setError("");

      try {
        const data = await getWeather(cityFromUrl);

        if (!cancelled) {
          setWeather(data);
          setCity(data.city);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setWeather(null);
          setError("Unable to load weather for this saved place.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSavedCityWeather();

    return () => {
      cancelled = true;
    };
  }, [cityFromUrl, setWeather, setCity]);

  // Update date and time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Search weather by city
  const searchWeather = async () => {
    if (!cityInput.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getWeather(cityInput.trim());

      setWeather(data);
      setCity(data.city);
    } catch (err) {
      console.error(err);
      setWeather(null);
      setError("Unable to get weather. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get weather for the current location
  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Location is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getWeatherByCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );

          setCityInput(data.city);
          setWeather(data);
          setCity(data.city);
        } catch (err) {
          console.error(err);
          setWeather(null);
          setError("Unable to get weather for your location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError(
          "Location permission was denied. Please allow location access."
        );
      }
    );
  };

  const formattedDate = currentDateTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const recommendation = roleRecommendations[selectedRole];

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="welcome-text">🌤️ Welcome to Weather App</p>

          <h1>Check the weather. Plan your day.</h1>

          <p className="hero-description">
            Get real-time weather information, forecasts, alerts and
            personalized weather tips.
          </p>

          <div className="datetime-card">
            <div>
              📅 <span>{formattedDate}</span>
            </div>
            <div>
              🕐 <span>{formattedTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Weather Search */}
      <section className="search-section">
        <SearchBar
          city={cityInput}
          setCity={setCityInput}
          onSearch={searchWeather}
          onCurrentLocation={getCurrentLocationWeather}
        />
      </section>

      {loading && (
        <p className="status-message">🌤️ Loading weather...</p>
      )}

      {error && (
        <p className="error status-message">{error}</p>
      )}

      {/* Smart Weather Assistant */}
      <section className="smart-assistant smart-assistant-new">
        <div className="smart-assistant-heading">
          <span>🧠 SMART WEATHER ASSISTANT</span>
          <h2>Weather That Understands Your Needs</h2>
          <p>
            Choose your profile to receive weather guidance for your
            daily activities.
          </p>
        </div>

        <div className="smart-role-grid">
          {roleOptions.map((role) => (
            <button
              type="button"
              key={role.value}
              className={`smart-role-card ${
                selectedRole === role.value ? "smart-role-active" : ""
              }`}
              onClick={() => {
                setSelectedRole(role.value);
                localStorage.setItem("weatherAssistantRole", role.value);
              }}
            >
              <img src={role.image} alt={role.label} />

              <div className="smart-role-overlay">
                <span className="smart-role-emoji">
                  {role.emoji}
                </span>

                <h3>{role.label}</h3>
                <p>{role.subtitle}</p>

                <span className="smart-role-action">
                  {selectedRole === role.value
                    ? "✓ Selected"
                    : "View Recommendations →"}
                </span>
              </div>
            </button>
          ))}
        </div>

        {recommendation && (
          <div className="smart-recommendation-panel">
            <span className="recommendation-label">
              PERSONALIZED GUIDANCE
            </span>

            <h3>{recommendation.title}</h3>
            <p>{recommendation.description}</p>

            <h4>💡 Recommended Actions</h4>

            <ul>
              {recommendation.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>

            <p className="smart-recommendation-note">
              These are general recommendations. Check the latest forecast
              and official local warnings before making weather-sensitive
              decisions.
            </p>
          </div>
        )}

        {!selectedRole && (
          <p className="smart-role-prompt">
            👆 Select a profile to get personalized weather recommendations.
          </p>
        )}
      </section>

      {/* Smart Weather Alerts */}
      <SmartWeatherAlerts />

      {/* Weather Dashboard */}
      {!loading && weather && (
        <section className="weather-dashboard">
          <div className="weather-main-card">
            <WeatherCard weather={weather} />
          </div>

          <div className="weather-info-card">
            <WeatherInfo weather={weather} />
          </div>

          <div className="map-card">
            <WeatherMap weather={weather} />
          </div>

          <div className="tips-card">
            <WeatherTips weather={weather} />
          </div>
        </section>
      )}

      {!loading && !weather && !error && (
        <div className="empty-weather">
          <div className="empty-icon">🌦️</div>
          <h2>Search for a city to get started</h2>
          <p>
            Enter your city above and discover the current weather conditions.
          </p>
        </div>
      )}
    </main>
  );
}

export default Home;

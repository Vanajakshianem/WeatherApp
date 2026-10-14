// Save weather data to Spring Boot backend
async function saveWeatherToBackend(weather) {
  try {
    const response = await fetch("http://localhost:8080/api/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: weather.city,
        country: weather.country,
        latitude: weather.latitude,
        longitude: weather.longitude,
        temperature: weather.temperature,
        humidity: weather.humidity,
        wind: weather.wind,
        weatherCode: weather.weatherCode,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to save weather data to backend");
    }

    return await response.json();
  } catch (error) {
    // Weather forecast should still work if backend saving fails.
    console.error("Backend save failed:", error.message);
    return null;
  }
}

// Convert Open-Meteo weather codes into readable descriptions
export function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Heavy thunderstorm with hail",
  };

  return descriptions[code] ?? "Unknown conditions";
}

// Get weather by city name
export async function getWeather(city) {
  const geoUrl =
    `https://geocoding-api.open-meteo.com/v1/search?` +
    `name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error("Unable to find location");
  }

  const geoData = await geoResponse.json();

  if (!geoData.results?.length) {
    throw new Error("City not found");
  }

  const location = geoData.results[0];

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${location.latitude}` +
    `&longitude=${location.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_probability_max` +
    `&forecast_days=6&timezone=auto`;

  const weatherResponse = await fetch(weatherUrl);

  if (!weatherResponse.ok) {
    throw new Error("Unable to get weather data");
  }

  const weatherData = await weatherResponse.json();

  if (!weatherData.current || !weatherData.daily) {
    throw new Error("Weather data is unavailable");
  }

  const daily = weatherData.daily;

  const weather = {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,

    temperature: weatherData.current.temperature_2m,
    humidity: weatherData.current.relative_humidity_2m,
    wind: weatherData.current.wind_speed_10m,
    weatherCode: weatherData.current.weather_code,

    forecast: daily.time.map((date, index) => ({
      date,
      maxTemp: daily.temperature_2m_max[index],
      minTemp: daily.temperature_2m_min[index],
      temperature: daily.temperature_2m_max[index],
      wind: daily.wind_speed_10m_max?.[index] ?? null,
      weatherCode: daily.weather_code[index],
      rainProbability:
        daily.precipitation_probability_max?.[index] ?? null,
      description: getWeatherDescription(daily.weather_code[index]),
    })),
  };

  // Save to backend without blocking the weather display
  await saveWeatherToBackend(weather);

  return weather;
}

// Get weather using current coordinates
export async function getWeatherByCoordinates(latitude, longitude) {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_probability_max` +
    `&forecast_days=6&timezone=auto`;

  const weatherResponse = await fetch(weatherUrl);

  if (!weatherResponse.ok) {
    throw new Error("Unable to get weather data");
  }

  const weatherData = await weatherResponse.json();

  if (!weatherData.current || !weatherData.daily) {
    throw new Error("Weather data is unavailable");
  }

  const daily = weatherData.daily;

  const weather = {
    city: "Current Location",
    country: "",
    latitude,
    longitude,

    temperature: weatherData.current.temperature_2m,
    humidity: weatherData.current.relative_humidity_2m,
    wind: weatherData.current.wind_speed_10m,
    weatherCode: weatherData.current.weather_code,

    forecast: daily.time.map((date, index) => ({
      date,
      maxTemp: daily.temperature_2m_max[index],
      minTemp: daily.temperature_2m_min[index],
      temperature: daily.temperature_2m_max[index],
      wind: daily.wind_speed_10m_max?.[index] ?? null,
      weatherCode: daily.weather_code[index],
      rainProbability:
        daily.precipitation_probability_max?.[index] ?? null,
      description: getWeatherDescription(daily.weather_code[index]),
    })),
  };

  await saveWeatherToBackend(weather);

  return weather;
}

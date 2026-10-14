function WeatherTips({ weather }) {
  if (!weather) {
    return null;
  }

  const temperature = weather.temperature;
  const humidity = weather.humidity;
  const wind = weather.wind;
  const code = weather.weatherCode;

  let tips = [];

  // Temperature tips
  if (temperature >= 35) {
    tips.push("🥵 It is very hot. Drink plenty of water and avoid direct sunlight.");
  } else if (temperature >= 30) {
    tips.push("☀️ It is warm outside. Stay hydrated and use sunscreen.");
  } else if (temperature <= 15) {
    tips.push("🧥 It is cold. Wear warm clothes when going outside.");
  } else {
    tips.push("😊 The temperature is comfortable today.");
  }

  // Rain tips
  if (code >= 51 && code <= 82) {
    tips.push("☔ Rain is possible. Carry an umbrella when going outside.");
  }

  // Thunderstorm tips
  if (code >= 95) {
    tips.push("⛈️ Thunderstorm conditions are possible. Stay indoors if possible.");
  }

  // Wind tips
  if (wind >= 30) {
    tips.push("💨 Strong winds are possible. Be careful with outdoor activities.");
  }

  // Humidity tips
  if (humidity >= 80) {
    tips.push("💧 Humidity is high. Stay hydrated and wear light clothing.");
  }

  return (
    <div className="weather-tips">

      <h2>💡 Weather Tips</h2>

      {tips.map((tip, index) => (
        <p key={index}>
          {tip}
        </p>
      ))}

    </div>
  );
}

export default WeatherTips;
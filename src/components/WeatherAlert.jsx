function WeatherAlert({ weather }) {
  if (!weather) {
    return null;
  }

  const code = weather.weatherCode;

  let alertMessage = "";
  let alertType = "";

  if (code >= 95) {
    alertMessage = "Severe thunderstorm conditions. Please stay indoors and avoid unnecessary travel.";
    alertType = "danger";
  } else if (code >= 80 && code <= 82) {
    alertMessage = "Heavy rain showers are possible. Carry an umbrella and travel carefully.";
    alertType = "warning";
  } else if (code >= 51 && code <= 67) {
    alertMessage = "Rain is expected. Consider carrying an umbrella.";
    alertType = "warning";
  } else if (code >= 71 && code <= 77) {
    alertMessage = "Snow conditions are possible. Take necessary precautions.";
    alertType = "warning";
  } else {
    alertMessage = "No severe weather alerts for the current conditions.";
    alertType = "safe";
  }

  return (
    <div className={`weather-alert ${alertType}`}>
      <h2>🚨 Weather Alert</h2>
      <p>{alertMessage}</p>
    </div>
  );
}

export default WeatherAlert;
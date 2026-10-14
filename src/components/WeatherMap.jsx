import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function WeatherMap({ weather }) {
  if (!weather) {
    return null;
  }

  const position = [
    weather.latitude,
    weather.longitude
  ];

  return (
    <div className="map-section">

      <h2>🗺️ Weather Location</h2>

      <div className="map-container">

        <MapContainer
          center={position}
          zoom={10}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>

            <Popup>
              <strong>{weather.city}</strong>
              <br />
              Temperature: {weather.temperature}°C
              <br />
              Humidity: {weather.humidity}%
              <br />
              Wind: {weather.wind} km/h
            </Popup>

          </Marker>

        </MapContainer>

      </div>

    </div>
  );
}

export default WeatherMap;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import HourlyForecast from "./pages/HourlyForecast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ForecastPage from "./pages/Forecastpage";
import Alerts from "./pages/Alerts";
import TravelPlanner from "./pages/TravelPlanner";
import TravelForecast from "./pages/TravelForecast";
import SavedPlaces from "./pages/SavedPlaces";

import { WeatherProvider } from "./context/WeatherContext";
import "./App.css";

function WeatherLayout() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/weather" element={<Home />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/travel-planner" element={<TravelPlanner />} />
        <Route path="/travel-forecast" element={<TravelForecast />} />
        <Route path="/saved-places" element={<SavedPlaces />} />
        <Route path="/hourly-forecast" element={<HourlyForecast />} />
        <Route
          path="/student"
          element={<Navigate to="/weather?role=STUDENT" replace />}
        />
        <Route
          path="/farmer"
          element={<Navigate to="/weather?role=FARMER" replace />}
        />
        <Route
          path="/employee"
          element={<Navigate to="/weather?role=EMPLOYEE" replace />}
        />

        <Route path="*" element={<Navigate to="/weather" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <WeatherProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<WeatherLayout />} />
        </Routes>
      </WeatherProvider>
    </BrowserRouter>
  );
}

export default App;

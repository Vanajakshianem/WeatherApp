import { createContext, useContext, useState } from "react";

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [weather, setWeatherState] = useState(null);
  const [city, setCityState] = useState(
    localStorage.getItem("selectedCity") || ""
  );

  const setWeather = (data) => {
    setWeatherState(data);

    if (data?.city) {
      setCityState(data.city);
      localStorage.setItem("selectedCity", data.city);
    }
  };

  const setCity = (value) => {
    setCityState(value);

    if (value) {
      localStorage.setItem("selectedCity", value);
    }
  };

  return (
    <WeatherContext.Provider value={{ weather, setWeather, city, setCity }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error("useWeather must be used inside WeatherProvider");
  }

  return context;
}
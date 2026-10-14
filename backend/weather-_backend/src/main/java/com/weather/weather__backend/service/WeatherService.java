package com.weather.weather__backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.weather.weather__backend.model.Weather;
import com.weather.weather__backend.repository.WeatherRepository;

@Service
public class WeatherService {

    private final WeatherRepository weatherRepository;

    public WeatherService(WeatherRepository weatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    // Save weather data
    public Weather saveWeather(Weather weather) {
        return weatherRepository.save(weather);
    }

    // Get all weather records
    public List<Weather> getAllWeather() {
        return weatherRepository.findAll();
    }
}

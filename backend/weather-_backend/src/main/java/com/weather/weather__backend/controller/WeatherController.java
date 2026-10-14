package com.weather.weather__backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.weather.weather__backend.model.Weather;
import com.weather.weather__backend.service.WeatherService;

@CrossOrigin(origins ={
       "http://localhost:5173",
       "http://localhost:5174",
       "http://localhost:5175"
} )
@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    // Test API
    @GetMapping("/test")
    public String testWeatherApi() {
        return "Weather Backend is working!";
    }

    // Save weather data
    @PostMapping
    public Weather saveWeather(@RequestBody Weather weather) {
        return weatherService.saveWeather(weather);
    }

    // Get all weather records
    @GetMapping
    public List<Weather> getAllWeather() {
        return weatherService.getAllWeather();
    }
}

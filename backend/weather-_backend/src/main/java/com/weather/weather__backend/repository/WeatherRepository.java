package com.weather.weather__backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weather.weather__backend.model.Weather;

public interface WeatherRepository extends JpaRepository<Weather, Long> {
}
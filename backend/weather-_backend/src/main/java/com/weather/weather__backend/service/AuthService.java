package com.weather.weather__backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.weather.weather__backend.entity.User;
import com.weather.weather__backend.repository.UserRepository;
import com.weather.weather__backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // SIGN UP
    public User signup(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("STUDENT");
        }

        return userRepository.save(user);
    }

    // LOGIN
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        return jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );
    }
    public User findUserByEmail(String email) {
    return userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));
    }
}

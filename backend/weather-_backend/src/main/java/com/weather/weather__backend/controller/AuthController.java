package com.weather.weather__backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.weather.weather__backend.entity.User;
import com.weather.weather__backend.security.LoginRequest;
import com.weather.weather__backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // SIGN UP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        try {
            User savedUser = authService.signup(user);

            // Don't send password back to frontend
            savedUser.setPassword(null);

            return ResponseEntity.ok(savedUser);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // LOGIN
   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    try {
        User user = authService.findUserByEmail(request.getEmail());

        String token = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        return ResponseEntity.ok(
            Map.of(
                "message", "Login successful",
                "token", token,
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole()
            )
        );

    } catch (RuntimeException e) {
        return ResponseEntity.status(401).body(e.getMessage());
    }
}
}
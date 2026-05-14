package me.gabrielporto.fintrack.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.dto.request.LoginRequest;
import me.gabrielporto.fintrack.backend.dto.request.RegisterRequest;
import me.gabrielporto.fintrack.backend.dto.response.RegisterResponse;
import me.gabrielporto.fintrack.backend.dto.response.TokenResponse;
import me.gabrielporto.fintrack.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
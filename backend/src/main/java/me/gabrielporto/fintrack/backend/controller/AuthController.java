package me.gabrielporto.fintrack.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.dto.request.ChangePasswordRequest;
import me.gabrielporto.fintrack.backend.dto.request.LoginRequest;
import me.gabrielporto.fintrack.backend.dto.request.RefreshRequest;
import me.gabrielporto.fintrack.backend.dto.request.RegisterRequest;
import me.gabrielporto.fintrack.backend.dto.request.UpdateProfileRequest;
import me.gabrielporto.fintrack.backend.dto.response.ApiResponse;
import me.gabrielporto.fintrack.backend.dto.response.MeResponse;
import me.gabrielporto.fintrack.backend.dto.response.MessageResponse;
import me.gabrielporto.fintrack.backend.dto.response.ProfileResponse;
import me.gabrielporto.fintrack.backend.dto.response.RegisterResponse;
import me.gabrielporto.fintrack.backend.dto.response.TokenResponse;
import me.gabrielporto.fintrack.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(authService.register(request), "Usuário registrado com sucesso"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(request), "Login realizado com sucesso"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.refresh(request.getRefreshToken()), "Token renovado com sucesso"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MeResponse>> me() {
        return ResponseEntity.ok(ApiResponse.success(authService.me(), "Dados do usuário obtidos com sucesso"));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.updateProfile(request), "Perfil atualizado com sucesso"));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<MessageResponse>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.changePassword(request), "Senha alterada com sucesso"));
    }

    @PutMapping("/me/avatar")
    public ResponseEntity<ApiResponse<MeResponse>> updateAvatar(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success(authService.updateAvatar(file), "Avatar atualizado com sucesso"));
    }

    @DeleteMapping("/me/avatar")
    public ResponseEntity<ApiResponse<MeResponse>> removeAvatar() {
        return ResponseEntity.ok(ApiResponse.success(authService.removeAvatar(), "Avatar removido com sucesso"));
    }

}

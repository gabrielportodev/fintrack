package me.gabrielporto.fintrack.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.dto.request.ForgotPasswordRequest;
import me.gabrielporto.fintrack.backend.dto.request.ResetPasswordRequest;
import me.gabrielporto.fintrack.backend.dto.request.VerifyCodeRequest;
import me.gabrielporto.fintrack.backend.dto.response.ApiResponse;
import me.gabrielporto.fintrack.backend.dto.response.MessageResponse;
import me.gabrielporto.fintrack.backend.dto.response.ResetTokenResponse;
import me.gabrielporto.fintrack.backend.service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<MessageResponse>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(ApiResponse.success(passwordResetService.forgotPassword(request), "Solicitação processada"));
    }

    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse<ResetTokenResponse>> verifyCode(@Valid @RequestBody VerifyCodeRequest request) {
        return ResponseEntity.ok(ApiResponse.success(passwordResetService.verifyCode(request), "Código verificado com sucesso"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<MessageResponse>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(ApiResponse.success(passwordResetService.resetPassword(request), "Senha redefinida com sucesso"));
    }
}

package me.gabrielporto.fintrack.backend.service;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.domain.entity.PasswordResetToken;
import me.gabrielporto.fintrack.backend.domain.entity.User;
import me.gabrielporto.fintrack.backend.dto.request.ForgotPasswordRequest;
import me.gabrielporto.fintrack.backend.dto.request.ResetPasswordRequest;
import me.gabrielporto.fintrack.backend.dto.request.VerifyCodeRequest;
import me.gabrielporto.fintrack.backend.dto.response.MessageResponse;
import me.gabrielporto.fintrack.backend.dto.response.ResetTokenResponse;
import me.gabrielporto.fintrack.backend.exception.BusinessException;
import me.gabrielporto.fintrack.backend.exception.ResourceNotFoundException;
import me.gabrielporto.fintrack.backend.repository.PasswordResetTokenRepository;
import me.gabrielporto.fintrack.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private static final SecureRandom RANDOM = new SecureRandom();

    @SuppressWarnings("null")
    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            tokenRepository.deleteByEmail(request.getEmail());

            String code = String.format("%06d", RANDOM.nextInt(1_000_000));

            PasswordResetToken token = PasswordResetToken.builder()
                    .email(request.getEmail())
                    .code(code)
                    .expiresAt(LocalDateTime.now().plusMinutes(15))
                    .build();

            tokenRepository.save(token);
            emailService.sendPasswordResetCode(request.getEmail(), code);
        }

        return new MessageResponse("Código enviado para o email");
    }

    @Transactional
    public ResetTokenResponse verifyCode(VerifyCodeRequest request) {
        try { Thread.sleep(500); } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); }

        PasswordResetToken token = tokenRepository
                .findByEmailAndCodeAndUsedFalse(request.getEmail(), request.getCode())
                .orElseThrow(() -> new BusinessException("Código inválido ou expirado"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Código inválido ou expirado");
        }

        String resetToken = UUID.randomUUID().toString();
        token.setResetToken(resetToken);
        tokenRepository.save(token);

        return new ResetTokenResponse(resetToken);
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = tokenRepository
                .findByResetTokenAndUsedFalse(request.getResetToken())
                .orElseThrow(() -> new BusinessException("Token inválido ou expirado"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Token inválido ou expirado");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("As senhas não coincidem");
        }

        User user = userRepository.findByEmail(token.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);

        return new MessageResponse("Senha redefinida com sucesso");
    }
}

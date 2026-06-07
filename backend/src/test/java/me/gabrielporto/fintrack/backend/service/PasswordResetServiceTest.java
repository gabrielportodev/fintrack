package me.gabrielporto.fintrack.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import me.gabrielporto.fintrack.backend.domain.entity.PasswordResetToken;
import me.gabrielporto.fintrack.backend.domain.entity.User;
import me.gabrielporto.fintrack.backend.dto.request.ForgotPasswordRequest;
import me.gabrielporto.fintrack.backend.dto.request.ResetPasswordRequest;
import me.gabrielporto.fintrack.backend.dto.request.VerifyCodeRequest;
import me.gabrielporto.fintrack.backend.dto.response.MessageResponse;
import me.gabrielporto.fintrack.backend.dto.response.ResetTokenResponse;
import me.gabrielporto.fintrack.backend.exception.BusinessException;
import me.gabrielporto.fintrack.backend.repository.PasswordResetTokenRepository;
import me.gabrielporto.fintrack.backend.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PasswordResetService passwordResetService;

    @Test
    @DisplayName("Deve enviar código quando email existir")
    void shouldSendCodeWhenEmailExists() {

        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("gabriel@email.com");

        when(userRepository.existsByEmail("gabriel@email.com")).thenReturn(true);

        when(tokenRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        MessageResponse response = passwordResetService.forgotPassword(request);

        assertThat(response.getMessage()).isEqualTo("Código enviado para o email");

        verify(emailService).sendPasswordResetCode(eq("gabriel@email.com"), anyString());
    }

    @Test
    @DisplayName("Não deve enviar email quando usuário não existir")
    void shouldNotSendEmailWhenUserDoesNotExist() {

        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("teste@email.com");

        when(userRepository.existsByEmail("teste@email.com")).thenReturn(false);

        MessageResponse response = passwordResetService.forgotPassword(request);

        assertThat(response.getMessage()).isEqualTo("Código enviado para o email");

        verify(emailService, never()).sendPasswordResetCode(anyString(), anyString());
    }

    @Test
    @DisplayName("Deve retornar resetToken quando código for válido")
    void shouldReturnResetTokenWhenCodeIsValid() {

        VerifyCodeRequest request = new VerifyCodeRequest();
        request.setEmail("gabriel@email.com");
        request.setCode("123456");

        PasswordResetToken token = PasswordResetToken.builder()
                .email("gabriel@email.com")
                .code("123456")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        when(tokenRepository.findByEmailAndCodeAndUsedFalse("gabriel@email.com", "123456"))
                .thenReturn(Optional.of(token));

        when(tokenRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        ResetTokenResponse response = passwordResetService.verifyCode(request);

        assertThat(response.getResetToken()).isNotBlank();
    }

    @Test
    @DisplayName("Deve lançar erro quando código estiver expirado")
    void shouldThrowExceptionWhenCodeIsExpired() {

        VerifyCodeRequest request = new VerifyCodeRequest();
        request.setEmail("gabriel@email.com");
        request.setCode("123456");

        PasswordResetToken token = PasswordResetToken.builder()
                .email("gabriel@email.com")
                .code("123456")
                .expiresAt(LocalDateTime.now().minusMinutes(1))
                .build();

        when(tokenRepository.findByEmailAndCodeAndUsedFalse("gabriel@email.com", "123456"))
                .thenReturn(Optional.of(token));

        assertThatThrownBy(() -> passwordResetService.verifyCode(request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Código inválido ou expirado");
    }

    @Test
    @DisplayName("Deve lançar erro quando código não existir")
    void shouldThrowExceptionWhenCodeDoesNotExist() {

        VerifyCodeRequest request = new VerifyCodeRequest();
        request.setEmail("gabriel@email.com");
        request.setCode("000000");

        when(tokenRepository.findByEmailAndCodeAndUsedFalse("gabriel@email.com", "000000"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> passwordResetService.verifyCode(request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Código inválido ou expirado");
    }

    @Test
    @DisplayName("Deve redefinir senha com sucesso")
    void shouldResetPasswordSuccessfully() {

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setResetToken("valid-token");
        request.setNewPassword("novaSenha123");
        request.setConfirmPassword("novaSenha123");

        User user = User.builder()
                .id(UUID.randomUUID())
                .email("gabriel@email.com")
                .password("senhaAntiga")
                .build();

        PasswordResetToken token = PasswordResetToken.builder()
                .email("gabriel@email.com")
                .resetToken("valid-token")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        when(tokenRepository.findByResetTokenAndUsedFalse("valid-token")).thenReturn(Optional.of(token));

        when(userRepository.findByEmail("gabriel@email.com")).thenReturn(Optional.of(user));

        when(passwordEncoder.encode("novaSenha123")).thenReturn("senhaNovaHash");

        MessageResponse response = passwordResetService.resetPassword(request);

        assertThat(response.getMessage()).isEqualTo("Senha redefinida com sucesso");

        assertThat(token.isUsed()).isTrue();

        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Deve lançar erro quando senhas forem diferentes")
    void shouldThrowExceptionWhenPasswordsAreDifferent() {

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setResetToken("valid-token");
        request.setNewPassword("123");
        request.setConfirmPassword("456");

        PasswordResetToken token = PasswordResetToken.builder()
                .email("gabriel@email.com")
                .resetToken("valid-token")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        when(tokenRepository.findByResetTokenAndUsedFalse("valid-token")).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> passwordResetService.resetPassword(request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("As senhas não coincidem");
    }
}

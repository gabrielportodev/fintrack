package me.gabrielporto.fintrack.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {

    @NotBlank(message = "Token é obrigatório")
    private String resetToken;

    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String newPassword;

    @NotBlank(message = "Confirmação de senha é obrigatória")
    private String confirmPassword;
}

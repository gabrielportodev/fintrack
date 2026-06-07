package me.gabrielporto.fintrack.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank(message = "Senha atual é obrigatória")
    private String currentPassword;

    @NotBlank(message = "Nova senha é obrigatória")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
        message = "Senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número"
    )
    private String newPassword;

    @NotBlank(message = "Confirmação de senha é obrigatória")
    private String confirmPassword;
}

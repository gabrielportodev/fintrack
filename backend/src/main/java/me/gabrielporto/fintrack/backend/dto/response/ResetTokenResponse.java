package me.gabrielporto.fintrack.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResetTokenResponse {

    private String resetToken;
}

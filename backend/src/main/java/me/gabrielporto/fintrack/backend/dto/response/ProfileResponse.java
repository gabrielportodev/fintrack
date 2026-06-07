package me.gabrielporto.fintrack.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileResponse {

    private UUID id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private String avatarUrl;
    private String accessToken;
    private String refreshToken;
}

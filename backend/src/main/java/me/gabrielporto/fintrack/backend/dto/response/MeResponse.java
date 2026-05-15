package me.gabrielporto.fintrack.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class MeResponse {

    private UUID id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
}

package me.gabrielporto.fintrack.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class CategoryResponse {

    private UUID id;
    private String name;
    private String color;
    private String icon;
    private LocalDateTime createdAt;
}
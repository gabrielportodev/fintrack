package me.gabrielporto.fintrack.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class GoalResponse {

    private UUID id;
    private String name;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;
    private Integer month;
    private Integer year;
    private UUID categoryId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
    private LocalDateTime createdAt;
}
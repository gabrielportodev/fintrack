package me.gabrielporto.fintrack.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import me.gabrielporto.fintrack.backend.domain.enums.TransactionType;

@Data
@AllArgsConstructor
public class TransactionResponse {

    private UUID id;
    private String description;
    private BigDecimal amount;
    private TransactionType type;
    private LocalDate date;
    private UUID categoryId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
    private LocalDateTime createdAt;
}

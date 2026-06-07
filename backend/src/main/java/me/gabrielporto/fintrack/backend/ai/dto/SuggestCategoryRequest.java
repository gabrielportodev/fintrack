package me.gabrielporto.fintrack.backend.ai.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import me.gabrielporto.fintrack.backend.domain.enums.TransactionType;

public record SuggestCategoryRequest(
        @NotBlank(message = "Descrição é obrigatória")
        String description,
        BigDecimal amount,
        TransactionType type
        ) {

}

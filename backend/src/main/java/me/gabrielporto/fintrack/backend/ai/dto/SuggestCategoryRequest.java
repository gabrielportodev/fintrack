package me.gabrielporto.fintrack.backend.ai.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import me.gabrielporto.fintrack.backend.domain.enums.TransactionType;

public record SuggestCategoryRequest(
        @NotBlank(message = "Descrição é obrigatória") String description, BigDecimal amount, TransactionType type) {}

package me.gabrielporto.fintrack.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class GoalRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotNull(message = "Valor limite é obrigatório")
    @Positive(message = "Valor limite deve ser positivo")
    private BigDecimal limitAmount;

    @NotNull(message = "Mês é obrigatório")
    @Min(value = 1, message = "Mês inválido")
    @Max(value = 12, message = "Mês inválido")
    private Integer month;

    @NotNull(message = "Ano é obrigatório")
    @Min(value = 2000, message = "Ano inválido")
    private Integer year;

    @NotNull(message = "Categoria é obrigatória")
    private UUID categoryId;
}
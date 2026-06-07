package me.gabrielporto.fintrack.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;
import me.gabrielporto.fintrack.backend.domain.enums.TransactionType;

@Data
public class TransactionRequest {

    @NotBlank(message = "Descrição é obrigatória")
    private String description;

    @NotNull(message = "Valor é obrigatório") @Positive(message = "Valor deve ser positivo") private BigDecimal amount;

    @NotNull(message = "Tipo é obrigatório") private TransactionType type;

    @NotNull(message = "Data é obrigatória") private LocalDate date;

    @NotNull(message = "Categoria é obrigatória") private UUID categoryId;
}

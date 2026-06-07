package me.gabrielporto.fintrack.backend.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlySummaryResponse {
    private int month;
    private int year;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal balance;
}

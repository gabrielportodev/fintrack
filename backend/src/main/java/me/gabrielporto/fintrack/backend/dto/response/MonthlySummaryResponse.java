package me.gabrielporto.fintrack.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MonthlySummaryResponse {
    private int month;
    private int year;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal balance;
}

package me.gabrielporto.fintrack.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.dto.request.TransactionRequest;
import me.gabrielporto.fintrack.backend.dto.response.ApiResponse;
import me.gabrielporto.fintrack.backend.dto.response.MonthlySummaryResponse;
import me.gabrielporto.fintrack.backend.dto.response.TransactionResponse;
import me.gabrielporto.fintrack.backend.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(transactionService.findAll(), "Transações listadas com sucesso"));
    }

    @GetMapping("/month")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> findByMonth(@RequestParam int month, @RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.findByMonth(month, year), "Transações do mês listadas com sucesso"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.findById(id), "Transação encontrada"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> create(@Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(transactionService.create(request), "Transação criada com sucesso"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> update(@PathVariable UUID id, @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.update(id, request), "Transação atualizada com sucesso"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        transactionService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Transação removida com sucesso"));
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> findByRange(
            @RequestParam int startMonth, @RequestParam int startYear,
            @RequestParam int endMonth, @RequestParam int endYear) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.findByRange(startMonth, startYear, endMonth, endYear), "Transações do período listadas com sucesso"));
    }

    @GetMapping("/summary/range")
    public ResponseEntity<ApiResponse<List<MonthlySummaryResponse>>> getSummaryRange(
            @RequestParam int startMonth, @RequestParam int startYear,
            @RequestParam int endMonth, @RequestParam int endYear) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getSummaryRange(startMonth, startYear, endMonth, endYear), "Resumo do período obtido com sucesso"));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getSummary(@RequestParam int month, @RequestParam int year) {
        BigDecimal income = transactionService.getMonthlyIncome(month, year);
        BigDecimal expense = transactionService.getMonthlyExpense(month, year);
        BigDecimal balance = income.subtract(expense);

        Map<String, BigDecimal> summary = Map.of(
                "income", income,
                "expense", expense,
                "balance", balance
        );

        return ResponseEntity.ok(ApiResponse.success(summary, "Resumo do mês obtido com sucesso"));
    }
}

package me.gabrielporto.fintrack.backend.service;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.domain.entity.Category;
import me.gabrielporto.fintrack.backend.domain.entity.Transaction;
import me.gabrielporto.fintrack.backend.domain.entity.User;
import me.gabrielporto.fintrack.backend.domain.enums.TransactionType;
import me.gabrielporto.fintrack.backend.dto.request.TransactionRequest;
import me.gabrielporto.fintrack.backend.dto.response.MonthlySummaryResponse;
import me.gabrielporto.fintrack.backend.dto.response.TransactionResponse;
import me.gabrielporto.fintrack.backend.exception.ResourceNotFoundException;
import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.repository.TransactionRepository;
import me.gabrielporto.fintrack.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<TransactionResponse> findAll() {
        User user = getAuthenticatedUser();
        return transactionRepository.findAllByUserIdOrderByDateDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TransactionResponse> findByMonth(int month, int year) {
        User user = getAuthenticatedUser();
        return transactionRepository.findAllByUserIdAndMonthAndYear(user.getId(), month, year)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TransactionResponse findById(UUID id) {
        User user = getAuthenticatedUser();
        Transaction transaction = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada"));
        return toResponse(transaction);
    }

    public TransactionResponse create(TransactionRequest request) {
        User user = getAuthenticatedUser();
        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        Transaction transaction = Transaction.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .type(request.getType())
                .date(request.getDate())
                .category(category)
                .user(user)
                .build();

        return toResponse(transactionRepository.save(transaction));
    }

    public TransactionResponse update(UUID id, TransactionRequest request) {
        User user = getAuthenticatedUser();
        Transaction transaction = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada"));

        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDate(request.getDate());
        transaction.setCategory(category);

        return toResponse(transactionRepository.save(transaction));
    }

    public void delete(UUID id) {
        User user = getAuthenticatedUser();
        Transaction transaction = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada"));
        transactionRepository.delete(transaction);
    }

    public BigDecimal getTotalIncome() {
        User user = getAuthenticatedUser();
        return transactionRepository.sumAmountByUserIdAndType(user.getId(), TransactionType.INCOME);
    }

    public BigDecimal getTotalExpense() {
        User user = getAuthenticatedUser();
        return transactionRepository.sumAmountByUserIdAndType(user.getId(), TransactionType.EXPENSE);
    }

    public List<TransactionResponse> findByRange(int startMonth, int startYear, int endMonth, int endYear) {
        User user = getAuthenticatedUser();
        return transactionRepository.findAllByUserIdInRange(user.getId(), startMonth, startYear, endMonth, endYear)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MonthlySummaryResponse> getSummaryRange(int startMonth, int startYear, int endMonth, int endYear) {
        User user = getAuthenticatedUser();
        List<Object[]> rows = transactionRepository.findMonthlySummaryInRange(user.getId(), startMonth, startYear, endMonth, endYear);

        Map<String, MonthlySummaryResponse> byKey = new HashMap<>();
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            int year = ((Number) row[1]).intValue();
            BigDecimal income = (BigDecimal) row[2];
            BigDecimal expense = (BigDecimal) row[3];
            byKey.put(year + "-" + month, new MonthlySummaryResponse(month, year, income, expense, income.subtract(expense)));
        }

        List<MonthlySummaryResponse> result = new ArrayList<>();
        int m = startMonth, y = startYear;
        while (y < endYear || (y == endYear && m <= endMonth)) {
            result.add(byKey.getOrDefault(y + "-" + m, new MonthlySummaryResponse(m, y, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO)));
            if (++m > 12) { m = 1; y++; }
        }
        return result;
    }

    public BigDecimal getMonthlyIncome(int month, int year) {
        User user = getAuthenticatedUser();
        return transactionRepository.sumAmountByUserIdAndTypeAndMonthAndYear(user.getId(), TransactionType.INCOME, month, year);
    }

    public BigDecimal getMonthlyExpense(int month, int year) {
        User user = getAuthenticatedUser();
        return transactionRepository.sumAmountByUserIdAndTypeAndMonthAndYear(user.getId(), TransactionType.EXPENSE, month, year);
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getDescription(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getDate(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName(),
                transaction.getCategory().getColor(),
                transaction.getCategory().getIcon(),
                transaction.getCreatedAt()
        );
    }
}
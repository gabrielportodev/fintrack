package me.gabrielporto.fintrack.backend.service;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.domain.entity.Category;
import me.gabrielporto.fintrack.backend.domain.entity.Transaction;
import me.gabrielporto.fintrack.backend.domain.entity.User;
import me.gabrielporto.fintrack.backend.domain.enums.TransactionType;
import me.gabrielporto.fintrack.backend.dto.request.TransactionRequest;
import me.gabrielporto.fintrack.backend.dto.response.TransactionResponse;
import me.gabrielporto.fintrack.backend.exception.ResourceNotFoundException;
import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.repository.TransactionRepository;
import me.gabrielporto.fintrack.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
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
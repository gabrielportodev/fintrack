package me.gabrielporto.fintrack.backend.repository;

import me.gabrielporto.fintrack.backend.domain.entity.Transaction;
import me.gabrielporto.fintrack.backend.domain.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    List<Transaction> findAllByUserIdOrderByDateDesc(UUID userId);

    Optional<Transaction> findByIdAndUserId(UUID id, UUID userId);

    List<Transaction> findAllByUserIdAndType(UUID userId, TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumAmountByUserIdAndType(@Param("userId") UUID userId, @Param("type") TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    BigDecimal sumAmountByUserIdAndTypeAndMonthAndYear(@Param("userId") UUID userId, @Param("type") TransactionType type, @Param("month") int month, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.category.id = :categoryId AND t.type = 'EXPENSE' AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    BigDecimal sumExpensesByCategoryAndMonthAndYear(@Param("userId") UUID userId, @Param("categoryId") UUID categoryId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND MONTH(t.date) = :month AND YEAR(t.date) = :year ORDER BY t.date DESC")
    List<Transaction> findAllByUserIdAndMonthAndYear(@Param("userId") UUID userId, @Param("month") int month, @Param("year") int year);
}
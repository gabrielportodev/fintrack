package me.gabrielporto.fintrack.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import me.gabrielporto.fintrack.backend.domain.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalRepository extends JpaRepository<Goal, UUID> {

    List<Goal> findAllByUserIdAndMonthAndYear(UUID userId, int month, int year);

    Optional<Goal> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByCategoryIdAndUserIdAndMonthAndYear(UUID categoryId, UUID userId, int month, int year);
}

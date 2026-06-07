package me.gabrielporto.fintrack.backend.service;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.domain.entity.Category;
import me.gabrielporto.fintrack.backend.domain.entity.Goal;
import me.gabrielporto.fintrack.backend.domain.entity.User;
import me.gabrielporto.fintrack.backend.dto.request.GoalRequest;
import me.gabrielporto.fintrack.backend.dto.response.GoalResponse;
import me.gabrielporto.fintrack.backend.exception.BusinessException;
import me.gabrielporto.fintrack.backend.exception.ResourceNotFoundException;
import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.repository.GoalRepository;
import me.gabrielporto.fintrack.backend.repository.TransactionRepository;
import me.gabrielporto.fintrack.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public List<GoalResponse> findByMonth(int month, int year) {
        User user = getAuthenticatedUser();
        return goalRepository.findAllByUserIdAndMonthAndYear(user.getId(), month, year).stream()
                .map(goal -> toResponse(goal, user.getId()))
                .toList();
    }

    public GoalResponse create(GoalRequest request) {
        User user = getAuthenticatedUser();
        Category category = categoryRepository
                .findByIdAndUserId(request.getCategoryId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        if (goalRepository.existsByCategoryIdAndUserIdAndMonthAndYear(
                category.getId(), user.getId(), request.getMonth(), request.getYear())) {
            throw new BusinessException("Já existe uma meta para essa categoria nesse mês");
        }

        Goal goal = Goal.builder()
                .name(request.getName())
                .limitAmount(request.getLimitAmount())
                .month(request.getMonth())
                .year(request.getYear())
                .category(category)
                .user(user)
                .build();

        return toResponse(goalRepository.save(goal), user.getId());
    }

    public GoalResponse update(UUID id, GoalRequest request) {
        User user = getAuthenticatedUser();
        Goal goal = goalRepository
                .findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Meta não encontrada"));

        Category category = categoryRepository
                .findByIdAndUserId(request.getCategoryId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        goal.setName(request.getName());
        goal.setLimitAmount(request.getLimitAmount());
        goal.setMonth(request.getMonth());
        goal.setYear(request.getYear());
        goal.setCategory(category);

        return toResponse(goalRepository.save(goal), user.getId());
    }

    public void delete(UUID id) {
        User user = getAuthenticatedUser();
        Goal goal = goalRepository
                .findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Meta não encontrada"));
        goalRepository.delete(goal);
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private GoalResponse toResponse(Goal goal, UUID userId) {
        var spent = transactionRepository.sumExpensesByCategoryAndMonthAndYear(
                userId, goal.getCategory().getId(), goal.getMonth(), goal.getYear());

        return new GoalResponse(
                goal.getId(),
                goal.getName(),
                goal.getLimitAmount(),
                spent,
                goal.getMonth(),
                goal.getYear(),
                goal.getCategory().getId(),
                goal.getCategory().getName(),
                goal.getCategory().getColor(),
                goal.getCategory().getIcon(),
                goal.getCreatedAt());
    }
}

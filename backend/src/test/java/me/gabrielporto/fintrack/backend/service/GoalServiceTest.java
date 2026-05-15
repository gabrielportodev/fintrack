package me.gabrielporto.fintrack.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import me.gabrielporto.fintrack.backend.domain.entity.Category;
import me.gabrielporto.fintrack.backend.domain.entity.Goal;
import me.gabrielporto.fintrack.backend.domain.entity.User;
import me.gabrielporto.fintrack.backend.dto.request.GoalRequest;
import me.gabrielporto.fintrack.backend.dto.response.GoalResponse;
import me.gabrielporto.fintrack.backend.exception.BusinessException;
import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.repository.GoalRepository;
import me.gabrielporto.fintrack.backend.repository.TransactionRepository;
import me.gabrielporto.fintrack.backend.repository.UserRepository;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class GoalServiceTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GoalService goalService;

    private User user;
    private Category category;

    @BeforeEach
    void setUp() {

        user = User.builder()
            .id(UUID.randomUUID())
            .name("Gabriel")
            .email("gabriel@email.com")
            .password("123")
            .build();

        category = Category.builder()
            .id(UUID.randomUUID())
            .name("Alimentação")
            .color("#FF0000")
            .icon("food")
            .user(user)
            .build();

        Authentication authentication = mock(Authentication.class);

        when(authentication.getName())
            .thenReturn("gabriel@email.com");

        SecurityContextHolder.getContext()
            .setAuthentication(authentication);

        when(userRepository.findByEmail("gabriel@email.com"))
            .thenReturn(Optional.of(user));
    }

    @AfterEach
    void cleanContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Deve criar meta com sucesso")
    void shouldCreateGoalSuccessfully() {

        GoalRequest request = new GoalRequest();
        request.setCategoryId(category.getId());
        request.setName("Meta alimentação");
        request.setLimitAmount(new BigDecimal("500.00"));
        request.setMonth(5);
        request.setYear(2026);

        Goal goal = Goal.builder()
            .id(UUID.randomUUID())
            .name("Meta alimentação")
            .limitAmount(new BigDecimal("500.00"))
            .month(5)
            .year(2026)
            .category(category)
            .user(user)
            .build();

        when(categoryRepository.findByIdAndUserId(category.getId(), user.getId()))
            .thenReturn(Optional.of(category));

        when(goalRepository.existsByCategoryIdAndUserIdAndMonthAndYear(
            category.getId(),
            user.getId(),
            5,
            2026
        )).thenReturn(false);

        when(goalRepository.save(any()))
            .thenReturn(goal);

        when(transactionRepository.sumExpensesByCategoryAndMonthAndYear(
            user.getId(),
            category.getId(),
            5,
            2026
        )).thenReturn(new BigDecimal("150.00"));

        GoalResponse response = goalService.create(request);

        assertThat(response.getName()).isEqualTo("Meta alimentação");
        assertThat(response.getLimitAmount())
            .isEqualByComparingTo("500.00");

        assertThat(response.getSpentAmount())
            .isEqualByComparingTo("150.00");
    }

    @Test
    @DisplayName("Deve lançar erro quando já existir meta no mês")
    void shouldThrowExceptionWhenGoalAlreadyExists() {

        GoalRequest request = new GoalRequest();
        request.setCategoryId(category.getId());
        request.setMonth(5);
        request.setYear(2026);

        when(categoryRepository.findByIdAndUserId(category.getId(), user.getId()))
            .thenReturn(Optional.of(category));

        when(goalRepository.existsByCategoryIdAndUserIdAndMonthAndYear(
            category.getId(),
            user.getId(),
            5,
            2026
        )).thenReturn(true);

        assertThatThrownBy(() -> goalService.create(request))
            .isInstanceOf(BusinessException.class)
            .hasMessage("Já existe uma meta para essa categoria nesse mês");
    }

    @Test
    @DisplayName("Deve calcular corretamente o valor gasto")
    void shouldCalculateSpentAmountCorrectly() {

        GoalRequest request = new GoalRequest();
        request.setCategoryId(category.getId());
        request.setName("Meta alimentação");
        request.setLimitAmount(new BigDecimal("500.00"));
        request.setMonth(5);
        request.setYear(2026);

        Goal goal = Goal.builder()
            .id(UUID.randomUUID())
            .name("Meta alimentação")
            .limitAmount(new BigDecimal("500.00"))
            .month(5)
            .year(2026)
            .category(category)
            .user(user)
            .build();

        when(categoryRepository.findByIdAndUserId(category.getId(), user.getId()))
            .thenReturn(Optional.of(category));

        when(goalRepository.existsByCategoryIdAndUserIdAndMonthAndYear(
            category.getId(),
            user.getId(),
            5,
            2026
        )).thenReturn(false);

        when(goalRepository.save(any()))
            .thenReturn(goal);

        when(transactionRepository.sumExpensesByCategoryAndMonthAndYear(
            user.getId(),
            category.getId(),
            5,
            2026
        )).thenReturn(new BigDecimal("320.50"));

        GoalResponse response = goalService.create(request);

        assertThat(response.getSpentAmount())
            .isEqualByComparingTo("320.50");
    }
}
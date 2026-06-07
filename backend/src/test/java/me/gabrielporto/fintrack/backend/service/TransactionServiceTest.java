package me.gabrielporto.fintrack.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
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

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TransactionService transactionService;

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

        when(authentication.getName()).thenReturn("gabriel@email.com");

        SecurityContextHolder.getContext().setAuthentication(authentication);

        when(userRepository.findByEmail("gabriel@email.com")).thenReturn(Optional.of(user));
    }

    @AfterEach
    void cleanContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Deve criar transação com sucesso")
    void shouldCreateTransactionSuccessfully() {

        TransactionRequest request = new TransactionRequest();
        request.setCategoryId(category.getId());
        request.setDescription("Almoço");
        request.setAmount(new BigDecimal("50.00"));
        request.setType(TransactionType.EXPENSE);
        request.setDate(LocalDate.of(2026, 5, 1));

        Transaction transaction = Transaction.builder()
                .id(UUID.randomUUID())
                .description("Almoço")
                .amount(new BigDecimal("50.00"))
                .type(TransactionType.EXPENSE)
                .date(LocalDate.of(2026, 5, 1))
                .category(category)
                .user(user)
                .build();

        when(categoryRepository.findByIdAndUserId(category.getId(), user.getId()))
                .thenReturn(Optional.of(category));

        when(transactionRepository.save(any())).thenReturn(transaction);

        TransactionResponse response = transactionService.create(request);

        assertThat(response.getDescription()).isEqualTo("Almoço");

        assertThat(response.getAmount()).isEqualByComparingTo("50.00");

        assertThat(response.getType()).isEqualTo(TransactionType.EXPENSE);
    }

    @Test
    @DisplayName("Deve lançar erro quando categoria não existir")
    void shouldThrowExceptionWhenCategoryDoesNotExist() {

        UUID categoryId = UUID.randomUUID();

        TransactionRequest request = new TransactionRequest();
        request.setCategoryId(categoryId);

        when(categoryRepository.findByIdAndUserId(categoryId, user.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Categoria não encontrada");
    }

    @Test
    @DisplayName("Deve lançar erro quando transação não existir")
    void shouldThrowExceptionWhenTransactionDoesNotExist() {

        UUID transactionId = UUID.randomUUID();

        when(transactionRepository.findByIdAndUserId(transactionId, user.getId()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.findById(transactionId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Transação não encontrada");
    }

    @Test
    @DisplayName("Deve retornar total de receitas")
    void shouldReturnTotalIncome() {

        when(transactionRepository.sumAmountByUserIdAndType(user.getId(), TransactionType.INCOME))
                .thenReturn(new BigDecimal("3000.00"));

        BigDecimal result = transactionService.getTotalIncome();

        assertThat(result).isEqualByComparingTo("3000.00");
    }

    @Test
    @DisplayName("Deve retornar total de despesas")
    void shouldReturnTotalExpense() {

        when(transactionRepository.sumAmountByUserIdAndType(user.getId(), TransactionType.EXPENSE))
                .thenReturn(new BigDecimal("1500.00"));

        BigDecimal result = transactionService.getTotalExpense();

        assertThat(result).isEqualByComparingTo("1500.00");
    }
}

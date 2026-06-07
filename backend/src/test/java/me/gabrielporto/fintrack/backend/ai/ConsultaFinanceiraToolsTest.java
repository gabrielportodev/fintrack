package me.gabrielporto.fintrack.backend.ai;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.repository.TransactionRepository;
import me.gabrielporto.fintrack.backend.security.AuthenticatedUserProvider;

@ExtendWith(MockitoExtension.class)
class ConsultaFinanceiraToolsTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private AuthenticatedUserProvider userProvider;

    @InjectMocks
    private ConsultaFinanceiraTools tools;

    @Test
    @DisplayName("totalGastosPorCategoria sempre usa o userId do contexto, nunca de parâmetro")
    void usaUserIdDoContexto() {
        UUID userId = UUID.randomUUID();
        LocalDate inicio = LocalDate.of(2026, 5, 1);
        LocalDate fim = LocalDate.of(2026, 5, 31);

        when(userProvider.getCurrentUserId()).thenReturn(userId);
        when(transactionRepository.sumExpensesByCategoryNameAndPeriod(userId, "Alimentação", inicio, fim))
                .thenReturn(new BigDecimal("250.00"));

        BigDecimal total = tools.totalGastosPorCategoria("Alimentação", inicio, fim);

        assertThat(total).isEqualByComparingTo("250.00");
        verify(transactionRepository).sumExpensesByCategoryNameAndPeriod(eq(userId), eq("Alimentação"), eq(inicio), eq(fim));
    }

    @Test
    @DisplayName("totalGastosPorPeriodo delega ao repositório com o userId do contexto")
    void totalPorPeriodo() {
        UUID userId = UUID.randomUUID();
        LocalDate inicio = LocalDate.of(2026, 1, 1);
        LocalDate fim = LocalDate.of(2026, 12, 31);

        when(userProvider.getCurrentUserId()).thenReturn(userId);
        when(transactionRepository.sumExpensesByPeriod(userId, inicio, fim)).thenReturn(new BigDecimal("1000.00"));

        assertThat(tools.totalGastosPorPeriodo(inicio, fim)).isEqualByComparingTo("1000.00");
    }
}

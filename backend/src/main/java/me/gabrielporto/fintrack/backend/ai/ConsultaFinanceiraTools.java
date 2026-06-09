package me.gabrielporto.fintrack.backend.ai;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.ai.dto.TotalCategoria;
import me.gabrielporto.fintrack.backend.domain.entity.Category;
import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.repository.TransactionRepository;
import me.gabrielporto.fintrack.backend.security.AuthenticatedUserProvider;

@Component
@RequiredArgsConstructor
public class ConsultaFinanceiraTools {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AuthenticatedUserProvider userProvider;

    @Tool(description = "Soma todos os gastos (despesas) do usuário em um intervalo de datas")
    public BigDecimal totalGastosPorPeriodo(
            @ToolParam(description = "data inicial no formato AAAA-MM-DD") LocalDate inicio,
            @ToolParam(description = "data final no formato AAAA-MM-DD") LocalDate fim) {
        return transactionRepository.sumExpensesByPeriod(userProvider.getCurrentUserId(), inicio, fim);
    }

    @Tool(description = "Soma todas as receitas (dinheiro que entrou) do usuário em um intervalo de datas")
    public BigDecimal totalReceitasPorPeriodo(
            @ToolParam(description = "data inicial no formato AAAA-MM-DD") LocalDate inicio,
            @ToolParam(description = "data final no formato AAAA-MM-DD") LocalDate fim) {
        return transactionRepository.sumIncomeByPeriod(userProvider.getCurrentUserId(), inicio, fim);
    }

    @Tool(description = "Calcula o saldo (receitas menos despesas) do usuário em um intervalo de datas")
    public BigDecimal saldoPorPeriodo(
            @ToolParam(description = "data inicial no formato AAAA-MM-DD") LocalDate inicio,
            @ToolParam(description = "data final no formato AAAA-MM-DD") LocalDate fim) {
        UUID userId = userProvider.getCurrentUserId();
        BigDecimal receitas = transactionRepository.sumIncomeByPeriod(userId, inicio, fim);
        BigDecimal despesas = transactionRepository.sumExpensesByPeriod(userId, inicio, fim);
        return receitas.subtract(despesas);
    }

    @Tool(
            description
            = "Soma os gastos (despesas) do usuário em uma categoria específica dentro de um intervalo de datas")
    public BigDecimal totalGastosPorCategoria(
            @ToolParam(description = "nome exato da categoria, ex.: Alimentação") String categoria,
            @ToolParam(description = "data inicial no formato AAAA-MM-DD") LocalDate inicio,
            @ToolParam(description = "data final no formato AAAA-MM-DD") LocalDate fim) {
        return transactionRepository.sumExpensesByCategoryNameAndPeriod(
                userProvider.getCurrentUserId(), categoria, inicio, fim);
    }

    @Tool(description = "Lista as categorias com maior gasto no período, da maior para a menor")
    public List<TotalCategoria> topCategorias(
            @ToolParam(description = "data inicial no formato AAAA-MM-DD") LocalDate inicio,
            @ToolParam(description = "data final no formato AAAA-MM-DD") LocalDate fim,
            @ToolParam(description = "quantidade máxima de categorias a retornar") int limite) {
        UUID userId = userProvider.getCurrentUserId();
        return transactionRepository.topCategorias(userId, inicio, fim, PageRequest.of(0, Math.max(1, limite)));
    }

    @Tool(
            description
            = "Lista os nomes das categorias do usuário. Use para mapear termos do usuário (ex.: 'comida') ao nome real de uma categoria (ex.: 'Alimentação')")
    public List<String> listarCategorias() {
        return categoryRepository.findAllByUserId(userProvider.getCurrentUserId()).stream()
                .map(Category::getName)
                .toList();
    }
}

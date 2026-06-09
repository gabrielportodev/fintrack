package me.gabrielporto.fintrack.backend.ai;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.domain.enums.TransactionType;
import me.gabrielporto.fintrack.backend.dto.request.CategoryRequest;
import me.gabrielporto.fintrack.backend.dto.request.GoalRequest;
import me.gabrielporto.fintrack.backend.dto.request.TransactionRequest;
import me.gabrielporto.fintrack.backend.dto.response.CategoryResponse;
import me.gabrielporto.fintrack.backend.dto.response.GoalResponse;
import me.gabrielporto.fintrack.backend.dto.response.TransactionResponse;
import me.gabrielporto.fintrack.backend.exception.ResourceNotFoundException;
import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.security.AuthenticatedUserProvider;
import me.gabrielporto.fintrack.backend.service.CategoryService;
import me.gabrielporto.fintrack.backend.service.GoalService;
import me.gabrielporto.fintrack.backend.service.TransactionService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MutacaoFinanceiraTools {

    private static final Map<String, String> ICON_ALIASES = Map.ofEntries(
            Map.entry("food", "utensils"),
            Map.entry("restaurant", "utensils"),
            Map.entry("utensils", "utensils"),
            Map.entry("car", "car"),
            Map.entry("transport", "car"),
            Map.entry("home", "home"),
            Map.entry("house", "home"),
            Map.entry("movie", "film"),
            Map.entry("entertainment", "film"),
            Map.entry("film", "film"),
            Map.entry("health", "pill"),
            Map.entry("medicine", "pill"),
            Map.entry("pill", "pill"),
            Map.entry("book", "book-open"),
            Map.entry("book-open", "book-open"),
            Map.entry("education", "book-open"),
            Map.entry("shopping", "shopping-cart"),
            Map.entry("shopping-cart", "shopping-cart"),
            Map.entry("cart", "shopping-cart"),
            Map.entry("coffee", "coffee"),
            Map.entry("money", "wallet"),
            Map.entry("wallet", "wallet"),
            Map.entry("subscription", "wallet"),
            Map.entry("subscriptions", "wallet"),
            Map.entry("assinatura", "wallet"),
            Map.entry("assinaturas", "wallet"),
            Map.entry("computer", "laptop"),
            Map.entry("laptop", "laptop"),
            Map.entry("investment", "chart-line"),
            Map.entry("chart", "chart-line"),
            Map.entry("chart-line", "chart-line"),
            Map.entry("gift", "gift"),
            Map.entry("travel", "plane"),
            Map.entry("plane", "plane"),
            Map.entry("pet", "paw-print"),
            Map.entry("paw-print", "paw-print"),
            Map.entry("game", "gamepad-2"),
            Map.entry("gamepad-2", "gamepad-2"),
            Map.entry("gym", "dumbbell"),
            Map.entry("fitness", "dumbbell"),
            Map.entry("dumbbell", "dumbbell"));

    private final TransactionService transactionService;
    private final CategoryService categoryService;
    private final GoalService goalService;
    private final CategoryRepository categoryRepository;
    private final AuthenticatedUserProvider userProvider;

    @Tool(description = "Cria uma nova transação financeira (despesa ou receita) para o usuário")
    public TransactionResponse criarTransacao(
            @ToolParam(description = "descrição da transação") String descricao,
            @ToolParam(description = "valor positivo da transação") BigDecimal valor,
            @ToolParam(description = "tipo: EXPENSE para despesa, INCOME para receita") TransactionType tipo,
            @ToolParam(description = "data da transação no formato AAAA-MM-DD") LocalDate data,
            @ToolParam(description = "nome exato da categoria, ex.: Alimentação") String nomeCategoria) {
        UUID categoryId = resolverCategoriaPorNome(nomeCategoria);
        TransactionRequest req = new TransactionRequest();
        req.setDescription(descricao);
        req.setAmount(valor);
        req.setType(tipo);
        req.setDate(data);
        req.setCategoryId(categoryId);
        return transactionService.create(req);
    }

    @Tool(description = "Atualiza uma transação existente do usuário")
    public TransactionResponse atualizarTransacao(
            @ToolParam(description = "ID UUID da transação a atualizar") UUID id,
            @ToolParam(description = "nova descrição") String descricao,
            @ToolParam(description = "novo valor positivo") BigDecimal valor,
            @ToolParam(description = "novo tipo: EXPENSE para despesa, INCOME para receita") TransactionType tipo,
            @ToolParam(description = "nova data no formato AAAA-MM-DD") LocalDate data,
            @ToolParam(description = "nome exato da nova categoria") String nomeCategoria) {
        UUID categoryId = resolverCategoriaPorNome(nomeCategoria);
        TransactionRequest req = new TransactionRequest();
        req.setDescription(descricao);
        req.setAmount(valor);
        req.setType(tipo);
        req.setDate(data);
        req.setCategoryId(categoryId);
        return transactionService.update(id, req);
    }

    @Tool(description = "Cria uma nova categoria de transação")
    public CategoryResponse criarCategoria(
            @ToolParam(description = "nome da categoria") String nome,
            @ToolParam(description = "cor em hexadecimal, ex.: #FF5733") String cor,
            @ToolParam(description = "nome do ícone, ex.: shopping-cart, wallet, car, home") String icone) {
        CategoryRequest req = new CategoryRequest();
        req.setName(nome);
        req.setColor(cor);
        req.setIcon(normalizarIcone(icone));
        return categoryService.create(req);
    }

    @Tool(description = "Atualiza uma categoria existente do usuário")
    public CategoryResponse atualizarCategoria(
            @ToolParam(description = "ID UUID da categoria a atualizar") UUID id,
            @ToolParam(description = "novo nome") String nome,
            @ToolParam(description = "nova cor em hexadecimal") String cor,
            @ToolParam(description = "novo nome do ícone") String icone) {
        CategoryRequest req = new CategoryRequest();
        req.setName(nome);
        req.setColor(cor);
        req.setIcon(normalizarIcone(icone));
        return categoryService.update(id, req);
    }

    @Tool(description = "Cria uma nova meta de limite de gasto mensal para uma categoria")
    public GoalResponse criarMeta(
            @ToolParam(description = "nome da meta") String nome,
            @ToolParam(description = "valor limite mensal") BigDecimal valorLimite,
            @ToolParam(description = "mês da meta (1-12)") int mes,
            @ToolParam(description = "ano da meta, ex.: 2025") int ano,
            @ToolParam(description = "nome exato da categoria") String nomeCategoria) {
        UUID categoryId = resolverCategoriaPorNome(nomeCategoria);
        GoalRequest req = new GoalRequest();
        req.setName(nome);
        req.setLimitAmount(valorLimite);
        req.setMonth(mes);
        req.setYear(ano);
        req.setCategoryId(categoryId);
        return goalService.create(req);
    }

    @Tool(description = "Atualiza uma meta de gasto existente do usuário")
    public GoalResponse atualizarMeta(
            @ToolParam(description = "ID UUID da meta a atualizar") UUID id,
            @ToolParam(description = "novo nome") String nome,
            @ToolParam(description = "novo valor limite mensal") BigDecimal valorLimite,
            @ToolParam(description = "novo mês (1-12)") int mes,
            @ToolParam(description = "novo ano") int ano,
            @ToolParam(description = "nome exato da nova categoria") String nomeCategoria) {
        UUID categoryId = resolverCategoriaPorNome(nomeCategoria);
        GoalRequest req = new GoalRequest();
        req.setName(nome);
        req.setLimitAmount(valorLimite);
        req.setMonth(mes);
        req.setYear(ano);
        req.setCategoryId(categoryId);
        return goalService.update(id, req);
    }

    private UUID resolverCategoriaPorNome(String nome) {
        return categoryRepository
                .findByNameAndUserId(nome, userProvider.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria '" + nome + "' não encontrada"))
                .getId();
    }

    private String normalizarIcone(String icone) {
        if (icone == null || icone.isBlank()) {
            return "utensils";
        }
        String valor = icone.trim();
        return ICON_ALIASES.getOrDefault(valor.toLowerCase(), valor);
    }
}

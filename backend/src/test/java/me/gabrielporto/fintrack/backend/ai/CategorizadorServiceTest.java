package me.gabrielporto.fintrack.backend.ai;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import me.gabrielporto.fintrack.backend.ai.dto.CategorySuggestion;
import me.gabrielporto.fintrack.backend.ai.dto.SuggestCategoryRequest;
import me.gabrielporto.fintrack.backend.ai.dto.SuggestCategoryResponse;
import me.gabrielporto.fintrack.backend.domain.entity.Category;
import me.gabrielporto.fintrack.backend.domain.enums.TransactionType;
import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.security.AuthenticatedUserProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;

@ExtendWith(MockitoExtension.class)
class CategorizadorServiceTest {

    @Mock
    private ChatClient.Builder builder;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private AuthenticatedUserProvider userProvider;

    private ChatClient chatClient;
    private CategorizadorService service;

    private Category alimentacao;
    private Category transporte;

    @BeforeEach
    void setUp() {
        chatClient = mock(ChatClient.class);
        when(builder.build()).thenReturn(chatClient);
        service = new CategorizadorService(builder, categoryRepository, userProvider);

        alimentacao = Category.builder()
                .id(UUID.randomUUID())
                .name("Alimentação")
                .color("#f00")
                .icon("utensils")
                .build();
        transporte = Category.builder()
                .id(UUID.randomUUID())
                .name("Transporte")
                .color("#0f0")
                .icon("car")
                .build();
    }

    private List<Category> categorias() {
        return List.of(alimentacao, transporte);
    }

    @Test
    @DisplayName("resolver: mapeia a sugestão para a categoria real (case-insensitive)")
    void resolverMapeiaCategoria() {
        SuggestCategoryResponse r = service.resolver(new CategorySuggestion("alimentação", 0.9), categorias());

        assertThat(r.categoryId()).isEqualTo(alimentacao.getId());
        assertThat(r.categoryName()).isEqualTo("Alimentação");
        assertThat(r.confidence()).isEqualTo(0.9);
    }

    @Test
    @DisplayName("resolver: confiança abaixo do limiar → vazio")
    void resolverConfiancaBaixa() {
        SuggestCategoryResponse r = service.resolver(new CategorySuggestion("Alimentação", 0.3), categorias());
        assertThat(r.categoryId()).isNull();
    }

    @Test
    @DisplayName("resolver: nome inexistente na lista → vazio")
    void resolverNomeInexistente() {
        SuggestCategoryResponse r = service.resolver(new CategorySuggestion("Viagem", 0.95), categorias());
        assertThat(r.categoryId()).isNull();
    }

    @Test
    @DisplayName("resolver: sugestão nula → vazio")
    void resolverNula() {
        SuggestCategoryResponse r = service.resolver(null, categorias());
        assertThat(r.categoryId()).isNull();
    }

    @Test
    @DisplayName("sugerir: usuário sem categorias retorna vazio sem chamar a LLM")
    void sugerirSemCategorias() {
        UUID userId = UUID.randomUUID();
        when(userProvider.getCurrentUserId()).thenReturn(userId);
        when(categoryRepository.findAllByUserId(userId)).thenReturn(List.of());

        SuggestCategoryResponse r = service.sugerir(
                new SuggestCategoryRequest("iFood almoço", new BigDecimal("35.90"), TransactionType.EXPENSE));

        assertThat(r.categoryId()).isNull();
        verifyNoInteractions(chatClient);
    }
}

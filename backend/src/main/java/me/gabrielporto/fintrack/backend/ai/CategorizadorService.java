package me.gabrielporto.fintrack.backend.ai;

import java.util.List;
import java.util.UUID;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import me.gabrielporto.fintrack.backend.ai.dto.CategorySuggestion;
import me.gabrielporto.fintrack.backend.ai.dto.SuggestCategoryRequest;
import me.gabrielporto.fintrack.backend.ai.dto.SuggestCategoryResponse;
import me.gabrielporto.fintrack.backend.domain.entity.Category;
import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.security.AuthenticatedUserProvider;

@Service
public class CategorizadorService {

    private static final double LIMIAR_CONFIANCA = 0.5;

    private final ChatClient chat;
    private final CategoryRepository categoryRepository;
    private final AuthenticatedUserProvider userProvider;

    public CategorizadorService(ChatClient.Builder builder,
            CategoryRepository categoryRepository,
            AuthenticatedUserProvider userProvider) {
        this.chat = builder.build();
        this.categoryRepository = categoryRepository;
        this.userProvider = userProvider;
    }

    public SuggestCategoryResponse sugerir(SuggestCategoryRequest request) {
        UUID userId = userProvider.getCurrentUserId();
        List<Category> categorias = categoryRepository.findAllByUserId(userId);

        if (categorias.isEmpty()) {
            return SuggestCategoryResponse.empty();
        }

        String nomes = categorias.stream().map(Category::getName).reduce((a, b) -> a + ", " + b).orElse("");

        CategorySuggestion sugestao = chat.prompt()
                .system("""
                        Você categoriza transações financeiras pessoais.
                        Escolha EXATAMENTE UMA categoria, usando o nome idêntico ao de uma das
                        opções válidas fornecidas pelo usuário. Não invente categorias novas.
                        Atribua uma confiança entre 0.0 e 1.0. Se ficar em dúvida, use confiança baixa.
                        """)
                .user("""
                        Descrição: %s
                        Valor: %s
                        Tipo: %s
                        Categorias válidas: %s
                        """.formatted(request.description(), request.amount(), request.type(), nomes))
                .call()
                .entity(CategorySuggestion.class);

        return resolver(sugestao, categorias);
    }

    SuggestCategoryResponse resolver(CategorySuggestion sugestao, List<Category> categorias) {
        if (sugestao == null || sugestao.categoryName() == null || sugestao.confidence() < LIMIAR_CONFIANCA) {
            return SuggestCategoryResponse.empty();
        }

        return categorias.stream()
                .filter(c -> c.getName().equalsIgnoreCase(sugestao.categoryName().trim()))
                .findFirst()
                .map(c -> new SuggestCategoryResponse(c.getId(), c.getName(), sugestao.confidence()))
                .orElseGet(SuggestCategoryResponse::empty);
    }
}

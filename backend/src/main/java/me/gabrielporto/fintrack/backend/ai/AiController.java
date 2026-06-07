package me.gabrielporto.fintrack.backend.ai;

import java.time.LocalDate;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import me.gabrielporto.fintrack.backend.ai.dto.PerguntaRequest;
import me.gabrielporto.fintrack.backend.ai.dto.SuggestCategoryRequest;
import me.gabrielporto.fintrack.backend.ai.dto.SuggestCategoryResponse;
import me.gabrielporto.fintrack.backend.dto.response.ApiResponse;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ChatClient chat;
    private final CategorizadorService categorizadorService;
    private final ConsultaFinanceiraTools tools;

    public AiController(ChatClient.Builder builder,
            CategorizadorService categorizadorService,
            ConsultaFinanceiraTools tools) {
        this.chat = builder.build();
        this.categorizadorService = categorizadorService;
        this.tools = tools;
    }

    @PostMapping("/suggest-category")
    public ResponseEntity<ApiResponse<SuggestCategoryResponse>> suggestCategory(
            @Valid @RequestBody SuggestCategoryRequest request) {
        SuggestCategoryResponse suggestion = categorizadorService.sugerir(request);
        return ResponseEntity.ok(ApiResponse.success(suggestion, "Sugestão de categoria gerada"));
    }

    @PostMapping("/consulta")
    public ResponseEntity<ApiResponse<String>> consulta(@Valid @RequestBody PerguntaRequest request) {
        String resposta = chat.prompt()
                .system("""
                        Você é o assistente financeiro do Fintrack.
                        Para QUALQUER número (totais, somas, comparações), use SEMPRE as ferramentas
                        disponíveis — NUNCA invente valores nem faça cálculos por conta própria.
                        A data de hoje é %s. Responda em português do Brasil, de forma curta e direta,
                        e formate valores monetários em reais (R$).
                        """.formatted(LocalDate.now()))
                .user(request.pergunta())
                .tools(tools)
                .call()
                .content();

        return ResponseEntity.ok(ApiResponse.success(resposta, "Consulta respondida"));
    }
}

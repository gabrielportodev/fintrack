package me.gabrielporto.fintrack.backend.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record PerguntaRequest(
        @NotBlank(message = "A pergunta é obrigatória")
        String pergunta
        ) {

}

package me.gabrielporto.fintrack.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "Cor é obrigatória")
    private String color;

    @NotBlank(message = "Ícone é obrigatório")
    private String icon;
}

package me.gabrielporto.fintrack.backend.ai.dto;

import java.util.UUID;

public record SuggestCategoryResponse(UUID categoryId, String categoryName, double confidence) {

    public static SuggestCategoryResponse empty() {
        return new SuggestCategoryResponse(null, null, 0.0);
    }
}

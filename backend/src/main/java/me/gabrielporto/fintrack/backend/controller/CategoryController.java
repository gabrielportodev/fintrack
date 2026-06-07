package me.gabrielporto.fintrack.backend.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.dto.request.CategoryRequest;
import me.gabrielporto.fintrack.backend.dto.response.ApiResponse;
import me.gabrielporto.fintrack.backend.dto.response.CategoryResponse;
import me.gabrielporto.fintrack.backend.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.findAll(), "Categorias listadas com sucesso"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.findById(id), "Categoria encontrada"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(categoryService.create(request), "Categoria criada com sucesso"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> update(
            @PathVariable UUID id, @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(categoryService.update(id, request), "Categoria atualizada com sucesso"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Categoria removida com sucesso"));
    }
}

package me.gabrielporto.fintrack.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.dto.request.GoalRequest;
import me.gabrielporto.fintrack.backend.dto.response.ApiResponse;
import me.gabrielporto.fintrack.backend.dto.response.GoalResponse;
import me.gabrielporto.fintrack.backend.service.GoalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GoalResponse>>> findByMonth(@RequestParam int month, @RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success(goalService.findByMonth(month, year), "Metas listadas com sucesso"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GoalResponse>> create(@Valid @RequestBody GoalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(goalService.create(request), "Meta criada com sucesso"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GoalResponse>> update(@PathVariable UUID id, @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(ApiResponse.success(goalService.update(id, request), "Meta atualizada com sucesso"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        goalService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Meta removida com sucesso"));
    }
}

package me.gabrielporto.fintrack.backend.service;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.domain.entity.Category;
import me.gabrielporto.fintrack.backend.domain.entity.User;
import me.gabrielporto.fintrack.backend.dto.request.CategoryRequest;
import me.gabrielporto.fintrack.backend.dto.response.CategoryResponse;
import me.gabrielporto.fintrack.backend.exception.BusinessException;
import me.gabrielporto.fintrack.backend.exception.ResourceNotFoundException;
import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<CategoryResponse> findAll() {
        User user = getAuthenticatedUser();
        return categoryRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse findById(UUID id) {
        User user = getAuthenticatedUser();
        Category category = categoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
        return toResponse(category);
    }

    public CategoryResponse create(CategoryRequest request) {
        User user = getAuthenticatedUser();

        if (categoryRepository.existsByNameAndUserId(request.getName(), user.getId())) {
            throw new BusinessException("Já existe uma categoria com esse nome");
        }

        Category category = Category.builder()
                .name(request.getName())
                .color(request.getColor())
                .icon(request.getIcon())
                .user(user)
                .build();

        return toResponse(categoryRepository.save(category));
    }

    public CategoryResponse update(UUID id, CategoryRequest request) {
        User user = getAuthenticatedUser();
        Category category = categoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        category.setName(request.getName());
        category.setColor(request.getColor());
        category.setIcon(request.getIcon());

        return toResponse(categoryRepository.save(category));
    }

    public void delete(UUID id) {
        User user = getAuthenticatedUser();
        Category category = categoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
        categoryRepository.delete(category);
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getColor(),
                category.getIcon(),
                category.getCreatedAt()
        );
    }
}
package me.gabrielporto.fintrack.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import me.gabrielporto.fintrack.backend.domain.entity.Category;
import me.gabrielporto.fintrack.backend.domain.entity.User;
import me.gabrielporto.fintrack.backend.dto.request.CategoryRequest;
import me.gabrielporto.fintrack.backend.dto.response.CategoryResponse;
import me.gabrielporto.fintrack.backend.exception.BusinessException;
import me.gabrielporto.fintrack.backend.exception.ResourceNotFoundException;
import me.gabrielporto.fintrack.backend.repository.CategoryRepository;
import me.gabrielporto.fintrack.backend.repository.UserRepository;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CategoryService categoryService;

    private User user;

    @BeforeEach
    void setUp() {

        user = User.builder()
            .id(UUID.randomUUID())
            .name("Gabriel")
            .email("gabriel@email.com")
            .password("123")
            .build();

        Authentication authentication = mock(Authentication.class);

        when(authentication.getName())
            .thenReturn("gabriel@email.com");

        SecurityContextHolder.getContext()
            .setAuthentication(authentication);

        when(userRepository.findByEmail("gabriel@email.com"))
            .thenReturn(Optional.of(user));
    }

    @AfterEach
    void cleanContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Deve retornar categorias do usuário")
    void shouldReturnUserCategories() {

        Category category = Category.builder()
            .id(UUID.randomUUID())
            .name("Alimentação")
            .color("#FF0000")
            .icon("food")
            .user(user)
            .build();

        when(categoryRepository.findAllByUserId(user.getId()))
            .thenReturn(List.of(category));

        List<CategoryResponse> response = categoryService.findAll();

        assertThat(response).hasSize(1);
        assertThat(response.get(0).getName())
            .isEqualTo("Alimentação");
    }

    @Test
    @DisplayName("Deve criar categoria com sucesso")
    void shouldCreateCategorySuccessfully() {

        CategoryRequest request = new CategoryRequest();
        request.setName("Alimentação");
        request.setColor("#FF0000");
        request.setIcon("food");

        Category category = Category.builder()
            .id(UUID.randomUUID())
            .name("Alimentação")
            .color("#FF0000")
            .icon("food")
            .user(user)
            .build();

        when(categoryRepository.existsByNameAndUserId("Alimentação", user.getId()))
            .thenReturn(false);

        when(categoryRepository.save(any()))
            .thenReturn(category);

        CategoryResponse response = categoryService.create(request);

        assertThat(response.getName()).isEqualTo("Alimentação");
        assertThat(response.getColor()).isEqualTo("#FF0000");
    }

    @Test
    @DisplayName("Deve lançar erro quando categoria já existir")
    void shouldThrowExceptionWhenCategoryAlreadyExists() {

        CategoryRequest request = new CategoryRequest();
        request.setName("Alimentação");

        when(categoryRepository.existsByNameAndUserId("Alimentação", user.getId()))
            .thenReturn(true);

        assertThatThrownBy(() -> categoryService.create(request))
            .isInstanceOf(BusinessException.class)
            .hasMessage("Já existe uma categoria com esse nome");
    }

    @Test
    @DisplayName("Deve atualizar categoria existente")
    void shouldUpdateCategorySuccessfully() {

        UUID categoryId = UUID.randomUUID();

        CategoryRequest request = new CategoryRequest();
        request.setName("Transporte");
        request.setColor("#00FF00");
        request.setIcon("car");

        Category category = Category.builder()
            .id(categoryId)
            .name("Alimentação")
            .color("#FF0000")
            .icon("food")
            .user(user)
            .build();

        when(categoryRepository.findByIdAndUserId(categoryId, user.getId()))
            .thenReturn(Optional.of(category));

        when(categoryRepository.save(any()))
            .thenReturn(category);

        CategoryResponse response = categoryService.update(categoryId, request);

        assertThat(response.getName()).isEqualTo("Transporte");
        assertThat(response.getColor()).isEqualTo("#00FF00");
    }

    @Test
    @DisplayName("Deve lançar erro ao deletar categoria inexistente")
    void shouldThrowExceptionWhenCategoryDoesNotExist() {

        UUID categoryId = UUID.randomUUID();

        when(categoryRepository.findByIdAndUserId(categoryId, user.getId()))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.delete(categoryId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Categoria não encontrada");
    }
}
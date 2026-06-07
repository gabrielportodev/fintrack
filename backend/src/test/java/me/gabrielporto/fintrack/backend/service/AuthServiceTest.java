package me.gabrielporto.fintrack.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import me.gabrielporto.fintrack.backend.domain.entity.User;
import me.gabrielporto.fintrack.backend.dto.request.ChangePasswordRequest;
import me.gabrielporto.fintrack.backend.dto.request.LoginRequest;
import me.gabrielporto.fintrack.backend.dto.request.RegisterRequest;
import me.gabrielporto.fintrack.backend.dto.request.UpdateProfileRequest;
import me.gabrielporto.fintrack.backend.dto.response.MeResponse;
import me.gabrielporto.fintrack.backend.dto.response.MessageResponse;
import me.gabrielporto.fintrack.backend.dto.response.ProfileResponse;
import me.gabrielporto.fintrack.backend.dto.response.RegisterResponse;
import me.gabrielporto.fintrack.backend.dto.response.TokenResponse;
import me.gabrielporto.fintrack.backend.exception.BusinessException;
import me.gabrielporto.fintrack.backend.exception.EmailAlreadyExistsException;
import me.gabrielporto.fintrack.backend.exception.InvalidCredentialsException;
import me.gabrielporto.fintrack.backend.exception.ResourceNotFoundException;
import me.gabrielporto.fintrack.backend.repository.UserRepository;
import me.gabrielporto.fintrack.backend.security.AuthenticatedUserProvider;
import me.gabrielporto.fintrack.backend.security.JwtService;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private AuthenticatedUserProvider authenticatedUserProvider;

    @InjectMocks
    private AuthService authService;

    @AfterEach
    void cleanSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Deve impedir cadastro com email já existente")
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        RegisterRequest request = new RegisterRequest();
        request.setEmail("gabriel@email.com");

        when(userRepository.existsByEmail("gabriel@email.com"))
            .thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
            .isInstanceOf(EmailAlreadyExistsException.class)
            .hasMessage("Email já cadastrado!");
    }

    @Test
    @DisplayName("Deve cadastrar usuário com sucesso")
    void shouldRegisterUserSuccessfully() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Gabriel");
        request.setEmail("gabriel@email.com");
        request.setPassword("123456");

        User user = User.builder()
            .name("Gabriel")
            .email("gabriel@email.com")
            .password("senhaCriptografada")
            .build();

        when(userRepository.existsByEmail(any()))
            .thenReturn(false);

        when(passwordEncoder.encode("123456"))
            .thenReturn("senhaCriptografada");

        when(userRepository.save(any()))
            .thenReturn(user);

        RegisterResponse response = authService.register(request);

        assertThat(response.getName()).isEqualTo("Gabriel");
        assertThat(response.getEmail()).isEqualTo("gabriel@email.com");
    }

    @Test
    @DisplayName("Deve retornar token ao fazer login")
    void shouldReturnTokenWhenLoginIsValid() {

        LoginRequest request = new LoginRequest();
        request.setEmail("gabriel@email.com");
        request.setPassword("123456");

        UserDetails userDetails = org.mockito.Mockito.mock(UserDetails.class);

        when(userDetailsService.loadUserByUsername("gabriel@email.com"))
            .thenReturn(userDetails);

        when(jwtService.generateToken(userDetails))
            .thenReturn("token123");

        TokenResponse response = authService.login(request);

        assertThat(response.getAccessToken()).isEqualTo("token123");
    }

    @Test
    @DisplayName("Deve lançar erro ao fazer login inválido")
    void shouldThrowExceptionWhenLoginIsInvalid() {

        LoginRequest request = new LoginRequest();
        request.setEmail("gabriel@email.com");
        request.setPassword("senhaErrada");

        when(authenticationManager.authenticate(any()))
            .thenThrow(new BadCredentialsException("Erro"));

        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOf(InvalidCredentialsException.class)
            .hasMessage("Email ou senha inválidos");
    }

    @Test
    @DisplayName("Deve retornar dados do usuário autenticado")
    void shouldReturnAuthenticatedUserData() {

        Authentication authentication = org.mockito.Mockito.mock(Authentication.class);

        when(authentication.getName())
            .thenReturn("gabriel@email.com");

        SecurityContextHolder.getContext()
            .setAuthentication(authentication);

        User user = User.builder()
            .id(UUID.randomUUID())
            .name("Gabriel")
            .email("gabriel@email.com")
            .password("123")
            .build();

        when(userRepository.findByEmail("gabriel@email.com"))
            .thenReturn(Optional.of(user));

        MeResponse response = authService.me();

        assertThat(response.getName()).isEqualTo("Gabriel");
        assertThat(response.getEmail()).isEqualTo("gabriel@email.com");
    }

    @Test
    @DisplayName("Deve lançar erro quando usuário não existir")
    void shouldThrowExceptionWhenUserDoesNotExist() {

        Authentication authentication = org.mockito.Mockito.mock(Authentication.class);

        when(authentication.getName())
            .thenReturn("gabriel@email.com");

        SecurityContextHolder.getContext()
            .setAuthentication(authentication);

        when(userRepository.findByEmail("gabriel@email.com"))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.me())
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Usuário não encontrado");
    }

    @Test
    @DisplayName("Deve atualizar perfil e retornar novos tokens")
    void shouldUpdateProfileSuccessfully() {

        User user = User.builder()
            .id(UUID.randomUUID())
            .name("Gabriel")
            .email("gabriel@email.com")
            .password("123")
            .build();

        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setName("Gabriel Porto");
        request.setEmail("novo@email.com");

        when(authenticatedUserProvider.getCurrentUser()).thenReturn(user);
        when(userRepository.existsByEmail("novo@email.com")).thenReturn(false);
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        UserDetails userDetails = org.mockito.Mockito.mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("novo@email.com")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("access123");
        when(jwtService.generateRefreshToken(userDetails)).thenReturn("refresh123");

        ProfileResponse response = authService.updateProfile(request);

        assertThat(response.getName()).isEqualTo("Gabriel Porto");
        assertThat(response.getEmail()).isEqualTo("novo@email.com");
        assertThat(response.getAccessToken()).isEqualTo("access123");
        assertThat(response.getRefreshToken()).isEqualTo("refresh123");
    }

    @Test
    @DisplayName("Deve impedir atualização de perfil com email já usado por outro usuário")
    void shouldThrowWhenUpdatingProfileToExistingEmail() {

        User user = User.builder()
            .id(UUID.randomUUID())
            .name("Gabriel")
            .email("gabriel@email.com")
            .password("123")
            .build();

        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setName("Gabriel");
        request.setEmail("existente@email.com");

        when(authenticatedUserProvider.getCurrentUser()).thenReturn(user);
        when(userRepository.existsByEmail("existente@email.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.updateProfile(request))
            .isInstanceOf(EmailAlreadyExistsException.class);
    }

    @Test
    @DisplayName("Deve alterar a senha com sucesso")
    void shouldChangePasswordSuccessfully() {

        User user = User.builder()
            .id(UUID.randomUUID())
            .name("Gabriel")
            .email("gabriel@email.com")
            .password("hashAtual")
            .build();

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("SenhaAtual1");
        request.setNewPassword("SenhaNova1");
        request.setConfirmPassword("SenhaNova1");

        when(authenticatedUserProvider.getCurrentUser()).thenReturn(user);
        when(passwordEncoder.matches("SenhaAtual1", "hashAtual")).thenReturn(true);
        when(passwordEncoder.matches("SenhaNova1", "hashAtual")).thenReturn(false);
        when(passwordEncoder.encode("SenhaNova1")).thenReturn("hashNovo");

        MessageResponse response = authService.changePassword(request);

        assertThat(response.getMessage()).isEqualTo("Senha alterada com sucesso");
        assertThat(user.getPassword()).isEqualTo("hashNovo");
    }

    @Test
    @DisplayName("Deve lançar erro ao alterar senha com senha atual incorreta")
    void shouldThrowWhenCurrentPasswordIsWrong() {

        User user = User.builder()
            .id(UUID.randomUUID())
            .name("Gabriel")
            .email("gabriel@email.com")
            .password("hashAtual")
            .build();

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("Errada1");
        request.setNewPassword("SenhaNova1");
        request.setConfirmPassword("SenhaNova1");

        when(authenticatedUserProvider.getCurrentUser()).thenReturn(user);
        when(passwordEncoder.matches("Errada1", "hashAtual")).thenReturn(false);

        assertThatThrownBy(() -> authService.changePassword(request))
            .isInstanceOf(BusinessException.class)
            .hasMessage("Senha atual incorreta");
    }
}
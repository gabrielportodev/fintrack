package me.gabrielporto.fintrack.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private final AvatarImageProcessor avatarImageProcessor;

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException();
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        return new RegisterResponse(savedUser.getName(), savedUser.getEmail());
    }

    public TokenResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException();
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return new TokenResponse(accessToken, refreshToken);
    }

    public TokenResponse refresh(String refreshToken) {
        try {
            String email = jwtService.extractEmail(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (!jwtService.isRefreshTokenValid(refreshToken)) {
                throw new InvalidCredentialsException();
            }

            String newAccessToken = jwtService.generateToken(userDetails);
            String newRefreshToken = jwtService.generateRefreshToken(userDetails);

            return new TokenResponse(newAccessToken, newRefreshToken);
        } catch (InvalidCredentialsException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidCredentialsException();
        }
    }

    public MeResponse me() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return new MeResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt(), user.getAvatarUrl());
    }

    public ProfileResponse updateProfile(UpdateProfileRequest request) {
        User user = authenticatedUserProvider.getCurrentUser();

        String newEmail = request.getEmail().trim();
        if (!user.getEmail().equalsIgnoreCase(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new EmailAlreadyExistsException();
        }

        user.setName(request.getName().trim());
        user.setEmail(newEmail);
        User savedUser = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return new ProfileResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getCreatedAt(),
                savedUser.getAvatarUrl(),
                accessToken,
                refreshToken
        );
    }

    public MessageResponse changePassword(ChangePasswordRequest request) {
        User user = authenticatedUserProvider.getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("Senha atual incorreta");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("As senhas não coincidem");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BusinessException("A nova senha deve ser diferente da senha atual");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new MessageResponse("Senha alterada com sucesso");
    }

    public MeResponse updateAvatar(MultipartFile file) {
        String avatarUrl = avatarImageProcessor.process(file);

        User user = authenticatedUserProvider.getCurrentUser();
        user.setAvatarUrl(avatarUrl);

        User savedUser = userRepository.save(user);
        return new MeResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail(),
                savedUser.getCreatedAt(), savedUser.getAvatarUrl());
    }

    public MeResponse removeAvatar() {
        User user = authenticatedUserProvider.getCurrentUser();
        user.setAvatarUrl(null);

        User savedUser = userRepository.save(user);
        return new MeResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail(),
                savedUser.getCreatedAt(), savedUser.getAvatarUrl());
    }

}

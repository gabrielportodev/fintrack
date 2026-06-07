package me.gabrielporto.fintrack.backend.security;

import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.fintrack.backend.domain.entity.User;
import me.gabrielporto.fintrack.backend.exception.ResourceNotFoundException;
import me.gabrielporto.fintrack.backend.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class AuthenticatedUserProvider {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    public UUID getCurrentUserId() {
        return getCurrentUser().getId();
    }
}

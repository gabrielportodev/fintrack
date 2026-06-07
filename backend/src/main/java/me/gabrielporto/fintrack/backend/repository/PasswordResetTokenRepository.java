package me.gabrielporto.fintrack.backend.repository;

import java.util.Optional;
import java.util.UUID;
import me.gabrielporto.fintrack.backend.domain.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findByEmailAndCodeAndUsedFalse(String email, String code);

    Optional<PasswordResetToken> findByResetTokenAndUsedFalse(String resetToken);

    void deleteByEmail(String email);
}

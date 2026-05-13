package me.gabrielporto.fintrack.backend.repository;

import me.gabrielporto.fintrack.backend.domain.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    List<Category> findAllByUserId(UUID userId);

    Optional<Category> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByNameAndUserId(String name, UUID userId);
}
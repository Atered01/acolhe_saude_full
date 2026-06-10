package com.acolhe_saude.auth_service.repository;

import com.acolhe_saude.auth_service.domain.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Integer> {
    Optional<Perfil> findByNomeRole(String nomeRole);
}

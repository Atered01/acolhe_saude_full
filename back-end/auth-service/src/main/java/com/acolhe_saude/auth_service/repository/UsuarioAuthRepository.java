package com.acolhe_saude.auth_service.repository;

import com.acolhe_saude.auth_service.domain.UsuarioAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioAuthRepository extends JpaRepository<UsuarioAuth, Integer> {

    Optional<UsuarioAuth> findByEmail(String email);
}
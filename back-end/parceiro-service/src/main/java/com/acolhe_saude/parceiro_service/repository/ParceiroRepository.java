package com.acolhe_saude.parceiro_service.repository;

import com.acolhe_saude.parceiro_service.domain.Parceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParceiroRepository extends JpaRepository<Parceiro,Integer> {
    Optional<Parceiro> findByIdUsuarioAuth(int idUsuarioAuth);
}

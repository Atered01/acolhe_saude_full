package com.acolhe_saude.atendimento_service.repository;

import com.acolhe_saude.atendimento_service.domain.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;import org.springframework.stereotype.Repository;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
}

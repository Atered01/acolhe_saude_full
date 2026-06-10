package com.acolhe_saude.parceiro_service.repository;

import com.acolhe_saude.parceiro_service.domain.CapacidadeAtendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CapacidadeAtendimentoRepository extends JpaRepository<CapacidadeAtendimento, Integer> {
    List<CapacidadeAtendimento> findByVagasDisponiveisSemanaGreaterThan(Integer vagas);
}

package com.acolhe_saude.atendimento_service.repository;

import com.acolhe_saude.atendimento_service.domain.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AtendimentoRepository extends JpaRepository<Atendimento, Integer> {
    List<Atendimento> findByStatusAtendimentoInOrderByDataRegistroDesc(List<String> status);

    List<Atendimento> findByPaciente_IdPacienteOrderByDataRegistroDesc(int idPaciente);

    List<Atendimento> findTop10ByOrderByDataRegistroDesc();
}
package com.acolhe_saude.inteligencia_service.repository;

import com.acolhe_saude.inteligencia_service.domain.LogProcessamentoIa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogProcessamentoIaRepository extends JpaRepository<LogProcessamentoIa, Integer> {
}

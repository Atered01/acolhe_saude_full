package com.acolhe_saude.atendimento_service.service;

import com.acolhe_saude.atendimento_service.domain.Paciente;
import com.acolhe_saude.atendimento_service.dto.PacienteRequestDTO;
import com.acolhe_saude.atendimento_service.repository.PacienteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    public Paciente cadastrarPaciente(PacienteRequestDTO dto) {
        // 1. Mapeia o DTO para a Entidade
        Paciente paciente = new Paciente();
        paciente.setNomeCompleto(dto.nomeCompleto());
        paciente.setDataNascimento(dto.dataNascimento());
        paciente.setDocumentoIdentificacao(dto.documentoIdentificacao());
        paciente.setTipoSanguineo(dto.tipoSanguineo());
        paciente.setNomeAbrigo(dto.nomeAbrigo());
        paciente.setCondicoesPrevias(dto.condicoesPrevias());

        // 2. Define os dados de controle interno
        paciente.setDataCriacao(LocalDateTime.now());

        // 3. Salva no banco e retorna
        return pacienteRepository.save(paciente);
    }
}
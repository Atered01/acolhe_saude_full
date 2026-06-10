package com.acolhe_saude.atendimento_service.controller;

import com.acolhe_saude.atendimento_service.domain.Paciente;
import com.acolhe_saude.atendimento_service.dto.PacienteRequestDTO;
import com.acolhe_saude.atendimento_service.dto.PacienteResponseDTO;
import com.acolhe_saude.atendimento_service.repository.PacienteRepository;
import com.acolhe_saude.atendimento_service.service.PacienteService;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> listarTodos() {
        return ResponseEntity.ok(pacienteService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Paciente> cadastrar(@RequestBody PacienteRequestDTO dto) {
        Paciente salvo = pacienteService.cadastrarPaciente(dto);
        return ResponseEntity.status(201).body(salvo);
    }
}

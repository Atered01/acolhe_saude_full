package com.acolhe_saude.parceiro_service.controller;

import com.acolhe_saude.parceiro_service.dto.AtualizarRecursosDTO;
import com.acolhe_saude.parceiro_service.dto.ParceiroListagemDTO;
import com.acolhe_saude.parceiro_service.dto.ParceiroRequestDTO;
import com.acolhe_saude.parceiro_service.dto.ParceiroResponseDTO;
import com.acolhe_saude.parceiro_service.service.ParceiroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parceiros")
public class ParceiroController {
    private final ParceiroService parceiroService;

    public ParceiroController(ParceiroService parceiroService) {
        this.parceiroService = parceiroService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PARCEIRO') or hasRole('ADMIN')")
    public ResponseEntity<ParceiroResponseDTO> cadastrarParceiro(@RequestBody ParceiroRequestDTO requestDTO) {
        ParceiroResponseDTO response = parceiroService.cadastrarNovoParceiro(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/capacidade")
    @PreAuthorize("hasRole('PARCEIRO')")
    public ResponseEntity<Void> atualizarCapacidade(@RequestBody AtualizarRecursosDTO dto) {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        int idUsuarioLogado = Integer.parseInt((String) authentication.getPrincipal());
        parceiroService.atualizarRecursos(idUsuarioLogado, dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ParceiroListagemDTO>> listarTodos() {
        return ResponseEntity.ok(parceiroService.listarTodos());
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<ParceiroListagemDTO>> listarDisponiveis() {
        // Não restrinjo com @PreAuthorize porque Cuidadores, Médicos e Admins podem precisar desta lista
        return ResponseEntity.ok(parceiroService.listarDisponiveisParaEncaminhamento());
    }

    @PutMapping("/{id}/suspender")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> suspenderParceiro(@PathVariable int id) {
        parceiroService.suspenderParceiro(id);
        return ResponseEntity.ok("Clínica parceira suspensa com sucesso!");
    }
}
package com.acolhe_saude.atendimento_service.controller;

import com.acolhe_saude.atendimento_service.dto.AtendimentoListagemDTO;
import com.acolhe_saude.atendimento_service.dto.AtendimentoRequestDTO;
import com.acolhe_saude.atendimento_service.dto.EncaminharRequestDTO;
import com.acolhe_saude.atendimento_service.dto.TransferirRequestDTO;
import com.acolhe_saude.atendimento_service.service.AtendimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atendimentos")
public class AtendimentoController {
    private final AtendimentoService atendimentoService;

    public AtendimentoController(AtendimentoService atendimentoService) {
        this.atendimentoService = atendimentoService;
    }

    @GetMapping("/recentes")
    @PreAuthorize("hasRole('CUIDADOR') or hasRole('ADMIN') or hasRole('MEDICO')")
    public ResponseEntity<List<AtendimentoListagemDTO>> listarTriagensRecentes() {
        return ResponseEntity.ok(atendimentoService.listarTriagensRecentes());
    }

    // 🚨 2. Dashboard da Clínica (Alertas de Emergência)
    @GetMapping("/pendentes")
    @PreAuthorize("hasRole('PARCEIRO') or hasRole('ADMIN') or hasRole('MEDICO')")
    public ResponseEntity<List<AtendimentoListagemDTO>> listarEmergenciasPendentes() {
        return ResponseEntity.ok(atendimentoService.listarEmergenciasPendentes());
    }

    @PostMapping("/sintoma/{idPaciente}")
    @PreAuthorize("hasRole('CUIDADOR') or hasRole('ADMIN')")
    public ResponseEntity<java.util.Map<String, Integer>> registrarSintoma(
            @PathVariable int idPaciente,
            @RequestBody AtendimentoRequestDTO requestDTO) {
        Integer idCriado = atendimentoService.registrarNovoSintoma(idPaciente, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Map.of("idAtendimento", idCriado));
    }

    @PutMapping("/{id}/encaminhar")
    @PreAuthorize("hasRole('CUIDADOR') or hasRole('ADMIN') or hasRole('MEDICO')")
    public ResponseEntity<Void> encaminharParaClinica(
            @PathVariable("id") int idAtendimento,
            @RequestBody EncaminharRequestDTO dto) {
        atendimentoService.encaminharParaClinica(idAtendimento, dto);
        return ResponseEntity.ok().build();
    }

    // 🚨 NOVO: Endpoint que o Angular usa para fazer o Polling da IA
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUIDADOR') or hasRole('PARCEIRO') or hasRole('ADMIN') or hasRole('MEDICO')")
    public ResponseEntity<AtendimentoListagemDTO> buscarPorId(@PathVariable("id") int idAtendimento) {
        return ResponseEntity.ok(atendimentoService.buscarPorId(idAtendimento));
    }

    @PutMapping("/{id}/aceitar")
    @PreAuthorize("hasRole('PARCEIRO')or hasRole('ADMIN') or hasRole('MEDICO')")
    public ResponseEntity<Void> aceitarEmergencia(
            @PathVariable("id") int idAtendimento,
            Authentication authentication) {
        int idParceiro = Integer.parseInt((String) authentication.getPrincipal());
        atendimentoService.aceitarEmergencia(idAtendimento, idParceiro);
        return ResponseEntity.ok().build();
    }

    // 🚨 4. Clínica transfere caso para outra (TransferCaseModal)
    @PutMapping("/{id}/transferir")
    @PreAuthorize("hasRole('PARCEIRO') or hasRole('ADMIN') or hasRole('MEDICO')")
    public ResponseEntity<Void> transferirCaso(
            @PathVariable("id") int idAtendimento,
            @RequestBody TransferirRequestDTO dto) {
        atendimentoService.transferirCaso(idAtendimento, dto);
        return ResponseEntity.ok().build();
    }
}
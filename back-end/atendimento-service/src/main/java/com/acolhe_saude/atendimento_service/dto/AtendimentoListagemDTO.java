package com.acolhe_saude.atendimento_service.dto;

import com.acolhe_saude.atendimento_service.domain.Atendimento;
import java.time.format.DateTimeFormatter;

public record AtendimentoListagemDTO(
        Integer idAtendimento,
        String nomePaciente,
        String relatoSintomas,
        String nivelRiscoIa,
        String statusAtendimento,
        String dataRegistro
) {
    public AtendimentoListagemDTO(Atendimento a) {
        this(
                a.getIdAtendimento(),
                a.getPaciente().getNomeCompleto(),
                a.getRelatoSintomas(),
                a.getNivelRiscoIa() != null ? a.getNivelRiscoIa() : "AGUARDANDO",
                a.getStatusAtendimento(),
                a.getDataRegistro() != null ? a.getDataRegistro().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : ""
        );
    }
}
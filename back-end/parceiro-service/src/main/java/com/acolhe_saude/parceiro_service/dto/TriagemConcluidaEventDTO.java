package com.acolhe_saude.parceiro_service.dto;

public record TriagemConcluidaEventDTO(
        Integer idAtendimento,
        Integer idPaciente,
        String nivelRiscoIa
) {
}

package com.acolhe_saude.atendimento_service.dto;

public record TriagemConcluidaEventoDTO(int idAtendimento,
                                        int idPaciente,
                                        String nivelRiscoIa) {
}

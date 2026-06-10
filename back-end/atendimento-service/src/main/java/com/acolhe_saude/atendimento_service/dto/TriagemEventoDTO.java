package com.acolhe_saude.atendimento_service.dto;

public record TriagemEventoDTO(int idAtendimento,
                               int idPaciente,
                               String relatoSintomas) {
}

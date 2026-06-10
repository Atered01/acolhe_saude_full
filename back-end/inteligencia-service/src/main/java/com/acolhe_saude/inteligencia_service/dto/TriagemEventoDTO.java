package com.acolhe_saude.inteligencia_service.dto;

public record TriagemEventoDTO(int idAtendimento,
                               int idPaciente,
                               String relatoSintomas)
{
}

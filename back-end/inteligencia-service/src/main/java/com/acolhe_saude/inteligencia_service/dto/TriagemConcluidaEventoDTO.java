package com.acolhe_saude.inteligencia_service.dto;

public record TriagemConcluidaEventoDTO(int idAtendimento,
                                        int idPaciente,
                                        String nivelRiscoIa) // "VERMELHO", "AMARELO" ou "VERDE")
{
}

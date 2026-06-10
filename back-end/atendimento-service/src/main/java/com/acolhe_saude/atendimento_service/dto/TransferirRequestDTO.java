package com.acolhe_saude.atendimento_service.dto;

public record TransferirRequestDTO(
        int idParceiroDestino,
        String especialidade,
        String justificativa
) {}
package com.acolhe_saude.parceiro_service.dto;

public record AtualizarRecursosDTO(
        Integer leitosUti,
        Integer leitosEnfermaria,
        Integer medicosPlantao,
        Boolean aceitandoEmergencias
) {}
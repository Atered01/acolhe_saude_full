package com.acolhe_saude.parceiro_service.dto;

public record CapacidadeRequestDTO(
        String especialidade,
        Integer vagasDisponiveisSemana
) {}

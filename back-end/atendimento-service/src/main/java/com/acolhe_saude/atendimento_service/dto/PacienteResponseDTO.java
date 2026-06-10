package com.acolhe_saude.atendimento_service.dto;

public record PacienteResponseDTO(
        int idPaciente,
        String nomeCompleto,
        String nomeAbrigo
) {
}

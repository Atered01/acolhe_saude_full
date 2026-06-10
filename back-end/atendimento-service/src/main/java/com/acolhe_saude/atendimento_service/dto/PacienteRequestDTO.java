package com.acolhe_saude.atendimento_service.dto;

import java.time.LocalDate;

public record PacienteRequestDTO(
        String nomeCompleto,
        LocalDate dataNascimento,
        String documentoIdentificacao,
        String tipoSanguineo,
        String nomeAbrigo,
        String condicoesPrevias
) {
}
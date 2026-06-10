package com.acolhe_saude.auth_service.dto;

public record UsuarioResponseDTO(
        int idUsuario,
        String nomeCompleto,
        String email,
        String cargo
) {}
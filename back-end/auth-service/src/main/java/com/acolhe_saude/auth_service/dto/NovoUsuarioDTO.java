package com.acolhe_saude.auth_service.dto;

public record NovoUsuarioDTO(
        String nome,
        String email,
        String senha,
        String cargo
) {}
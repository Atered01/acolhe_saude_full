package com.acolhe_saude.auth_service.dto;

public record TrocarSenhaDTO(
        String senhaAtual,
        String novaSenha
) {}
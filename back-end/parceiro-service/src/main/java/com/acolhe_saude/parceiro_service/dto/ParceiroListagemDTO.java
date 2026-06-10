package com.acolhe_saude.parceiro_service.dto;

import com.acolhe_saude.parceiro_service.domain.Parceiro;

public record ParceiroListagemDTO(
        Integer idParceiro,
        String nomeApresentacao,
        String documento,
        String tipoParceiro,
        String enderecoAtendimento,
        Integer leitosUti,
        Integer leitosEnfermaria,
        Boolean aceitandoEmergencias
) {
    // Construtor inteligente que converte a Entidade diretamente para DTO
    public ParceiroListagemDTO(Parceiro parceiro) {
        this(
                parceiro.getIdParceiro(),
                parceiro.getNomeApresentacao(),
                parceiro.getDocumento(),
                parceiro.getTipoParceiro(),
                parceiro.getEnderecoAtendimento(),
                parceiro.getLeitosUti(),
                parceiro.getLeitosEnfermaria(),
                parceiro.getAceitandoEmergencias()
        );
    }
}
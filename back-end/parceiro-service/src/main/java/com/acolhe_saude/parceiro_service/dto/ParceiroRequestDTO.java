package com.acolhe_saude.parceiro_service.dto;

import java.util.List;

public record ParceiroRequestDTO(Integer idUsuarioAuth,
                                 String nomeApresentacao,
                                 String tipoParceiro,
                                 String documento,
                                 String registroConselho,
                                 String enderecoAtendimento,
                                 List<CapacidadeRequestDTO> capacidades) {
}

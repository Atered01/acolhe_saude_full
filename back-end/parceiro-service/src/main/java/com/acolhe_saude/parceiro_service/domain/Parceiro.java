package com.acolhe_saude.parceiro_service.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PARCEIRO")
@SQLDelete(sql = "UPDATE PARCEIRO SET STATUS_ATIVO = false WHERE ID_PARCEIRO = ?")
@SQLRestriction("STATUS_ATIVO = true")
public class Parceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PARCEIRO")
    private int idParceiro;

    @Column(name = "ID_USUARIO_AUTH", unique = true, nullable = false)
    private int idUsuarioAuth;

    @Column(name = "NOME_APRESENTACAO", nullable = false, length = 150)
    private String nomeApresentacao;

    @Column(name = "TIPO_PARCEIRO", nullable = false, length = 30)
    private String tipoParceiro;

    @Column(name = "DOCUMENTO", unique = true, nullable = false, length = 20)
    private String documento;

    @Column(name = "REGISTRO_CONSELHO", length = 50)
    private String registroConselho;

    @Column(name = "ENDERECO_ATENDIMENTO", nullable = false, length = 255)
    private String enderecoAtendimento;

    @Column(name = "STATUS_ATIVO")
    private boolean statusAtivo = true;

    @CreationTimestamp
    @Column(name = "DATA_CADASTRO", updatable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "LEITOS_UTI")
    private Integer leitosUti = 0;

    @Column(name = "LEITOS_ENFERMARIA")
    private Integer leitosEnfermaria = 0;

    @Column(name = "MEDICOS_PLANTAO")
    private Integer medicosPlantao = 0;

    @Column(name = "ACEITANDO_EMERGENCIAS")
    private Boolean aceitandoEmergencias = true;
}

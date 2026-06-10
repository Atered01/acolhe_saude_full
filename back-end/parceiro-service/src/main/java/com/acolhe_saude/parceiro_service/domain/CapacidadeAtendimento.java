package com.acolhe_saude.parceiro_service.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "CAPACIDADE_ATENDIMENTO")
public class CapacidadeAtendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CAPACIDADE")
    private int idCapacidade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PARCEIRO", nullable = false)
    private Parceiro parceiro;

    @Column(name = "ESPECIALIDADE", nullable = false, length = 100)
    private String especialidade;

    @Column(name = "VAGAS_DISPONIVEIS_SEMANA")
    private int vagasDisponiveisSemana = 0;

    @UpdateTimestamp
    @Column(name = "DATA_ULTIMA_ATUALIZACAO")
    private LocalDateTime dataUltimaAtualizacao;
}
package com.acolhe_saude.atendimento_service.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ATENDIMENTO")
public class Atendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ATENDIMENTO")
    private int idAtendimento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PACIENTE", nullable = false)
    private Paciente paciente;

    @Column(name = "RELATO_SINTOMAS", nullable = false, columnDefinition = "TEXT")
    private String relatoSintomas;

    @Column(name = "NIVEL_RISCO_IA", length = 20)
    private String nivelRiscoIa;

    @Column(name = "STATUS_ATENDIMENTO", length = 30)
    private String statusAtendimento = "AGUARDANDO_TRIAGEM";

    @Column(name = "ID_PARCEIRO_ALOCADO")
    private int idParceiroAlocado;

    @CreationTimestamp
    @Column(name = "DATA_REGISTRO", updatable = false)
    private LocalDateTime dataRegistro;

    @UpdateTimestamp
    @Column(name = "DATA_ATUALIZACAO")
    private LocalDateTime dataAtualizacao;

    @ElementCollection
    @CollectionTable(name = "ATENDIMENTO_SINTOMA_RAPIDO", joinColumns = @JoinColumn(name = "ID_ATENDIMENTO"))
    @Column(name = "SINTOMA")
    private List<String> sintomasRapidos = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "ATENDIMENTO_RISCO", joinColumns = @JoinColumn(name = "ID_ATENDIMENTO"))
    @Column(name = "RISCO")
    private List<String> riscosIdentificados = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "ATENDIMENTO_EXAME", joinColumns = @JoinColumn(name = "ID_ATENDIMENTO"))
    @Column(name = "EXAME")
    private List<String> examesSugeridos = new ArrayList<>();

    @Column(name = "JUSTIFICATIVA_TRANSFERENCIA", columnDefinition = "TEXT")
    private String justificativaTransferencia;

    @Column(name = "ESPECIALIDADE_REQUERIDA", length = 100)
    private String especialidadeRequerida;
}

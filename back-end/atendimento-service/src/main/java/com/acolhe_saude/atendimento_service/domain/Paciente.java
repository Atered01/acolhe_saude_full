package com.acolhe_saude.atendimento_service.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PACIENTE")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PACIENTE")
    private int idPaciente; // Mudado de int para Long

    @Column(name = "NOME_COMPLETO", nullable = false, length = 150)
    private String nomeCompleto;

    @Column(name = "DATA_NASCIMENTO", nullable = false)
    private LocalDate dataNascimento;

    @Column(name = "DOCUMENTO_IDENTIFICACAO", length = 50)
    private String documentoIdentificacao;

    @Column(name = "NOME_ABRIGO", nullable = false, length = 100)
    private String nomeAbrigo;

    @Column(name = "CONDICOES_PREVIAS", columnDefinition = "TEXT")
    private String condicoesPrevias;

    @CreationTimestamp
    @Column(name = "DATA_CRIACAO", updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "TIPO_SANGUINEO", length = 3)
    private String tipoSanguineo;

    @ElementCollection
    @CollectionTable(name = "PACIENTE_COMORBIDADE", joinColumns = @JoinColumn(name = "ID_PACIENTE"))
    @Column(name = "COMORBIDADE")
    private List<String> comorbidades = new ArrayList<>();
}
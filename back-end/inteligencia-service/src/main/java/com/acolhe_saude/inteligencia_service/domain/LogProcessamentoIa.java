package com.acolhe_saude.inteligencia_service.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "LOG_PROCESSAMENTO_IA")
public class LogProcessamentoIa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_LOG")
    private int idLog;

    @Column(name = "ID_REFERENCIA_ATENDIMENTO", nullable = false)
    private int idReferenciaAtendimento;

    @Column(name = "TIPO_PROCESSAMENTO", nullable = false, length = 50)
    private String tipoProcessamento;

    @Column(name = "PROMPT_ENVIADO", nullable = false, columnDefinition = "TEXT")
    private String promptEnviado;

    @Column(name = "RESPOSTA_RECEBIDA", nullable = false, columnDefinition = "TEXT")
    private String respostaRecebida;

    @Column(name = "MODELO_UTILIZADO", nullable = false, length = 50)
    private String modeloUtilizado;

    @Column(name = "TEMPO_RESPOSTA_MS", nullable = false)
    private Integer tempoRespostaMs;

    @CreationTimestamp
    @Column(name = "DATA_PROCESSAMENTO", updatable = false)
    private LocalDateTime dataProcessamento;
}
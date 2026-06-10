package com.acolhe_saude.parceiro_service.service;

import com.acolhe_saude.parceiro_service.config.RabbitMQConfig;
import com.acolhe_saude.parceiro_service.domain.CapacidadeAtendimento;
import com.acolhe_saude.parceiro_service.dto.TriagemConcluidaEventDTO;
import com.acolhe_saude.parceiro_service.repository.CapacidadeAtendimentoRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AlertaParceiroService {

    private final CapacidadeAtendimentoRepository capacidadeRepository;

    public AlertaParceiroService(CapacidadeAtendimentoRepository capacidadeRepository) {
        this.capacidadeRepository = capacidadeRepository;
    }

    @Transactional
    @RabbitListener(queues = RabbitMQConfig.FILA_ACIONAR_PARCEIRO)
    public void buscarMedicoParaEmergencia(TriagemConcluidaEventDTO evento) {

        System.out.println("==================================================");
        System.out.println("🚨 ALERTA GERAL RECEBIDO NO PARCEIRO-SERVICE!");
        System.out.println("🩺 Paciente ID: " + evento.idPaciente() + " | Risco: " + evento.nivelRiscoIa());
        System.out.println("==================================================");
        System.out.println("Buscando médicos e clínicas com vagas na rede...");

        List<CapacidadeAtendimento> medicosDisponiveis = capacidadeRepository.findByVagasDisponiveisSemanaGreaterThan(0);

        if (medicosDisponiveis.isEmpty()) {
            System.out.println("❌ CRÍTICO: Nenhum médico com vaga disponível no momento!");
        } else {
            CapacidadeAtendimento escolhido = medicosDisponiveis.get(0);
            String nomeMedico = escolhido.getParceiro().getNomeApresentacao();

            System.out.println("✅ MÉDICO ENCONTRADO!");
            System.out.println("🏥 Alocando paciente para: " + nomeMedico);
            System.out.println("⚕️ Especialidade: " + escolhido.getEspecialidade());

            // TODO: Aqui a gente subtrairia 1 vaga do médico no banco de dados!
        }
    }
}
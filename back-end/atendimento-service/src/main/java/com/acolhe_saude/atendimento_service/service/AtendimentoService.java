package com.acolhe_saude.atendimento_service.service;

import com.acolhe_saude.atendimento_service.config.RabbitMQConfig;
import com.acolhe_saude.atendimento_service.domain.Atendimento;
import com.acolhe_saude.atendimento_service.domain.Paciente;
import com.acolhe_saude.atendimento_service.dto.*;
import com.acolhe_saude.atendimento_service.repository.AtendimentoRepository;
import com.acolhe_saude.atendimento_service.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class AtendimentoService {

    private final AtendimentoRepository atendimentoRepository;
    private final PacienteRepository pacienteRepository;
    private final RabbitTemplate rabbitTemplate;

    public AtendimentoService(AtendimentoRepository atendimentoRepository, PacienteRepository pacienteRepository, RabbitTemplate rabbitTemplate) {
        this.atendimentoRepository = atendimentoRepository;
        this.pacienteRepository = pacienteRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    public Integer registrarNovoSintoma(int idPaciente, AtendimentoRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(idPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado!"));

        Atendimento atendimento = new Atendimento();
        atendimento.setPaciente(paciente);
        atendimento.setRelatoSintomas(dto.relatoSintomas());
        atendimento.setStatusAtendimento("AGUARDANDO_TRIAGEM");

        Atendimento salvo = atendimentoRepository.save(atendimento); // 🚨 Guardamos a referência

        TriagemEventoDTO evento = new TriagemEventoDTO(
                salvo.getIdAtendimento(), // 🚨 Usamos o ID gerado
                paciente.getIdPaciente(),
                dto.relatoSintomas()
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_TRIAGEM_IA, evento);

        return salvo.getIdAtendimento(); // 🚨 Retornamos o ID para o Controller
    }

    public AtendimentoListagemDTO buscarPorId(int idAtendimento) {
        Atendimento atendimento = atendimentoRepository.findById(idAtendimento)
                .orElseThrow(() -> new EntityNotFoundException("Atendimento não encontrado."));

        return new AtendimentoListagemDTO(atendimento);
    }

    @Transactional
    public void aceitarEmergencia(int idAtendimento, int idParceiro) {

        Atendimento atendimento = atendimentoRepository.findById(idAtendimento)
                .orElseThrow(() -> new EntityNotFoundException("Atendimento não encontrado."));

        // Atualiza o status para mostrar que a clínica assumiu o caso
        atendimento.setStatusAtendimento("EM_ATENDIMENTO");

        // Vincula o ID da clínica/médico que clicou no botão "Aceitar"
        atendimento.setIdParceiroAlocado(idParceiro);

        atendimentoRepository.save(atendimento);

        System.out.println("🩺 Emergência " + idAtendimento + " aceita pelo Parceiro ID: " + idParceiro);
    }

    @org.springframework.amqp.rabbit.annotation.RabbitListener(queues = RabbitMQConfig.FILA_TRIAGEM_CONCLUIDA)
    @Transactional
    public void atualizarStatusTriagem(TriagemConcluidaEventoDTO evento) {

        System.out.println("📥 Resposta da IA recebida para o Atendimento: " + evento.idAtendimento());

        Atendimento atendimento = atendimentoRepository.findById(evento.idAtendimento())
                .orElseThrow(() -> new RuntimeException("Atendimento não encontrado no banco!"));

        atendimento.setNivelRiscoIa(evento.nivelRiscoIa()); // Ex: VERMELHO
        atendimento.setStatusAtendimento("TRIAGEM_CONCLUIDA");

        atendimentoRepository.save(atendimento);

        System.out.println("✅ Status atualizado com sucesso! Novo Risco: " + evento.nivelRiscoIa());

        if (evento.nivelRiscoIa().equalsIgnoreCase("VERMELHO") || evento.nivelRiscoIa().equalsIgnoreCase("AMARELO")) {
            System.out.println("🚑 Risco alto detectado! Acionando o serviço de parceiros...");
            rabbitTemplate.convertAndSend("fila.acionar.parceiro", evento);
        }
    }

    public List<AtendimentoListagemDTO> listarTriagensRecentes() {
        return atendimentoRepository.findTop10ByOrderByDataRegistroDesc().stream()
                .map(AtendimentoListagemDTO::new)
                .toList();
    }

    public List<AtendimentoListagemDTO> listarEmergenciasPendentes() {
        List<String> statusPendentes = Arrays.asList("ENCAMINHADO_CLINICA", "TRANSFERIDO");

        return atendimentoRepository.findByStatusAtendimentoInOrderByDataRegistroDesc(statusPendentes).stream()
                .filter(a -> "VERMELHO".equalsIgnoreCase(a.getNivelRiscoIa()) || "AMARELO".equalsIgnoreCase(a.getNivelRiscoIa()))
                .map(AtendimentoListagemDTO::new)
                .toList();
    }

    @Transactional
    public void encaminharParaClinica(int idAtendimento, EncaminharRequestDTO dto) {
        Atendimento atendimento = atendimentoRepository.findById(idAtendimento)
                .orElseThrow(() -> new EntityNotFoundException("Atendimento não encontrado."));

        atendimento.setIdParceiroAlocado(dto.idParceiroDestino());
        atendimento.setStatusAtendimento("ENCAMINHADO_CLINICA");

        atendimentoRepository.save(atendimento);
        System.out.println("Cuidador encaminhou o atendimento " + idAtendimento + " para o Parceiro " + dto.idParceiroDestino());
    }

    @Transactional
    public void transferirCaso(int idAtendimento, TransferirRequestDTO dto) {
        Atendimento atendimento = atendimentoRepository.findById(idAtendimento)
                .orElseThrow(() -> new EntityNotFoundException("Atendimento não encontrado."));

        atendimento.setIdParceiroAlocado(dto.idParceiroDestino());
        atendimento.setEspecialidadeRequerida(dto.especialidade());
        atendimento.setJustificativaTransferencia(dto.justificativa());
        atendimento.setStatusAtendimento("TRANSFERIDO");

        atendimentoRepository.save(atendimento);
        System.out.println("Médico transferiu o atendimento " + idAtendimento + " para o Parceiro " + dto.idParceiroDestino());
    }
}
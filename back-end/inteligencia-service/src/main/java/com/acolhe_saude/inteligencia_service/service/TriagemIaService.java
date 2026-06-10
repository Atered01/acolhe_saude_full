package com.acolhe_saude.inteligencia_service.service;

import com.acolhe_saude.inteligencia_service.domain.LogProcessamentoIa;
import com.acolhe_saude.inteligencia_service.dto.TriagemConcluidaEventoDTO;
import com.acolhe_saude.inteligencia_service.dto.TriagemEventoDTO;
import com.acolhe_saude.inteligencia_service.repository.LogProcessamentoIaRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class TriagemIaService {

    private final ChatClient chatClient;
    private final LogProcessamentoIaRepository logRepository;
    private final RabbitTemplate rabbitTemplate;

    public TriagemIaService(ChatClient.Builder chatClientBuilder,
                            LogProcessamentoIaRepository logRepository,
                            RabbitTemplate rabbitTemplate) {
        this.chatClient = chatClientBuilder.build();
        this.logRepository = logRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = "fila.triagem.ia")
    public void processarTriagem(TriagemEventoDTO evento) {
        long tempoInicio = System.currentTimeMillis();

        String prompt = """
                Você é um médico triador especialista em urgências.
                Classifique o nível de risco do paciente a seguir APENAS com UMA destas três palavras:
                VERMELHO, AMARELO ou VERDE.
                Não justifique, apenas devolva a cor.
                
                REGRAS DE CLASSIFICAÇÃO:
                - VERMELHO (Emergência absoluta): Risco de vida imediato. Ex: infarto, suspeita de AVC, desmaio, dificuldade respiratória grave, trauma severo, hemorragia.
                - AMARELO (Urgência moderada): Precisa de atendimento rápido, mas estável. Ex: dor de cabeça forte persistente, febre muito alta, dor abdominal intensa, vômito contínuo.
                - VERDE (Pouco urgente): Condições leves que podem aguardar. Ex: dor de cabeça leve, resfriado comum, dor muscular, tontura leve, renovação de receita.
                
                Relato do paciente: """ + evento.relatoSintomas();

        String respostaIa = chatClient.prompt()
                .user(prompt)
                .call()
                .content()
                .trim();

        long tempoFim = System.currentTimeMillis();

        LogProcessamentoIa log = new LogProcessamentoIa();
        log.setIdReferenciaAtendimento(evento.idAtendimento());
        log.setTipoProcessamento("TRIAGEM_SINTOMA");
        log.setPromptEnviado(prompt);
        log.setRespostaRecebida(respostaIa);
        log.setModeloUtilizado("qwen2.5:1.5b");
        log.setTempoRespostaMs((int) (tempoFim - tempoInicio));
        logRepository.save(log);

        TriagemConcluidaEventoDTO resultado = new TriagemConcluidaEventoDTO(
                evento.idAtendimento(),
                evento.idPaciente(),
                respostaIa
        );

        rabbitTemplate.convertAndSend("fila.triagem.concluida", resultado);

        System.out.println("✅ Triagem concluída! Risco: " + respostaIa);
    }
}
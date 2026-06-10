package com.acolhe_saude.atendimento_service.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String FILA_TRIAGEM_IA = "fila.triagem.ia";
    public static final String FILA_TRIAGEM_CONCLUIDA = "fila.triagem.concluida";

    @Bean
    public Queue filaTriagem() {
        return new Queue(FILA_TRIAGEM_IA, true);
    }

    @Bean
    public Queue filaTriagemConcluida() {
        return new Queue(FILA_TRIAGEM_CONCLUIDA, true);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}

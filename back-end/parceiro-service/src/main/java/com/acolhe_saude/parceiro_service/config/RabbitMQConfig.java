package com.acolhe_saude.parceiro_service.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String FILA_ACIONAR_PARCEIRO = "fila.acionar.parceiro";

    @Bean
    public Queue filaAcionarParceiro() {
        return new Queue(FILA_ACIONAR_PARCEIRO, true);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
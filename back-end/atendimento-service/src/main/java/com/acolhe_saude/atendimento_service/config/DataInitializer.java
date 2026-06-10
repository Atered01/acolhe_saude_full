package com.acolhe_saude.atendimento_service.config;

import com.acolhe_saude.atendimento_service.domain.Paciente;
import com.acolhe_saude.atendimento_service.repository.PacienteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(PacienteRepository pacienteRepository) {
        return args -> {
            // 🚨 MUDANÇA: Use existsById, é muito mais seguro que contar linhas
            if (!pacienteRepository.existsById(1)) {
                try {
                    Paciente p = new Paciente();
                    p.setNomeCompleto("Dona Cecília Souza");
                    p.setDataNascimento(LocalDate.of(1944, 5, 15));
                    p.setDocumentoIdentificacao("123.456.789-00");
                    p.setTipoSanguineo("O+");
                    p.setNomeAbrigo("Abrigo Esperança");
                    p.setCondicoesPrevias("Hipertensão, Diabetes");
                    p.setDataCriacao(LocalDateTime.now());

                    pacienteRepository.save(p);
                    System.out.println("Paciente 1 inicializado com sucesso!");
                } catch (Exception e) {
                    System.err.println("Erro ao inicializar paciente: " + e.getMessage());
                }
            }
        };
    }
}
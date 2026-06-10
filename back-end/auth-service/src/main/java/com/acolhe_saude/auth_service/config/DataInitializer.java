package com.acolhe_saude.auth_service.config;

import com.acolhe_saude.auth_service.domain.Perfil;
import com.acolhe_saude.auth_service.domain.UsuarioAuth;
import com.acolhe_saude.auth_service.repository.PerfilRepository;
import com.acolhe_saude.auth_service.repository.UsuarioAuthRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioAuthRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioAuthRepository usuarioRepository,
                           PerfilRepository perfilRepository,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("⚙️ Sincronizando banco de dados de segurança...");

        Perfil perfilAdmin = criarPerfilSeNaoExistir("ROLE_ADMIN");
        Perfil perfilCuidador = criarPerfilSeNaoExistir("ROLE_CUIDADOR");
        Perfil perfilParceiro = criarPerfilSeNaoExistir("ROLE_PARCEIRO");

        criarUsuarioSeNaoExistir("Administrador Supremo", "admin@acolhesaude.com", perfilAdmin);
        criarUsuarioSeNaoExistir("Maria Cuidadora", "cuidador@acolhesaude.com", perfilCuidador);
        criarUsuarioSeNaoExistir("Dr. João Parceiro", "medico@acolhesaude.com", perfilParceiro);

        System.out.println("✅ Dados iniciais de segurança carregados com sucesso!");
    }

    private Perfil criarPerfilSeNaoExistir(String nomeRole) {
        return perfilRepository.findByNomeRole(nomeRole)
                .orElseGet(() -> {
                    Perfil novoPerfil = new Perfil();
                    novoPerfil.setNomeRole(nomeRole);
                    return perfilRepository.save(novoPerfil);
                });
    }

    private void criarUsuarioSeNaoExistir(String nome, String email, Perfil perfil) {
        if (usuarioRepository.findByEmail(email).isEmpty()) {
            UsuarioAuth usuario = new UsuarioAuth();
            usuario.setNomeCompleto(nome); // <-- A nossa nova linha!
            usuario.setEmail(email);
            usuario.setSenhaHash(passwordEncoder.encode("123456"));
            usuario.setAtivo(true);
            usuario.setDataCriacao(LocalDateTime.now());
            usuario.setPerfil(perfil);

            usuarioRepository.save(usuario);
            System.out.println("👤 Novo utilizador de teste gerado: " + email);
        }
    }
}
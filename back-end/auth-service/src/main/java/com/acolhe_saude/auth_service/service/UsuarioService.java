package com.acolhe_saude.auth_service.service;

import com.acolhe_saude.auth_service.domain.Perfil;
import com.acolhe_saude.auth_service.domain.UsuarioAuth;
import com.acolhe_saude.auth_service.dto.AtualizarPerfilDTO;
import com.acolhe_saude.auth_service.dto.NovoUsuarioDTO;
import com.acolhe_saude.auth_service.dto.TrocarSenhaDTO;
import com.acolhe_saude.auth_service.dto.UsuarioResponseDTO;
import com.acolhe_saude.auth_service.repository.PerfilRepository;
import com.acolhe_saude.auth_service.repository.UsuarioAuthRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioAuthRepository repository;
    private final PerfilRepository perfilRepository;
    private final PasswordEncoder passwordEncoder;

    // 🚨 Injetamos o PasswordEncoder e o PerfilRepository
    public UsuarioService(UsuarioAuthRepository repository, PerfilRepository perfilRepository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.perfilRepository = perfilRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void cadastrarUsuario(NovoUsuarioDTO dto) {
        if (repository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("E-mail já está em uso no sistema!");
        }

        // Mapeia o cargo que vem do Angular para as Roles do Spring Security
        String nomeRole = mapearCargoFrontendParaRole(dto.cargo());
        Perfil perfil = perfilRepository.findByNomeRole(nomeRole)
                .orElseThrow(() -> new RuntimeException("Erro interno: Perfil " + nomeRole + " não encontrado na base de dados."));

        UsuarioAuth novoUsuario = new UsuarioAuth();
        novoUsuario.setNomeCompleto(dto.nome());
        novoUsuario.setEmail(dto.email());
        novoUsuario.setSenhaHash(passwordEncoder.encode(dto.senha())); // 🔒 Senha encriptada!
        novoUsuario.setPerfil(perfil);
        novoUsuario.setAtivo(true);

        repository.save(novoUsuario);
    }

    @Transactional
    public void atualizarPerfil(int idUsuario, AtualizarPerfilDTO dto) {
        UsuarioAuth usuario = repository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        usuario.setNomeCompleto(dto.nome());
        usuario.setTelefone(dto.telefone());

        repository.save(usuario);
    }

    @Transactional
    public void trocarSenha(int idUsuario, TrocarSenhaDTO dto) {
        UsuarioAuth usuario = repository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        // Verifica se a senha antiga bate com a do banco
        if (!passwordEncoder.matches(dto.senhaAtual(), usuario.getSenhaHash())) {
            throw new RuntimeException("A senha atual informada está incorreta.");
        }

        usuario.setSenhaHash(passwordEncoder.encode(dto.novaSenha()));
        repository.save(usuario);
    }

    @Transactional
    public void desativarUsuario(int idUsuario) {
        UsuarioAuth usuario = repository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
        usuario.setAtivo(false);
        repository.save(usuario);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(u -> new UsuarioResponseDTO(
                        u.getIdUsuario(),
                        u.getNomeCompleto() != null ? u.getNomeCompleto() : "Utilizador do Sistema",
                        u.getEmail(),
                        u.getPerfil().getNomeRole()
                ))
                .toList();
    }

    // Método utilitário para converter as strings do select do Angular para as regras do Spring
    private String mapearCargoFrontendParaRole(String cargoFrontend) {
        if (cargoFrontend == null) return "ROLE_CUIDADOR";

        return switch (cargoFrontend) {
            case "Médico(a)" -> "ROLE_MEDICO";
            case "Administrador(a) de Clínica" -> "ROLE_PARCEIRO";
            case "Super Admin" -> "ROLE_ADMIN";
            default -> "ROLE_CUIDADOR";
        };
    }
}
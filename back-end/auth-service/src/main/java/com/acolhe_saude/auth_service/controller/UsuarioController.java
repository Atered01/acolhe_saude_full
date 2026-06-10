package com.acolhe_saude.auth_service.controller;

import com.acolhe_saude.auth_service.dto.AtualizarPerfilDTO;
import com.acolhe_saude.auth_service.dto.NovoUsuarioDTO;
import com.acolhe_saude.auth_service.dto.TrocarSenhaDTO;
import com.acolhe_saude.auth_service.dto.UsuarioResponseDTO;
import com.acolhe_saude.auth_service.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // 🚨 1. CADASTRAR NOVO USUÁRIO (Apenas Admin)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> cadastrarUsuario(@RequestBody NovoUsuarioDTO dto) {
        usuarioService.cadastrarUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário cadastrado com sucesso!");
    }

    // 🚨 2. ATUALIZAR O MEU PERFIL (Qualquer utilizador autenticado)
    @PutMapping("/perfil")
    public ResponseEntity<String> atualizarMeuPerfil(@RequestBody AtualizarPerfilDTO dto, Authentication authentication) {
        int idUsuario = Integer.parseInt((String) authentication.getPrincipal());
        usuarioService.atualizarPerfil(idUsuario, dto);
        return ResponseEntity.ok("Perfil atualizado com sucesso!");
    }

    // 🚨 3. TROCAR A MINHA SENHA (Qualquer utilizador autenticado)
    @PutMapping("/senha")
    public ResponseEntity<String> trocarMinhaSenha(@RequestBody TrocarSenhaDTO dto, Authentication authentication) {
        int idUsuario = Integer.parseInt((String) authentication.getPrincipal());
        usuarioService.trocarSenha(idUsuario, dto);
        return ResponseEntity.ok("Senha alterada com sucesso!");
    }

    // (Mantém os métodos que você já tinha)
    @PutMapping("/{id}/desativar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> desativarConta(@PathVariable int id) {
        usuarioService.desativarUsuario(id);
        return ResponseEntity.ok("Conta desativada com sucesso! O usuário não poderá mais fazer login.");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }
}
package com.acolhe_saude.auth_service.controller;

import com.acolhe_saude.auth_service.domain.UsuarioAuth;
import com.acolhe_saude.auth_service.dto.LoginRequestDTO;
import com.acolhe_saude.auth_service.dto.TokenResponseDTO;
import com.acolhe_saude.auth_service.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> efetuarLogin(@RequestBody LoginRequestDTO dto) {

        var authToken = new UsernamePasswordAuthenticationToken(dto.email(), dto.senha());

        Authentication authentication = authenticationManager.authenticate(authToken);

        UsuarioAuth usuarioAutenticado = (UsuarioAuth) authentication.getPrincipal();

        String tokenJwt = tokenService.gerarToken(usuarioAutenticado);

        return ResponseEntity.ok(new TokenResponseDTO(tokenJwt, "Bearer"));
    }
}
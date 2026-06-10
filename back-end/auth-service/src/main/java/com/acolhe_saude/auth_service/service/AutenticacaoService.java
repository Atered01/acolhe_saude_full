package com.acolhe_saude.auth_service.service;

import com.acolhe_saude.auth_service.domain.UsuarioAuth;
import com.acolhe_saude.auth_service.repository.UsuarioAuthRepository;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService implements UserDetailsService {

    private final UsuarioAuthRepository repository;

    public AutenticacaoService(UsuarioAuthRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UsuarioAuth usuario = repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado!"));

        if (!usuario.isAtivo()) {
            throw new DisabledException("Este usuário foi desativado do sistema.");
        }

        return usuario;
    }
}
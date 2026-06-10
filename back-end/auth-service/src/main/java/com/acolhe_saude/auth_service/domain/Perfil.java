package com.acolhe_saude.auth_service.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PERFIL")
public class Perfil implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PERFIL")
    private int idPerfil;

    @Column(name = "NOME_ROLE", unique = true, nullable = false, length = 50)
    private String nomeRole;

    @Override
    public String getAuthority() {
        return this.nomeRole;
    }
}
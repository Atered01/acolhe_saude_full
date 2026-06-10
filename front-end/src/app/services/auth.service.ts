import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // 🚨 Importação do Router adicionada
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.authApiUrl;

  // 🚨 Router injetado no construtor
  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('acolhe_token', response.token);
      })
    );
  }

  // Unificámos para usar sempre 'acolhe_token'
  getToken(): string | null {
    return localStorage.getItem('acolhe_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const agora = Math.floor(Date.now() / 1000);
      return payload.exp > agora;
    } catch {
      return false;
    }
  } // 🚨 Chave fechada corretamente aqui!

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      const decodedToken = JSON.parse(decodedJson);

      return decodedToken.role;
    } catch (e) {
      console.error('Erro ao ler o token', e);
      return null;
    }
  }

  isCuidador(): boolean {
    const role = this.getRole();
    return role === 'ROLE_CUIDADOR' || role === 'CUIDADOR';
  }

  isMedico(): boolean {
    const role = this.getRole();
    return role === 'ROLE_MEDICO' || role === 'MEDICO'; // 🚨 Agora mapeia a role 2 correta!
  }

  isParceiro(): boolean {
    const role = this.getRole();
    return role === 'ROLE_PARCEIRO' || role === 'PARCEIRO'; // 🚨 Mapeia a role 4 (Admin Clínica)
  }

  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ROLE_ADMIN' || role === 'ADMIN'; // Mapeia a role 3 (Super Admin)
  }

  // Logout unificado
  logout(): void {
    localStorage.removeItem('acolhe_token');
    this.router.navigate(['/login']);
  }
}
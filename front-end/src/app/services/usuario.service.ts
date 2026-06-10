import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface que vem do GET (Listagem)
export interface UsuarioResponse {
  idUsuario: number;
  nomeCompleto: string;
  email: string;
  cargo: string;
}

// Interface que vai no POST (Criação)
export interface NovoUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  cargo: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // 🚨 Usamos a URL específica do Auth Service (Porta 8083)
  private apiUrl = `${environment.authApiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  listarUsuarios(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(this.apiUrl);
  }

  cadastrarUsuario(usuario: NovoUsuarioRequest): Observable<any> {
    // Retorna a resposta (String) do back-end
    return this.http.post(this.apiUrl, usuario, { responseType: 'text' });
  }

  desativarUsuario(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/desativar`, {}, { responseType: 'text' });
  }
}
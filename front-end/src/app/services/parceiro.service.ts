import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// A interface que bate certo com o ParceiroListagemDTO do Java
export interface ParceiroResponse {
  idParceiro: number;
  nomeApresentacao: string;
  documento: string;
  tipoParceiro: string;
  enderecoAtendimento: string;
  leitosUti: number;
  leitosEnfermaria: number;
  aceitandoEmergencias: boolean;
}

export interface AtualizarRecursosDTO {
  aceitandoEmergencias: boolean;
  leitosEnfermaria: number;
  leitosUti: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParceiroService {
  // 🚨 Aponta para a porta 8082 (Parceiro Service)
  private apiUrl = `${environment.parceirosApiUrl}/parceiros`;

  constructor(private http: HttpClient) { }


  // 🚨 Método que envia as novas configurações de capacidade
  atualizarCapacidade(dados: AtualizarRecursosDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/capacidade`, dados);
  }

  listarParceiros(): Observable<ParceiroResponse[]> {
    return this.http.get<ParceiroResponse[]>(this.apiUrl);
  }

  listarDisponiveis(): Observable<ParceiroResponse[]> {
    return this.http.get<ParceiroResponse[]>(`${this.apiUrl}/disponiveis`);
  }

  cadastrarParceiro(parceiro: any): Observable<any> {
    // Nota: O DTO do Java espera "idUsuarioAuth" e "nomeApresentacao". 
    // Vamos adaptar os dados que vêm do Drawer antes de enviar:
    const payload = {
      idUsuarioAuth: 2, // Temporário (idealmente você associaria ao ID de um usuário do tipo Médico)
      nomeApresentacao: parceiro.nome,
      tipoParceiro: parceiro.especialidade || 'Clínica Geral',
      documento: parceiro.cnpj,
      enderecoAtendimento: `${parceiro.cidade} - ${parceiro.uf}`
    };

    return this.http.post(this.apiUrl, payload);
  }

  suspenderParceiro(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/suspender`, {}, { responseType: 'text' });
  }
}
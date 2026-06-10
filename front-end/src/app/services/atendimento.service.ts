import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface que espelha exatamente o AtendimentoListagemDTO do seu Spring Boot
export interface AtendimentoResponse {
  idAtendimento: number;
  nomePaciente: string;
  relatoSintomas: string;
  nivelRiscoIa: string;
  statusAtendimento: string;
  dataRegistro: string;
}

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {
  private apiUrl = `${environment.atendimentosApiUrl}/atendimentos`;

  constructor(private http: HttpClient) { }

  buscarPorId(idAtendimento: number): Observable<AtendimentoResponse> {
    return this.http.get<AtendimentoResponse>(`${this.apiUrl}/${idAtendimento}`);
  }

  encaminharParaClinica(idAtendimento: number, idParceiroDestino: number): Observable<any> {
    const payload = { idParceiroDestino: idParceiroDestino };
    return this.http.put(`${this.apiUrl}/${idAtendimento}/encaminhar`, payload, { responseType: 'text' });
  }

  listarTriagensRecentes(): Observable<AtendimentoResponse[]> {
    return this.http.get<AtendimentoResponse[]>(`${this.apiUrl}/recentes`);
  }

  aceitarEmergencia(idAtendimento: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idAtendimento}/aceitar`, {}, { responseType: 'text' });
  }

  transferirCaso(idAtendimento: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idAtendimento}/transferir`, payload, { responseType: 'text' });
  }

  listarEmergenciasPendentes(): Observable<AtendimentoResponse[]> {
    return this.http.get<AtendimentoResponse[]>(`${this.apiUrl}/pendentes`);
  }

  registrarSintoma(idPaciente: number, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sintoma/${idPaciente}`, payload);
  }
}
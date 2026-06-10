import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Paciente {
  idPaciente: number;
  nomeCompleto: string;
  dataNascimento: string;
  documentoIdentificacao: string;
  tipoSanguineo: string;
  nomeAbrigo: string;
  condicoesPrevias: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // Aponta para o atendimento-service (8081)
  private apiUrl = `${environment.atendimentosApiUrl}/pacientes`;

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  cadastrar(paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }
}
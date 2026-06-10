import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Plus, Heart, Calendar, AlertCircle, ChevronRight } from 'lucide-angular';
import { TriageDetailsModalComponent } from '../../components/triage-details-modal/triage-details-modal.component';
import { AtendimentoService, AtendimentoResponse } from '../../services/atendimento.service';
import { ForwardClinicModalComponent } from '../../components/forward-clinic-modal/forward-clinic-modal.component';
import { PacienteService, Paciente } from '../../services/paciente.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    TriageDetailsModalComponent,
    ForwardClinicModalComponent // 🚨 ADICIONE AQUI
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  readonly PlusIcon = Plus;
  readonly HeartIcon = Heart;
  readonly CalendarIcon = Calendar;
  readonly AlertCircleIcon = AlertCircle;
  readonly ChevronRightIcon = ChevronRight;

  // Pacientes (Vamos manter mockados por agora até fazermos a gestão de pacientes)
  pacientesReais: Paciente[] = [];

  colorMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  getColorClass(color: string): string {
    return this.colorMap[color] || '';
  }
  // 🚨 A nossa lista real de Triagens
  triagensReais: AtendimentoResponse[] = [];

  // Variáveis do Modal
  triagemSelecionada: any = null;
  modalTriagemAberto = false;
  modalEncaminharAberto = false;

  constructor(
    private atendimentoService: AtendimentoService,
    private pacienteService: PacienteService // 🚨 ADICIONAR AQUI
  ) { }

  ngOnInit() {
    this.carregarTriagens();
    this.carregarPacientes(); // 🚨 ADICIONAR AQUI
  }

  carregarPacientes() {
    this.pacienteService.listarTodos().subscribe({
      next: (dados) => this.pacientesReais = dados,
      error: (err) => console.error('Erro ao buscar pacientes', err)
    });
  }
  
  getIniciais(nome: string): string {
    if (!nome) return 'PA';
    const partes = nome.split(' ');
    if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
    return nome.substring(0, 2).toUpperCase();
  }

  carregarTriagens() {
    this.atendimentoService.listarTriagensRecentes().subscribe({
      next: (dados) => {
        this.triagensReais = dados;
      },
      error: (erro) => console.error('Erro ao buscar triagens:', erro)
    });
  }

  // 🚨 Função auxiliar para dar a cor baseada na IA
  getCorRisco(risco: string): string {
    if (!risco) return 'bg-slate-100 text-slate-700'; // Aguardando
    const r = risco.toUpperCase();
    if (r === 'VERMELHO') return 'bg-red-100 text-red-700';
    if (r === 'AMARELO') return 'bg-amber-100 text-amber-700';
    if (r === 'VERDE') return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  }

  abrirDetalhesTriagem(triagem: AtendimentoResponse) {
    this.triagemSelecionada = {
      idAtendimento: triagem.idAtendimento, // 🚨 Agora passamos o ID Real!
      patient: triagem.nomePaciente,
      symptom: triagem.relatoSintomas,
      level: triagem.nivelRiscoIa || 'Aguardando Análise IA'
    };
    this.modalTriagemAberto = true;
  }

  iniciarEncaminhamento() {
    this.modalTriagemAberto = false; // Fecha o primeiro modal (Detalhes)
    this.modalEncaminharAberto = true; // 🚨 Abre o novo modal (Escolher Clínica)
  }
}
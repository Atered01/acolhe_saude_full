import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, AlertTriangle, ShieldAlert, CheckCircle, ArrowRightLeft, Clock, Eye } from 'lucide-angular'; // 🚨 Importado o Eye
import { AtendimentoService, AtendimentoResponse } from '../../services/atendimento.service';
import { AcceptCaseModalComponent } from '../../components/accept-case-modal/accept-case-modal.component';
import { TransferCaseModalComponent } from '../../components/transfer-case-modal/transfer-case-modal.component';

@Component({
  selector: 'app-clinic-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule,
    RouterLink,
    AcceptCaseModalComponent, 
    TransferCaseModalComponent
  ],
  templateUrl: './clinic-dashboard.component.html'
})
export class ClinicDashboardComponent implements OnInit {
  // Ícones
  readonly AlertTriangleIcon = AlertTriangle;
  readonly ShieldAlertIcon = ShieldAlert;
  readonly CheckCircleIcon = CheckCircle;
  readonly ArrowRightLeftIcon = ArrowRightLeft;
  readonly ClockIcon = Clock;
  readonly EyeIcon = Eye; // 🚨 Declarado o ícone para o HTML

  emergencias: AtendimentoResponse[] = [];

  casoSelecionado: AtendimentoResponse | null = null;
  modalAceitarAberto = false;
  modalTransferirAberto = false;

  constructor(private atendimentoService: AtendimentoService) {}

  ngOnInit() {
    this.carregarEmergencias();
  }

  carregarEmergencias() {
    this.atendimentoService.listarEmergenciasPendentes().subscribe({
      next: (dados) => {
        this.emergencias = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar alertas da clínica:', erro);
      }
    });
  }

  abrirAceitar(caso: AtendimentoResponse) {
    this.casoSelecionado = caso;
    this.modalAceitarAberto = true;
  }

  abrirTransferir(caso: AtendimentoResponse) {
    this.casoSelecionado = caso;
    this.modalTransferirAberto = true;
  }

  getBadgeColor(risco: string): string {
    if (!risco) return 'bg-slate-100 text-slate-700';
    return risco.toUpperCase() === 'VERMELHO' 
      ? 'bg-red-100 text-red-700 ring-1 ring-red-200' 
      : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, History, FileText, CheckCircle, ArrowRightLeft } from 'lucide-angular';
import { AtendimentoService, AtendimentoResponse } from '../../services/atendimento.service';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './historico.component.html',
})
export class HistoricoComponent implements OnInit {
  readonly ArrowLeftIcon = ArrowLeft;
  readonly HistoryIcon = History;
  readonly FileTextIcon = FileText;
  readonly CheckCircleIcon = CheckCircle;
  readonly ArrowRightLeftIcon = ArrowRightLeft;

  atendimentos: AtendimentoResponse[] = [];
  carregando = true;

  constructor(private atendimentoService: AtendimentoService) {}

  ngOnInit() {
    this.atendimentoService.listarTriagensRecentes().subscribe({
      next: (dados) => {
        // Inverte a ordem para os mais recentes aparecerem primeiro
        this.atendimentos = dados.reverse();
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico:', err);
        this.carregando = false;
      }
    });
  }

  // Define a cor da badge de risco
  getBadgeRisco(risco: string): string {
    if (!risco) return 'bg-slate-100 text-slate-700';
    if (risco === 'VERMELHO') return 'bg-red-100 text-red-700 border-red-200';
    if (risco === 'AMARELO') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  }

  // Define a cor da badge de status
  getBadgeStatus(status: string): string {
    if (status === 'CONCLUIDO' || status === 'ACEITO') return 'bg-blue-100 text-blue-700';
    if (status === 'TRANSFERIDO') return 'bg-purple-100 text-purple-700';
    return 'bg-slate-100 text-slate-700';
  }
}
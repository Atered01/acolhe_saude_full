import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertCircle, CheckCircle2, Clock, X, Loader2 } from 'lucide-angular';
import { AtendimentoService } from '../../services/atendimento.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-accept-case-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './accept-case-modal.component.html'
})
export class AcceptCaseModalComponent {
  @Input() patientName: string = 'Paciente';
  
  @Input() open = false;
  @Input() caseData: any = null; // 🚨 AQUI ESTÁ A CORREÇÃO DO ERRO
  
  @Output() fechar = new EventEmitter<void>();
  @Output() sucesso = new EventEmitter<void>();

  readonly XIcon = X;
  readonly AlertCircleIcon = AlertCircle;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly ClockIcon = Clock;
  readonly Loader2Icon = Loader2;

  isEnviando = false;

  constructor(private atendimentoService: AtendimentoService, private toastService: ToastService) {}

  confirmar() {
    if (!this.caseData?.idAtendimento) return;
    
    this.isEnviando = true;
    this.atendimentoService.aceitarEmergencia(this.caseData.idAtendimento).subscribe({
   next: () => {
        this.toastService.mostrar('Emergência admitida com sucesso! Vaga ocupada no sistema.', 'sucesso'); // 🚨
        this.isEnviando = false;
        this.sucesso.emit(); 
        this.fechar.emit();  
      },
      error: (err) => {
        console.error(err);
        this.toastService.mostrar('Erro ao admitir a emergência.', 'erro'); // 🚨
        this.isEnviando = false;
      }
    });
  }
}
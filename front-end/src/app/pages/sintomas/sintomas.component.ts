import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, AlertCircle, Sparkles, ArrowLeft, Loader2, Mic, User } from 'lucide-angular';

import { AtendimentoService } from '../../services/atendimento.service';
import { ToastService } from '../../services/toast.service';
import { PacienteService, Paciente } from '../../services/paciente.service';

@Component({
  selector: 'app-sintomas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './sintomas.component.html'
})
export class SintomasComponent implements OnInit {
  // Ícones
  readonly AlertCircleIcon = AlertCircle;
  readonly SparklesIcon = Sparkles;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly Loader2Icon = Loader2;
  readonly MicIcon = Mic;
  readonly UserIcon = User;

  // Variáveis de Estado
  pacientes: Paciente[] = [];
  pacienteSelecionado: number | null = null;
  relatoSintomas = '';
  isEnviando = false;
  recording = false;

  // Sintomas Rápidos (Chips)
  quickChips = ['Dor de cabeça', 'Febre alta', 'Falta de ar', 'Tontura', 'Dor no peito'];

  constructor(
    private pacienteService: PacienteService,
    private atendimentoService: AtendimentoService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pacienteService.listarTodos().subscribe({
      next: (dados) => this.pacientes = dados,
      error: (err) => console.error('Erro ao buscar pacientes', err)
    });
  }

  // Funções Visuais (Microfone e Chips)
  toggleRecording() {
    this.recording = !this.recording;
    if (this.recording) {
      this.toastService.mostrar('Gravador de voz ativado (Modo simulação)', 'aviso');
    }
  }

  toggleChip(chip: string) {
    if (this.relatoSintomas.includes(chip)) {
      this.relatoSintomas = this.relatoSintomas.replace(chip, '').replace(/^, |, $/g, '').trim();
    } else {
      this.relatoSintomas += (this.relatoSintomas.length > 0 ? ', ' : '') + chip;
    }
  }

  isActive(chip: string): boolean {
    return this.relatoSintomas.includes(chip);
  }

  // Função Principal de Envio
  enviarParaIA() {
    if (!this.pacienteSelecionado || !this.relatoSintomas.trim()) {
      this.toastService.mostrar('Selecione um paciente e descreva os sintomas.', 'aviso');
      return;
    }

    this.isEnviando = true;
    const payload = { relatoSintomas: this.relatoSintomas };

    this.atendimentoService.registrarSintoma(this.pacienteSelecionado, payload).subscribe({
      next: (resposta: any) => {
        this.toastService.mostrar('Sintoma enviado! A IA está a analisar...', 'sucesso');
        this.isEnviando = false;
        // Redireciona para a página de Triagem com o ID recém-criado
        this.router.navigate(['/triagem', resposta.idAtendimento]);
      },
      error: (erro) => {
        console.error(erro);
        this.toastService.mostrar('Erro ao registar sintoma. Tente novamente.', 'erro');
        this.isEnviando = false;
      }
    });
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, AlertTriangle, Sparkles, CheckCircle2, Stethoscope, Phone, AlertCircle, Loader2 } from 'lucide-angular';
import { AtendimentoService, AtendimentoResponse } from '../../services/atendimento.service';
import { ForwardClinicModalComponent } from '../../components/forward-clinic-modal/forward-clinic-modal.component';
import { DoctorChatDrawerComponent } from '../../components/doctor-chat-drawer/doctor-chat-drawer.component';

@Component({
  selector: 'app-triagem',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ForwardClinicModalComponent, DoctorChatDrawerComponent],
  templateUrl: './triagem.component.html'
})
export class TriagemComponent implements OnInit, OnDestroy {
  // Ícones
  readonly AlertTriangleIcon = AlertTriangle;
  readonly AlertCircleIcon = AlertCircle;
  readonly SparklesIcon = Sparkles;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly StethoscopeIcon = Stethoscope;
  readonly PhoneIcon = Phone;
  readonly Loader2Icon = Loader2;

  atendimento: AtendimentoResponse | null = null;
  idAtendimento: number | null = null;
  
  modalEncaminharAberto = false;
  drawerChatAberto = false;
  
  // Controle de espera da IA
  iaProcessando = true;
  pollingInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atendimentoService: AtendimentoService
  ) {}

  ngOnInit() {
    // Pega o ID da URL (ex: /triagem/5)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idAtendimento = Number(id);
      this.iniciarMonitoramentoIA();
    }
  }

  ngOnDestroy() {
    this.pararMonitoramento();
  }

  iniciarMonitoramentoIA() {
    // Faz a primeira busca imediatamente
    this.buscarDados();

    // Fica a perguntar ao back-end a cada 2 segundos se a IA já respondeu
    this.pollingInterval = setInterval(() => {
      if (this.iaProcessando) {
        this.buscarDados();
      }
    }, 2000);
  }

  buscarDados() {
    if (!this.idAtendimento) return;

    this.atendimentoService.buscarPorId(this.idAtendimento).subscribe({
      next: (dados) => {
        this.atendimento = dados;
        
        // Se a IA já classificou (Vermelho, Amarelo ou Verde), paramos o relógio!
        if (dados.nivelRiscoIa && dados.nivelRiscoIa !== 'AGUARDANDO') {
          this.iaProcessando = false;
          this.pararMonitoramento();
        }
      },
      error: (err) => console.error('Erro ao carregar triagem:', err)
    });
  }

  pararMonitoramento() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  // Métodos Visuais Dinâmicos
  getTheme() {
    if (this.iaProcessando) return 'from-slate-400 via-slate-500 to-slate-400 shadow-slate-500/30';
    if (this.atendimento?.nivelRiscoIa === 'VERMELHO') return 'from-red-500 via-red-600 to-red-500 shadow-red-500/30';
    if (this.atendimento?.nivelRiscoIa === 'AMARELO') return 'from-amber-400 via-amber-500 to-orange-400 shadow-amber-500/30';
    return 'from-emerald-400 via-emerald-500 to-emerald-400 shadow-emerald-500/30';
  }

  getBadgeColor() {
    if (this.iaProcessando) return 'bg-slate-100 text-slate-700';
    if (this.atendimento?.nivelRiscoIa === 'VERMELHO') return 'bg-red-100 text-red-700';
    if (this.atendimento?.nivelRiscoIa === 'AMARELO') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  }

  getTituloRisco() {
    if (this.iaProcessando) return 'Analisando sintomas...';
    if (this.atendimento?.nivelRiscoIa === 'VERMELHO') return 'Emergência: Encaminhamento Imediato';
    if (this.atendimento?.nivelRiscoIa === 'AMARELO') return 'Alerta: Recomendamos avaliação médica';
    return 'Baixo Risco: Monitoramento padrão';
  }

  getMensagemRisco() {
    if (this.iaProcessando) return 'A nossa Inteligência Artificial está a avaliar os sintomas relatados. Aguarde um momento.';
    if (this.atendimento?.nivelRiscoIa === 'VERMELHO') return 'Os sintomas indicam potencial risco à vida. Transfira o paciente para uma unidade de emergência imediatamente.';
    if (this.atendimento?.nivelRiscoIa === 'AMARELO') return 'Os sintomas merecem atenção. Sugerimos agendar avaliação ou encaminhar para clínica moderada nas próximas 6 horas.';
    return 'Não foram identificados sinais de alerta graves. Mantenha os cuidados regulares no abrigo.';
  }

  redirecionarAposEncaminhar() {
    this.modalEncaminharAberto = false;
    this.router.navigate(['/dashboard']);
  }
}
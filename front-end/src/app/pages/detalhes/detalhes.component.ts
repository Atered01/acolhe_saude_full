import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // 🚨 Importar rotas
import { LucideAngularModule, Sparkles, AlertTriangle, Heart, Droplet, Activity, FileText, CheckCircle2 } from 'lucide-angular';
import { AcceptCaseModalComponent } from '../../components/accept-case-modal/accept-case-modal.component';
import { TransferCaseModalComponent } from '../../components/transfer-case-modal/transfer-case-modal.component';
import { AtendimentoService, AtendimentoResponse } from '../../services/atendimento.service'; // 🚨 Importar Serviço
import { ToastService } from '../../services/toast.service'; // 🚨 Importar Toasts

@Component({
  selector: 'app-clinica-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    AcceptCaseModalComponent,
    TransferCaseModalComponent
  ],
  templateUrl: './detalhes.component.html'
})
export class DetalhesComponent implements OnInit {
  // Ícones Globais
  readonly SparklesIcon = Sparkles;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly HeartIcon = Heart;
  readonly DropletIcon = Droplet;
  readonly ActivityIcon = Activity;
  readonly FileTextIcon = FileText;
  readonly CheckCircle2Icon = CheckCircle2;

  // Estados de Controle
  atendimento: AtendimentoResponse | null = null;
  idAtendimento: number | null = null;
  modalAceiteAberto = false;
  modalTransferenciaAberto = false;
  isLoading = false;

  // 🚨 Dados Auxiliares (Como não vêm no DTO simplificado, mantemos como dados de suporte visual)
  sinaisVitais = [
    { icon: Heart, label: "Pressão", value: "138/84", iconColor: "text-red-500" },
    { icon: Droplet, label: "Glicose", value: "104 mg/dL", iconColor: "text-blue-500" },
    { icon: Activity, label: "Sat O₂", value: "98%", iconColor: "text-emerald-500" }
  ];

  comorbidades = ["Hipertensão", "Acompanhamento Regular"];
  medicacoes = ["Losartana 50mg — 1x/dia"];
  exames = ["Glicemia capilar", "ECG de Urgência", "Hemograma Completo"];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atendimentoService: AtendimentoService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    // Captura o ID da URL (/clinica/detalhes/2)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idAtendimento = Number(id);
      this.carregarDadosDoCaso();
    }
  }

  carregarDadosDoCaso() {
    if (!this.idAtendimento) return;

    this.atendimentoService.buscarPorId(this.idAtendimento).subscribe({
      next: (dados) => {
        console.log('🚨 DADOS RECEBIDOS DO BACK-END:', dados);
        this.atendimento = dados;
      },
      error: (err) => {
        console.error('Erro ao carregar caso:', err);
        this.toastService.mostrar('Não foi possível carregar os detalhes deste caso.', 'erro');
      }
    });
  }

  // 🚨 INTEGRAÇÃO REAL: Aceitar o paciente no Hospital/Clínica
  confirmarAceite() {
    if (!this.idAtendimento) return;

    this.isLoading = true;
    this.atendimentoService.aceitarEmergencia(this.idAtendimento).subscribe({
      next: () => {
        this.isLoading = false;
        this.modalAceiteAberto = false;
        this.toastService.mostrar('Emergência assumida com sucesso! Vaga reservada.', 'sucesso');
        this.router.navigate(['/clinica']); // Volta para o painel principal da clínica
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao aceitar emergência:', err);
        this.toastService.mostrar('Erro ao assumir o caso. Tente novamente.', 'erro');
      }
    });
  }

  // 🚨 INTEGRAÇÃO REAL: Callback após o modal de transferência salvar com sucesso
  confirmarTransferencia() {
    this.modalTransferenciaAberto = false;
    this.toastService.mostrar('Caso transferido e encaminhado para outra unidade.', 'sucesso');
    this.router.navigate(['/clinica']);
  }

  // Métodos Utilitários Estéticos baseados no risco real da IA
  getThemeClass() {
    if (this.atendimento?.nivelRiscoIa === 'VERMELHO') return 'from-red-500 to-red-600 shadow-red-500/20';
    if (this.atendimento?.nivelRiscoIa === 'AMARELO') return 'from-amber-400 to-orange-500 shadow-amber-500/20';
    return 'from-emerald-400 to-emerald-500 shadow-emerald-500/20';
  }

  getBadgeClass() {
    if (this.atendimento?.nivelRiscoIa === 'VERMELHO') return 'bg-red-100 text-red-700';
    if (this.atendimento?.nivelRiscoIa === 'AMARELO') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  }
}
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, ArrowRightLeft, Search, MapPin, CheckCircle2, Loader2 } from 'lucide-angular';
import { ModalComponent } from '../modal/modal.component';
import { ParceiroService, ParceiroResponse } from '../../services/parceiro.service';
import { AtendimentoService } from '../../services/atendimento.service';
import { ToastService } from '../../services/toast.service';

export interface DadosTransferencia {
  idParceiroDestino: number;
  especialidade: string;
  justificativa: string;
}

@Component({
  selector: 'app-transfer-case-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ModalComponent],
  templateUrl: './transfer-case-modal.component.html'
})
export class TransferCaseModalComponent implements OnInit, OnChanges {
  @Input() idAtendimento: number = 0;

  @Input() open = false;
  @Input() caseData: any = null;

  @Output() fechar = new EventEmitter<void>();
  @Output() sucesso = new EventEmitter<void>();

  readonly XIcon = X;
  readonly ArrowRightLeftIcon = ArrowRightLeft;
  readonly SearchIcon = Search;
  readonly MapPinIcon = MapPin;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly Loader2Icon = Loader2;

  clinicasDisponiveis: ParceiroResponse[] = [];
  searchQuery = '';
  selectedClinic: number | null = null;
  especialidadeRequerida = '';
  justificativaTransferencia = '';
  isEnviando = false;

  constructor(
    private parceiroService: ParceiroService,
    private atendimentoService: AtendimentoService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.carregarClinicas();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open'] && changes['open'].currentValue === true) {
      this.carregarClinicas();
      this.selectedClinic = null;
      this.especialidadeRequerida = '';
      this.justificativaTransferencia = '';
    }
  }

  carregarClinicas() {
    this.parceiroService.listarDisponiveis().subscribe({
      next: (dados) => this.clinicasDisponiveis = dados,
      error: (err) => console.error(err)
    });
  }

  get filteredClinics() {
    return this.clinicasDisponiveis.filter(c =>
      c.nomeApresentacao.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      c.tipoParceiro.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectClinic(id: number) {
    this.selectedClinic = id;
  }

  confirmTransfer() {
    if (!this.selectedClinic || !this.caseData?.idAtendimento || !this.justificativaTransferencia) {
      this.toastService.mostrar('Preencha a justificativa e selecione uma clínica de destino.', 'aviso'); // 🚨 AVISO
      return;
    }

    this.isEnviando = true;
    const payload = {
      idParceiroDestino: this.selectedClinic,
      especialidade: this.especialidadeRequerida,
      justificativa: this.justificativaTransferencia
    };

    this.atendimentoService.transferirCaso(this.caseData.idAtendimento, payload).subscribe({
      next: () => {
        this.toastService.mostrar('Paciente transferido com sucesso para a nova unidade!', 'sucesso'); // 🚨 SUCESSO
        this.isEnviando = false;
        this.sucesso.emit();
        this.fechar.emit();
      },
      error: (err) => {
        console.error(err);
        this.toastService.mostrar('Erro ao transferir o paciente.', 'erro'); // 🚨 ERRO
        this.isEnviando = false;
      }
    });
  }
}
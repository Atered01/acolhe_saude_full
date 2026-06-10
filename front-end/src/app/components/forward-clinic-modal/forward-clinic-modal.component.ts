import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, MapPin, Navigation, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-angular';
import { ModalComponent } from '../modal/modal.component';
import { ParceiroService, ParceiroResponse } from '../../services/parceiro.service';
import { AtendimentoService } from '../../services/atendimento.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forward-clinic-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ModalComponent],
  templateUrl: './forward-clinic-modal.component.html'
})
export class ForwardClinicModalComponent implements OnInit, OnChanges {
  @Input() open = false;
  @Input() patientName = '';
  @Input() idAtendimento!: number; // 🚨 PRECISAMOS DE RECEBER O ID!
  
  @Output() fechar = new EventEmitter<void>();
  @Output() sucesso = new EventEmitter<void>();

  // Ícones
  readonly XIcon = X;
  readonly MapPinIcon = MapPin;
  readonly NavigationIcon = Navigation;
  readonly SearchIcon = Search;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly AlertCircleIcon = AlertCircle;
  readonly Loader2Icon = Loader2;

  clinicasDisponiveis: ParceiroResponse[] = [];
  searchQuery = '';
  selectedClinic: number | null = null;
  isEnviando = false;

  constructor(
    private parceiroService: ParceiroService,
    private atendimentoService: AtendimentoService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.carregarClinicas();
  }

  // Recarrega as clínicas sempre que o modal abre
  ngOnChanges(changes: SimpleChanges) {
    if (changes['open'] && changes['open'].currentValue === true) {
      this.carregarClinicas();
      this.selectedClinic = null;
    }
  }

  carregarClinicas() {
    this.parceiroService.listarDisponiveis().subscribe({
      next: (dados) => this.clinicasDisponiveis = dados,
      error: (err) => console.error('Erro ao buscar clínicas disponíveis', err)
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

  // 🚨 A MÁGICA DE ENCAMINHAR ACONTECE AQUI
  confirmForward() {
    if (!this.selectedClinic || !this.idAtendimento) return;

    this.isEnviando = true;

    this.atendimentoService.encaminharParaClinica(this.idAtendimento, this.selectedClinic).subscribe({
    next: () => {
        this.toastService.mostrar('Paciente encaminhado com sucesso! A clínica foi notificada.', 'sucesso'); // 🚨
        this.isEnviando = false;
        this.sucesso.emit(); 
        this.fechar.emit();  
      },
      error: (erro) => {
        console.error(erro);
        this.toastService.mostrar('Erro ao encaminhar o paciente. Tente novamente.', 'erro'); // 🚨
        this.isEnviando = false;
      }
    });
  }
}
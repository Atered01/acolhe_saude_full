import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-angular';
import { ModalComponent } from '../modal/modal.component';

// Interface do objeto que recebemos
export interface TriageInfo {
  patient: string;
  symptom: string;
  level: string;
}

@Component({
  selector: 'app-triage-details-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ModalComponent],
  templateUrl: './triage-details-modal.component.html'
})
export class TriageDetailsModalComponent {
  @Input() open: boolean = false;
  @Input() triage?: TriageInfo;

  @Output() fechar = new EventEmitter<void>();
  @Output() encaminhar = new EventEmitter<void>(); // Dispara quando o usuário quer enviar para a clínica

  readonly SparklesIcon = Sparkles;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly CheckCircle2Icon = CheckCircle2;

  // Dados fictícios (Mocks) baseados no React
  sintomasMock = ["Tontura", "Fraqueza", "Visão turva", "Pressão 14×9"];
  recomendacoesMock = [
    "Levar à clínica parceira mais próxima em até 6h",
    "Manter hidratação e repouso",
    "Comunicar o médico responsável",
  ];

  // Getter de segurança: Se o componente pai não passar uma triagem, mostramos a Dna. Cecília
  get t(): TriageInfo {
    return this.triage ?? { patient: "Dona Cecília Souza", symptom: "Tontura e fraqueza", level: "Moderado" };
  }

  onClose() {
    this.fechar.emit();
  }

  onEncaminhar() {
    this.encaminhar.emit();
    // Ao encaminhar, a tela pai pode decidir se fecha este modal ou não.
  }
}
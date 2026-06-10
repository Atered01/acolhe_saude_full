import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Building2 } from 'lucide-angular';
import { DrawerComponent } from '../drawer/drawer.component';

export interface ParceiroPayload {
  nome: string;
  cnpj: string;
  especialidade: string;
  cidade: string;
  uf: string;
  email: string;
  telefone: string;
}

@Component({
  selector: 'app-new-partner-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DrawerComponent],
  templateUrl: './new-partner-drawer.component.html'
})
export class NewPartnerDrawerComponent {
  @Input() open: boolean = false;
  
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<ParceiroPayload>();

  readonly Building2Icon = Building2;

  // Estado do formulário
  formData: ParceiroPayload = {
    nome: '',
    cnpj: '',
    especialidade: '',
    cidade: '',
    uf: '',
    email: '',
    telefone: ''
  };

  onClose() {
    this.fechar.emit();
  }

  onSalvar() {
    // Emite uma cópia dos dados para o componente Pai
    this.salvar.emit({ ...this.formData });
    
    // Limpa o formulário e fecha a gaveta
    this.formData = { nome: '', cnpj: '', especialidade: '', cidade: '', uf: '', email: '', telefone: '' };
    this.onClose();
  }
}
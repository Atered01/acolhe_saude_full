import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { DrawerComponent } from '../drawer/drawer.component';

export interface NovoUsuarioPayload {
  nome: string;
  email: string;
  senha: string;
  cargo: string;
}

@Component({
  selector: 'app-new-user-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DrawerComponent],
  templateUrl: './new-user-drawer.component.html'
})
export class NewUserDrawerComponent {
  @Input() open: boolean = false;

  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<NovoUsuarioPayload>();

  readonly UserPlusIcon = UserPlus;

  // Estado do formulário
  formData: NovoUsuarioPayload = {
    nome: '',
    email: '',
    senha: '',
    cargo: 'Cuidador(a)' // Valor por omissão
  };

  // Lista para o Select
  cargos = ['Cuidador(a)', 'Médico(a)', 'Administrador(a) de Clínica', 'Super Admin'];

  onClose() {
    this.fechar.emit();
  }

  onSalvar() {
    // Emite uma cópia do objeto para o ecrã pai fazer o POST à API
    this.salvar.emit({ ...this.formData });
    
    // Limpa o formulário e fecha o drawer
    this.formData = { nome: '', email: '', senha: '', cargo: 'Cuidador(a)' };
    this.onClose();
  }
}
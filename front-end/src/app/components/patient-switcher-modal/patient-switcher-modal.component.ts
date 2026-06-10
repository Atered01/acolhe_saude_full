import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para o ngModel da busca
import { LucideAngularModule, Search, Check } from 'lucide-angular';
import { ModalComponent } from '../modal/modal.component'; // Confirme o caminho correto do seu componente!

@Component({
  selector: 'app-patient-switcher-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ModalComponent],
  templateUrl: './patient-switcher-modal.component.html'
})
export class PatientSwitcherModalComponent {
  // Controle de abertura e eventos
  @Input() open: boolean = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<string>(); // Devolve o nome do paciente selecionado

  // Ícones
  readonly SearchIcon = Search;
  readonly CheckIcon = Check;

  // Estado do Componente
  searchQuery: string = '';
  selectedPatient: string = 'Sr. Antônio Pereira';

  // Dados Mockados
  patients = [
    { name: "Sr. Antônio Pereira", age: 78, initials: "AP", tone: "from-blue-500 to-emerald-500" },
    { name: "Dona Cecília Souza", age: 82, initials: "CS", tone: "from-amber-500 to-red-500" },
    { name: "Sr. José Carvalho", age: 71, initials: "JC", tone: "from-purple-500 to-pink-500" },
    { name: "Dna. Lúcia Mendes", age: 84, initials: "LM", tone: "from-emerald-500 to-teal-500" },
  ];

  // Getter inteligente para filtrar a lista com base na busca
  get filteredPatients() {
    if (!this.searchQuery) return this.patients;
    const query = this.searchQuery.toLowerCase();
    return this.patients.filter(p => p.name.toLowerCase().includes(query));
  }

  selecionarPaciente(nome: string) {
    this.selectedPatient = nome;
  }

  onClose() {
    this.fechar.emit();
  }

  onConfirmar() {
    this.confirmar.emit(this.selectedPatient);
    this.onClose();
  }
}
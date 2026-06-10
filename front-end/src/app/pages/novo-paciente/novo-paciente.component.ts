import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, UserPlus, ArrowLeft, Loader2 } from 'lucide-angular';
import { PacienteService } from '../../services/paciente.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-novo-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './novo-paciente.component.html'
})

export class NovoPacienteComponent {
  readonly UserPlusIcon = UserPlus;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly Loader2Icon = Loader2;

  // Objeto espelhado com os campos obrigatórios da sua tabela do MySQL
  novoPaciente = {
    nomeCompleto: '',
    dataNascimento: '',
    documentoIdentificacao: '',
    tipoSanguineo: '',
    nomeAbrigo: '',
    condicoesPrevias: ''
  };

  isSalvando = false;
  tiposSanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private toastService: ToastService // 🚨 ADICIONAR AQUI
  ) { }

  salvar() {
    if (!this.novoPaciente.nomeCompleto || !this.novoPaciente.documentoIdentificacao) {
      this.toastService.mostrar('Preencha os campos obrigatórios.', 'erro'); // 🚨
      return;
    }

    this.isSalvando = true;

    this.pacienteService.cadastrar(this.novoPaciente).subscribe({
      next: () => {
        this.toastService.mostrar('Paciente cadastrado com sucesso!', 'sucesso'); // 🚨
        this.isSalvando = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro ao cadastrar paciente:', err);
        this.toastService.mostrar('Erro ao salvar o paciente na base de dados.', 'erro'); // 🚨
        this.isSalvando = false;
      }
    });
  }
}
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router'; // 🚨 Router adicionado
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Heart, Home, UserPlus, Activity, Stethoscope, Settings, LogOut, Bell, Search, Users, FileText } from 'lucide-angular';
import { NotificationsDropdownComponent } from '../../components/notifications-dropdown/notifications-dropdown.component';
import { PatientSwitcherModalComponent } from '../../components/patient-switcher-modal/patient-switcher-modal.component';
import { AuthService } from '../../services/auth.service';
import { AtendimentoService } from '../../services/atendimento.service'; // 🚨 Importar o serviço
import { ToastService } from '../../services/toast.service'; // 🚨 Importar o Toast

@Component({
  selector: 'app-caregiver-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive, 
    RouterOutlet, 
    LucideAngularModule, 
    NotificationsDropdownComponent, 
    PatientSwitcherModalComponent
  ],
  templateUrl: './caregiver-layout.component.html'
})
export class CaregiverLayoutComponent {

  @Input() title: string = '';

  // Ícones do Layout
  readonly HeartIcon = Heart;
  readonly SettingsIcon = Settings;
  readonly LogOutIcon = LogOut;
  readonly SearchIcon = Search;
  readonly BellIcon = Bell;
  readonly UsersIcon = Users;
  readonly StethoscopeIcon = Stethoscope;

  // Itens de Navegação (Sem a Triagem aqui, pois será um botão dinâmico)
  navItems = [
    { to: "/dashboard", label: "Início", icon: Home },
    { to: "/pacientes/novo", label: "Cadastrar Paciente", icon: UserPlus },
    { to: "/sintomas", label: "Relatar Sintoma", icon: Activity },
    { to: "/historico", label: "Histórico Geral", icon: FileText } // Opcional: manter o histórico se quiser
  ];

  notificacoesAbertas = false;
  modalTrocarPacienteAberto = false;

  constructor(
    public authService: AuthService,
    private atendimentoService: AtendimentoService, // 🚨 Injetado
    private toastService: ToastService,             // 🚨 Injetado
    private router: Router                          // 🚨 Injetado
  ) {}

  // 🚨 A MÁGICA ACONTECE AQUI
  abrirUltimaTriagem() {
    // Usamos o endpoint de recentes para pegar o último atendimento
    this.atendimentoService.listarTriagensRecentes().subscribe({
      next: (dados) => {
        if (dados && dados.length > 0) {
          // Pega o ID do primeiro da lista (o mais recente)
          const ultimoId = dados[0].idAtendimento;
          // Navega para a página da triagem com esse ID
          this.router.navigate(['/triagem', ultimoId]);
        } else {
          this.toastService.mostrar('Nenhuma triagem registrada no sistema ainda.', 'aviso');
        }
      },
      error: (err) => {
        console.error('Erro ao buscar última triagem', err);
        this.toastService.mostrar('Erro ao buscar dados.', 'erro');
      }
    });
  }

  trocarPacienteGlobal(nome: string) {
    console.log('O utilizador quer focar-se no paciente:', nome);
  }
}
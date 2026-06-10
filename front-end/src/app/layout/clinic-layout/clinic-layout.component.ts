import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Stethoscope, LayoutDashboard, FileText, Settings, Users, Building2, LogOut, Bell } from 'lucide-angular';
import { NotificationsDropdownComponent } from '../../components/notifications-dropdown/notifications-dropdown.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-clinic-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LucideAngularModule,
    NotificationsDropdownComponent
  ],
  templateUrl: './clinic-layout.component.html'
})
export class ClinicLayoutComponent {
  constructor(public authService: AuthService) { }

  @Input() title: string = '';
  @Input() subtitle: string = '';

  // Ícones Globais do Layout
  readonly StethoscopeIcon = Stethoscope;
  readonly LayoutDashboardIcon = LayoutDashboard;
  readonly FileTextIcon = FileText;
  readonly SettingsIcon = Settings;
  readonly UsersIcon = Users;
  readonly Building2Icon = Building2;
  readonly LogOutIcon = LogOut;
  readonly BellIcon = Bell;

  // Menu Lateral
  navItems = [
    { to: "/clinica", label: "Emergências", icon: LayoutDashboard },
    //{ to: "/clinica/detalhes", label: "Detalhes Médicos", icon: FileText },
    { to: "/clinica/configuracoes", label: "Capacidade", icon: Settings },
    { to: "/admin/parceiros", label: "Parceiros", icon: Building2 },
    { to: "/admin/usuarios", label: "Usuários", icon: Users },
  ];

  notificacoesAbertas = false;
}
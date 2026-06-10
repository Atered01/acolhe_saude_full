import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule, 
  Bell, AlertCircle, Stethoscope, Heart, CheckCheck, X 
} from 'lucide-angular';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notifications-dropdown.component.html'
})
export class NotificationsDropdownComponent {
  // Controle de abertura vindo do componente Pai (Header)
  @Input() open: boolean = false;
  
  // Emissor de evento para fechar
  @Output() fechar = new EventEmitter<void>();

  // Ícones Globais
  readonly BellIcon = Bell;
  readonly AlertCircleIcon = AlertCircle;
  readonly StethoscopeIcon = Stethoscope;
  readonly HeartIcon = Heart;
  readonly CheckCheckIcon = CheckCheck;
  readonly XIcon = X;

  // Lista Mockada de Notificações
  items = [
    {
      icon: this.AlertCircleIcon,
      tone: "bg-red-100 text-red-600",
      title: "Nova triagem crítica de Maria",
      desc: "Dna. Cecília apresentou tontura e fraqueza intensas.",
      time: "Há 2 min",
      unread: true,
    },
    {
      icon: this.StethoscopeIcon,
      tone: "bg-emerald-100 text-emerald-600",
      title: "Paciente João aceito pelo Dr. Ricardo",
      desc: "O caso foi assumido pelo Hospital Santa Helena.",
      time: "Há 18 min",
      unread: true,
    },
    {
      icon: this.HeartIcon,
      tone: "bg-blue-100 text-blue-600",
      title: "Lembrete de medicação",
      desc: "Sr. Antônio precisa tomar Losartana às 14h.",
      time: "Há 1h",
      unread: false,
    },
  ];

  onClose() {
    this.fechar.emit();
  }
}
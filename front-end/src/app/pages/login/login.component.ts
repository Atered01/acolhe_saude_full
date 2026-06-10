import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, Heart, Mail, Lock, Stethoscope, ShieldCheck, Activity } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  // Ícones
  readonly HeartIcon = Heart;
  readonly MailIcon = Mail;
  readonly LockIcon = Lock;
  readonly StethoscopeIcon = Stethoscope;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly ActivityIcon = Activity;

  features = [
    { label: 'Análise IA', icon: this.ActivityIcon },
    { label: 'Dados Seguros', icon: this.ShieldCheckIcon },
    { label: 'Rede Médica', icon: this.StethoscopeIcon }
  ];

  // Variáveis ligadas ao formulário HTML via ngModel
  email = '';
  password = '';

  // Variáveis de estado
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  fazerLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Faz a chamada ao Spring Boot
    this.authService.login({ email: this.email, senha: this.password }).subscribe({
  next: (response) => {
        this.isLoading = false;
        console.log('Login efetuado com sucesso! Token guardado.');
        if (this.authService.isCuidador()) {
          this.router.navigate(['/dashboard']);
        } else if (this.authService.isMedico() || this.authService.isParceiro()) {
          this.router.navigate(['/clinica']);
        } else if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/parceiros']);
        } else {
          this.errorMessage = 'Perfil autenticado, mas sem área de acesso configurada.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Credenciais inválidas ou erro no servidor.';
        console.error('Erro no login:', err);
      }
    });
  }
}
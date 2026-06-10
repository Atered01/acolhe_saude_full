import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRole === 'PARCEIRO' && !this.authService.isParceiro() && !this.authService.isMedico()) {
      this.toastService.mostrar('Acesso negado. Área restrita à equipe clínica.', 'erro');
      this.router.navigate(['/dashboard']);
      return false;
    }

    if (expectedRole === 'CUIDADOR' && !this.authService.isCuidador()) {
      this.router.navigate(['/clinica']);
      return false;
    }

    return true;
  }
}
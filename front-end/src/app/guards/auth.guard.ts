import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router"; // 🚨 CORRIGIDO AQUI
import { AuthService } from "../services/auth.service";

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router); // Agora o Angular sabe o que é o Router

  if (authService.isTokenValid()) {
    return true;
  } else {
    router.navigate(['/']); // Manda para o Login
    return false;
  }
};
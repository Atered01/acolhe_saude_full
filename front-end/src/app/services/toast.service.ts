import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'aviso';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>(this.toasts);
  
  // O componente visual vai "escutar" esta variável
  toasts$ = this.toastsSubject.asObservable();
  private contador = 0;

  mostrar(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' = 'sucesso') {
    const id = this.contador++;
    const novoToast: Toast = { id, mensagem, tipo };
    
    this.toasts.push(novoToast);
    this.toastsSubject.next([...this.toasts]);

    // Oculta a notificação automaticamente após 4 segundos
    setTimeout(() => {
      this.remover(id);
    }, 4000);
  }

  remover(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastsSubject.next([...this.toasts]);
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle2, AlertCircle, X, Info } from 'lucide-angular';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast-container.component.html'
})
export class ToastContainerComponent {
  readonly CheckCircle2Icon = CheckCircle2;
  readonly AlertCircleIcon = AlertCircle;
  readonly InfoIcon = Info;
  readonly XIcon = X;

  constructor(public toastService: ToastService) {}

  fechar(id: number) {
    this.toastService.remover(id);
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (open) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
        <!-- Overlay (Fundo escuro) -->
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" (click)="onClose()"></div>
        
        <!-- Caixa do Modal -->
        <div class="relative w-full {{ widthClass }} bg-white rounded-3xl shadow-2xl ring-1 ring-black/5 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4">
          
          <!-- Cabeçalho -->
          <div class="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900">{{ title }}</h3>
              @if (subtitle) {
                <p class="text-sm text-slate-500 mt-0.5">{{ subtitle }}</p>
              }
            </div>
            <button (click)="onClose()" class="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer transition">
              <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
          
          <!-- Corpo do Modal (O conteúdo será injetado aqui) -->
          <div class="px-6 pb-6">
            <ng-content></ng-content>
          </div>
          
          <!-- Rodapé do Modal (Opcional) -->
          @if (hasFooter) {
            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <!-- O conteúdo com a tag [modal-footer] virá para aqui -->
              <ng-content select="[modal-footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() open: boolean = false;
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() hasFooter: boolean = false; // Controle para exibir a barra cinzenta do rodapé

  @Output() fechar = new EventEmitter<void>();

  readonly XIcon = X;

  get widthClass(): string {
    if (this.size === 'sm') return 'max-w-md';
    if (this.size === 'lg') return 'max-w-2xl';
    return 'max-w-lg'; // md (padrão)
  }

  onClose() {
    this.fechar.emit();
  }
}
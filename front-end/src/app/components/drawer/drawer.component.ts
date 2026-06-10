import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- O z-50 e pointer-events controlam se o usuário pode interagir -->
    <div class="fixed inset-0 z-50" [class.pointer-events-none]="!open">
      
      <!-- Overlay Animado (Fica transparente quando fechado) -->
      <div
        class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300"
        [class.opacity-100]="open"
        [class.opacity-0]="!open"
        (click)="onClose()"
      ></div>
      
      <!-- Gaveta Deslizante -->
      <aside
        class="absolute right-0 top-0 h-full w-full sm:w-[440px] bg-white shadow-2xl flex flex-col transition-transform duration-300"
        [class.translate-x-0]="open"
        [class.translate-x-full]="!open"
      >
        <!-- Cabeçalho -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
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
        
        <!-- Corpo com Scroll -->
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <ng-content></ng-content>
        </div>
        
        <!-- Rodapé -->
        @if (hasFooter) {
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
            <ng-content select="[drawer-footer]"></ng-content>
          </div>
        }
      </aside>
    </div>
  `
})
export class DrawerComponent {
  @Input() open: boolean = false;
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() hasFooter: boolean = false;

  @Output() fechar = new EventEmitter<void>();

  readonly XIcon = X;

  onClose() {
    this.fechar.emit();
  }
}
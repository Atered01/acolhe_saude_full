import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MoreVertical, Pencil, Ban, History } from 'lucide-angular';

@Component({
  selector: 'app-partner-actions-menu',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './partner-actions-menu.component.html'
})
export class PartnerActionsMenuComponent {
  // Recebe os dados do parceiro (para sabermos qual linha da tabela foi clicada)
  @Input() parceiro: any;

  // Emissores de eventos para a Tabela Pai
  @Output() editar = new EventEmitter<any>();
  @Output() verHistorico = new EventEmitter<any>();
  @Output() suspender = new EventEmitter<any>();

  // Ícones
  readonly MoreVerticalIcon = MoreVertical;
  readonly PencilIcon = Pencil;
  readonly HistoryIcon = History;
  readonly BanIcon = Ban;

  isOpen = false;

  constructor(private elementRef: ElementRef) { }

  // Deteta cliques em todo o documento
  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: any) { // 🚨 Alterado de HTMLElement para any

    // Verificação de segurança: se o clique for nulo, ignora
    if (!targetElement) {
      return;
    }

    // Se o clique NÃO foi dentro deste componente, fecha o menu
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  onEditar() {
    this.editar.emit(this.parceiro);
    this.isOpen = false;
  }

  onVerHistorico() {
    this.verHistorico.emit(this.parceiro);
    this.isOpen = false;
  }

  onSuspender() {
    this.suspender.emit(this.parceiro);
    this.isOpen = false;
  }
}
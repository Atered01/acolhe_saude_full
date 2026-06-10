import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Send, Paperclip, Phone, Video } from 'lucide-angular';
import { DrawerComponent } from '../drawer/drawer.component';

// Tipagem para as mensagens
export interface ChatMessage {
  from: 'me' | 'doc';
  text: string;
  time: string;
}

@Component({
  selector: 'app-doctor-chat-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DrawerComponent],
  templateUrl: './doctor-chat-drawer.component.html'
})
export class DoctorChatDrawerComponent {
  @Input() open: boolean = false;
  @Output() fechar = new EventEmitter<void>();

  readonly SendIcon = Send;
  readonly PaperclipIcon = Paperclip;
  readonly PhoneIcon = Phone;
  readonly VideoIcon = Video;

  // Estado da mensagem atual
  novaMensagem: string = '';

  // Histórico Mockado
  mensagens: ChatMessage[] = [
    { from: 'doc', text: 'Olá Maria, recebi a triagem da Dona Cecília. Ela tomou a medicação hoje?', time: '10:12' },
    { from: 'me', text: 'Sim doutor, Losartana e Metformina pela manhã.', time: '10:13' },
    { from: 'doc', text: 'Ótimo. Pode medir a pressão novamente e me enviar?', time: '10:13' },
    { from: 'me', text: 'Acabei de medir: 14×9. Ela está mais calma agora.', time: '10:15' },
    { from: 'doc', text: 'Perfeito. Continue observando. Se piorar, encaminhe direto para o Santa Helena.', time: '10:16' },
  ];

  enviarMensagem() {
    if (!this.novaMensagem.trim()) return;
    
    // Adiciona a nova mensagem à lista
    this.mensagens.push({
      from: 'me',
      text: this.novaMensagem,
      time: 'agora' // Num cenário real, usaríamos new Date() formatado
    });
    
    // Limpa o input
    this.novaMensagem = '';
  }

  onClose() {
    this.fechar.emit();
  }
}
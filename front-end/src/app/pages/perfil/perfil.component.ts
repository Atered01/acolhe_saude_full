import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Camera, KeyRound, Save } from 'lucide-angular';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent {
  // Ícones
  readonly CameraIcon = Camera;
  readonly KeyRoundIcon = KeyRound;
  readonly SaveIcon = Save;

  // Estado do formulário
  usuario = {
    nome: 'Maria Aparecida Silva',
    email: 'maria.silva@email.com',
    telefone: '(11) 98888-1234',
    dataNascimento: '12/04/1985'
  };

  iniciais = 'MA';

  alterarFoto() {
    // Aqui no futuro chamaremos o input do tipo 'file' oculto
    console.log('Abrir seletor de fotos da galeria...');
  }

  salvarAlteracoes() {
    // O payload que você enviará para a API (PUT /api/usuarios/perfil)
    console.log('Enviando para a API:', this.usuario);
    alert('Perfil atualizado com sucesso!');
  }

  trocarSenha() {
    // Pode abrir um pequeno modal futuramente
    alert('Fluxo de troca de senha será iniciado!');
  }
}
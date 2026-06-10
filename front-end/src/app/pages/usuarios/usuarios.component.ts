import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Plus } from 'lucide-angular';

// Serviços e Componentes
import { UsuarioService, UsuarioResponse } from '../../services/usuario.service';
import { NovoUsuarioPayload } from '../../components/new-user-drawer/new-user-drawer.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule, 
  ],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  readonly SearchIcon = Search;
  readonly PlusIcon = Plus;

  // 🚨 A lista agora recebe o formato exato do Back-end
  users: UsuarioResponse[] = [];
  drawerNovoUsuarioAberto = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  // 🚨 1. BUSCAR USUÁRIOS REAIS
  carregarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (dados) => {
        this.users = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar utilizadores:', erro);
        alert('Falha ao carregar a lista de utilizadores. Verifique se tem permissão (Admin).');
      }
    });
  }

  // 🚨 2. CRIAR NOVO USUÁRIO REAL
  salvarNovoUsuario(dados: NovoUsuarioPayload) {
    console.log('Enviando para a API:', dados);
    
    this.usuarioService.cadastrarUsuario(dados).subscribe({
      next: (mensagemSucesso) => {
        alert(mensagemSucesso); // "Usuário cadastrado com sucesso!"
        this.carregarUsuarios(); // Atualiza a tabela na hora!
      },
      error: (erro) => {
        console.error('Erro ao cadastrar:', erro);
        // Exibe a mensagem de erro que vem do Spring (ex: "E-mail já está em uso!")
        alert(erro.error || 'Ocorreu um erro ao tentar cadastrar o utilizador.');
      }
    });
  }

  // 🚨 3. DESATIVAR USUÁRIO REAL (Botão Suspensão/Desativar caso já tenha no HTML)
  desativar(id: number) {
    if(confirm('Tem a certeza que deseja desativar este acesso?')) {
      this.usuarioService.desativarUsuario(id).subscribe({
        next: (msg) => {
          alert(msg);
          this.carregarUsuarios(); // Atualiza a tabela
        },
        error: (err) => console.error(err)
      });
    }
  }

  // Função auxiliar de cores (como você já tinha)
  getBadgeColor(role: string): string {
    if (role === 'ROLE_ADMIN') return 'bg-purple-100 text-purple-700';
    if (role === 'ROLE_PARCEIRO') return 'bg-blue-100 text-blue-700';
    return 'bg-emerald-100 text-emerald-700'; // ROLE_CUIDADOR
  }

  formatarCargo(role: string): string {
    if (role === 'ROLE_ADMIN') return 'Administrador';
    if (role === 'ROLE_PARCEIRO') return 'Clínica / Médico';
    return 'Cuidador(a)';
  }
}
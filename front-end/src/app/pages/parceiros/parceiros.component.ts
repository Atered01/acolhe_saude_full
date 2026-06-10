import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Building2, AlertCircle, CheckCircle2, Activity, Plus } from 'lucide-angular';

import { ParceiroService, ParceiroResponse } from '../../services/parceiro.service';
import { NewPartnerDrawerComponent, ParceiroPayload } from '../../components/new-partner-drawer/new-partner-drawer.component';
import { PartnerActionsMenuComponent } from '../../components/partner-actions-menu/partner-actions-menu.component';

@Component({
  selector: 'app-parceiros', // Ajuste para o seu selector correto
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    NewPartnerDrawerComponent,
    PartnerActionsMenuComponent
  ],
  templateUrl: './parceiros.component.html'
})
export class ParceirosComponent implements OnInit {

  // 🚨 Busca apenas clínicas com camas livres e que aceitem urgências!


  readonly Building2Icon = Building2;
  readonly AlertCircleIcon = AlertCircle;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly ActivityIcon = Activity;
  readonly PlusIcon = Plus;

  // 🚨 A nossa lista real de clínicas
  clinicas: ParceiroResponse[] = [];
  drawerNovoParceiroAberto = false;

kpis = [
    { label: 'Total de Parceiros', value: '12', tone: 'bg-blue-100 text-blue-600', icon: this.Building2Icon },
    { label: 'Clínicas Ativas', value: '11', tone: 'bg-emerald-100 text-emerald-600', icon: this.CheckCircle2Icon },
    { label: 'Emergências Hoje', value: '84', tone: 'bg-purple-100 text-purple-600', icon: this.ActivityIcon },
    { label: 'Suspensas', value: '1', tone: 'bg-amber-100 text-amber-600', icon: this.AlertCircleIcon }
  ];

  constructor(private parceiroService: ParceiroService) {}

  ngOnInit() {
    this.carregarParceiros();
  }

  carregarParceiros() {
    this.parceiroService.listarParceiros().subscribe({
      next: (dados) => {
        this.clinicas = dados;
      },
      error: (erro) => console.error('Erro ao buscar parceiros:', erro)
    });
  }

  salvarNovoParceiro(dados: ParceiroPayload) {
    this.parceiroService.cadastrarParceiro(dados).subscribe({
      next: () => {
        alert('Clínica parceira cadastrada com sucesso!');
        this.carregarParceiros(); // Recarrega a tabela
      },
      error: (erro) => alert('Erro ao cadastrar clínica: ' + erro.message)
    });
  }

  // Ações do Menu de 3 Pontinhos
  editarParceiro(parceiro: ParceiroResponse) {
    alert(`Editar dados de: ${parceiro.nomeApresentacao}`);
  }

  verHistoricoParceiro(parceiro: ParceiroResponse) {
    alert(`Visualizar histórico de: ${parceiro.nomeApresentacao}`);
  }

  suspenderParceiro(parceiro: ParceiroResponse) {
    if (confirm(`Tem a certeza que deseja SUSPENDER a clínica ${parceiro.nomeApresentacao}?`)) {
      this.parceiroService.suspenderParceiro(parceiro.idParceiro).subscribe({
        next: (msg) => {
          alert(msg);
          this.carregarParceiros();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
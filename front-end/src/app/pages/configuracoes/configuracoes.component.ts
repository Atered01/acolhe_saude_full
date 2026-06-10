import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule, Minus, Plus, BedDouble, Stethoscope, Building2, Loader2
} from 'lucide-angular';
import { ParceiroService, AtualizarRecursosDTO } from '../../services/parceiro.service';
import { ToastService } from '../../services/toast.service';

interface CounterConfig {
  id: string;
  label: string;
  value: number;
  max: number;
  icon: any;
  tone: string;
}

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './configuracoes.component.html'
})
export class ConfiguracoesComponent {
  readonly MinusIcon = Minus;
  readonly PlusIcon = Plus;
  readonly Loader2Icon = Loader2; // 🚨 Adicionado ícone de loading

  accept: boolean = true;
  isSalvando: boolean = false; // 🚨 Estado para controlar o botão

  counters: CounterConfig[] = [
    { id: 'uti', label: 'Leitos de UTI', value: 8, max: 20, icon: BedDouble, tone: 'bg-red-100 text-red-600' },
    { id: 'enf', label: 'Leitos de Enfermaria', value: 24, max: 60, icon: Building2, tone: 'bg-blue-100 text-blue-600' }
    // (Pode remover os médicos se o backend não os estiver a mapear no DTO atual)
  ];

  constructor(
    private parceiroService: ParceiroService,
    private toastService: ToastService
  ) { }

  toggleAccept() {
    this.accept = !this.accept;
  }

  updateCounter(counter: CounterConfig, delta: number) {
    const newValue = counter.value + delta;
    if (newValue >= 0 && newValue <= counter.max) {
      counter.value = newValue;
    }
  }

  getPct(counter: CounterConfig): number {
    return Math.round((counter.value / counter.max) * 100);
  }

  // 🚨 A MÁGICA DA INTEGRAÇÃO
  salvar() {
    this.isSalvando = true;

    // 1. Mapear o nosso array dinâmico para o formato JSON que o Java exige
    const payload: AtualizarRecursosDTO = {
      aceitandoEmergencias: this.accept,
      leitosUti: this.counters.find(c => c.id === 'uti')?.value || 0,
      leitosEnfermaria: this.counters.find(c => c.id === 'enf')?.value || 0
    };

    // 2. Chamar a API
    this.parceiroService.atualizarCapacidade(payload).subscribe({
      next: () => {
        this.toastService.mostrar('Capacidade atualizada com sucesso no sistema!', 'sucesso');
        this.isSalvando = false;
      },
      error: (err) => {
        console.error('Erro ao salvar capacidade:', err);
        this.toastService.mostrar('Erro ao atualizar os recursos. Tente novamente.', 'erro');
        this.isSalvando = false;
      }
    });
  }
}
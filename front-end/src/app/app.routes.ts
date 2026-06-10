import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CaregiverLayoutComponent } from './layout/caregiver-layout/caregiver-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NovoPacienteComponent } from './pages/novo-paciente/novo-paciente.component';
import { SintomasComponent } from './pages/sintomas/sintomas.component';
import { TriagemComponent } from './pages/triagem/triagem.component';
import { ClinicDashboardComponent } from './pages/clinic-dashboard/clinic-dashboard.component';
import { DetalhesComponent } from './pages/detalhes/detalhes.component';
import { ClinicLayoutComponent } from './layout/clinic-layout/clinic-layout.component';
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';
import { ParceirosComponent } from './pages/parceiros/parceiros.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AuthGuard } from './guards/auth.guard';
import { HistoricoComponent } from './pages/historico/historico.component';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  // 🚨 Rota explícita para o Login
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: CaregiverLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'CUIDADOR' }, // 🚨 O RoleGuard precisa de saber que esta área é do Cuidador
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'pacientes/novo', component: NovoPacienteComponent },
      { path: 'sintomas', component: SintomasComponent },
      { path: 'triagem/:id', component: TriagemComponent }, // 🚨 Adicionado o :id para a IA funcionar
      { path: 'historico', component: HistoricoComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  },

{
    path: 'clinica',
    component: ClinicLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_PARCEIRO', 'ROLE_MEDICO'] }, 
    children: [
      { path: '', component: ClinicDashboardComponent },
      { path: 'detalhes/:id', component: DetalhesComponent },
      { path: 'configuracoes', component: ConfiguracoesComponent }
    ]
  },

  {
    path: 'admin',
    component: ClinicLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'PARCEIRO' }, // 🚨 Assumindo que os administradores da clínica usam a role PARCEIRO
    children: [
      { path: 'parceiros', component: ParceirosComponent },
      { path: 'usuarios', component: UsuariosComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ClientDashboardComponent } from './components/client/client.component';
import { AdminDashboardComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cliente', component: ClientDashboardComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: 'login' }
];

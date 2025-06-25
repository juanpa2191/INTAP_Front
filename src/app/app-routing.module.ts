import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { TiemposComponent } from './tiempos/tiempos.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'actividades', 
    component: ActividadesComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'tiempos', 
    component: TiemposComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

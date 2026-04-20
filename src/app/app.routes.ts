import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'eventos',
        loadComponent: () => import('./pages/eventos/eventos.component').then(m => m.EventosComponent),
      },
      {
        path: 'eventos/:idEvento',
        loadComponent: () => import('./pages/evento-detalle/evento-detalle.component').then(m => m.EventoDetalleComponent),
      },
      {
        path: 'reservas',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/mis-reservas/mis-reservas.component').then(m => m.MisReservasComponent),
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'admin/eventos',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/admin-eventos/admin-eventos.component').then(m => m.AdminEventosComponent),
      },
      {
        path: 'admin/tipos',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/admin-tipos/admin-tipos.component').then(m => m.AdminTiposComponent),
      },
      {
        path: 'admin/perfiles',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/admin-perfiles/admin-perfiles.component').then(m => m.AdminPerfilesComponent),
      },
      {
        path: 'admin/usuarios',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/admin-usuarios/admin-usuarios.component').then(m => m.AdminUsuariosComponent),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

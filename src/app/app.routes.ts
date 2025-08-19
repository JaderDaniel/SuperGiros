import { Routes } from '@angular/router';
import { AuthGuard, RedirectGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [RedirectGuard]
  },
  {
    path: 'catalog',
    loadComponent: () => import('./components/catalog/catalog.component').then(m => m.CatalogComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
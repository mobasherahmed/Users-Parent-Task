import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent) },
    { path: 'users', loadComponent: () => import('./users/pages/home/home.component').then(m => m.HomeComponent), canActivate: [AuthGuard] },
    { path: 'user/:id', loadComponent: () => import('./users/pages/user/user.component').then(m => m.UserComponent), canActivate: [AuthGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
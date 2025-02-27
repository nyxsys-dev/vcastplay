import { Routes } from '@angular/router';

const appTitle: string = 'VCastplay';
export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
        title: `Login • ${appTitle}`,
    },
    { path: '', redirectTo: '/dashboard',  pathMatch: 'full' },
    {
        path: '',
        loadComponent: () => import('./main/main.component').then(m => m.MainComponent),
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), title: `Dashboard • ${appTitle}`, },
            { path: 'settings', loadChildren: () => import('./pages/settings/settings.routes') }
        ]
    },
    { 
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];

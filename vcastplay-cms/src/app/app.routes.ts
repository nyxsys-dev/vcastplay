import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        loadComponent: () => import('./main/main.component').then(m => m.MainComponent),
        children: [
            { 
                path: 'dashboard', 
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
            },
        ]
    }
];

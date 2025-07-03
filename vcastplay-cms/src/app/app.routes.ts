import { Routes } from '@angular/router';
import { environment } from '../environments/environment.development';

const appTitle: string = environment.appTitle;
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
            { path: 'screens', loadChildren: () => import('./pages/screens/screens.routes') },
            { path: 'assets', loadChildren: () => import('./pages/assets/assets.routes') },
            { path: 'playlist', loadChildren: () => import('./pages/playlist/playlist.routes') },
            { path: 'layout', loadChildren: () => import('./pages/design-layout/design-layout.route') },
            { path: 'schedule', loadChildren: () => import('./pages/schedules/schedules.route') },
            { path: 'reports', loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent), title: `Reports • ${appTitle}`, },
            { path: 'settings', loadChildren: () => import('./pages/settings/settings.routes') }
        ]
    },
    { 
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];

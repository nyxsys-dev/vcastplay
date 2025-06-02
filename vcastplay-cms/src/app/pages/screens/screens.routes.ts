import { Routes } from "@angular/router";
import { environment } from "../../../environments/environment.development";

const appTitle: string = environment.appTitle;

export default [
    {
        path: 'screen-registration', 
        loadComponent: () => import('./screen-list/screen-list.component').then(m => m.ScreenListComponent),
        title: `Screen Registration • ${appTitle}`,
    },
    {
        path: 'screen-details', 
        loadComponent: () => import('./screen-details/screen-details.component').then(m => m.ScreenDetailsComponent),
        title: `Screen Details • ${appTitle}`,
    },
    {
        path: 'screen-details/:code', 
        loadComponent: () => import('./screen-details/screen-details.component').then(m => m.ScreenDetailsComponent),
        title: `Screen Details • ${appTitle}`,
    },
    {
        path: 'screen-management', 
        loadComponent: () => import('./screen-monitoring/screen-monitoring.component').then(m => m.ScreenMonitoringComponent),
        title: `Screen Management • ${appTitle}`,
    },
] as Routes
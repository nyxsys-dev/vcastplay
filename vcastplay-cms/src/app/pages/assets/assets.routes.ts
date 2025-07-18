import { Routes } from "@angular/router";
import { environment } from "../../../environments/environment.development";

const appTitle: string = environment.appTitle;

export default [
    {
        path: 'asset-library', 
        loadComponent: () => import('./asset-list/asset-list.component').then(m => m.AssetListComponent),
        title: `Asset Library • ${appTitle}`,
    },
    {
        path: 'asset-details', 
        loadComponent: () => import('./asset-details/asset-details.component').then(m => m.AssetDetailsComponent),
        title: `Asset Upload • ${appTitle}`,
    },
    {
        path: 'asset-details/:code', 
        loadComponent: () => import('./asset-details/asset-details.component').then(m => m.AssetDetailsComponent),
        title: `Asset Upload • ${appTitle}`,
    },
] as Routes
import { Routes } from "@angular/router";

const appTitle: string = 'VCastplay';
export default [
    {
        path: 'user-management', 
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
        title: `User Management • ${appTitle}`,
    },
    {
        path: 'role-management', 
        loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent),
        title: `Role Management • ${appTitle}`,
    },
    {
        path: 'profile', 
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
        title: `Profile • ${appTitle}`,
    },
] as Routes
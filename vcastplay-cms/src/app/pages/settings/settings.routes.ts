import { Routes } from "@angular/router";
import { environment } from "../../../environments/environment.development";

const appTitle: string = environment.appTitle;
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
    {
        path: 'audience-tag',
        loadComponent: () => import('./audience-tag/audience-tag-list/audience-tag-list.component').then(m => m.AudienceTagListComponent),
        title: `Audience Tag • ${appTitle}`,
    }
] as Routes
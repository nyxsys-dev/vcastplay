import { Routes } from "@angular/router";
import { environment } from "../../../environments/environment.development";

const appTitle: string = environment.appTitle;

export default [
    {
        path: 'design-layout-library', 
        loadComponent: () => import('./design-layout-list/design-layout-list.component').then(m => m.DesignLayoutListComponent),
        title: `Design Layout • ${appTitle}`,
    },
] as Routes
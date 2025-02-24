import { Component, HostListener, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { DrawerMenu } from '../../core/interfaces/drawer-menu';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-drawer',
  imports: [ PrimengUiModule, RouterModule ],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class DrawerComponent {

  router = inject(Router);
  items = signal<DrawerMenu[]>([]);
  
  ngOnInit() {
    this.items.set([
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Screen',
        icon: 'pi pi-desktop',
        expanded: false,
        menus: [
          {
            label: 'Register',
            icon: 'pi pi-plus',
            routerLink: ['/screen-register'],
          },
          {
            label: 'List',
            icon: 'pi pi-list',
            routerLink: ['/screen-list'],
          }
        ]
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        expanded: false,
        menus: [
          {
            label: 'Users',
            icon: 'pi pi-users',
            routerLink: ['/user-management'],
          },
          {
            label: 'Roles',
            icon: 'pi pi-lock',
            routerLink: ['/role-management'],
          }
        ]
      }
    ])
  }

  onToggleMenu(item: DrawerMenu, event: Event) {
    event.stopPropagation(); // Prevent the global click listener from triggering immediately

    if (item.menus) {
      const updatedItems = this.items().map(data => ({
        ...data,
        expanded: data.label === item.label ? !data.expanded : false
      }));
      this.items.set(updatedItems);
    } else if (item.routerLink) {
      this.router.navigate([item.routerLink]);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Close all expanded menus when clicking outside the drawer
    const updatedItems = this.items().map(data => ({
      ...data,
      expanded: false
    }));
    this.items.set(updatedItems);
  }
}

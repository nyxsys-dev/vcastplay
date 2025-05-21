import { Component, HostListener, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { DrawerMenu } from '../../core/interfaces/drawer-menu';
import { Router, RouterModule } from '@angular/router';
import { UtilityService } from '../../core/services/utility.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-drawer',
  imports: [ PrimengUiModule, RouterModule ],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  providers: [ MessageService, AuthService, ConfirmationService ]
})
export class DrawerComponent {

  router = inject(Router);
  utils = inject(UtilityService);
  auth = inject(AuthService);
  confirmation = inject(ConfirmationService);
  menuItems = signal<DrawerMenu[]>([]);
  
  ngOnInit() {    
    this.menuItems.set([
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Screen',
        icon: 'pi pi-desktop',
        expanded: false,
        items: [
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
        label: 'Assets',
        icon: 'pi pi-image',
        expanded: false,
        items: [
          {
            label: 'Upload',
            icon: 'pi pi-upload',
            routerLink: ['/asset-register'],
          },
          {
            label: 'List',
            icon: 'pi pi-list',
            routerLink: ['/asset-list'],
          }
        ]
      },
      {
        label: 'Playlist',
        icon: 'pi pi-list',
        expanded: false,
        items: [
          {
            label: 'Add Playlist',
            icon: 'pi pi-plus',
            routerLink: ['/playlist-register'],
          },
          {
            label: 'List',
            icon: 'pi pi-list',
            routerLink: ['/playlist-list'],
          }
        ]
      },
      {
        label: 'Layout',
        icon: 'pi pi-th-large',
        routerLink: '/dashboard'
      },
      {
        label: 'Schedules',
        icon: 'pi pi-calendar',
        expanded: false,
        items: [
          {
            label: 'Add Schedule',
            icon: 'pi pi-plus',
            routerLink: ['/schedule-register'],
          },
          {
            label: 'List',
            icon: 'pi pi-list',
            routerLink: ['/schedule-list'],
          }
        ]
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-bar',
        routerLink: '/dashboard'
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        expanded: false,
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user',
            routerLink: ['/settings/profile'],
          },
          {
            label: 'Users',
            icon: 'pi pi-users',
            routerLink: ['/settings/user-management'],
          },
          {
            label: 'Roles',
            icon: 'pi pi-lock',
            routerLink: ['/settings/role-management'],
          },
        ]
      }
    ])
  }

  onToggleMenu(menuItem: DrawerMenu, event: Event) {
    event.stopPropagation();
    const updatedItems = this.menuItems().map(data => ({ ...data, expanded: data.label === menuItem.label ? !data.expanded : false }));
    this.menuItems.set(updatedItems);
    
    if (menuItem.routerLink && !menuItem.items) this.onClickGotoPage(menuItem)
  }

  onClickLogout(event: Event | { originalEvent: Event }) {
    this.utils.drawerVisible.set(false);
    const actualEvent = (event as any).originalEvent || event;
    this.confirmation.confirm({
      target: actualEvent.currentTarget as EventTarget,
      message: 'Are you sure you want to log out?',
      closable: true,
      closeOnEscape: true,
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {
        this.auth.onLogout();
      },
    })
  }

  onClickGotoPage(subMenu: any) {
    const router = Array.isArray(subMenu.routerLink) ? subMenu.routerLink : [ subMenu.routerLink ] //isArray(subMenu.routerLink)
    this.router.navigate(router);    
    if (this.utils.drawerVisible()) this.utils.drawerVisible.set(!this.utils.drawerVisible());
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Close all expanded menus when clicking outside the drawer
    const updatedItems = this.menuItems().map(data => ({
      ...data,
      expanded: false
    }));
    this.menuItems.set(updatedItems);
  }
}

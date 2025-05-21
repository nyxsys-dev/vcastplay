import { computed, inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { DrawerMenu } from '../interfaces/drawer-menu';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  filterValues = signal<any>({});
  drawerVisible = signal<boolean>(false);
  tableSkeletonRows = Array(7).fill({});

  modules = signal<DrawerMenu[]>([
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
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
    { label: 'Layout', icon: 'pi pi-th-large', routerLink: '/dashboard' },
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
    { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
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
        {
          label: 'Modules',
          icon: 'pi pi-globe',
          routerLink: ['/settings/module-management'],
        },
      ]
    }
  ]);

  private breakPointObserver = inject(BreakpointObserver);
  readonly isMobile = toSignal(
    this.breakPointObserver.observe([ Breakpoints.Handset ]).pipe(
      map(result => Object.values(result.breakpoints).some(match => match))
    ),
    { initialValue: false }
  );
  
  readonly isTablet = toSignal(
    this.breakPointObserver.observe([ Breakpoints.Tablet ]).pipe(
      map(result => Object.values(result.breakpoints).some(match => match))
    ),
    { initialValue: false }
  );

  readonly isDesktop = toSignal(
    this.breakPointObserver.observe([ Breakpoints.Web ]).pipe(
      map(result => Object.values(result.breakpoints).some(match => match))
    ),
    { initialValue: false }
  );

  roles: any[] = [
    { label: 'Administrator', value: 'admin' },
    { label: 'User', value: 'user' },
    { label: 'Guest', value: 'guest' },
  ]

  colors: any[] = [
    { text: 'blue', hex: '#36A2EB', rgb: '54, 162, 235' },
    { text: 'red', hex: '#FF6384', rgb: '255, 99, 132' },
    { text: 'green', hex: '#4BC0C0', rgb: '75, 192, 192' },
    { text: 'orange', hex: '#FF9F40', rgb: '255, 159, 64' },
    { text: 'violet', hex: '#9966FF', rgb: '153, 102, 255' },
    { text: 'yellow', hex: '#FFCD56', rgb: '255, 205, 86' },
    { text: 'indigo', hex: '#3F51B5', rgb: '63, 81, 181' },
    { text: 'salmon', hex: '#FA8072', rgb: '250, 128, 114' },
    { text: 'periwinkle', hex: '#CCCCFF', rgb: '204, 204, 255' },
    { text: 'pink', hex: '#FFC0CB', rgb: '255, 192, 203' },
    { text: 'orchid', hex: '#DA70D6', rgb: '218, 112, 214' },
    { text: 'taupe', hex: '#483D3C', rgb: '72, 61, 60' },
  ]

  isEmpty(value: any) {
    return value === null || value === undefined || value === '' || Object.keys(value).length === 0 || !value;
  }

  constructor() { }

  getStatus(status: string) {
    switch (status) {
      case 'Active':
      case 'online':
        return 'success';
      case 'Inactive':
        return 'warn';
      case 'Suspended':
      case 'offline':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}

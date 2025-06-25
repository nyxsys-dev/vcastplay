import { computed, inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { DrawerMenu } from '../interfaces/drawer-menu';
import { PrimeNG } from 'primeng/config';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  filterValues = signal<any>({});
  drawerVisible = signal<boolean>(false);
  tableSkeletonRows = Array(5).fill({});

  modules = signal<DrawerMenu[]>([
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Screen', icon: 'pi pi-desktop', routerLink: '/screens/screen-registration' },
    { label: 'Assets', icon: 'pi pi-image', routerLink: '/assets/asset-library' },
    { label: 'Playlist', icon: 'pi pi-list', routerLink: '/playlist/playlist-library' },
    { label: 'Layout', icon: 'pi pi-th-large', routerLink: '/dashboard' },
    { label: 'Schedules', icon: 'pi pi-calendar', routerLink: '/schedule-list' },
    { label: 'Screen Mangement', icon: 'pi pi-cloud', routerLink: '/screens/screen-management' },
    { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      expanded: false,
      items: [
        { label: 'Profile', icon: 'pi pi-user', routerLink: ['/settings/profile'], },
        { label: 'Users', icon: 'pi pi-users', routerLink: ['/settings/user-management'], },
        { label: 'Roles', icon: 'pi pi-lock', routerLink: ['/settings/role-management'], },
        { label: 'Modules', icon: 'pi pi-globe', routerLink: ['/settings/module-management'], },
        { separator: true },
        { label: 'Audience Tag', icon: 'pi pi-users', routerLink: ['/settings/audience-tag'], },
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
  
  status: any[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
    { label: 'Suspended', value: 'suspended' }
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

  platForms: any[] = [
    { label: 'Web', value: 'web' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Desktop', value: 'desktop' },
  ]

  isEmpty(value: any) {
    return value === null || value === undefined || value === '' || Object.keys(value).length === 0 || !value;
  }

  genereteScreenCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }

  constructor(private config: PrimeNG) { }

  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes: any = this.config.translation.fileSizeTypes;    
    if (bytes == 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = !isNaN(parseFloat((bytes / Math.pow(k, i)).toFixed(dm))) ? parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) : 0;

    return `${formattedSize} ${sizes[i]}`;
  }

  timeConversion(ms: number, isReadable: boolean = false): string {
    const totalSeconds = Math.floor(ms);
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');

    if (!isReadable) return `${hrs}:${mins}:${secs}`;
    else return [ hrs ? `${hrs}h` : '', mins ? `${mins}m` : '', secs || (!hrs && !mins) ? `${secs}s` : '' ].filter(Boolean).join(' ');
  }

  getFormControl(formGroup: FormGroup, fieldName: string) {
    return formGroup.controls[fieldName];
  }

  getStatus(status: string) {
    switch (status) {
      case 'Approved':
      case 'Active':
      case 'online':
        return 'success';
      case 'Inactive':
        return 'warn';
      case 'Disapproved':
      case 'Suspended':
      case 'offline':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getIcon(status: string) {
    switch (status) {
      case 'Approved':
      case 'Active':
      case 'online':
        return 'pi-check-circle';
      case 'Inactive':
        return 'pi-pause-circle';
      case 'Disapproved':
      case 'Suspended':
      case 'offline':
        return 'pi-times-circle';
      default:
        return 'pi-question-circle';
    }
  }
}

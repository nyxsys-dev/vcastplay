import { computed, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Screen } from '../interfaces/screen';
import { SelectOption } from '../interfaces/general';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  isEditMode = signal<boolean>(false);

  private screenSignal = signal<Screen[]>([]);
  screens = computed(() => this.screenSignal());

  loadingSignal = signal<boolean>(false);
  loadingAddressSignal = signal<boolean>(false);

  showDownload = signal<boolean>(false);
  toggleControls = signal<boolean>(false);

  selectedScreen = signal<Screen | null>(null);
  selectMultipleScreen = signal<Screen[]>([]);
  
  rows = signal<number>(8);
  totalRecords = signal<number>(0);

  types = signal<SelectOption[]>([
    { label: 'Desktop', value: 'desktop' },
    { label: 'Android', value: 'android' },
    // { label: 'Web', value: 'web' },
  ]);

  screenStatus = signal<SelectOption[]>([
    { label: 'Playing', value: 'playing' },
    { label: 'Standby', value: 'Standby' },
    { label: 'Disconnected', value: 'disconnected' },
  ]);
  
  contentStatus = signal<SelectOption[]>([
    { label: 'Approved', value: 'approved' },
    { label: 'Disapproved', value: 'disapproved' },
    { label: 'Pending', value: 'pending' },
  ])

  locations = signal<SelectOption[]>([
    { label: 'Local', value: 'local' },
    { label: 'Global', value: 'global' },
    { label: 'National', value: 'national' },
    { label: 'International', value: 'iInternational' },
    { label: 'Regional', value: 'regional' },
  ]);

  landmarks = signal<SelectOption[]>([
    { label: 'Mountains', value: 'mountains' },
    { label: 'Rivers', value: 'rivers' },
    { label: 'Ancient Ruins', value: 'ancient Ruins' },
    { label: 'Castles', value: 'castles' },
    { label: 'Skyscrapers', value: 'skyscrapers' },
  ]);

  screenForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    code: new FormControl(null),
    name: new FormControl(null, [ Validators.required ]),
    type: new FormControl(null, [ Validators.required ]),
    address: new FormGroup({
      country: new FormControl('Philippines', [ Validators.required ]),
      region: new FormControl(null),
      city: new FormControl(null),
      fullAddress: new FormControl(null),
      latitude: new FormControl(0, { nonNullable: true }),
      longitude: new FormControl(0, { nonNullable: true }),
      zipCode: new FormControl(null),
    }),
    group: new FormControl(null, [ Validators.required ]),
    subGroup: new FormControl(null, [ Validators.required ]),
    displaySettings: new FormGroup({
      orientation: new FormControl(null, [ Validators.required ]),
      resolution: new FormControl(null, [ Validators.required ]),
    }),
    operation: new FormGroup({
      alwaysOn: new FormControl(false),
      weekdays: new FormControl([], { nonNullable: true }),
      hours: new FormControl([], { nonNullable: true }),
    }),
    geograhic: new FormGroup({
      locations: new FormControl(null, [ Validators.required ]),
      landmarks: new FormControl(null, [ Validators.required ]),
    }),
    tags: new FormControl([], { nonNullable: true }),
    screenStatus: new FormControl(null),
    displayStatus: new FormControl(null),
    registeredOn: new FormControl(null),
  });

  screenFilterForm: FormGroup = new FormGroup({
    dateRange: new FormControl(null),
    type: new FormControl(null),
    group: new FormControl(null),
    subGroup: new FormControl(null),
    orientation: new FormControl(null),
    status: new FormControl(null),
    location: new FormControl(null),
    screenStatus: new FormControl(null),
    contentStatus: new FormControl(null),
    keywords: new FormControl(null),
  });

  tagControl: FormControl = new FormControl(null);

  onLoadScreens() {
    /**Call GET roles API */
    this.screenSignal.set([
      { 
        id: 1,
        code: 'NYX001',
        name: 'PLAYER-NYX001',
        type: 'desktop',
        address: {
          country: 'Philippines',
          region: 'Manila',
          city: 'Quezon City',
          fullAddress: `Secret of God’s Child Learning Center, Inc., 176 12th Avenue corner Rosal Street,, A. Luna Street, Balong-Bato, San Juan, 1st District, Eastern Manila District, Metro Manila, 1132, Philippines`,
          latitude: 14.6091,
          longitude: 121.0223,
          zipCode: '1100'
        },
        displaySettings: {
          orientation: 'landscape',
          resolution: '1920x1080'
        },
        status: 'inactive',
        screenStatus: 'standby',
        displayStatus: 'on',
        createdOn: new Date('2024-01-01'),
        updatedOn: new Date('2024-02-01'),
      },
      { 
        id: 2,
        code: 'NYX002',
        name: 'PLAYER-NYX002',
        type: 'android',
        address: {
          country: 'Philippines',
          region: 'Manila',
          city: 'Mandaluyong',
          fullAddress: '',
          latitude: 14.7611,
          longitude: 121.2023,
          zipCode: '1100'
        },
        displaySettings: {
          orientation: 'portrait',
          resolution: '757x1062'
        },
        status: 'inactive',
        screenStatus: 'standby',
        displayStatus: 'on',
        createdOn: new Date('2024-01-01'),
        updatedOn: new Date('2024-02-01'),
      },
    ]);
    this.totalRecords.set(this.screens().length);
  }

  onGetScreens() {
    if (this.screens().length === 0) this.onLoadScreens();
    return this.screens();
  }

  onGetScreenByCode(code: string) {
    /**Call GET screen by code or id API */
    return new Promise((resolve, reject) => {
      const screen = this.screens().find(s => s.code === code);
      if (screen) resolve(screen);
    })
  }

  onRefreshScreens() {
    this.screenSignal.set([]);
    this.onLoadScreens();
  }

  onRemoveTag(tag: string) {
    const tempData = this.tags?.value || [];
    this.tags?.setValue(tempData.filter((t: any) => t !== tag));
  }

  onSaveScreen(screen: Screen) {
    /**Call POST/PATCH role API */
    const tempScreens = this.screens();
    const { id, code, status, ...info } = screen;
    const index = tempScreens.findIndex(s => s.id === id);
    if (index !== -1) tempScreens[index] = { ...tempScreens[index], ...info, status: 'active', registeredOn: new Date(), updatedOn: new Date() };
    else tempScreens.push({ id: tempScreens.length + 1, code: `NYX00${tempScreens.length + 1}`, status: 'inactive', ...info, createdOn: new Date(), updatedOn: new Date() });

    this.screenSignal.set([...tempScreens]);

    this.totalRecords.set(this.screens().length);
  }

  onDeleteScreen(screen: Screen) {
    /**Call DELETE role API */
    const tempScreens = this.screens().filter(s => s.id !== screen.id);
    this.screenSignal.set([...tempScreens]);

    this.totalRecords.set(this.screens().length);
  }

  get tags() { return this.screenForm.get('tags'); }
}

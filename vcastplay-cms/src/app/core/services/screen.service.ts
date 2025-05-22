import { computed, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  private screenSignal = signal<Screen[]>([]);
  screens = computed(() => this.screenSignal());

  loadingSignal = signal<boolean>(false);

  screenForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl(''),
    type: new FormControl(''),
    group: new FormControl(''),
    subGroup: new FormControl(''),
    displaySettings: new FormGroup({
      orientation: new FormControl(''),
      resolution: new FormControl(''),
    }),
    schedule: new FormControl(''),
    geographicalLocation: new FormGroup({
      location: new FormControl(''),
      landmark: new FormControl(''),
    }),
    caltonDatxSerialNo: new FormControl(''),
    status: new FormControl(''),
  });

  selectedScreen = signal<Screen | null>(null);

  constructor() { }

  onLoadScreens() {
    /**Call GET roles API */
  }

  onGetScreens() {
    if (this.screenSignal().length === 0) this.onLoadScreens();
    return this.screenSignal();
  }

  onRefreshScreens() {
    this.screenSignal.set([]);
    this.onLoadScreens();
  }

  onSaveScreen(screen: Screen) {
    /**Call POST/PATCH role API */
  }

  onDeleteScreen(screen: Screen) {
    /**Call DELETE role API */
  }
}

import { computed, Injectable, signal } from '@angular/core';
import { ScreenMessage } from '../interfaces/screen';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private messageSignal = signal<ScreenMessage[]>([]);
  messages = computed(() => this.messageSignal());

  isEditMode = signal<boolean>(false);
  loadingSignal = signal<boolean>(false);

  broadCastMessage: FormGroup = new FormGroup({
    id: new FormControl(0, { nonNullable: true }),

  });

  constructor() { }
}

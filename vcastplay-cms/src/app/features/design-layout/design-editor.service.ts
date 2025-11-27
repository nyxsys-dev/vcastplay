import { Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Assets } from '../assets/assets';
import { DesignLayout, LayerItem } from './design-layout';
import { ApprovedInfo } from '../../core/interfaces/general';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DesignEditorService {

  designForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    name: new FormControl(null, [ Validators.required ]),
    description: new FormControl(null, [ Validators.required ]),
    type: new FormControl<string>('design', { nonNullable: true }),
    layers: new FormControl<LayerItem[]>([], { nonNullable: true , validators: [ Validators.required ] }),
    thumbnail: new FormControl<string | null>(null),
    duration: new FormControl<number>(0),
    color: new FormControl<string | null>(null),
    status: new FormControl<string | null>(null),
    approvedInfo: new FormControl<ApprovedInfo | null>(null),
    isActive: new FormControl<boolean>(false),
    screen: new FormControl<Screen | null>(null, [ Validators.required ]),
    contentId: new FormControl<any | null>(null),
    createdOn: new FormControl<Date>(moment().toDate()),
    updatedOn: new FormControl<Date>(moment().toDate()),
  });

  selectedObject: FormGroup = new FormGroup({
    left: new FormControl<number>(0),
    top: new FormControl<number>(0),
    width: new FormControl<number>(0),
    height: new FormControl<number>(0),
    rotation: new FormControl<number>(0),
  })

  menuBarItems: MenuItem[] = [
    { 
      label: 'File',
      items: [
        { label: 'New', command: () => this.showCanvasSize.set(true) },
        { label: 'Open' },
        { label: 'Save' }
      ]
    }
  ]

  showCanvasSize = signal<boolean>(false);

  constructor() { }
}

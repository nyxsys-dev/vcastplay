import { Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import EXIF from 'exif-js'
import { Assets } from '../interfaces/assets';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  selectedAsset = signal<Assets | null>(null);
  assetForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl(''),
    type: new FormControl(''),
    file: new FormControl(null),
    category: new FormControl(''),
    subCategory: new FormControl(''),
    fileDetails: new FormGroup({
      orientation: new FormControl(''),
      resolution: new FormControl(''),
      size: new FormControl(''),
      type: new FormControl(''),
    }),
    audienceTag: new FormControl(''),
    availability: new FormControl(''),
    dateRange: new FormGroup({
      start: new FormControl(''),
      end: new FormControl(''),
    }),
    hours: new FormControl([], [ Validators.required ]),
  })

  constructor() { }

  getImageOrientationAndResolution(file: File): Promise<{ width: number, height: number, orientation: number }> {
    return new Promise((resolve, reject) => {
      const img: any = new Image();
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (!e.target || !e.target.result) {
          reject(new Error('Failed to read file'));
          return;
        }

        img.onload = () => {
          EXIF.getData(img, () => {
            const orientation = EXIF.getTag(img, 'Orientation');
            resolve({
              width: img.width,
              height: img.height,
              orientation
            })
          })
        };
        
        img.onerror = reject;
        img.src = e.target.result as string;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    })
  }
}

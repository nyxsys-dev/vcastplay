import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { UtilityService } from '../../../core/services/utility.service';
import { AssetsService } from '../../../core/services/assets.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ActivatedRoute, Router } from '@angular/router';
import { WEEKDAYS } from '../../../core/interfaces/general';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-asset-details',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class AssetDetailsComponent {

  pageInfo: MenuItem = [ {label: 'Asset Library'}, {label: 'Lists', routerLink: '/assets/asset-library'}, {label: 'Details'} ];

  utils = inject(UtilityService);
  assetService = inject(AssetsService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  files: any[] = [];
  totalSize : number = 0;
  totalSizePercent : number = 0;

  previewUrl = signal<string>('');
  currentFileType = signal<string>('image');

  weekdays: string[] = WEEKDAYS;

  showLinkInput = () => {
    const type = this.assetForm.get('type')?.value;
    return [ 'web', 'widget' ].includes(type);
  }

  constructor() {
    this.type?.valueChanges.subscribe(value => {
      this.currentFileType.set(value);
      this.assetForm.patchValue({
        link: '',
        file: null
      })
    });
  }
  
  ngOnInit() {
    // Get screen code from url
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      const assetData: any = this.assetService.selectedAsset();
      if (assetData) {      
        this.assetForm.patchValue(assetData);
      }
    } 
  }
  
  onRemoveTemplatingFile(event: any, file: File, removeFileCallback: any, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.utils.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearFiles() {
    this.assetForm.reset();
  }

  onFileSelected(event: Event): void {
    const maxSizeBytes = 300 * 1024 * 1024; // 300MB
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    if (file.size > maxSizeBytes) {
      this.message.add({ severity: 'error', summary: 'Error', detail: 'File size exceeds the maximum limit of 300MB.' });
      return;
    }

    if (['image', 'video', 'audio'].includes(this.type?.value)) {
      this.assetForm.patchValue({ name: file.name });
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      this.assetService.getImageOrientationAndResolution(file).then((res) => {      
        const type = this.type?.value;
        switch (type) {
          case 'video':
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
              URL.revokeObjectURL(video.src);
              const durationInSeconds = video.duration;             

              this.assetForm.patchValue({
                name: res.name,
                link: reader.result as string,
                file,
                fileDetails: {
                  size: res.size,
                  type: res.type,
                  orientation: res.orientation,
                  resolution: `${res.resolution.width} x ${res.resolution.height}`,
                },
                duration: Math.max(Math.floor(durationInSeconds), 1),
              });
            };

              video.src = URL.createObjectURL(file);
            break;
          default:
            this.assetForm.patchValue({
              name: res.name,
              link: reader.result as string,
              file,
              fileDetails: {
                size: res.size,
                type: res.type,
                orientation: res.orientation,
                resolution: `${res.resolution.width} x ${res.resolution.height}`
              }
            })
            break;
        }
      });
    };
    reader.readAsDataURL(file);
  }

  onClickUpload(input: any) {
    this.message.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onClickSave(event: Event) {    
    if (this.assetForm.invalid) {
      this.assetForm.markAllAsTouched();
      this.message.add({ severity: 'error', summary: 'Error', detail: 'Please input required fields (*)' });
      return;
    }

    this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to save changes?',
      closable: true,
      closeOnEscape: true,
      header: 'Confirm Save',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.assetService.onSaveAssets(this.assetForm.value)
        this.message.add({ severity:'success', summary: 'Success', detail: 'Assets upload successfully!' });
        this.selectedAsset.set(null);
        this.assetForm.reset();
        this.router.navigate([ '/assets/asset-library' ]);
      },
    })
  }
  
  onClickCancel() {
    this.selectedAsset.set(null);
    this.assetForm.reset();
    this.router.navigate([ '/assets/asset-library' ]);
  }

  formControl(fieldName: string) {
    return this.utils.getFormControl(this.assetForm, fieldName);
  }

  get selectedAsset() {
    return this.assetService.selectedAsset;
  }

  get assetForm() {
    return this.assetService.assetForm;
  }

  get fileDetails() {
    return this.assetForm.get('fileDetails');
  }

  get assetTypes() {
    return this.assetService.assetType;
  }

  get type() {
    return this.assetForm.get('type');
  }

  get availability(): FormArray {
    return this.assetForm.get('availability') as FormArray;
  }

}

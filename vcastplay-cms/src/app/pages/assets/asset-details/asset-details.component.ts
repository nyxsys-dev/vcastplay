import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { AssetScheduleComponent } from '../asset-schedule/asset-schedule.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UtilityService } from '../../../core/services/utility.service';
import { AssetsService } from '../../../core/services/assets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-asset-details',
  imports: [ PrimengUiModule, ComponentsModule, AssetScheduleComponent ],
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

  isShowSchedule = signal<boolean>(false);
  isShowInfo = signal<boolean>(false);

  showLinkInput = () => {
    const type = this.assetTypeControl.value;
    return [ 'web', 'widget' ].includes(type);
  }

  constructor() {
    this.assetTypeControl.enable();

    // Get screen code from url
    const code = this.route.snapshot.paramMap.get('code');    
    if (code) {
      const assetData: any = this.assetService.selectedAsset();      
      if (assetData) {      
        this.assetForm.patchValue(assetData);
        this.assetTypeControl.disable();
      }
    }
  }
  
  ngOnInit() { }

  onChangeType(event: any) {
    const type = event.value;
    if (['web', 'widget'].includes(type)) {
      this.assetForm.patchValue({ type })
    } else {
      this.assetForm.reset();
    }
  }

  onFileSelected(event: Event): void {
    const maxSizeBytes = 300 * 1024 * 1024; // 300MB
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    this.formControl('duration').enable();
    
    if (file.size > maxSizeBytes) {
      this.message.add({ severity: 'error', summary: 'Error', detail: 'File size exceeds the maximum limit of 300MB.' });
      return;
    }

    if (['file'].includes(this.assetTypeControl.value)) {
      this.assetForm.patchValue({ name: file.name });
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.assetService.getImageOrientationAndResolution(file).then((res) => {      
        const type = file.type.split('/')[0];        
        switch (type) {
          case 'video':
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = URL.createObjectURL(file);

            video.onloadedmetadata = () => {
              video.currentTime = 1;
              
              video.onseeked = () => {
                setTimeout(() => {
                  const canvas = document.createElement('canvas');
                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;

                  const ctx = canvas.getContext('2d');
                  const thumbnail = ctx ? (() => {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    return canvas.toDataURL('image/png');
                  })() : '';

                  URL.revokeObjectURL(video.src);
                  
                  this.assetForm.patchValue({
                    name: res.name,
                    link: reader.result as string,
                    type,
                    fileDetails: {
                      name: res.name,
                      size: res.size,
                      type: res.type,
                      orientation: res.orientation,
                      resolution: {
                        width: res.resolution.width,
                        height: res.resolution.height,
                      },
                      thumbnail,
                    },
                    duration: Math.floor(video.duration),
                  });                  
                }, 100);
              };
            };
            break;
          default:
            this.assetForm.patchValue({
              name: res.name,
              link: reader.result as string,
              type,
              fileDetails: {
                name: res.name,
                size: res.size,
                type: res.type,
                orientation: res.orientation,
                resolution: { width: res.resolution.width, height: res.resolution.height },
                thumbnail: reader.result as string
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
        this.assetService.onSaveAssets(this.assetForm.value);
        this.message.add({ severity:'success', summary: 'Success', detail: 'Assets upload successfully!' });
        this.selectedAsset.set(null);
        this.assetForm.reset();
        this.isEditMode.set(false);
        this.router.navigate([ '/assets/asset-library' ]);
      },
    })
  }
  
  onClickCancel() {
    this.selectedAsset.set(null);
    this.assetForm.reset();
    this.router.navigate([ '/assets/asset-library' ]);
  }

  onClickCloseSchedule() {    
    this.isShowSchedule.set(false);
  }

  formControl(fieldName: string) {
    return this.utils.getFormControl(this.assetForm, fieldName);
  }

  get isEditMode() {
    return this.assetService.isEditMode;
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

  get assetTypeControl() {
    return this.assetService.assetTypeControl;
  }

  get type() {
    return this.assetForm.get('type');
  }

  get availability(): FormArray {
    return this.assetForm.get('availability') as FormArray;
  }

}

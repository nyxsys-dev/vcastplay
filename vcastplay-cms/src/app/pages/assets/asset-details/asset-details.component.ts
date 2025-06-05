import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { UtilityService } from '../../../core/services/utility.service';
import { AssetsService } from '../../../core/services/assets.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { Router } from '@angular/router';

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
  router = inject(Router);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  
  files: any[] = [];
  totalSize : number = 0;
  totalSizePercent : number = 0;

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.files.forEach((file: any) => {
      file = Object.assign(file, { objectURL: URL.createObjectURL(file) });
      this.totalSize += parseInt(this.utils.formatSize(file.size));
    });   

    this.assetService.getImageOrientationAndResolution(this.files[0]).then((res) => {      
      this.assetForm.patchValue({
        name: res.name,
        file: this.files[0],
        fileDetails: {
          size: res.size,
          type: res.type,
          orientation: res.orientation,
          resolution: `${res.resolution.width} x ${res.resolution.height}`
        }
      })
    });
  }
  
  onRemoveTemplatingFile(event: any, file: File, removeFileCallback: any, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.utils.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearFiles() {
    this.assetForm.reset();
  }

  onClickUpload() {
    this.message.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onClickSave(event: Event) {
    console.log(this.assetForm.value);
    
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

}

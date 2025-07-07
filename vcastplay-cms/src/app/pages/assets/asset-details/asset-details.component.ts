import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UtilityService } from '../../../core/services/utility.service';
import { AssetsService } from '../../../core/services/assets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-asset-details',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class AssetDetailsComponent {

  pageInfo: MenuItem = [ {label: 'Asset Library'}, {label: 'Lists', routerLink: '/assets/asset-library'}, {label: 'Details'} ];
  fileSettingItems: MenuItem[] = [
    { 
      label: 'Options', 
      items: [ 
        { label: 'Schedule', icon: 'pi pi-calendar', command: () => this.isShowSchedule.set(!this.isShowSchedule()) }, 
        { label: 'Audience Tag', icon: 'pi pi-users', command: () => this.isShowAudienceTag.set(!this.isShowAudienceTag()) }, 
      ] 
    }
  ]

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
  isShowAudienceTag = signal<boolean>(false);
  isShowInfo = signal<boolean>(false);

  showLinkInput = () => {
    const type = this.assetTypeControl.value;
    return [ 'web', 'widget' ].includes(type);
  }

  constructor() { }
  
  ngOnInit() { 
    if (!this.isEditMode()) this.assetTypeControl.enable();
    const type = this.formControl('type').value;
    this.assetTypeControl.patchValue([ 'web', 'widget' ].includes(type) ? type : 'file');
  }

  ngOnDestroy() {
    this.onClickCancel();
  }

  onChangeType(event: any) {
    const type = event.value;
    if (['web', 'widget'].includes(type)) {
      this.formFileDetails('orientation').enable();
      this.assetForm.patchValue({ type, name: null, link: null })
    } else {
      this.formFileDetails('orientation').disable();
      this.assetForm.reset();
    }
  }
  
  async onDropFile(event: DragEvent) {
    event.preventDefault();
    if (this.showLinkInput()) return;
    const files = Array.from(event.dataTransfer?.files || []);    

    const file = files[0];
    const result = await this.assetService.processFile(file);
    if (result) {
      this.assetForm.patchValue(result);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  async onFileSelected(event: Event) {
    const MAX_SIZE = 300 * 1024 * 1024; // 300MB
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      this.message.add({ severity: 'error', summary: 'Error', detail: 'File size should be less than 300MB' });
      return;
    }
    
    const result = await this.assetService.processFile(file);
    if (result) {
      this.assetForm.patchValue(result);
    }
    
  }

  async onClickSave(event: Event) {
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
      icon: 'pi pi-question-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.message.add({ severity: 'success', summary: 'Success', detail: 'Assets upload successfully!' });
        this.assetService.onSaveAssets(this.assetForm.value);
        this.selectedAsset.set(null);
        this.assetForm.reset();
        this.assetTypeControl.reset();
        this.isEditMode.set(false);
        this.router.navigate(['/assets/asset-library']);
      },
    });
  }

  onClickDelete(item: any, event: Event) {
    this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this asset?',
      closable: true,
      closeOnEscape: true,
      header: 'Danger Zone',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.assetService.onDeleteAssets(item);
        this.message.add({ severity:'success', summary: 'Success', detail: 'User deleted successfully!' });
        this.selectedAsset.set(null);
        this.assetForm.reset();
        this.router.navigate([ '/assets/asset-library' ]);
      },
      reject: () => { }
    })
  }
  
  onClickCancel() {
    this.selectedAsset.set(null);
    this.assetForm.reset();
    this.isEditMode.set(false);
    this.router.navigate([ '/assets/asset-library' ]);
  }

  onClickCloseSchedule() {
    const isAvailable = this.availability?.value;
    const dateRange = this.dateRange;
    const weekdays = this.weekdays?.value;
    const hours = this.hours?.value;
    if (isAvailable) {
      if (dateRange?.errors?.['startAfterEnd'] || weekdays.length === 0 || hours.length === 0) {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'Please input required fields (*)' });
        return;
      }
    } 
    this.isShowSchedule.set(false);
  }

  onClickCloseAudienceTag() {
    this.isShowAudienceTag.set(false);
  }

  formControl(fieldName: string) {
    return this.utils.getFormControl(this.assetForm, fieldName);
  }

  formFileDetails(fieldName: string) {
    return this.formControl('fileDetails').get(fieldName) as FormGroup;
  }

  get isEditMode() { return this.assetService.isEditMode; }
  get selectedAsset() { return this.assetService.selectedAsset; }
  get assetForm() { return this.assetService.assetForm; }
  get assetTypes() { return this.assetService.assetType; }
  get assetTypeControl() { return this.assetService.assetTypeControl; }
  get fileDetails() { return this.assetForm.get('fileDetails'); }
  get type() { return this.assetForm.get('type'); }
  get availability() { return this.assetForm.get('availability'); }
  get dateRange() { return this.assetForm.get('dateRange'); }
  get weekdays() { return this.assetForm.get('weekdays'); }
  get hours() { return this.assetForm.get('hours'); }
  get orientations() { return this.utils.orientations; }

}

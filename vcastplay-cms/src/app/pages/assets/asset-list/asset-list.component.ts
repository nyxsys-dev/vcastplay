import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { UtilityService } from '../../../core/services/utility.service';
import { AssetsService } from '../../../core/services/assets.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Assets } from '../../../core/interfaces/assets';
import { AssetListItemComponent } from '../asset-list-item/asset-list-item.component';
import { PreviewContentComponent } from '../../../components/preview-content/preview-content.component';

@Component({
  selector: 'app-asset-list',
  imports: [ PrimengUiModule, ComponentsModule, AssetListItemComponent, PreviewContentComponent ],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class AssetListComponent {

  pageInfo: MenuItem = [ { label: 'Asset Library' }, { label: 'Lists' } ];
  actionItems: MenuItem[] = [
    { 
      label: 'Options',
      items: [
        { label: 'Preview', icon: 'pi pi-eye', command: ($event: any) => this.onClickPreview(this.selectedAsset()) },
        { label: 'Duplicate', icon: 'pi pi-copy', command: ($event: any) => this.onClickDuplicate(this.selectedAsset(), $event) },
        { label: 'Add to Playlist', icon: 'pi pi-users', command: ($event: any) => this.onClickAddToPlaylist(this.selectedAsset(), $event) },
        { label: 'Delete', icon: 'pi pi-trash', command: ($event: any) => this.onClickDelete(this.selectedAsset(), $event) }
      ]
    }
  ];

  assetService = inject(AssetsService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);

  isShowPreview = signal<boolean>(false);
  
  filteredAssets = computed(() => {
    return this.assetService.assets();
  });
  
  rows: number = 8;
  totalRecords: number = 0;

  constructor() {
    this.assetViewModeCtrl.valueChanges.subscribe(value => this.assetViewModeSignal.set(value));
  }

  ngOnInit() {
    this.assetService.onGetAssets();
    this.totalRecords = this.assetService.assets().length;
  }

  onClickAddNew() {
    this.isEditMode.set(false);
    this.router.navigate([ '/assets/asset-details' ]);
  }

  onClickEdit(asset: Assets) {
    this.isEditMode.set(true);
    this.selectedAsset.set(asset);    
    this.router.navigate([ '/assets/asset-details', asset.code ]);
  }

  onClickDuplicate(item: any, event: Event) {
    this.message.add({ severity:'success', summary: 'Success', detail: 'Asset duplicated successfully!' });
    this.selectedAsset.set(null);
  }

  onClickAddToPlaylist(item: any, event: Event) {
    this.message.add({ severity:'success', summary: 'Success', detail: 'Asset added to playlist successfully!' });
    this.selectedAsset.set(null);
  }

  onClickDelete(item: any, event: Event) {
    this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this user?',
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
      },
      reject: () => { }
    })
  }

  onClickRefresh() { }

  onClickPreview(item: any) {
    this.selectedAsset.set(item);
    this.isShowPreview.set(!this.isShowPreview());
  }

  onClickOpenOptions(event: Event, item: any, menu: any) {
    this.selectedAsset.set(item);
    menu.toggle(event);
  }

  get isMobile() {
    return this.utils.isMobile();
  }

  get isTablet() {
    return this.utils.isTablet();
  }

  get isEditMode() {
    return this.assetService.isEditMode;
  }

  get selectedAsset() {
    return this.assetService.selectedAsset;
  }

  get assetViewModes() {
    return this.assetService.assetViewModes;
  }

  get assetViewModeCtrl() {
    return this.assetService.assetViewModeCtrl;
  }

  get assetViewModeSignal() {
    return this.assetService.assetViewModeSignal;
  }
}

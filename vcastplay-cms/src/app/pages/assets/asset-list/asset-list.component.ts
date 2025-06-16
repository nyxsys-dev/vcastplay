import { Component, computed, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { UtilityService } from '../../../core/services/utility.service';
import { AssetsService } from '../../../core/services/assets.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Assets } from '../../../core/interfaces/assets';

@Component({
  selector: 'app-asset-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class AssetListComponent {

  pageInfo: MenuItem = [ { label: 'Asset Library' }, { label: 'Lists' } ];

  assetService = inject(AssetsService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);
  
  filteredAssets = computed(() => {
    return this.assetService.assets();
  });
  
  rows: number = 8;
  totalRecords: number = 0;

  onClickAddNew() {
    this.router.navigate([ '/assets/asset-details' ]);
  }

  ngOnInit() {
    this.assetService.onGetAssets();
    this.totalRecords = this.assetService.assets().length;
  }

  onClickEdit(asset: Assets) {
    // this.isEditMode.set(true);
    this.selectedAsset.set(asset);
    this.router.navigate([ '/assets/asset-details', asset.code ]);
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
      },
      reject: () => { }
    })
  }

  onClickRefresh() { }

  get selectedAsset() {
    return this.assetService.selectedAsset;
  }

  get isMobile() {
    return this.utils.isMobile();
  }
}

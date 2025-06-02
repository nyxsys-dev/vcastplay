import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { UtilityService } from '../../../core/services/utility.service';
import { AssetsService } from '../../../core/services/assets.service';
import { MenuItem } from 'primeng/api';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-details',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss'
})
export class AssetDetailsComponent {

  pageInfo: MenuItem = [ {label: 'Asset Library'}, {label: 'Lists', routerLink: '/assets/asset-library'}, {label: 'Details'} ];

  utils = inject(UtilityService);
  assetService = inject(AssetsService);
  router = inject(Router);

  
  onClickCancel() {
    this.selectedAsset.set(null);
    this.assetForm.reset();
    this.router.navigate([ '/assets/asset-library' ]);
  }

  get selectedAsset() {
    return this.assetService.selectedAsset;
  }

  get assetForm() {
    return this.assetService.assetForm;
  }

}

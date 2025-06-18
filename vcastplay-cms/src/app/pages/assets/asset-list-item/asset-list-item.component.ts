import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { CdkDragPlaceholder, CdkDragPreview } from '@angular/cdk/drag-drop';
import { AssetsService } from '../../../core/services/assets.service';
import { PreviewContentComponent } from '../../../components/preview-content/preview-content.component';

@Component({
  selector: 'app-asset-list-item',
  imports: [ PrimengUiModule, CommonModule, CdkDragPlaceholder, CdkDragPreview, PreviewContentComponent ],
  templateUrl: './asset-list-item.component.html',
  styleUrl: './asset-list-item.component.scss'
})
export class AssetListItemComponent {

  @Input() asset: any;
  @Input() disableDrag: boolean = false;

  assetService = inject(AssetsService);

  get assetViewModeSignal() {
    return this.assetService.assetViewModeSignal;
  }
}

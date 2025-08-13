import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, TemplateRef } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { CdkDragPlaceholder, CdkDragPreview } from '@angular/cdk/drag-drop';
import { AssetsService } from '../../../core/services/assets.service';
import { PreviewContentComponent } from '../../../components/preview-content/preview-content.component';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-asset-list-item',
  imports: [ PrimengUiModule, CommonModule, CdkDragPlaceholder, CdkDragPreview, PreviewContentComponent ],
  templateUrl: './asset-list-item.component.html',
  styleUrl: './asset-list-item.component.scss'
})
export class AssetListItemComponent {

  @Input() asset: any;
  @Input() customCSS: string = 'h-full';
  @Input() showDetails: boolean = true;
  @Input() disableDrag: boolean = false;
  @Input() showOptions: boolean = false;
  @Input() actionBtn!: TemplateRef<any>;

  assetService = inject(AssetsService);
  utils = inject(UtilityService);

  showDrawer = signal<boolean>(false);

  get assetViewModeSignal() {
    return this.assetService.assetViewModeSignal;
  }
}

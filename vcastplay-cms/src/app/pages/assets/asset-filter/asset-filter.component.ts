import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { AssetsService } from '../../../core/services/assets.service';
import { UtilityService } from '../../../core/services/utility.service';
import { AudienceTagFiltersComponent } from '../../../components/audience-tag-filters/audience-tag-filters.component';
import { AudienceTagService } from '../../../core/services/audience-tag.service';

@Component({
  selector: 'app-asset-filter',
  imports: [ PrimengUiModule, AudienceTagFiltersComponent ],
  templateUrl: './asset-filter.component.html',
  styleUrl: './asset-filter.component.scss'
})
export class AssetFilterComponent {

  @Output() filterChange = new EventEmitter<any>();

  utils = inject(UtilityService);
  assetService = inject(AssetsService);
  audienceTagService = inject(AudienceTagService);

  isShowAudienceTag = signal<boolean>(false);

  constructor() {
    this.keywords?.valueChanges.subscribe(value => {
      console.log(value);
      
    });
  }

  onClickApply(filter: any) {
    const filters = this.assetFilterForm.value;
    const audienceTag = this.audienceTagForm.value.audienceTag;  
    this.filterChange.emit({ filters, audienceTag });
    filter.hide();
  }

  onClickClear(filter: any) {
    this.assetFilterForm.reset();
    this.audienceTagForm.reset();
    this.filterChange.emit({ filters: this.assetFilterForm.value, audienceTag: this.audienceTagForm.value.audienceTag });
    filter.hide();
  }

  onClickCloseAudienceTag() {
    this.isShowAudienceTag.set(false);
  }

  onClickApplyAudienceTag() {
    const filters = this.assetFilterForm.value;
    const audienceTag = this.audienceTagForm.value.audienceTag;  
    this.isShowAudienceTag.set(false);
    this.filterChange.emit({ filters, audienceTag });
  }

  get keywords() { return this.assetFilterForm.get('keyword'); }
  
  get categories() { return this.assetService.filterCategory; }
  get subCategories() { return this.assetService.filterSubCategory; }
  get assetFilterForm() { return this.assetService.assetFilterForm; }

  get fileTypes() { return this.utils.fileTypes; }
  get orientations() { return this.utils.orientations; }
  
  get audienceTagForm() { return this.audienceTagService.audienceTagForm; }
}

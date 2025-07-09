import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { AssetsService } from '../../../core/services/assets.service';
import { UtilityService } from '../../../core/services/utility.service';
import { AudienceTagFiltersComponent } from '../../../components/audience-tag-filters/audience-tag-filters.component';
import { TagService } from '../../../core/services/tag.service';

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
  tagService = inject(TagService);

  isShowAudienceTag = signal<boolean>(false);

  useFilter = signal<boolean>(false);

  filterCategory = computed(() => {
    return this.tagsLists().find(tag => tag.id.includes('categories')).data();
  })

  filterSubCategory = computed(() => {
    return this.tagsLists().find(tag => tag.id.includes('subCategories')).data();
  })

  onClickApply(filter: any) {
    const filters = this.assetFilterForm.value;
    const audienceTag = this.audienceTagForm.value.audienceTag;  
    this.filterChange.emit({ filters, audienceTag });
    this.useFilter.set(true);
    filter.hide();
  }

  onClickClear(filter: any) {
    this.assetFilterForm.reset();
    this.audienceTagForm.reset();
    this.filterChange.emit({ filters: this.assetFilterForm.value, audienceTag: {} });
    this.useFilter.set(false);
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
  
  get assetFilterForm() { return this.assetService.assetFilterForm; }

  get fileTypes() { return this.utils.fileTypes; }
  get orientations() { return this.utils.orientations; }
  
  get tagsLists() { return this.tagService.tagsLists; }
  get audienceTagForm() { return this.tagService.audienceTagForm; }
}

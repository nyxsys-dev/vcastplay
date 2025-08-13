import { Component, computed, effect, inject, signal } from '@angular/core';
import { DesignLayoutService } from '../../../core/services/design-layout.service';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { AssetsService } from '../../../core/services/assets.service';
import { PlaylistService } from '../../../core/services/playlist.service';
import { AssetFilterComponent } from '../../assets/asset-filter/asset-filter.component';
import { PlaylistFilterComponent } from '../../playlist/playlist-filter/playlist-filter.component';
import { AssetListItemComponent } from '../../assets/asset-list-item/asset-list-item.component';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-design-layout-contents',
  imports: [ PrimengUiModule, AssetFilterComponent, AssetListItemComponent, PlaylistFilterComponent ],
  templateUrl: './design-layout-contents.component.html',
  styleUrl: './design-layout-contents.component.scss'
})
export class DesignLayoutContentsComponent {

  designlayoutService = inject(DesignLayoutService);
  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  utils = inject(UtilityService);

  tabIndex = signal<any>(0);
  contentLists = signal<any[]>([]);

  filterSignal = signal<any>({});
  audienceTagSignal = signal<any>({});
  selectionContent = signal<any>(null);
  filteredContents = computed(() => {
    const contents = this.contentLists();
    const { keywords, status, category, subCategory, type, orientation, isAuto } = this.filterSignal();
    const hasAnyValue = Object.values(this.audienceTagSignal()).some(arr => Array.isArray(arr) && arr.length > 0);
    const filteredItems = this.utils.onFilterItems(contents, this.audienceTagSignal());

    const data = hasAnyValue ? filteredItems : contents;
    
    const filteredContents = data.filter((content: any) => {
      const matchKeywords = !keywords || content.name.toLowerCase().includes(keywords.toLowerCase()) || content.description.toLowerCase().includes(keywords.toLowerCase());
      const matchStatus = !status || (content.status == status);
      const matchCategory = !category || content.category?.toLowerCase().includes(category.toLowerCase());
      const matchSubCategory = !subCategory || content.subCategory?.toLowerCase().includes(subCategory.toLowerCase());
      const matchType = !type || content.type?.toLowerCase().includes(type.toLowerCase());
      const matchOrientation = !orientation || content.displaySettings.orientation?.toLowerCase().includes(orientation.toLowerCase());
      const matchIsAuto = isAuto == null || content.isAuto == isAuto;

      return matchKeywords && matchStatus && matchCategory && matchSubCategory && matchType && matchOrientation && matchIsAuto;
    })

    return filteredContents;
  });

  constructor() { }

  ngOnInit() {
    this.onTabChange(0)
  }

  onTabChange(event: any) {
    this.tabIndex.set(event);    
    this.selectionContent.set(null);
    switch (event) {
      case 1:
        this.contentLists.set(this.playlistService.onGetPlaylists());
        break;
      case 2:
        break;
      default:
        this.contentLists.set(this.assetService.onGetAssets());
        break;
    }    
  }

  onSelectionChange(event: any) {
    const { loop, ...info } = event;
    this.canvasHTMLLayers.set([]);
    this.selectionContent.set(event);
    this.playListForm.patchValue({ loop: true, ...info });
    this.playlistService.onPlayPreview();
    this.designlayoutService.onAddHTMLToCanvas(event);
  }

  onFilterChange(event: any) {
    const { filters, audienceTag } = event
    this.filterSignal.set(filters);    
    this.audienceTagSignal.set(audienceTag ?? {});
  }

  get showContents() { return this.designlayoutService.showContents; }
  get canvasHTMLLayers() { return this.designlayoutService.canvasHTMLLayers; }
  
  get assets() { return this.assetService.assets; }
  get assetViewModes() { return this.assetService.assetViewModes; }
  get assetViewModeCtrl() { return this.assetService.assetViewModeCtrl; }
  get assetViewModeSignal() { return this.assetService.assetViewModeSignal; }

  get playListForm() { return this.playlistService.playListForm; }
}

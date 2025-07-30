import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { AssetFilterComponent } from '../../assets/asset-filter/asset-filter.component';
import { AssetsService } from '../../../core/services/assets.service';
import { PlaylistService } from '../../../core/services/playlist.service';
import { SchedulesService } from '../../../core/services/schedules.service';
import { UtilityService } from '../../../core/services/utility.service';
import moment from 'moment';

@Component({
  selector: 'app-schedule-fillers',
  imports: [ PrimengUiModule, AssetFilterComponent ],
  templateUrl: './schedule-fillers.component.html',
  styleUrl: './schedule-fillers.component.scss'
})
export class ScheduleFillersComponent {
  
  assetService = inject(AssetsService);
  scheduleService = inject(SchedulesService);
  utils = inject(UtilityService);
  
  keywords = signal<string>('');
  contentLists = signal<any[]>([]);

  filterSignal = signal<any>({});
  audienceTagSignal = signal<any>({});
  filteredContentLists = computed(() => {
    const contents = this.contentLists();
    const { keywords, status, category, subCategory, type, orientation } = this.filterSignal();

    // Check if any audience tag is selected
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

      return matchKeywords && matchStatus && matchCategory && matchSubCategory && matchType && matchOrientation;
    })

    return filteredContents;
  })

  ngOnInit() {
    this.contentLists.set(this.assetService.onGetAssets());
  }
  
  onFilterChange(event: any) {
    const { filters, audienceTag } = event
    this.filterSignal.set(filters);    
    this.audienceTagSignal.set(audienceTag ?? {});
  }

  get scheduleForm() { return this.scheduleService.scheduleForm; }
  get contentItemForm() { return this.scheduleService.contentItemForm; }
  get arrSelectedContents() { return this.scheduleService.arrSelectedContents; }
  get calendarSelectedDate() { return this.scheduleService.calendarSelectedDate; }
}

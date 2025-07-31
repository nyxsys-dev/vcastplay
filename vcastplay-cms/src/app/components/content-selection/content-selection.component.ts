import { Component, computed, EventEmitter, inject, Input, Output, signal, SimpleChanges } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { AssetFilterComponent } from '../../pages/assets/asset-filter/asset-filter.component';
import { PlaylistFilterComponent } from '../../pages/playlist/playlist-filter/playlist-filter.component';
import { AssetsService } from '../../core/services/assets.service';
import { PlaylistService } from '../../core/services/playlist.service';
import { SchedulesService } from '../../core/services/schedules.service';
import { UtilityService } from '../../core/services/utility.service';
import { FormControl } from '@angular/forms';
import { ScheduleFilterComponent } from '../../pages/schedules/schedule-filter/schedule-filter.component';

@Component({
  selector: 'app-content-selection',
  imports: [ PrimengUiModule, AssetFilterComponent, PlaylistFilterComponent, ScheduleFilterComponent ],
  templateUrl: './content-selection.component.html',
  styleUrl: './content-selection.component.scss'
})
export class ContentSelectionComponent {
  
  @Input() assetOnly: boolean = false;
  @Input() includeSchedules: boolean = false;
  @Input() selectionMode: 'single' | 'multiple' = 'single';
  @Input() selectionContent: any;

  @Output() contentType = new EventEmitter<any>();
  @Output() selectedContents = new EventEmitter<any>();

  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  scheduleService = inject(SchedulesService);
  utils = inject(UtilityService);
  
  contentLists = signal<any[]>([]);

  contentTypeControl: FormControl = new FormControl('asset');
  
  filterSignal = signal<any>({});
  audienceTagSignal = signal<any>({});
  filteredContentLists = computed(() => {
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
  })

  filtereContentTypes = computed(() => {    
    return this.includeSchedules ? this.contentTypes() : this.contentTypes().filter(type => type.value !== 'schedule');
  })
  
  constructor() {
    this.contentTypeControl.valueChanges.subscribe((value) => {
      this.filterSignal.set({});
      this.audienceTagSignal.set({});
      this.selectionContent = null;
      this.onGetContents(value);
      this.contentType.emit(value);
    })
  }

  ngOnInit() {
    this.onGetContents('asset');
  }

  onGetContents(type: string) {
    switch (type) {
      case 'playlist':
        this.contentLists.set(this.playlistService.onGetPlaylists());
        break;
      case 'layout':
        this.contentLists.set([]);
        break;
      case 'schedule':
        this.contentLists.set(this.scheduleService.onGetSchedule());
        break;
      default:
        this.contentLists.set(this.assetService.onGetAssets());
        break;
    }
  }

  onFilterChange(event: any) {
    const { filters, audienceTag } = event
    this.filterSignal.set(filters);    
    this.audienceTagSignal.set(audienceTag ?? {});
  }
  
  onSelectionChange(event: any) {    
    this.selectedContents.emit(event);
  }
  
  get contentTypes() { return this.scheduleService.contentTypes; }
  get calendarSelectedDate() { return this.scheduleService.calendarSelectedDate; }
}

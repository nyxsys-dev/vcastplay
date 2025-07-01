import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { SchedulesService } from '../../../core/services/schedules.service';
import { UtilityService } from '../../../core/services/utility.service';
import { AssetsService } from '../../../core/services/assets.service';
import { PlaylistService } from '../../../core/services/playlist.service';

@Component({
  selector: 'app-schedules-content-list',
  imports: [ PrimengUiModule ],
  templateUrl: './schedules-content-list.component.html',
  styleUrl: './schedules-content-list.component.scss'
})
export class SchedulesContentListComponent {

  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  scheduleService = inject(SchedulesService);
  utils = inject(UtilityService);

  keywords = signal<string>('');
  contentLists = signal<any[]>([]);
  filteredContentLists = computed(() => {
    return this.contentLists().filter((content: any) => {
      return content.name?.toLowerCase().includes(this.keywords().toLowerCase());
    })
  })

  constructor() {
    this.formcontrol('type').valueChanges.subscribe(value => {      
      this.contentSignal.set(value);
      this.onGetContents(value);
    })
  }

  ngOnInit() {
    this.onGetContents('asset');
    this.timeValues.set(this.utils.generateTimeOptions());
  }

  onGetContents(type: string) {
    this.selectedContent.set(null);
    switch (type) {
      case 'playlist':
        this.contentLists.set(this.playlistService.onGetPlaylists());
        break;
      case 'layout':
        this.contentLists.set([]);
        break;
      default:
        this.contentLists.set(this.assetService.onGetAssets());
        break;
    }
  }

  onSelectionChange(event: any) {
    this.contentItemForm.patchValue({ id: event.code ?? event.id, title: event.name });
  }

  onUpdateContentEventColor(color: any) {
    this.contentItemForm.patchValue({ color: color.hex });  
  }

  formcontrol(fieldName: string) {
    return this.utils.getFormControl(this.contentItemForm, fieldName);
  }

  get colors() { return this.utils.colors; }
  get timeValues() { return this.scheduleService.timeValues; }
  get contentItemForm() { return this.scheduleService.contentItemForm; }
  get contentTypes() { return this.scheduleService.contentTypes; }
  get contentSignal() { return this.scheduleService.contentSignal; }
  get selectedContent() { return this.scheduleService.selectedContent; }
  get selectedColor() { return this.contentItemForm.get('color'); }

}

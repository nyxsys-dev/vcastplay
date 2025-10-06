import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ScreenService } from '../../../core/services/screen.service';
import { TagService } from '../../settings/tags/tag.service';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-screen-filter',
  imports: [ PrimengUiModule ],
  templateUrl: './screen-filter.component.html',
  styleUrl: './screen-filter.component.scss'
})
export class ScreenFilterComponent {
  
  @Input() showOrientation: boolean = false;
  @Input() showLocation: boolean = false;
  @Input() showScreenStatus: boolean = false;

  @Output() filterChange = new EventEmitter<any>();

  screenService = inject(ScreenService);
  tagService = inject(TagService);
  utils = inject(UtilityService);

  useFilter = signal<boolean>(false);

  filterGroup = computed(() => {
    return this.tagsLists().find(tag => tag.id.includes('groups')).data();
  })

  filterSubGroup = computed(() => {
    return this.tagsLists().find(tag => tag.id.includes('subGroups')).data();
  })

  filterLocation = computed(() => {
    return this.tagsLists().find(tag => tag.id.includes('locations')).data();
  })

  onClickApply(filter: any) {
    const filters = this.screenFilterForm.value;
    this.filterChange.emit({ filters });
    this.useFilter.set(true);
    filter.hide();
  }

  onClickClear(filter: any) {
    this.screenFilterForm.reset();
    this.filterChange.emit({ filters: this.screenFilterForm.value });
    this.useFilter.set(false);
    filter.hide();
  }

  get status() { return this.utils.status; }
  get orientations() { return this.utils.orientations; }

  get tagsLists() { return this.tagService.tagsLists; }
  
  get types() { return this.screenService.types; }
  get screenStatus() { return this.screenService.screenStatus; }
  get contentStatus() { return this.screenService.contentStatus; }
  get screenFilterForm() { return this.screenService.screenFilterForm; }
}

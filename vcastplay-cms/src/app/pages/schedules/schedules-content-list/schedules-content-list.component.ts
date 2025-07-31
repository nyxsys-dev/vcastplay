import { Component, computed, inject, Input, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { SchedulesService } from '../../../core/services/schedules.service';
import { UtilityService } from '../../../core/services/utility.service';
import { AssetsService } from '../../../core/services/assets.service';
import { PlaylistService } from '../../../core/services/playlist.service';
import { AssetFilterComponent } from '../../assets/asset-filter/asset-filter.component';
import { PlaylistFilterComponent } from '../../playlist/playlist-filter/playlist-filter.component';
import { FullCalendarComponent } from '@fullcalendar/angular';
import moment from 'moment-timezone';
import { ContentSelectionComponent } from '../../../components/content-selection/content-selection.component';

@Component({
  selector: 'app-schedules-content-list',
  imports: [ PrimengUiModule, ContentSelectionComponent ],
  templateUrl: './schedules-content-list.component.html',
  styleUrl: './schedules-content-list.component.scss'
})
export class SchedulesContentListComponent {

  @Input() calendar!: FullCalendarComponent 

  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  scheduleService = inject(SchedulesService);
  utils = inject(UtilityService);
  
  dateRange: { start: Date; end: Date } = { start: new Date(), end: new Date() };

  constructor() { }

  ngOnInit() {
    this.timeValues.set(this.utils.generateTimeOptions());
  }

  onContentTypeChange(event: any) {    
    this.contentItemForm.patchValue({ type: event });
  }

  onSelectionChange(event: any) {    
    if (!event) {
      this.selectedContent.set(null);
      return
    };

    this.selectedContent.set(event);
    
    const { start, end, allDay } = this.calendarSelectedDate();
    const startDate = moment(start);
    const endDateTime = moment(startDate).add(event.duration, 'seconds').format('HH:mm:ss');
    const newEndDate = moment(moment(end).tz('Asia/Manila').format('YYYY-MM-DD') + 'T' + endDateTime).toDate();   

    this.contentItemForm.patchValue({ 
      id: event?.code ?? event.id, 
      title: event.name, 
      end: newEndDate,
      allDay,
      color: event.color,
      duration: event.duration,
    });    
  }

  onUpdateContentEventColor(color: any) {
    this.contentItemForm.patchValue({ color: color.hex });  
  }

  onStartDateChange(event: any, isTime: boolean = false) {
    const { start, end, isSpecificTime } = this.calendarSelectedDate();
    const { duration, end: prevEnd } = this.contentItemForm.value;
    const endDate = moment(isSpecificTime && !isTime ? start : prevEnd).format('YYYY-MM-DD') + 'T' + moment(isTime ? event : prevEnd).format('HH:mm:ss');
    
    this.contentItemForm.patchValue({ end: moment(endDate).add(!isTime ? 0 : duration, 'seconds').toDate() }) 
  }

  onEndDateChange(event: any) {
    const { start, duration, isSpecificTime } = this.contentItemForm.value;
    const endDate = moment(event).format('YYYY-MM-DD') + 'T' + moment(start).format('HH:mm:ss');
    this.contentItemForm.patchValue({
      end: moment(endDate).add(duration, 'seconds').toDate()
    })
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
  
  get isSpecificTime() { return this.contentItemForm.get('isSpecificTime'); }
  get calendarViewSignal() { return this.scheduleService.calendarViewSignal; }
  get start() { return this.contentItemForm.get('start'); }
  get end() { return this.contentItemForm.get('end'); }
  get calendarDateRange() { return this.scheduleService.calendarDateRange; }
  get calendarSelectedDate() { return this.scheduleService.calendarSelectedDate; }
}

import { computed, inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Assets } from '../interfaces/assets';
import { Playlist } from '../interfaces/playlist';
import { Schedule, ScheduleContentItem } from '../interfaces/schedules';
import moment from 'moment-timezone';
import { AssetsService } from './assets.service';
import { PlaylistService } from './playlist.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);

  private scheduleSignal = signal<Schedule[]>([]);
  schedules = computed(() => this.scheduleSignal());

  selectedSchedule = signal<Schedule | null>(null);

  selectedContent = signal<any>(null);
  contentSignal = signal<string>('asset');
  contentTypes = signal<any[]>([
    { label: 'Asset', value: 'asset' },
    { label: 'Playlist', value: 'playlist' },
    { label: 'Design Layout', value: 'layout' },
  ]);

  loadingSignal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  showAddContents = signal<boolean>(false);
  showPreviewEvent = signal<boolean>(false);
  timeValues = signal<string[]>([]);

  first = signal<number>(0);
  rows = signal<number>(8);
  totalRecords = signal<number>(0);

  scheduleForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [ Validators.required ]),
    description: new FormControl('', [ Validators.required ]),
    contents: new FormControl<any[]>([], { nonNullable: true, validators: Validators.required }),
    status: new FormControl(''),
  })

  contentItemForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    title: new FormControl('', [ Validators.required ]),
    start: new FormControl('', [ Validators.required ]),
    end: new FormControl('', [ Validators.required ]),
    color: new FormControl('', [ Validators.required ]),
    allDay: new FormControl(false),
    type: new FormControl('asset', { nonNullable: true, validators: Validators.required }),
  }, { validators: this.dateRangeValidator })
  
  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }
  
  dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('start')?.value;
      const end = group.get('end')?.value;
      if (start && end && new Date(start) > new Date(end)) {
        return { startAfterEnd: true }
      }
      return null;
    }
  }

  timeRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startTime')?.value;
    const end = group.get('endTime')?.value;

    if (!start || !end) return null;

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;    

    return { timeInvalid: startTotal > endTotal };
  }

  onLoadSchedules() {
    /**Call GET API */
  }

  onGetSchedule() {
    if (this.scheduleSignal().length == 0) this.onLoadSchedules();
    return this.scheduleSignal();
  }

  onSaveContent(content: ScheduleContentItem, fullcalendar: FullCalendarComponent) {
    const calendar = fullcalendar.getApi();
    calendar.addEvent({
      id: content.id,
      title: content.title,
      start: moment(content.start).tz('Asia/Manila').toDate(),
      end: moment(content.end).tz('Asia/Manila').toDate(),
      backgroundColor: content.color,
      borderColor: content.color,
      extendedProps: content
    })
    const events = calendar.getEvents().map(event => event.extendedProps);    
    this.scheduleForm.patchValue({ contents: events });
  }

  onUpdateContent(event: any, fullcalendar: FullCalendarComponent) {
    const { start, end, ...info } = event.extendedProps;
    
    const tempContents = this.scheduleForm.value.contents || [];
    const index = tempContents.findIndex((item: any) => item.id === event.id);

    tempContents[index] = { 
      start: moment(event.start).tz('Asia/Manila').toDate(),
      end: moment(event.end).tz('Asia/Manila').toDate(),
      ...info
    };    
    this.scheduleForm.patchValue({ contents: tempContents });
  }

  onGetContentDetails(id: any, type: string) {
    switch (type) {
      case 'asset':
        const asset = this.assetService.onGetAssets().find(item => item.code == id);
        if (asset) this.selectedContent.set(asset);
        break;
      case 'playlist':
        const playlist = this.playlistService.onGetPlaylists().find(item => item.id == id);
        if (playlist) {
          this.playlistService.playListForm.patchValue(playlist);
          this.selectedContent.set(this.playlistService.playListForm.value);
        }
        break;
      default:
        this.selectedContent.set(null);
        break;
    }    
  }

  onDeleteContent(event: any, fullcalendar: FullCalendarComponent) {
    const calendar: any = fullcalendar.getApi();
    calendar.getEventById(event.id).remove();
    const events = calendar.getEvents().map((event: any) => event.extendedProps);    
    this.scheduleForm.patchValue({ contents: events });
  }

  onSaveSchedule(schedule: Schedule) {
    const tempData = this.schedules();
    const { id, status, ...info } = schedule;
    const index = tempData.findIndex(item => item.id === schedule.id);

    if (index !== -1) tempData[index] = { ...schedule, updatedOn: new Date() };
    else tempData.push({ id: tempData.length + 1, status: 'Pending', ...info, createdOn: new Date(), updatedOn: new Date() });

    this.scheduleSignal.set([...tempData]);
    this.totalRecords.set(this.schedules().length);
    /**Call POST/PATCH API */
  }

  onDeleteSchedule(schedule: Schedule) {
    const tempAssets = this.scheduleSignal().filter(u => u.id !== schedule.id);
    this.scheduleSignal.set([...tempAssets]);
    this.totalRecords.set(this.schedules().length);
    /**Call DELETE API */
  }

}

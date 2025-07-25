import { computed, inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Assets } from '../interfaces/assets';
import { Playlist } from '../interfaces/playlist';
import { Schedule, ScheduleContentItem } from '../interfaces/schedules';
import moment from 'moment-timezone';
import { AssetsService } from './assets.service';
import { PlaylistService } from './playlist.service';
import { SelectOption } from '../interfaces/general';
import _ from 'lodash';

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
  
  calendarTitle = signal<string>('');
  calendarViewSignal = signal<string>('timeGridWeek');
  calendarViews = signal<any[]>([
    { label: 'Day', value: 'timeGridDay' },
    { label: 'Week', value: 'timeGridWeek' },
    { label: 'Month', value: 'dayGridMonth' },
  ]);

  loadingSignal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  showAddContents = signal<boolean>(false);
  showPreviewEvent = signal<boolean>(false);
  timeValues = signal<string[]>([]);

  first = signal<number>(0);
  rows = signal<number>(8);
  totalRecords = signal<number>(0);

  scheduleStatus = signal<SelectOption[]>([
    { label: 'Approved', value: 'approved' },
    { label: 'Disapproved', value: 'disapproved' },
    { label: 'Pending', value: 'pending' },
  ])

  scheduleForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [ Validators.required ]),
    description: new FormControl('', [ Validators.required ]),
    contents: new FormControl<any[]>([], { nonNullable: true, validators: Validators.required }),
    status: new FormControl(''),
    approvedInfo: new FormGroup({
      approvedBy: new FormControl('Admin', { nonNullable: true }),
      approvedOn: new FormControl(new Date()),
      remarks: new FormControl(''),
    }),
  })

  contentItemForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    title: new FormControl('', [ Validators.required ]),
    start: new FormControl('', [ Validators.required ]),
    end: new FormControl('', [ Validators.required ]),
    color: new FormControl('', [ Validators.required ]),
    type: new FormControl('asset', { nonNullable: true, validators: Validators.required }),
    allDay: new FormControl(false),
    overlap: new FormControl(false),
  }, { validators: this.onTimeRangeValidator })

  
  scheduleFilterForm: FormGroup = new FormGroup({
    dateRange: new FormControl(null),
    status: new FormControl(null),
    keywords: new FormControl(null),
  });

  onTimeRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('start')?.value;
    const end = group.get('end')?.value;

    if (start && end && new Date(start) > new Date(end)) {
      return { startAfterEnd: true }
    }
    return null;
  }
  
  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  onLoadSchedules() {
    /**Call GET API */
    this.scheduleSignal.set([
      {
        id: 1,
        name: 'New Schedule',
        description: 'This is a sample description of a new schedule',
        contents: [
          {
            eventId: 1,
            id: 'NYX001',
            title: 'image (2).png',
            start: '2025-07-10T06:15:00',
            end: '2025-07-10T06:20:00',
            color: '#FF6384',
            allDay: false,
            type: 'asset'
          },
          {
            eventId: 2,
            id: 'NYX001',
            title: 'image (2).png',
            start: '2025-07-11T06:15:00',
            end: '2025-07-11T06:20:00',
            color: '#FF6384',
            allDay: false,
            type: 'asset'
          },
          {
            eventId: 3,
            id: 'NYX001',
            title: 'image (2).png',
            start: '2025-07-12T06:15:00',
            end: '2025-07-12T06:20:00',
            color: '#FF6384',
            allDay: false,
            type: 'asset'
          },
          {
            eventId: 4,
            id: 'NYX001',
            title: 'image (2).png',
            start: '2025-07-13T06:15:00',
            end: '2025-07-13T06:20:00',
            color: '#FF6384',
            allDay: false,
            type: 'asset'
          },
          {
            eventId: 5,
            id: 'NYX001',
            title: 'image (2).png',
            start: '2025-07-14T06:15:00',
            end: '2025-07-14T06:20:00',
            color: '#FF6384',
            allDay: false,
            type: 'asset'
          },
          {
            eventId: 6,
            id: 'NYX001',
            title: 'image (2).png',
            start: '2025-07-15T06:15:00',
            end: '2025-07-15T06:20:00',
            color: '#FF6384',
            allDay: false,
            type: 'asset'
          },
          {
            eventId: 7,
            id: 'NYX001',
            title: 'image (2).png',
            start: '2025-07-16T06:15:00',
            end: '2025-07-16T06:20:00',
            color: '#FF6384',
            allDay: false,
            type: 'asset'
          }
        ],
        status: 'pending',
        createdOn: new Date('2025-07-10T00:42:28.042Z'),
        updatedOn: new Date('2025-07-10T00:42:28.042Z')
    }
    ])
    this.totalRecords.set(this.schedules().length);
  }

  onGetSchedule() {
    if (this.scheduleSignal().length == 0) this.onLoadSchedules();
    return this.scheduleSignal();
  }

  async onSaveContent(content: ScheduleContentItem, fullCalendar: FullCalendarComponent) {
    const calendarApi = fullCalendar.getApi();
    const type = calendarApi.view.type;
    const start = moment(content.start);
    let end = moment(content.end);

    if (type.startsWith('timeGrid') && end.isSameOrAfter(start)) end.add(1, 'day');

    const daysCount = moment(end).tz('Asia/Manila').diff(start, 'days');
    
    for (let day = 0; day < daysCount; day++) {
      // debugger
      const currentDate = moment(content.start).add(day, 'days');
      const startTime = moment(content.start).tz('Asia/Manila').format('HH:mm:ss');
      const endTime = moment(content.end).tz('Asia/Manila').format('HH:mm:ss');

      const eventData = {
        eventId: calendarApi.getEvents().length + 1,
        id: content.id,
        title: content.title,
        start: currentDate.tz('Asia/Manila').format('YYYY-MM-DD') + 'T' + startTime,
        end: currentDate.tz('Asia/Manila').format('YYYY-MM-DD') + 'T' + endTime,
        color: content.color,
        allDay: content.allDay,
        type: content.type,
      };

      calendarApi.addEvent({
        id: eventData.eventId.toString(),
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        backgroundColor: eventData.color,
        borderColor: eventData.color,
        extendedProps: eventData,
        allDay: eventData.allDay,
      });
    }

    const updatedContents = calendarApi.getEvents().map(event => event.extendedProps);
    this.scheduleForm.patchValue({ contents: updatedContents });
  }

  onUpdateContent(event: any, fullcalendar: FullCalendarComponent) {
    const { start, end, allDay, ...info } = event.extendedProps;    
    
    const tempContents = [ ...this.scheduleForm.value.contents || [] ];
    const index = tempContents.findIndex((item: any) => item.eventId == event.id);
    
    tempContents[index] = { 
      start: moment(event.start).toISOString(),
      end: moment(event.end).toISOString(),
      allDay: event.allDay,
      ...info
    };
    this.scheduleForm.patchValue({ contents: tempContents });
  }

  onSelectAllow(info: any, fullcalendar: FullCalendarComponent): boolean {
    const calendarApi = fullcalendar.getApi();
    const type = calendarApi.view.type;

    if (type.startsWith('timeGrid') && info.allDay) return false;

    // Remove previous selection
    const existing = calendarApi.getEventById('selectBox');
    if (existing) existing.remove();

    let startMoment = moment(info.start);
    let endMoment = moment(info.end);

    // Swap if start is after end
    if (startMoment.isAfter(endMoment)) [startMoment, endMoment] = [endMoment, startMoment];

    const startTime = startMoment.format('HH:mm:ss');
    const endTime = endMoment.format('HH:mm:ss');

    const eventData: any = {
      id: 'selectBox',
      start: startMoment.toISOString(),
      end: endMoment.toISOString(),
      // overlap: false
    };

    if (this.calendarViewSignal() == 'dayGridMonth') {
      eventData.allDay = true;
      eventData.display = 'background';
    } else {
      eventData.startTime = startTime;
      eventData.endTime = endTime;
      eventData.startRecur = startMoment.toISOString();
      eventData.endRecur = endMoment.toISOString();
      eventData.display = 'background';
      eventData.backgroundColor = '#53EAFD';
    }

    calendarApi.addEvent(eventData);

    return true;
  }

  onGetContentDetails(id: any, type: string, eventId: string) {
    switch (type) {
      case 'asset':
        const asset = this.assetService.onGetAssets().find(item => item.code == id);
        if (asset) this.selectedContent.set({ ...asset, eventId });
        break;
      case 'playlist':
        const playlist = this.playlistService.onGetPlaylists().find(item => item.id == id);
        if (playlist) {
          this.playlistService.playListForm.patchValue(playlist);
          this.selectedContent.set({ ...playlist, eventId });
        }
        break;
      default:
        this.selectedContent.set(null);
        break;
    }    
  }

  onDeleteContent(event: any, fullcalendar: FullCalendarComponent) {
    const calendar: any = fullcalendar.getApi();    
    calendar.getEventById(event.eventId).remove();
    const events = calendar.getEvents().map((event: any) => event.extendedProps);    
    this.scheduleForm.patchValue({ contents: events });
  }

  onSaveSchedule(schedule: Schedule) {
    const tempData = this.schedules();
    const { id, status, ...info } = schedule;
    const index = tempData.findIndex(item => item.id == schedule.id);

    if (index !== -1) tempData[index] = { ...schedule, updatedOn: new Date() };
    else tempData.push({ id: tempData.length + 1, status: 'pending', ...info, 
      createdOn: new Date(), updatedOn: new Date(), approvedInfo: { approvedBy: '', approvedOn: null, remarks: '' } });

    this.scheduleSignal.set([ ...tempData ]);
    this.totalRecords.set(this.schedules().length);
    /**Call POST/PATCH API */
  }

  onDeleteSchedule(schedule: Schedule) {
    const tempAssets = this.scheduleSignal().filter(u => u.id !== schedule.id);
    this.scheduleSignal.set([...tempAssets]);
    this.totalRecords.set(this.schedules().length);
    /**Call DELETE API */
  }

  onDuplicateSchedule(schedule: Schedule) {
    const tempData = this.schedules();
    tempData.push({ ...schedule, id: tempData.length + 1, name: `Copy of ${schedule.name}`, approvedInfo: { approvedBy: '', approvedOn: null, remarks: '' },
      status: 'pending', createdOn: new Date(), updatedOn: new Date() });
    this.scheduleSignal.set([...tempData]);
    
    this.totalRecords.set(this.schedules().length);
    /**CALL POST API */
  }

  onApproveSchedule(schedule: Schedule, status: string) {
    const tempData = this.schedules();
    const index = tempData.findIndex(item => item.id === schedule.id);
    tempData[index] = { ...schedule, status, updatedOn: new Date() };
    this.scheduleSignal.set([...tempData]);
    
    this.totalRecords.set(this.schedules().length);
    /**CALL PATCH API */
  }

}

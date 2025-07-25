import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SchedulesService } from '../../../core/services/schedules.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { UtilityService } from '../../../core/services/utility.service';
import { Router } from '@angular/router';
import moment from 'moment-timezone';
import { PlaylistService } from '../../../core/services/playlist.service';

@Component({
  selector: 'app-schedule-details',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './schedule-details.component.html',
  styleUrl: './schedule-details.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class ScheduleDetailsComponent {

  @ViewChild('scheduleCalendar') scheduleCalendar!: FullCalendarComponent;
  
  pageInfo: MenuItem = [ {label: 'Schedules'}, {label: 'List', routerLink: '/schedule/schedule-library'}, {label: 'Details'} ];

  scheduleServices = inject(SchedulesService);
  playlistService = inject(PlaylistService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  utils = inject(UtilityService);
  router = inject(Router);

  currentDateRange = signal<string>('');

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin  ],
    height: '100%',
    selectable: true,
    editable: true,
    dayHeaderFormat: { weekday: 'short' },
    headerToolbar: false,
    slotLabelInterval: '00:01:30',
    eventOrder: 'start',
    views: {
      timeGridWeek: { type: 'timeGrid', duration: { days: 7 }, buttonText: 'Week' },
      timeGridDay: { type: 'timeGrid', duration: { days: 1 }, buttonText: 'Day' },
    },
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short'
    },
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
  hour12: false
    },
    events: [],
    datesSet: this.onDateSet.bind(this), // trigger when view changes
    eventChange: (info: any) => this.onEventUpdate(info),
    eventClick: (info: any) => this.onClickEditContent(info),
    select: (info: any) => this.onClickSelectContents(info),
    selectAllow: (info: any) => this.onSelectAllow(info),
  }

  slotDurations = ['00:00:10', '00:00:15', '00:00:30', '00:01:00', '00:01:30', '00:05:00'];
  zoomLevel: number = 2;
  calendarLoading = signal<boolean>(false);

  ngAfterViewInit() {
    this.calendarOptions = {
      slotDuration: this.slotDuration,
      ...this.calendarOptions
    }

    if (this.isEditMode()) this.onAddCalendarEvents()
  }

  ngOnDestroy() {
    this.scheduleForm.reset();
  }

  onClickSave(event: Event) {
    const calendarApi = this.scheduleCalendar.getApi();
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      this.message.add({ severity: 'error', summary: 'Error', detail: 'Please input required fields (*)' });
      return;
    }

    this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to save changes?',
      closable: true,
      closeOnEscape: true,
      header: 'Confirm Save',
      icon: 'pi pi-question-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        console.log(this.scheduleForm.value);
        this.scheduleServices.onSaveSchedule(this.scheduleForm.value);
        this.message.add({ severity: 'success', summary: 'Success', detail: 'Schedule saved successfully!' });
        this.scheduleForm.reset();
        this.contentItemForm.reset();
        calendarApi.removeAllEvents();
        this.router.navigate([ '/schedule/schedule-library' ]);        
      },
      reject: () => { }
    })
  }

  onClickCancel() {
    this.scheduleForm.reset();
    this.router.navigate([ '/schedule/schedule-library' ]);
  }

  onClickCancelContent() {
    this.showAddContents.set(false);
    this.contentItemForm.reset();
    this.selectedContent.set(null);
  }

  onClickSelectContents({ start, end, allDay }: { start: moment.Moment, end: moment.Moment, allDay: boolean }) {       
    // Remove the selection box
    const calendarApi = this.scheduleCalendar.getApi();
    const existing = calendarApi.getEventById('selectBox');
    if (existing) existing.remove();

    const startDate = moment(start);
    const endDate = allDay ? moment(end).subtract(1, 'day') : moment(end);
    this.currentDateRange.set(`${startDate.format('MMM DD, yyyy')} - ${endDate.format('MMM DD, yyyy')}`);

    this.contentItemForm.patchValue({ start, end, allDay });
    this.showAddContents.set(true);
  }

  onClickEditContent(content: any) {
    document.querySelectorAll('.fc-popover').forEach(el => el.remove());
    const data = content.event;
    const { start, end, ...info } = data.extendedProps;
    this.contentItemForm.patchValue({
      start: moment(data.start).tz('Asia/Manila').toDate(),
      end: moment(data.end).tz('Asia/Manila').toDate(),
      ...info
    });    
    this.scheduleServices.onGetContentDetails(info.id, info.type, data.id);
    this.showPreviewEvent.set(true);
  }

  async onClickSaveContent(event: Event) {
    if (this.contentItemForm.invalid) {
      this.contentItemForm.markAllAsTouched();
      this.message.add({ severity: 'error', summary: 'Error', detail: 'Please input required fields (*)' });
      return;
    }

    this.scheduleServices.onSaveContent(this.contentItemForm.value, this.scheduleCalendar);
    this.contentItemForm.reset();
    this.selectedContent.set(null);
    this.showAddContents.set(false);
  }

  onClickDeleteContent(event: any) {
    this.scheduleServices.onDeleteContent(this.selectedContent(), this.scheduleCalendar);
    this.showPreviewEvent.set(false);
  }

  onClickNextCalendar() {
    const calendar = this.scheduleCalendar.getApi();
    calendar.next();
  }

  onClickPreviousCalendar() {
    const calendar = this.scheduleCalendar.getApi();
    calendar.prev();
  }

  onClickZoomIn() {
    const calendarApi = this.scheduleCalendar.getApi();
    if (this.zoomLevel < this.slotDurations.length - 1) {
      this.zoomLevel++;
      calendarApi.setOption('slotDuration', this.slotDuration);
    }
  }

  onClickZoomOut() {
    const calendarApi = this.scheduleCalendar.getApi();
    if (this.zoomLevel > 0) {
      this.zoomLevel--;
      calendarApi.setOption('slotDuration', this.slotDuration);
    }
  }

  onAddCalendarEvents() {    
    const calendar = this.scheduleCalendar.getApi();
    const contents = this.contents?.value || [];
    calendar.addEventSource(contents.map((content: any) => ({
      id: content.eventId,
      title: content.title,
      start: moment(content.start).toISOString(),
      end: moment(content.end).toISOString(),
      backgroundColor: content.color,
      borderColor: content.color,
      extendedProps: content,
      allDay: content.allDay,
    })));
  }

  onChangeCalendarView(event: any) {
    const calendar = this.scheduleCalendar.getApi();
    calendar.changeView(event.value);
  }

  onEventUpdate(data: any) {
    this.scheduleServices.onUpdateContent(data.event, this.scheduleCalendar);
  }

  onSelectAllow(info: any) {
    return this.scheduleServices.onSelectAllow(info, this.scheduleCalendar);
  }

  onDateSet(event: any) {
    this.calendarTitle.set(event.view.title);
  }

  onClosePreview() {
    this.playlistService.onStopPreview();
    this.playlistService.playListForm.reset();
  }
  
  formControl(fieldName: string) {
    return this.utils.getFormControl(this.scheduleForm, fieldName);
  }

  get slotDuration() { 
    return this.slotDurations[this.zoomLevel];
  }

  get isEditMode() { return this.scheduleServices.isEditMode; }
  get scheduleForm() { return this.scheduleServices.scheduleForm; }
  get timeValues() { return this.scheduleServices.timeValues; }
  get contentType() { return this.scheduleServices.contentSignal; }
  get contentItemForm() { return this.scheduleServices.contentItemForm; }
  get selectedContent() { return this.scheduleServices.selectedContent; }
  get showAddContents() { return this.scheduleServices.showAddContents; }
  get showPreviewEvent() { return this.scheduleServices.showPreviewEvent; }
  get calendarTitle() { return this.scheduleServices.calendarTitle; }
  get calendarViewSignal() { return this.scheduleServices.calendarViewSignal; }
  get calendarViews() { return this.scheduleServices.calendarViews; }
  get contents() { return this.scheduleForm.get('contents'); }
  get type() { return this.contentItemForm.get('type'); }
  get start() { return this.contentItemForm.get('start'); }
  get end() { return this.contentItemForm.get('end'); }
}

import { Component, effect, inject, signal, ViewChild } from '@angular/core';
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

  calendarTitle = signal<string>('');
  calendarViewSignal = signal<string>('timeGridWeek');
  calendarViews = signal<any[]>([
    { label: 'Day', value: 'timeGridDay' },
    { label: 'Week', value: 'timeGridWeek' },
    { label: 'Month', value: 'dayGridMonth' },
  ]);

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin  ],
    height: '100%',
    selectable: true,
    editable: !this.isEditMode(),
    droppable: true,
    dayMaxEvents: true,
    eventOverlap: false,
    selectOverlap: false,
    dayHeaderFormat: { weekday: 'short' },
    headerToolbar: false,
    slotDuration: '00:05:00',
    views: {
      timeGridWeek: { type: 'timeGrid', duration: { days: 7 }, buttonText: 'Week' },
      timeGridDay: { type: 'timeGrid', duration: { days: 1 }, buttonText: 'Day' }
    },
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short'
    },
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short'
    },
    events: [],
    datesSet: this.onDateSet.bind(this), // trigger when view changes
    eventChange: (info: any) => this.onEventUpdate(info),
    select: (info: any) => this.onClickSelectContents(info),
    eventClick: (info: any) => this.onClickEditContent(info),
  }

  ngAfterViewInit() {
    if (this.isEditMode()) this.onAddCalendarEvents()
  }

  ngOnDestroy() {
    this.scheduleForm.reset();
  }

  onClickSave(event: Event) {
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
    this.scheduleServices.onGetContentDetails(data.id, info.type);
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
    this.scheduleServices.onDeleteContent(event.event, this.scheduleCalendar);
  }

  onClickNextCalendar() {
    const calendar = this.scheduleCalendar.getApi();
    calendar.next();
  }

  onClickPreviousCalendar() {
    const calendar = this.scheduleCalendar.getApi();
    calendar.prev();
  }

  onAddCalendarEvents() {    
    const calendar = this.scheduleCalendar.getApi();
    const contents = this.scheduleForm.value.contents || [];      
    calendar.addEventSource(contents.map((content: any) => ({
      id: content.id,
      title: content.title,
      start: moment(content.start).tz('Asia/Manila').toDate(),
      end: moment(content.end).tz('Asia/Manila').toDate(),
      backgroundColor: content.color,
      borderColor: content.color,
      extendedProps: content
    })));
  }

  onChangeCalendarView(event: any) {
    const calendar = this.scheduleCalendar.getApi();
    calendar.changeView(event.value);
  }

  onEventUpdate(event: any) {
    this.scheduleServices.onUpdateContent(event.event, this.scheduleCalendar);
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

  get isEditMode() { return this.scheduleServices.isEditMode; }
  get scheduleForm() { return this.scheduleServices.scheduleForm; }
  get timeValues() { return this.scheduleServices.timeValues; }
  get contentType() { return this.scheduleServices.contentSignal; }
  get contentItemForm() { return this.scheduleServices.contentItemForm; }
  get selectedContent() { return this.scheduleServices.selectedContent; }
  get showAddContents() { return this.scheduleServices.showAddContents; }
  get showPreviewEvent() { return this.scheduleServices.showPreviewEvent; }
  get type() { return this.contentItemForm.get('type'); }
}

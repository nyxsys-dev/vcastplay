import { Component, computed, effect, HostListener, inject, signal, ViewChild } from '@angular/core';
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
import { SchedulesContentListComponent } from '../schedules-content-list/schedules-content-list.component';
import { PreviewAssetsComponent } from '../../../components/preview-assets/preview-assets.component';
import { PlaylistMainPlayerComponent } from '../../playlist/playlist-main-player/playlist-main-player.component';
import { PreviewDesignLayoutComponent } from '../../../components/preview-design-layout/preview-design-layout.component';
import { PreviewPlaylistComponent } from "../../../components/preview-playlist/preview-playlist.component";

@Component({
  selector: 'app-schedule-details',
  imports: [PrimengUiModule, ComponentsModule, PreviewAssetsComponent, PlaylistMainPlayerComponent, PreviewDesignLayoutComponent, PreviewPlaylistComponent],
  templateUrl: './schedule-details.component.html',
  styleUrl: './schedule-details.component.scss',
})
export class ScheduleDetailsComponent {

  @ViewChild('scheduleCalendar') scheduleCalendar!: FullCalendarComponent;
  @ViewChild('scheduleContents') scheduleContents!: SchedulesContentListComponent;
  
  pageInfo: MenuItem = [ {label: 'Schedules'}, {label: 'List', routerLink: '/schedule/schedule-library'}, {label: 'Details'} ];
  itemMenu: MenuItem[] = [
    { 
      label: 'Choose One',
      items: [
        { label: 'Content', icon: 'pi pi-image', command: () => this.onClickAddContent() },
        { label: 'Fillers', icon: 'pi pi-images', command: () => this.onClickAddFillers() }
      ]
    }
  ];

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
    eventDurationEditable: false,
    eventOverlap: false,
    slotEventOverlap: false,
    dayHeaderFormat: { weekday: 'short' },
    headerToolbar: false,
    fixedWeekCount: false,
    eventOrder: 'start',
    slotDuration: '00:00:05',
    slotLabelInterval: '00:00:05',
    slotMinTime: '00:00:00',
    slotMaxTime: '01:00:00',
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
    slotLabelContent: (arg) => {
      const start = moment(arg.date);
      const end = start.clone().add(5, 'seconds');
      return `${start.format('HH:mm:ss')} - ${end.format('HH:mm:ss')}`;
    },
    events: [],
    datesSet: this.onDateSet.bind(this), // trigger when view changes
    eventChange: (info: any) => this.onEventUpdate(info),
    // eventDidMount: (info) => {
    //   info.el.addEventListener('contextmenu', (e) => {
    //     e.preventDefault(); // Prevent browser right-click menu
    //     // this.onClickEditContent(info);
    //   });
    // },
    eventClick: (info: any) => this.onClickEditContent(info),
    // eventContent: (info: any) => this.onRenderEventContent(info),
    eventDrop: (info: any) => this.onEventDrop(info),
    select: (info: any) => this.onSelectContents(info),
    selectAllow: (info: any) => this.onSelectAllow(info), 
  }

  timeSlots = computed(() => this.generateTimeCode().map((timeSlot: any) => ({ ...timeSlot, value: `${timeSlot.start} - ${timeSlot.end}`})) );
  
  hasUnsavedChanges!: () => boolean;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.hasUnsavedData()) {
      $event.returnValue = true;
    }
  }

  ngOnInit() {
    if (!this.isEditMode()) {
      this.scheduleForm.reset();
      this.contentItemForm.reset();
    }    
  }

  ngAfterViewInit() {    
    this.onGetCurrentTime();
    if (this.isEditMode()) this.onAddCalendarEvents();
  }

  ngOnDestroy() {
    this.scheduleForm.reset();
    this.calendarViewSignal.set('timeGridWeek');
  }
  
  hasUnsavedData(): boolean {
    return this.scheduleForm.invalid;
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
    this.router.navigate([ '/schedule/schedule-library' ]);
  }

  onClickCancelContent() {
    this.showAddContents.set(false);
    this.showFillerContents.set(false);
    this.contentItemForm.reset();
    this.selectedContent.set(null);
    this.arrSelectedContents.set([]);
  }

  onClickAddContent() {
    this.contentItemForm.reset();
    const isMonth = ['dayGridMonth'].includes(this.calendarViewSignal());
    const time = this.timeSlots().find(slot => slot.value == this.timeSlotSignal());
    const start = moment(this.calendarDateRange()?.start).format('YYYY-MM-DD');
    const end = moment(this.calendarDateRange()?.end).subtract(1, 'day').format('YYYY-MM-DD');    
    
    const startDateTime = moment(`${start} ${time.start}`, 'YYYY-MM-DD HH:mm:ss').toDate();
    const endDateTime = moment(`${end} ${time.end}`, 'YYYY-MM-DD HH:mm:ss').toDate();
    
    this.onSelectContents({ start: startDateTime, end: endDateTime, allDay: isMonth }, false);
    this.scheduleContents.contents.selectionContent = null;
  }

  onClickAddFillers() {
    const contents: any[] = this.contents?.value || [];
    const fillers = contents.filter((event: any) => event.isFiller);

    const time = this.timeSlots().find(slot => slot.value == this.timeSlotSignal());
    const start = moment(this.calendarDateRange()?.start).format('YYYY-MM-DD');
    const end = moment(this.calendarDateRange()?.end).subtract(1, 'day').format('YYYY-MM-DD');    
    
    const startDateTime = moment(`${start} ${time.start}`, 'YYYY-MM-DD HH:mm:ss').toDate();
    const endDateTime = moment(`${end} ${time.end}`, 'YYYY-MM-DD HH:mm:ss').toDate();
    this.calendarSelectedDate.set({ start: startDateTime, end: endDateTime, allDay: true });
    this.showFillerContents.set(true);
    this.arrSelectedContents.set(fillers);
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

    this.scheduleServices.onSaveContent(this.contentItemForm.value, this.scheduleCalendar).then((result: any) => {      

      if (result.totalDuplicates > 0) {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'Duplicate events found. Some events were not saved' });
      }

      this.selectedContent.set(null);
      this.contentItemForm.reset();
      this.showAddContents.set(false);
    });
  }
  
  onClickSaveFillers(event: Event) {
    const { contents } = this.scheduleForm.value;    
    const fillers = this.arrSelectedContents().map((item: any) => ({
      id: item.id,
      code: item.code,
      title: item.name,
      type: item.type,
      allDay: true,
      color: '#71717B',
      isFiller: true
    }))    
    this.scheduleForm.patchValue({ contents: [ ...fillers, ...contents.filter((item: any) => !item.isFiller) ] });
    this.showFillerContents.set(false);
    this.arrSelectedContents.set([]);
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

  onSelectContents({ start, end, allDay }: { start: any, end: any, allDay: boolean }, isSpecificTime: boolean = true) {
    // Remove the selection box
    const calendarApi = this.scheduleCalendar.getApi();
    const existing = calendarApi.getEventById('selectBox');
    if (existing) existing.remove();

    const startDate = moment(start);
    const endDate = allDay ? moment(end).subtract(1, 'day') : moment(end);
    this.currentDateRange.set(`${startDate.format('MMM DD, yyyy')} - ${endDate.format('MMM DD, yyyy')}`);

    this.contentItemForm.patchValue({ start: startDate.toDate(), end: !isSpecificTime ? endDate.toDate() : null, allDay });
    this.calendarSelectedDate.set({ start, end, allDay, isSpecificTime });
    
    this.scheduleContents.contents.selectionContent = null;
    this.showAddContents.set(true);
  }

  onAddCalendarEvents() {    
    const calendar = this.scheduleCalendar.getApi();
    const contents: any[] = this.contents?.value || [];
    const fillers = contents.filter((event: any) => event.isFiller);
    const events: any[] = contents.filter((event: any) => !event.isFiller).map((content: any) => ({
      id: content.eventId,
      title: content.title,
      start: moment(content.start).toISOString(),
      end: moment(content.end).toISOString(),
      backgroundColor: content.color,
      borderColor: content.color,
      extendedProps: content,
      allDay: content.allDay,
    }));
    calendar.addEventSource(events);    
    this.arrSelectedContents.set(fillers);
  }

  onChangeCalendarView(event: any) {
    const calendar = this.scheduleCalendar.getApi();
    calendar.changeView(event.value);
  }

  onChangeTimeSlot(event: any) {    
    const { start, end, value } = event;
    const calendar = this.scheduleCalendar.getApi();
    
    const time = this.timeSlots().find(slot => slot.value == (value ?? `${start} - ${end}`));
    
    // calendar.setOption('slotMinTime', start);
    // calendar.setOption('slotMaxTime', end);  
    calendar.setOption('slotMinTime', time.start);
    calendar.setOption('slotMaxTime', time.end);      
  }

  onEventUpdate(info: any) {
    this.scheduleServices.onUpdateContent(info.event, this.scheduleCalendar);
  }

  onSelectAllow(info: any) {
    return this.scheduleServices.onSelectAllow(info, this.scheduleCalendar);
  }

  onDateSet(event: any) {
    const start = event.start;
    const end = event.end;
    this.calendarDateRange.set({ start, end });
    this.calendarTitle.set(event.view.title);
  }

  onClosePreview() {
    this.playlistService.onStopAllContents();
    this.playlistForm.reset();
  }

  onRenderEventContent(arg: any) {
    const event = arg.event;
    const title = event.title || '';
    const bg = event.backgroundColor ;

    return {
      html: `<div class="text-xs text-white w-full px-1 rounded-sm" style="background-color: ${bg}">${title}</div>`
    };
  }

  onGetCurrentTime() {    
    const start = moment().startOf('hour').format('HH:mm'); // e.g., 14:00
    const end = moment().startOf('hour').add(15, 'minutes').format('HH:mm'); // e.g., 14:15

    this.timeSlotSignal.set(`${start} - ${end}`);
    this.onChangeTimeSlot({ start, end });
  }

  onGetCurrentRange(event: any) {
    const { start, end }: any = event;
    this.timeSlotSignal.set(`${start} - ${end}`);
    this.onChangeTimeSlot({ start, end });
  }

  onEventDrop(info: any) {    
    const draggedEvent = info.event;
    const { duration, allDay } = draggedEvent.extendedProps;
    const events = info.view.calendar.getEvents();

    const hasDuplicate = events.some((e: any) =>
      e.id !== draggedEvent.id && // exclude the dragged event itself
      moment(e.start).isSame(draggedEvent.start) &&
      moment(e.end).isSame(draggedEvent.end)
    );
    
    // If dragged event is not all day
    if (!draggedEvent.allDay) {
      draggedEvent.setAllDay(false);
      draggedEvent.setStart(moment(draggedEvent.start).toDate());
      draggedEvent.setEnd(moment(draggedEvent.start).add(duration, 'seconds').toDate());
      draggedEvent.setExtendedProp('allDay', false);
    }

    if (hasDuplicate) {
      this.message.add({ severity: 'error', summary: 'Error', detail: 'Event already exists at the same time' });
      info.revert();
    } else {
      this.message.add({ severity: 'success', summary: 'Success', detail: 'Event updated successfully' });
    }
  }

  onSelectionChange(event: any) {
    this.arrSelectedContents.set(event);
  }
  
  formControl(fieldName: string) {
    return this.utils.getFormControl(this.scheduleForm, fieldName);
  }

  get generateTimeCode() { return this.utils.generateTimeCode; }

  get isEditMode() { return this.scheduleServices.isEditMode; }
  get scheduleForm() { return this.scheduleServices.scheduleForm; }
  get timeValues() { return this.scheduleServices.timeValues; }
  get contentType() { return this.scheduleServices.contentSignal; }
  get contentItemForm() { return this.scheduleServices.contentItemForm; }
  get contentValue() { return this.scheduleServices.contentItemForm.value; }
  get selectedContent() { return this.scheduleServices.selectedContent; }
  get arrSelectedContents() { return this.scheduleServices.arrSelectedContents; }
  get showAddContents() { return this.scheduleServices.showAddContents; }
  get showFillerContents() { return this.scheduleServices.showFillerContents; }
  get showPreviewEvent() { return this.scheduleServices.showPreviewEvent; }
  get calendarTitle() { return this.scheduleServices.calendarTitle; }
  get calendarViewSignal() { return this.scheduleServices.calendarViewSignal; }
  get calendarViews() { return this.scheduleServices.calendarViews; }
  get contents() { return this.scheduleForm.get('contents'); }
  get type() { return this.contentItemForm.get('type'); }
  get start() { return this.contentItemForm.get('start'); }
  get end() { return this.contentItemForm.get('end'); }
  get timeSlotSignal() { return this.scheduleServices.timeSlotSignal; }
  get calendarDateRange() { return this.scheduleServices.calendarDateRange; }
  get calendarSelectedDate() { return this.scheduleServices.calendarSelectedDate; }

  get playlistForm() { return this.playlistService.playListForm; }

}

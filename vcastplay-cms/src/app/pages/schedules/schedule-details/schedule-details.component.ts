import { Component, inject, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { MenuItem } from 'primeng/api';
import { SchedulesService } from '../../../core/services/schedules.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { UtilityService } from '../../../core/services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-details',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './schedule-details.component.html',
  styleUrl: './schedule-details.component.scss'
})
export class ScheduleDetailsComponent {

  @ViewChild('scheduleCalendar') scheduleCalendar!: FullCalendarComponent;
  
  pageInfo: MenuItem = [ {label: 'Schedules'}, {label: 'List', routerLink: '/schedule/schedule-library'}, {label: 'Details'} ];

  scheduleServices = inject(SchedulesService);
  utils = inject(UtilityService);
  router = inject(Router);

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin  ],
    height: '100%',
    // slotMinTime: '05:00:00', 
    // slotMaxTime: '10:59:59',
    dayHeaderFormat: { weekday: 'long' },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    selectable: true,
    editable: true,
    droppable: true,
    buttonText: { today: 'Today', month: 'Month', week: 'Week', day: 'Day' },
    views: {
      timeGridWeek: { type: 'timeGrid', duration: { days: 7 }, buttonText: 'Week' },
      timeGridDay: { type: 'timeGrid', duration: { days: 1 }, buttonText: 'Day' }
    },
    drop: (info) => {
      console.log(info);
    },
    events: [
      {
        title: 'Event 1',
        start: '2025-06-01T10:00:00',
        end: '2025-06-01T11:00:00',
        contents: [
          {
            id: 1,
            name: 'Asset 1',
            type: 'video',
          }
        ]
      }
    ],
    select: (info: any) => this.onClickSelectContents(info),
    eventClick: (info: any) => this.onClickSelectContents(info),
    validRange: () => {
      return this.dateRange?.value;
    }
  }

  ngOnInit() {
    this.timeValues.set(this.utils.generateTimeOptions())
    this.scheduleForm.valueChanges.subscribe(value => this.scheduleServices.onUpdateRange(this.scheduleCalendar, value.dateRange));
  }

  onClickSave(event: Event) {
    this.scheduleServices.onSaveSchedule(this.scheduleForm.value);
  }

  onClickCancel() {
    this.scheduleForm.reset();
    this.router.navigate([ '/schedule/schedule-library' ]);
  }

  onClickSelectContents(info: any) {
    const { startStr, endStr } = info;
    const data = info.event
    console.log(data.extendedProps);
  }
  
  formControl(fieldName: string) {
    return this.utils.getFormControl(this.scheduleForm, fieldName);
  }

  get isEditMode() { return this.scheduleServices.isEditMode; }
  get scheduleForm() { return this.scheduleServices.scheduleForm; }
  get dateRange() { return this.scheduleForm.get('dateRange'); }
  get timeValues() { return this.scheduleServices.timeValues; }
}

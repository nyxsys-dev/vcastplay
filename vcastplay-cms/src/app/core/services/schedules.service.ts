import { computed, Injectable, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Assets } from '../interfaces/assets';
import { Playlist } from '../interfaces/playlist';
import { Schedule } from '../interfaces/schedules';
import moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  private scheduleSignal = signal<Schedule[]>([]);
  schedules = computed(() => this.scheduleSignal());

  loadingSignal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  timeValues = signal<string[]>([]);

  first = signal<number>(0);
  rows = signal<number>(8);
  totalRecords = signal<number>(0);

  scheduleForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [ Validators.required ]),
    description: new FormControl('', [ Validators.required ]),
    contents: new FormControl<Assets[] | Playlist[]>([], { nonNullable: true }),
    dateRange: new FormGroup({
      start: new FormControl(moment().startOf('month').toDate(), { nonNullable: true  }),
      end: new FormControl(moment().endOf('month').toDate(), { nonNullable: true  }),
      timeStart: new FormControl('00:00'),
      timeEnd: new FormControl('23:00'),
    }, { validators: [ this.dateRangeValidator() ] }),
  })

  constructor() { }
  
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

  onUpdateRange(fullcalendar: FullCalendarComponent, dateRange: { start: Date, end: Date }) {    
    const calendarAPI = fullcalendar.getApi();
    if (calendarAPI && dateRange) {
      calendarAPI.gotoDate(dateRange.start);
      calendarAPI.setOption('validRange', dateRange);
    }
    calendarAPI.render();
  }

  onLoadSchedules() {
    /**Call GET API */
  }

  onGetSchedule() {
    if (this.scheduleSignal().length == 0) this.onLoadSchedules();
    return this.scheduleSignal();
  }

  onSaveSchedule(schedule: Schedule) {
    const tempData = this.schedules();
    tempData.push({ ...schedule, id: tempData.length + 1, status: 'Pending', createdOn: new Date(), updatedOn: new Date() });
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

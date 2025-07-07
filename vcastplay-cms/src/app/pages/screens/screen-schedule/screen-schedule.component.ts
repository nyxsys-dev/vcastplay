import { Component, inject, Input } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { FormGroup } from '@angular/forms';
import { ScreenService } from '../../../core/services/screen.service';
import { WEEKDAYS } from '../../../core/interfaces/general';

@Component({
  selector: 'app-screen-schedule',
  imports: [ PrimengUiModule ],
  templateUrl: './screen-schedule.component.html',
  styleUrl: './screen-schedule.component.scss'
})
export class ScreenScheduleComponent {

  @Input() screenForm!: FormGroup;

  weekdays: string[] = WEEKDAYS;
  screenService = inject(ScreenService);
  
  onClickAddHours() {
    const hoursTotal = this.hoursControl?.value.length;
    const hour = { id: hoursTotal + 1, start: new Date(), end: new Date() }
    this.hoursControl?.patchValue([...this.hoursControl?.value, hour]);
  }

  onClickDeleteHour(item: any) {    
    const { id } = item;
    const hours = this.hoursControl?.value;
    this.hoursControl?.patchValue(hours.filter((hour: any) => hour.id !== id));
  }
  
  onCheckAllWeekdays(event: any) {
    const checked = event.checked;
    if (checked) {
      this.weekdaysControl?.patchValue(WEEKDAYS);
    } else {
      this.weekdaysControl?.patchValue([]);
    }
  }

  isCheckedWeekday(): boolean {
    const weekdaysCtrl = this.weekdaysControl?.value;
    return weekdaysCtrl.length > 0 && weekdaysCtrl.length < this.weekdays.length;
  }

  get operationGroupControl() { return this.screenForm.get('operation') as FormGroup; }
  get weekdaysControl() { return this.operationGroupControl.get('weekdays'); }
  get hoursControl() { return this.operationGroupControl.get('hours'); } 
}

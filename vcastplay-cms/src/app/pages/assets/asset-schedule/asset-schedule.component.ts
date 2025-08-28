import { Component, Input } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { WEEKDAYS } from '../../../core/interfaces/general';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-asset-schedule',
  imports: [ PrimengUiModule ],
  templateUrl: './asset-schedule.component.html',
  styleUrl: './asset-schedule.component.scss'
})
export class AssetScheduleComponent {

  @Input() assetForm!: FormGroup;
  
  weekdays: string[] = WEEKDAYS;

  onChangeAvailability(event: any) {
    const checked = event.checked;
    if (!checked) {
      this.dateRangeControl?.reset();
      this.weekdaysControl?.reset();
      this.hoursControl?.reset();
    }
  }
  
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

  get dateRangeControl() { return this.assetForm.get('dateRange'); }
  get weekdaysControl() { return this.assetForm.get('weekdays'); }
  get hoursControl() { return this.assetForm.get('hours'); }
  get typeControl() { return this.assetForm.get('type'); }
  get availability() { return this.assetForm.get('availability'); }
}

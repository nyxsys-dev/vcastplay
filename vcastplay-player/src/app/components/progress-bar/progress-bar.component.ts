import { Component, inject, signal } from '@angular/core';
import { UtilsService } from '../../core/services/utils.service';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';

@Component({
  selector: 'app-progress-bar',
  imports: [ PrimengModule ],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {

  utils = inject(UtilsService);

  value = signal<number>(0);

  ngOnInit() {
    this.utils.onGetDownloadProgessa().subscribe((data) => {
      const percent = isNaN(data.percentage) ? 100 : data.percentage;      
      this.value.set(percent);
    })
  }
}

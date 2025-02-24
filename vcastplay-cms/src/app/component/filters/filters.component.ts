import { Component } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters',
  imports: [ PrimengUiModule ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {

  filters: FormGroup = new FormGroup({
    keywords: new FormControl(''),
    sortBy: new FormControl(''),
    sort: new FormControl('asc')
  })
}

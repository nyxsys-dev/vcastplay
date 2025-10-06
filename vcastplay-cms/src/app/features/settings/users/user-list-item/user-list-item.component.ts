import { Component, Input, TemplateRef } from '@angular/core';
import { PrimengUiModule } from '../../../../core/modules/primeng-ui/primeng-ui.module';
import { User } from '../../../../core/interfaces/account-settings';

@Component({
  selector: 'app-user-list-item',
  imports: [ PrimengUiModule ],
  templateUrl: './user-list-item.component.html',
  styleUrl: './user-list-item.component.scss'
})
export class UserListItemComponent {

  @Input() user!: User;
  @Input() actionBtn!: TemplateRef<any>;
}

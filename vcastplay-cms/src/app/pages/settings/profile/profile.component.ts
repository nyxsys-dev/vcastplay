import { Component } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-profile',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  
  pageInfo: MenuItem = [ {label: 'Settings'}, {label: 'Profile'} ];

}

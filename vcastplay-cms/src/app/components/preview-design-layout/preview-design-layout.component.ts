import { Component } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { PreviewPlaylistComponent } from '../preview-playlist/preview-playlist.component';

@Component({
  selector: 'app-preview-design-layout',
  imports: [ PrimengUiModule ],
  templateUrl: './preview-design-layout.component.html',
  styleUrl: './preview-design-layout.component.scss'
})
export class PreviewDesignLayoutComponent {

}

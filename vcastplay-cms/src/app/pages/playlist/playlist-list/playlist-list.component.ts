import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AssetsService } from '../../../core/services/assets.service';

@Component({
  selector: 'app-playlist-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './playlist-list.component.html',
  styleUrl: './playlist-list.component.scss'
})
export class PlaylistListComponent {

  pageInfo: MenuItem = [ { label: 'Playlist' }, { label: 'Playlist Library' } ];

  assetService = inject(AssetsService);
  router = inject(Router);

  ngOnInit() {
    this.assetService.onGetAssets()
  }

  onClickAddNew() {
    this.router.navigate([ '/playlist/playlist-details' ]);
  }
}

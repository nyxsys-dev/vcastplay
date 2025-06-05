import { Component, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { TimelineContainerComponent } from '../../../components/playlist/timeline-container/timeline-container.component';
import moment from 'moment';
import { AssetsService } from '../../../core/services/assets.service';
import { Assets } from '../../../core/interfaces/assets';
import { AssetListItemComponent } from '../../assets/asset-list-item/asset-list-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlaylistService } from '../../../core/services/playlist.service';

@Component({
  selector: 'app-playlist-details',
  imports: [ PrimengUiModule, ComponentsModule, DragDropModule, TimelineContainerComponent, AssetListItemComponent ],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.scss'
})
export class PlaylistDetailsComponent {

  pageInfo: MenuItem = [ {label: 'Playlist'}, {label: 'Playlist Library', routerLink: '/playlist/playlist-library'}, {label: 'New Playlist'} ];

  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  router = inject(Router);

  moment = moment;

  assets = signal<Assets[]>([]);

  constructor() {
    this.assets.set(this.assetService.onGetAssets());
  }
  
  onClickCancel() {
    this.router.navigate([ '/playlist/playlist-library' ]);
  }
  
  get playlistItems() {
    return this.playlistService.playlistItems;
  }
}

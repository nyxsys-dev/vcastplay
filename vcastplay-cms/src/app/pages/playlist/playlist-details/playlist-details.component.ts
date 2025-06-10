import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TimelineContainerComponent } from '../../../components/playlist/timeline-container/timeline-container.component';
import moment from 'moment';
import { AssetsService } from '../../../core/services/assets.service';
import { Assets } from '../../../core/interfaces/assets';
import { AssetListItemComponent } from '../../assets/asset-list-item/asset-list-item.component';
import { PlaylistService } from '../../../core/services/playlist.service';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-playlist-details',
  imports: [ PrimengUiModule, ComponentsModule, TimelineContainerComponent, AssetListItemComponent ],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.scss',
  providers: [ MessageService ]
})
export class PlaylistDetailsComponent {

  pageInfo: MenuItem = [ {label: 'Playlist'}, {label: 'Playlist Library', routerLink: '/playlist/playlist-library'}, {label: 'New Playlist'} ];

  utils = inject(UtilityService);
  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  message = inject(MessageService);
  router = inject(Router);

  moment = moment;

  assets = signal<Assets[]>([]);
  
  totalDuration = () => {
    const contents = this.formControl('contents').value;
    return contents.reduce((acc: any, item: any) => acc + item.duration, 0);
  }

  constructor() {
    this.assets.set(this.assetService.onGetAssets());
  }

  onClickPlayPreview() {
    // this.playlistService.duration.set(this.totalDuration());
    if (this.playlistService.isPlaying()) this.playlistService.onStopPreview();
    else this.playlistService.onPlayPreview();
  }

  onClickSave(event: Event) {
    console.log(this.playListForm.value);    
  }
  
  onClickCancel() {
    this.router.navigate([ '/playlist/playlist-library' ]);
  }

  onTimeUpdate(event: Event) {
    const video: HTMLVideoElement = event.target as HTMLVideoElement;
    const currentTime = video.currentTime;
    const duration = video.duration;
    this.playlistService.updateProgress(currentTime, duration);
  }

  formControl(fieldName: string) {
    return this.utils.getFormControl(this.playListForm, fieldName);
  }

  get currentContent() {
    return this.playlistService.currentContent();
  }

  get playListForm() {
    return this.playlistService.playListForm;
  }
  
  get playlistItems() {
    return this.playlistService.playlistItems;
  }

  get isPlaying() {
    return this.playlistService.isPlaying;
  }
}

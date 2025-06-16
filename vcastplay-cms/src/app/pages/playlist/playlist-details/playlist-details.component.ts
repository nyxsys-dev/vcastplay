import { Component, computed, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { PlaylistContainerComponent } from '../../../components/playlist/playlist-container/playlist-container.component';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { AssetsService } from '../../../core/services/assets.service';
import { Assets } from '../../../core/interfaces/assets';
import { AssetListItemComponent } from '../../assets/asset-list-item/asset-list-item.component';
import { PlaylistService } from '../../../core/services/playlist.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MenuItem, MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-playlist-details',
  imports: [ PrimengUiModule, ComponentsModule, PlaylistContainerComponent, AssetListItemComponent ],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.scss',
  providers: [ MessageService ]
})
export class PlaylistDetailsComponent {
  
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  
  pageInfo: MenuItem = [ {label: 'Playlist'}, {label: 'Playlist Library', routerLink: '/playlist/playlist-library'}, {label: 'New Playlist'} ];

  utils = inject(UtilityService);
  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  message = inject(MessageService);
  router = inject(Router);

  moment = moment;

  keywords: FormControl = new FormControl('');
  keywordSignal = signal<string>('');

  assets = signal<Assets[]>([]);
  filteredAssets = computed(() => this.assets().filter(asset => {
    return asset.name.toLowerCase().includes(this.keywordSignal().toLowerCase());
  }));

  assetViewModeSignal = signal<string>('Grid');
  assetViewMode: FormControl = new FormControl('Grid');
  assetViewModes = [
    { icon: 'pi pi-table', label: 'Grid' },
    { icon: 'pi pi-list', label: 'List' },
  ]
  
  totalDuration = () => {
    const contents = this.formControl('contents').value;
    return contents.reduce((acc: any, item: any) => acc + item.duration, 0);
  }

  constructor() {
    this.assets.set(this.assetService.onGetAssets());
    this.keywords.valueChanges.subscribe(value => this.keywordSignal.set(value));
    this.assetViewMode.valueChanges.subscribe(value => this.assetViewModeSignal.set(value));

    effect(() => {
      const progress = this.playlistService.progress();
      if (progress > 0 && this.videoPlayer) this.playlistService.videoElement.set(this.videoPlayer.nativeElement);      
    })
  }

  ngOnInit() { }

  ngOnDestroy() { }

  onClickPlayPreview() {
    if (this.playlistService.isPlaying()) this.playlistService.onStopPreview();
    else this.playlistService.onPlayPreview();
  }

  onClickSave(event: Event) {
    console.log(this.playListForm.value);    
  }
  
  onClickCancel() {
    this.router.navigate([ '/playlist/playlist-library' ]);
  }

  onClickClearAll() {
    this.formControl('contents').setValue([]);
    this.playlistService.onStopPreview();
  }

  onTimeUpdate(event: any) {    
    const { currentTime, duration } = event;
    this.playlistService.onUpdateProgress(currentTime, duration);
  }

  formControl(fieldName: string) {
    return this.utils.getFormControl(this.playListForm, fieldName);
  }

  getTransitionClasses() {
    const { type } = this.currentTransition ?? '';
    const fadeIn = this.playlistService.fadeIn();    
    return {
      'transition-all duration-500 ease-in-out': true,
      'w-full h-full flex justify-center items-center': true,
      [`${type?.opacity ? 'opacity-0' : ''} ${type?.x ?? ''}`]: !fadeIn,
      [`${type?.opacity ? 'opacity-100' : ''} ${type?.y ?? ''}`]: fadeIn
    };
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

  get isLooping() {
    return this.playlistService.isLooping;
  }

  get transitionTypes() {
    return this.playlistService.transitionTypes;
  }

  get currentTransition() {
    return this.playlistService.currentTransition();
  }
}

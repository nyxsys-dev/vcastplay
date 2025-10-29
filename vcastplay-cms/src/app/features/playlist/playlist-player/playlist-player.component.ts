import { Component, ElementRef, EventEmitter, forwardRef, inject, Input, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { Playlist } from '../playlist';
import { Assets } from '../../assets/assets';
import { DesignLayout } from '../../design-layout/design-layout';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { UtilityService } from '../../../core/services/utility.service';
import { SafeurlPipe } from '../../../core/pipes/safeurl.pipe';
import { PlaylistService } from '../playlist.service';
import { FacebookSDKService } from '../../../core/services/facebook-sdk.service';
import { DesignLayoutPreviewComponent } from '../../design-layout/design-layout-preview/design-layout-preview.component';
import { YoutubeSdkService } from '../../../core/services/youtube-sdk.service';

declare const FB: any;
declare const YT: any;

@Component({
  selector: 'app-playlist-player',
  imports: [ PrimengUiModule, SafeurlPipe, forwardRef(() => DesignLayoutPreviewComponent) ],
  templateUrl: './playlist-player.component.html',
  styleUrl: './playlist-player.component.scss',
})
export class PlaylistPlayerComponent {

  @Input() playlist!: Playlist;
  @Input() isAutoPlay: boolean = false;

  @Output() onCurrentItemChange = new EventEmitter<Assets | DesignLayout | any>();
  @Output() isPlayingChange = new EventEmitter<boolean>();

  @ViewChild('fbPlayer') fbPlayerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('ytPlayer') ytPlayerRef!: ElementRef<HTMLDivElement>;

  playlistService = inject(PlaylistService);
  utils = inject(UtilityService);
  fbService = inject(FacebookSDKService);
  ytService = inject(YoutubeSdkService);

  isPlaying = signal<boolean>(false);
  isTransitioning = signal<boolean>(false);
  isFacebookLoading = signal<boolean>(false);
  currentIndex = signal<number>(0);
  currentItem = signal<Assets | DesignLayout | any>(null);
  nextPreloadedItem = signal<Assets | DesignLayout | any>(null);
  animationClasses = signal<string>('');

  private timerId: any;
  private gapId: any;
  private transitionId: any;
  private fbTimerId: any;
  private ytTimerId: any;
  

  ngOnInit() {
    this.onInitPlaylist();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['playlist'].currentValue) this.onStopPlayback();
    if (changes['playlist'] && changes['playlist'].currentValue) this.onInitPlaylist(true);
  }

  ngOnDestroy() {
    this.onStopPlayback();
  }

  onClickPlayback() {
    if (this.isPlaying()) this.onStopPlayback();
    else this.onStartPlayback();
  }

  onInitPlaylist(fromChange: boolean = false) {
    const contents: number = this.playlist?.contents.length || 0;
    this.onClearTimeout();
    this.currentIndex.set(0);

    if (contents > 0) {
      this.currentItem.set(this.playlist.contents[0]);
      this.onPreloadNextItem();

      if (this.isAutoPlay) this.onStartPlayback();
      else if (fromChange && this.isPlaying()) this.onStartPlayback();
    }
  }

  onStartPlayback() {
    const contents: number = this.playlist.contents.length;
    if (contents == 0) return;
    this.isPlaying.set(true);
    this.currentItem.set(this.playlist.contents[this.currentIndex()]);

    if (this.currentItem().type == 'facebook') this.onFacebookLoad();
    if (this.currentItem().type == 'youtube') this.onYoutubeLoad();
    this.onCurrentItemChange.emit(this.currentItem());
    this.isPlayingChange.emit(true);

    this.onPreloadNextItem();
  }

  onStopPlayback() {
    this.isPlaying.set(false);
    this.onClearTimeout();
    this.currentIndex.set(0);
    
    const video = document.querySelector('video');    
    if (video) {
      video.currentTime = 0;
      video.pause();
    }
    this.onCurrentItemChange.emit(null);
    this.isPlayingChange.emit(false);
  }

  onNextItem() {
    const { type, hasGap } = this.playlist.transition;
    const typeDuration = type ? 300 : 0;
    const gapDuration = hasGap ? 1500 : 0;
    this.onClearTimeout();
    
    this.currentItem.set(null);
    this.transitionId = setTimeout(() => {

      this.gapId = setTimeout(() => {
        const isLoop: boolean = this.playlist.loop;
        const contents: number = this.playlist.contents.length;

        let nextIndex: number = this.currentIndex() + 1;

        if (nextIndex >= contents) {
          if (isLoop) {
            nextIndex = 0;
          } else { 
            this.onStopPlayback();
            return;
          }
        }

        this.currentIndex.set(nextIndex);
        this.currentItem.set(this.playlist.contents[nextIndex]);        

        if (this.currentItem().type == 'facebook') this.onFacebookLoad();
        if (this.currentItem().type == 'youtube') this.onYoutubeLoad();

        this.onCurrentItemChange.emit(this.currentItem());
        this.onPreloadNextItem();
        
      }, gapDuration);

    }, typeDuration);    
  }

  onPreloadNextItem() {
    const nextIndex = (this.currentIndex() + 1) % this.playlist.contents.length;
    this.nextPreloadedItem.set(this.playlist.contents[nextIndex]);
  }

  // For Image and Web links
  onImageLoaded(item: Assets) {
    const duration = item.duration * 1000 || 5000;    
    this.timerId = setTimeout(() => this.onNextItem(), duration);
  }
  
  async onYoutubeLoad() {
    await this.ytService.onLoadSDK()
    this.ytTimerId = setTimeout(async () => {
      const ytPlayer = this.ytPlayerRef?.nativeElement;
      const item = this.currentItem()
      const { videoId } = this.utils.onGetEmbedUrl(item.link);
      if (!ytPlayer) return;
      
      const player = await new YT.Player(ytPlayer, {
        videoId,
        playerVars: { autoPlay: 1, controls: 0, playsinline: 1, showinfo: 0 },
        events: {
          onReady: (event: any) => player.playVideo(),
          onStateChange: (event: any) => {
            if (event.data == YT.PlayerState.ENDED) {
              player.seekTo(0);
              player.stopVideo();
              this.onNextItem();
            }
          }
        }
      })  
    }, 10);
  }

  async onFacebookLoad() { 
    let player: any;
    this.isFacebookLoading.set(true);
    await this.fbService.onLoadSDK();
    this.fbTimerId = setTimeout(async () => {
      const fbPlayer = this.fbPlayerRef?.nativeElement;
      if (!fbPlayer) return;
      this.fbService.onFacebookParse(fbPlayer);

      const iframe = fbPlayer.querySelector('iframe');
      if (!iframe) return;      
      try {
        await FB.Event.unsubscribe('xfbml.ready');
        await FB.Event.subscribe('xfbml.ready', async (msg: any) => {     
          this.isFacebookLoading.set(false);
          if (msg.type === 'video' && msg.instance) {
            player = msg.instance;
            player.play();
            
            player.subscribe('finishedPlaying', () => {
              player.pause();
              this.onNextItem();
            });
          }
      
        });

      } catch (err) {
        console.warn('FB Player init failed', err);
        this.onNextItem();
      }
    }, 20);
  }

  onActiveTransitionClass() {
    const { type } = this.playlist.transition;
    switch (type) {
      case 'fade-in':
        return `opacity-0 animate-fade-in`;
      case 'slide-up':
        return `transform animate-slide-up`;
      case 'slide-down':
        return `transform animate-slide-down`;
      case 'slide-left':
        return `transform animate-slide-left`;
      case 'slide-right':
        return `transform animate-slide-right`;
      default:
        return '';
    }
  }

  onClearTimeout() {
    clearTimeout(this.timerId);
    clearTimeout(this.gapId);
    clearTimeout(this.transitionId);
    clearTimeout(this.fbTimerId);
  }
}

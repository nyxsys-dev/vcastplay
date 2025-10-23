import { Component, ElementRef, inject, Input, signal, SimpleChanges, ViewChild } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { Playlist } from '../playlist';
import { Assets } from '../../assets/assets';
import { DesignLayout } from '../../design-layout/design-layout';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { UtilityService } from '../../../core/services/utility.service';
import { SafeurlPipe } from '../../../core/pipes/safeurl.pipe';
import YouTubePlayer from 'youtube-player';

declare const FB: any;

@Component({
  selector: 'app-playlist-player',
  imports: [ PrimengUiModule, SafeurlPipe ],
  templateUrl: './playlist-player.component.html',
  styleUrl: './playlist-player.component.scss',
  animations: [
    trigger('fadeAnimation', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden <=> visible', animate('{{speed}}ms ease-in-out'), {
        params: { speed: 800 },
      }),
    ]),
  ]
})
export class PlaylistPlayerComponent {

  @Input() playlist!: Playlist;

  @ViewChild('fbPlayer') fbPlayerRef!: ElementRef<HTMLDivElement>;

  utils = inject(UtilityService);

  isPlaying = signal<boolean>(false);
  isTransitioning = signal<boolean>(false);
  currentIndex = signal<number>(0);
  currentItem = signal<Assets | DesignLayout | any>(null);
  nextPreloadedItem = signal<Assets | DesignLayout | any>(null);
  animationClasses = signal<string>('');

  private timerId: any;
  private gapId: any;

  ngOnInit() {
    this.onInitPlaylist();
    this.onRenderFacebookSDK();
  }

  ngOnChanges(changes: SimpleChanges) {
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
    const contents: number = this.playlist.contents.length;
    clearTimeout(this.timerId);
    clearTimeout(this.gapId);
    this.currentIndex.set(0);

    if (contents > 0) {
      this.currentItem.set(this.playlist.contents[0]);
      this.onPreloadNextItem();

      if (fromChange && this.isPlaying()) this.onStartPlayback();
    }
  }

  onStartPlayback() {
    const contents: number = this.playlist.contents.length;
    if (contents == 0) return;
    this.isPlaying.set(true);
    this.currentItem.set(this.playlist.contents[this.currentIndex()]);
    this.onPreloadNextItem();

    // if (this.currentItem().type == 'image') this.onImageLoaded(this.currentItem());
    // else if (this.currentItem().type == 'facebook') this.onFacebookLoad();    
  }

  onStopPlayback() {
    this.isPlaying.set(false);
    clearTimeout(this.timerId);
    clearTimeout(this.gapId);
    this.currentIndex.set(0);
    
    const video = document.querySelector('video');    
    if (video) {
      video.currentTime = 0;
      video.pause();
    }
  }

  onNextItem() {
    const { type, hasGap } = this.playlist.transition;
    const typeDuration = type ? 300 : 0;
    const gapDuration = hasGap ? 1500 : 0;
    clearTimeout(this.timerId);
    clearTimeout(this.gapId);
    
    setTimeout(() => {

      this.currentItem.set(null);

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
        this.onPreloadNextItem();

        // if (this.isPlaying() && this.currentItem().type == 'image') this.onImageLoaded(this.currentItem());
        if (this.currentItem().type == 'facebook') this.onFacebookLoad();
      }, gapDuration);
    }, typeDuration);    
  }

  onItemEnd() {
    const hasGap: boolean = this.playlist.transition.hasGap;    
    const gapDuration = hasGap ? 1500 : 0;
    // this.currentItem.set(null);
    // if (hasGap) {
    //   this.gapId = setTimeout(() => this.onNextItem(), gapDuration);
    // }
    // else 
    this.onNextItem();
  }

  onPreloadNextItem() {
    const nextIndex = (this.currentIndex() + 1) % this.playlist.contents.length;
    this.nextPreloadedItem.set(this.playlist.contents[nextIndex]);
  }

  onImageLoaded(item: Assets) {
    const duration = item.duration * 1000 || 5000;    
    this.timerId = setTimeout(() => this.onItemEnd(), duration);
  }

  onYoutubeLoad() {
    const ytPlayer = document.querySelector('iframe');    
    if (!ytPlayer) return;
    
    const youtube = YouTubePlayer(ytPlayer)
    youtube.on('ready', () => youtube.playVideo());
    youtube.on('stateChange', (event: any) => {
      if (event.data == 0) {
        youtube.stopVideo();
        this.onItemEnd();
      }
    })
  }

  onFacebookLoad() {
    let facebook: any = null;
    setTimeout(async () => {
      const fbPlayer = this.fbPlayerRef.nativeElement;
      
      if ((window as any).FB) await FB.Event.unsubscribe('xfbml.ready');
      
      await FB.Event.subscribe('xfbml.ready', async (msg: any) => {        
        if (msg.type === 'video' && msg.instance) {
          facebook = msg.instance;
        }
      });

      await FB.XFBML.parse(fbPlayer, async () => {
        facebook.play();
        facebook.subscribe('finishedPlaying', () => {
          console.log('Finished playing');
          facebook.pause();
          this.onItemEnd();
        });
      })
    }, 10);
  }
  
  private onRenderFacebookSDK(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).FB) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      (window as any).fbAsyncInit = () => {
        FB.init({ xfbml: true, version: 'v24.0' });
        resolve();
      };
    });
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
}

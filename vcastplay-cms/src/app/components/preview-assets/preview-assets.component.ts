import { Component, ElementRef, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SafeurlPipe } from '../../core/pipes/safeurl.pipe';
import { Assets } from '../../features/assets/assets';
import { UtilityService } from '../../core/services/utility.service';
import YouTubePlayer from 'youtube-player';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';

declare const FB: any;

@Component({
  selector: 'app-preview-assets',
  imports: [ SafeurlPipe, PrimengUiModule ],
  templateUrl: './preview-assets.component.html',
  styleUrl: './preview-assets.component.scss',
})
export class PreviewAssetsComponent {

  @ViewChild('video', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('image', { static: false }) imageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('iframe', { static: false }) iframeRef!: ElementRef<HTMLIFrameElement>;
  @ViewChild('ytPlayer') ytPlayerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fbPlayer') fbPlayerRef!: ElementRef<HTMLDivElement>;

  @Input() currentContent!: Assets | any;
  @Input() currentPlaying: any
  @Input() showControls: boolean = false;
  @Input() autoPlay: boolean = false;

  @Output() timeUpdate = new EventEmitter<any>();
  @Output() contentDuration = new EventEmitter<any>();

  utils = inject(UtilityService);
  private youtube: any;
  private fbVideo: any;

  constructor() { }

  async ngAfterViewInit() {
    if (this.currentContent) {
      if (this.currentContent.type == 'facebook') {
        await this.onRenderFacebookSDK();
      }
      await this.onLoadMedia(this.currentContent);      
      // if (this.currentContent.type == 'youtube') await this.youtube.getDuration().then((duration: number) => this.contentDuration.emit(duration));
      // if (this.currentContent.type == 'facebook') this.contentDuration.emit(this.fbVideo.getDuration());
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPlaying']) {
      await this.onLoadMedia(this.currentContent);
    }
  }

  ngOnDestroy() {
    if (this.currentContent?.type == 'video' && this.videoRef) {
      this.videoRef.nativeElement.currentTime = 0;
      this.videoRef.nativeElement.pause();
    }
  }

  onTimeUpdate(event: Event) {
    const video: HTMLVideoElement = event.target as HTMLVideoElement;
    const currentTime = video.currentTime;
    const duration = video.duration;
    this.timeUpdate.emit({ currentTime, duration });
  }
  
  private async onLoadMedia(content: any) {
    const video = this.videoRef?.nativeElement;
    const image = this.imageRef?.nativeElement;
    const iframe = this.iframeRef?.nativeElement;
    const ytPlayer = this.ytPlayerRef?.nativeElement;
    const fbPlayer = this.fbPlayerRef?.nativeElement;
    
    if (content.type == 'youtube' && ytPlayer) {
      const { videoId } = this.utils.onGetEmbedUrl(content.link);
      if (this.youtube) this.youtube.destroy();
      
      this.youtube = YouTubePlayer(ytPlayer, {
        videoId,
        playerVars: { 
          autoplay: this.autoPlay ? 1 : 0, 
          controls: 0, 
          loop: 1, 
          fs: 0,
          disablekb: 1, 
          playsinline: 1, 
        },
      })
      
      this.youtube.on('ready', () => {
        this.youtube.playVideo();
      })

      this.youtube.on('stateChange', (event: any) => {
        const { data } = event;
        if (data == 0) this.youtube.playVideo();
      })

      this.youtube.getDuration().then((duration: number) => this.contentDuration.emit(duration));
    }

    if (content.type == 'facebook' && fbPlayer) {

      if ((window as any).FB) await FB.Event.unsubscribe('xfbml.ready');
      
      await FB.Event.subscribe('xfbml.ready', async (msg: any) => {        
        if (msg.type === 'video' && msg.instance) {
          this.fbVideo = msg.instance;
        }
      });

      await FB.XFBML.parse(fbPlayer, async () => {
        const duration = await this.fbVideo.getDuration();
        this.contentDuration.emit(duration);
        this.fbVideo.play();
        

        // this.fbVideo.subscribe('finishedPlaying', () => {
        //   this.fbVideo.play();
        //   this.fbVideo.unMute();
        // })
      });
    }

    if (content.type == 'video' && video) {
      video.src = content.link;
      video.currentTime = 0;
      video.preload = 'auto';      
      video.addEventListener('loadeddata', () => {
        video.play();
      })
    }

    if (content.type == 'image' && image) image.src = content.link;

    if (content.type == 'web' && iframe) iframe.src = content.link;
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
}

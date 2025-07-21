import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { SafeurlPipe } from '../../core/pipes/safeurl.pipe';
import videojs from 'video.js';
import { PlatformService } from '../../core/services/platform.service';

@Component({
  selector: 'app-content-container',
  imports: [ SafeurlPipe ],
  templateUrl: './content-container.component.html',
  styleUrl: './content-container.component.scss'
})
export class ContentContainerComponent {

  @ViewChild('videoPlayer') videoPlayer: any;

  @Input() currentContent: any;
  @Input() isPlaying: boolean = false;
  @Input() showControls: boolean = false;
  @Input() autoPlay: boolean = false;

  @Output() timeUpdate = new EventEmitter<any>();

  platformService = inject(PlatformService);
  player: any;

  ngAfterViewInit() {
    if (!this.videoPlayer) return;
    this.player = videojs(this.videoPlayer.nativeElement, {
      // autoplay: this.autoPlay, 
      controls: this.showControls,
      preload: 'auto',
      muted: true,
      sources: {
        src: this.currentContent?.link,
        type: 'video/mp4'
      }
    } ,() => {
      console.log('player is ready');
      this.player.play();
    });

    this.player.on('loadeddata', () => {
      console.log('loadeddata');
      this.player.play();
    });    
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

  onTimeUpdate(event: Event) {
    const video: HTMLVideoElement = event.target as HTMLVideoElement;
    const currentTime = video.currentTime;
    const duration = video.duration;
    this.timeUpdate.emit({ currentTime, duration });
  }

  get platform() {    
    return this.platformService.platform;
  }
}

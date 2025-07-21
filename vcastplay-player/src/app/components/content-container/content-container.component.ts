import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SafeurlPipe } from '../../core/pipes/safeurl.pipe';
import videojs from 'video.js';

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

  player: any;

  ngAfterViewInit() {
    if (!this.videoPlayer) return;
    this.player = videojs(this.videoPlayer.nativeElement, {  } ,() => {
      console.log('player is ready');
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
}

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Assets } from '../../core/interfaces/assets';
import { SafeurlPipe } from '../../core/pipes/safeurl.pipe';

@Component({
  selector: 'app-preview-assets',
  imports: [ SafeurlPipe ],
  templateUrl: './preview-assets.component.html',
  styleUrl: './preview-assets.component.scss'
})
export class PreviewAssetsComponent {
  
  @ViewChild('video', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;

  @Input() currentContent!: Assets | any;
  @Input() currentPlaying: any

  @Output() timeUpdate = new EventEmitter<any>();

  ngOnChanges() {
    if (!this.currentPlaying) return;
    if (this.currentContent.type == 'video' && this.videoRef) {
      this.videoRef.nativeElement.currentTime = 0;
      this.videoRef.nativeElement.play();
    }
  }

  ngOnDestroy() {
    if (this.currentContent.type == 'video' && this.videoRef) {
      this.videoRef.nativeElement.currentTime = 0;
      this.videoRef.nativeElement.remove();
    }
  }

  onTimeUpdate(event: Event) {
    const video: HTMLVideoElement = event.target as HTMLVideoElement;
    const currentTime = video.currentTime;
    const duration = video.duration;    
    this.timeUpdate.emit({ currentTime, duration });
  }

  onVideoEnded(event: Event) {
    const video: HTMLVideoElement = event.target as HTMLVideoElement;
    // video.currentTime = 0;
    video.pause();
  }

}

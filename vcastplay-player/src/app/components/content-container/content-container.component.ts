import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeurlPipe } from '../../core/pipes/safeurl.pipe';

@Component({
  selector: 'app-content-container',
  imports: [ SafeurlPipe ],
  templateUrl: './content-container.component.html',
  styleUrl: './content-container.component.scss'
})
export class ContentContainerComponent {

  @Input() currentContent: any;
  @Input() isPlaying: boolean = false;
  @Input() showControls: boolean = false;
  @Input() autoPlay: boolean = false;

  @Output() timeUpdate = new EventEmitter<any>();

  onTimeUpdate(event: Event) {
    const video: HTMLVideoElement = event.target as HTMLVideoElement;
    const currentTime = video.currentTime;
    const duration = video.duration;
    this.timeUpdate.emit({ currentTime, duration });
  }
}

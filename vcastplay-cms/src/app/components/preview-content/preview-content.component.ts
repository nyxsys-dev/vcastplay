import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeurlPipe } from '../../core/pipes/safeurl.pipe';
import { Assets } from '../../core/interfaces/assets';

@Component({
  selector: 'app-preview-content',
  imports: [ SafeurlPipe ],
  templateUrl: './preview-content.component.html',
  styleUrl: './preview-content.component.scss'
})
export class PreviewContentComponent {

  @Input() currentContent!: Assets | null;
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

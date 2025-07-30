import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';

@Component({
  selector: 'app-scrubber-timeline',
  imports: [ PrimengUiModule ],
  templateUrl: './scrubber-timeline.component.html',
  styleUrl: './scrubber-timeline.component.scss'
})
export class ScrubberTimelineComponent {
  
  @Output() rangeChange = new EventEmitter<{ start: string; end: string }>();
  @ViewChild('timeline', { static: true }) timelineRef!: ElementRef<HTMLDivElement>;

  startSeconds = 8 * 3600; // 08:00
  endSeconds = 8 * 3600 + 15 * 60; // 08:15
  private readonly SNAP_INTERVAL = 15 * 60; // 15 min
  private readonly MIN_RANGE = 15 * 60; // 15 min
  private timelineWidth = 0;

  isResizingLeft = false;
  isResizingRight = false;
  isDraggingRange = false;
  initialX = 0;

  ngAfterViewInit() {
    this.timelineWidth = this.timelineRef.nativeElement.offsetWidth;
  }

  get startTime(): string {
    return this.formatTime(this.startSeconds);
  }

  get endTime(): string {
    return this.formatTime(this.endSeconds);
  }

  get startPosition(): number {
    return (this.startSeconds / 86400) * 100;
  }

  get endPosition(): number {
    return (this.endSeconds / 86400) * 100;
  }

  private formatTime(totalSeconds: number): string {
    totalSeconds = Math.floor(totalSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private snapTo15Min(seconds: number): number {
    return Math.max(0, Math.min(86400, Math.round(seconds / this.SNAP_INTERVAL) * this.SNAP_INTERVAL));
  }

  onMouseDown(event: MouseEvent, type: 'left' | 'right' | 'move') {
    this.initialX = event.clientX;
    this.isResizingLeft = type === 'left';
    this.isResizingRight = type === 'right';
    this.isDraggingRange = type === 'move';

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    const deltaX = event.clientX - this.initialX;
    const deltaSeconds = (deltaX / this.timelineWidth) * 86400;

    requestAnimationFrame(() => {
      if (this.isResizingLeft) {
        let newStart = this.startSeconds + deltaSeconds;
        if (newStart < 0) newStart = 0;
        if (this.endSeconds - newStart < this.MIN_RANGE) {
          newStart = this.endSeconds - this.MIN_RANGE;
        }
        this.startSeconds = newStart;
        this.initialX = event.clientX;
      }
      else if (this.isResizingRight) {
        let newEnd = this.endSeconds + deltaSeconds;
        if (newEnd > 86400) newEnd = 86400;
        if (newEnd - this.startSeconds < this.MIN_RANGE) {
          newEnd = this.startSeconds + this.MIN_RANGE;
        }
        this.endSeconds = newEnd;
        this.initialX = event.clientX;
      }
      else if (this.isDraggingRange) {
        const duration = this.endSeconds - this.startSeconds;
        let newStart = this.startSeconds + deltaSeconds;
        let newEnd = newStart + duration;

        if (newStart < 0) {
          newStart = 0;
          newEnd = duration;
        }
        if (newEnd > 86400) {
          newEnd = 86400;
          newStart = 86400 - duration;
        }

        this.startSeconds = newStart;
        this.endSeconds = newEnd;
        this.initialX = event.clientX;
      }

      // this.rangeChange.emit({ start: this.startTime, end: this.endTime });
    });
  };

  onMouseUp = () => {
    // Snap to 15-min increments only on release
    this.startSeconds = this.snapTo15Min(this.startSeconds);
    this.endSeconds = this.snapTo15Min(this.endSeconds);

    // Ensure minimum range is maintained
    if (this.endSeconds - this.startSeconds < this.MIN_RANGE) {
      this.endSeconds = this.startSeconds + this.MIN_RANGE;
    }

    this.rangeChange.emit({ start: this.startTime, end: this.endTime });

    this.isResizingLeft = false;
    this.isResizingRight = false;
    this.isDraggingRange = false;

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
}

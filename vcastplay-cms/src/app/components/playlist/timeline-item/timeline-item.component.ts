import { Component, Input } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { TimelineItem } from '../../../core/interfaces/timeline';

@Component({
  selector: 'app-timeline-item',
  imports: [ PrimengUiModule, ComponentsModule, DragDropModule ],
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.scss'
})
export class TimelineItemComponent {

  @Input() item: any;
  @Input() timelineItems: any;
  @Input() zoomLevel: any;

  resizing = false;
  resizeSide: 'left' | 'right' | null = null;
  resizingItem: TimelineItem | null = null;
  startX = 0;
  startPosition = 0;
  startDuration = 0;
  dragStartPositions = new Map<string, number>();
  

  onDragStarted(item: TimelineItem) {
    this.dragStartPositions.set(item.id, item.position);
  }

  onDragEnded(event: CdkDragEnd, item: TimelineItem) {
    const start = this.dragStartPositions.get(item.id) ?? item.position;
    const deltaX = event.distance.x;
    const deltaMinutes = Math.round(deltaX / this.zoomLevel);
    let newPos = Math.max(0, start + deltaMinutes);

    newPos = this.snapToClosestEdge(item, newPos);

    item.position = newPos;
    const el = event.source.getRootElement();
    if (el) el.style.transform = 'none';
  }
  

  snapToClosestEdge(item: TimelineItem, proposedPos: number): number {
    const SNAP_THRESHOLD = 3; // minutes
    const duration = item.duration;
    const others = this.timelineItems.filter((i: any) => i.id !== item.id);

    let closestSnap = proposedPos;
    let minDistance = Number.MAX_SAFE_INTEGER;

    for (const other of others) {
      const otherStart = other.position;
      const otherEnd = other.position + other.duration;

      const distToSnapLeft = Math.abs((proposedPos + duration) - otherStart);
      const distToSnapRight = Math.abs(proposedPos - otherEnd);

      if (distToSnapLeft <= SNAP_THRESHOLD) {
        if (distToSnapLeft < minDistance) {
          minDistance = distToSnapLeft;
          closestSnap = otherStart - duration;
        }
      }

      if (distToSnapRight <= SNAP_THRESHOLD) {
        if (distToSnapRight < minDistance) {
          minDistance = distToSnapRight;
          closestSnap = otherEnd;
        }
      }
    }

    return this.preventOverlap(item, Math.max(0, closestSnap));
  }

  preventOverlap(item: TimelineItem, proposedPos: number): number {
    const duration = item.duration;
    const others = this.timelineItems.filter((i: any) => i.id !== item.id).sort((a: any, b: any) => a.position - b.position);

    let position = proposedPos;
    let maxIterations = 50;

    while (maxIterations-- > 0) {
      let overlapped = false;

      for (const other of others) {
        const otherStart = other.position;
        const otherEnd = other.position + other.duration;
        const thisEnd = position + duration;

        const overlaps = !(thisEnd <= otherStart || position >= otherEnd);
        if (overlaps) {
          overlapped = true;
          if (position < otherStart) {
            position = otherStart - duration;
          } else {
            position = otherEnd;
          }
          break;
        }
      }

      if (!overlapped) break;
    }

    return Math.max(0, position);
  }
  
  isOverlapping(testItem: TimelineItem, self: TimelineItem): boolean {
    const testStart = testItem.position;
    const testEnd = testItem.position + testItem.duration;

    return this.timelineItems.some((item: any) => {
      if (item === self) return false;

      const start = item.position;
      const end = item.position + item.duration;

      return !(testEnd <= start || testStart >= end); // overlap
    });
  }
  
  onMouseMove = (event: MouseEvent) => {
    if (!this.resizing || !this.resizingItem) return;

    const deltaX = event.clientX - this.startX;
    const deltaMinutes = Math.round(deltaX / this.zoomLevel);
    let testItem: TimelineItem = { ...this.resizingItem };

    if (this.resizeSide === 'left') {
      const newPosition = Math.max(0, this.startPosition + deltaMinutes);
      const change = this.startPosition - newPosition;
      const newDuration = this.startDuration + change;
      testItem.position = newPosition;
      testItem.duration = newDuration;

      if (newDuration >= 5 && newPosition + newDuration <= 1440 && !this.isOverlapping(testItem, this.resizingItem)) {
        this.resizingItem.position = newPosition;
        this.resizingItem.duration = newDuration;
      }
    }

    if (this.resizeSide === 'right') {
      const newDuration = Math.max(5, this.startDuration + deltaMinutes);
      testItem.duration = newDuration;

      if (testItem.position + newDuration <= 1440 && !this.isOverlapping(testItem, this.resizingItem)) {
        this.resizingItem.duration = newDuration;
      }
    }
  };

  stopResizing = () => {
    this.resizing = false;
    this.resizingItem = null;
    this.resizeSide = null;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.stopResizing);
  };
  
  startResizing(event: MouseEvent, item: TimelineItem, side: 'left' | 'right') {
    event.preventDefault();
    this.resizing = true;
    this.resizeSide = side;
    this.resizingItem = item;
    this.startX = event.clientX;
    this.startPosition = item.position;
    this.startDuration = item.duration;

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.stopResizing);
  }
  
  formatTime(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}`;
  }

}

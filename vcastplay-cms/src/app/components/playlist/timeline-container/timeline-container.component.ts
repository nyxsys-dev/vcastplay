import { Component, computed, ElementRef, inject, Input, signal, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import moment from 'moment';
import { PlaylistService } from '../../../core/services/playlist.service';
import { TimelineItemComponent } from '../timeline-item/timeline-item.component';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

type ZoomLevel = 'hour' | 'minute' | 'second';

interface TimelineItem {
  id: number;
  label: string;
  start: number; // in seconds from 8am
  duration: number; // in seconds
}

@Component({
  selector: 'app-timeline-container',
  imports: [ PrimengUiModule, CommonModule, ComponentsModule, DragDropModule, TimelineItemComponent ],
  templateUrl: './timeline-container.component.html',
  styleUrl: './timeline-container.component.scss'
})
export class TimelineContainerComponent {

  @Input() startTime: moment.Moment = moment().startOf('day').hour(8);
  @Input() endTime: moment.Moment = moment().startOf('day').hour(18);

  playlistService = inject(PlaylistService);

  zoomLevels: ZoomLevel[] = ['hour', 'minute', 'second'];
  preventEnter = () => false;
  currentZoomIndex = 2;
  tickWidth = 80;

  zoomIn() {
    if (this.currentZoomIndex < this.zoomLevels.length - 1) {
      this.currentZoomIndex++;
    }
  }

  zoomOut() {
    if (this.currentZoomIndex > 0) {
      this.currentZoomIndex--;
    }
  }

  getTotalSeconds(): number {
    return (this.endTime.hour() - this.startTime.hour()) * 3600;
  }

  getTicks(): string[] {
    const ticks: string[] = [];
    for (let hour = this.startTime.hour(); hour < this.endTime.hour(); hour++) {
      if (this.zoomLevel === 'hour') {
        ticks.push(`${hour}:00`);
      } else if (this.zoomLevel === 'minute') {
        for (let min = 0; min < 60; min += 5) {
          ticks.push(`${hour}:${min.toString().padStart(2, '0')}`);
        }
      } else if (this.zoomLevel === 'second') {
        for (let min = 0; min < 60; min++) {
          for (let sec = 0; sec < 60; sec += 5) {
            ticks.push(`${hour}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`);
          }
        }
      }
    }
    return ticks;
  }

  onDroppedItem(event: CdkDragDrop<any[]>) {
    const duration = 60; // 1 hour default
    const position = this.getNextAvailablePosition(duration);
    const playlists = this.playlistItems();
    playlists.push({
      id: `${this.playlistItems().length + 1}`,
      name: `Track ${this.playlistItems().length + 1}`,
      position,
      duration
    });
    this.playlistItems.set(playlists)
  }
  
  getNextAvailablePosition(duration: number): number {
    if (this.playlistItems().length === 0) return 0;

    // Find the max end time
    const lastEnd = this.playlistItems().reduce(
      (max, item) => Math.max(max, item.position + item.duration),
      0
    );

    return Math.min(lastEnd, 1440 - duration); // keep within 24h
  }

  get zoomLevel(): ZoomLevel {
    return this.zoomLevels[this.currentZoomIndex];
  }
  
  get playlistItems() {
    return this.playlistService.playlistItems;
  }

}

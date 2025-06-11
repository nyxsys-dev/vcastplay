import { Component, computed, inject, Input, signal, } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { PlaylistService } from '../../../core/services/playlist.service';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AssetsService } from '../../../core/services/assets.service';
import { Assets } from '../../../core/interfaces/assets';
import { TimelineItemComponent } from '../timeline-item/timeline-item.component';
import { MessageService } from 'primeng/api';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-timeline-container',
  imports: [ PrimengUiModule, CommonModule, ComponentsModule, TimelineItemComponent ],
  templateUrl: './timeline-container.component.html',
  styleUrl: './timeline-container.component.scss'
})
export class TimelineContainerComponent {

  @Input() playListForm!: FormGroup;

  assets = signal<Assets[]>([]);

  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  message = inject(MessageService);

  ngOnInit() {
    this.assets.set(this.assetService.onGetAssets());    
  }

  onDropped(event: CdkDragDrop<string[]>) {
    const contents = this.contents?.value || [];
    const { previousIndex, previousContainer, currentIndex, container, item: { data } } = event;

    // If the item is from the same container (reordering)
    if (previousContainer == container) {
      moveItemInArray(contents, previousIndex, currentIndex);
      this.contents?.setValue([...contents]);
      return;
    }

    // If it's from another container (adding)
    const isExists = contents.some((item: Assets) => item.id === data.id);
    if (isExists) {
      this.message.add({ severity: 'error', summary: 'Error', detail: `"${data.name}" is already exists` });
      return;
    }

    // Add item
    contents.splice(currentIndex, 0, data);
    this.contents?.setValue([...contents]);
  }

  get contents() {
    return this.playListForm.get('contents');
  }
}

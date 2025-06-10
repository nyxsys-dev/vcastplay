import { Component, computed, inject, Input, signal, } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { PlaylistService } from '../../../core/services/playlist.service';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { CommonModule } from '@angular/common';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
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
    const { previousContainer, container, item: { data } } = event;
    const isExists = this.contents?.value.find((item: Assets) => item.id === data.id);
    if (isExists) {
      this.message.add({ severity: 'error', summary: 'Error', detail: `"${data.name}" is already exists` });
      return;
    };
    this.contents?.setValue([...this.contents?.value, data]);
  }

  get contents() {
    return this.playListForm.get('contents');
  }
}

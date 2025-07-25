import { Component, computed, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UtilityService } from '../../../core/services/utility.service';
import { FormControl, Validators } from '@angular/forms';
import { TagService } from '../../../core/services/tag.service';

@Component({
  selector: 'app-tags',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class TagsComponent {

  pageInfo: MenuItem = [ {label: 'Settings'}, {label: 'Tags'} ];

  utils = inject(UtilityService);
  tagService = inject(TagService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);

  audienceTagControl: FormControl = new FormControl(null, [ Validators.required ]);

  filteredAudienceTagList = computed(() => {
    const audienceTagLists = this.audienceTagsLists();
    return audienceTagLists.filter((audienceTag: any) => audienceTag.showInSettings);
  })

  filteredGroupCategoryList = computed(() => {
    const audienceTagLists = this.audienceTagsLists();
    return audienceTagLists.filter((audienceTag: any) => ['group', 'category'].includes(audienceTag.id));
  })

  onClickSave = (item: any, type: string, label: string) => {
    if (this.audienceTagControl.invalid) {
      this.message.add({ severity: 'error', summary: 'Error', detail: `Please input ${label}` });
      return
    };
    this.tagService.onSaveAudienceTags(item, type);
    this.audienceTagControl.reset();
  }

  onClickDelete = (event: Event, item: any, type: string) => {
    event.stopPropagation();
    this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this tag?',
      closable: true,
      closeOnEscape: true,
      header: 'Danger Zone',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.tagService.onDeleteAudienceTags(item, type);
        this.message.add({ severity:'success', summary: 'Success', detail: 'Tag deleted successfully!' });
      },
      reject: () => { }
    })
  }

  get audienceTagsLists() { return this.tagService.tagsLists; }
}

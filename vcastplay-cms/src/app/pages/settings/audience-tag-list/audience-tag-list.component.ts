import { Component, computed, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormControl, Validators } from '@angular/forms';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { UtilityService } from '../../../core/services/utility.service';
import { AudienceTagService } from '../../../core/services/audience-tag.service';

@Component({
  selector: 'app-audience-tag-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './audience-tag-list.component.html',
  styleUrl: './audience-tag-list.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class AudienceTagListComponent {

  pageInfo: MenuItem = [ {label: 'Settings'}, {label: 'Audience Tags'} ];

  utils = inject(UtilityService);
  audienceTagService = inject(AudienceTagService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);

  audienceTagControl: FormControl = new FormControl('', [ Validators.required ]);

  filteredAudienceTagList = computed(() => {
    const audienceTagLists = this.audienceTagsLists();
    return audienceTagLists.filter((audienceTag: any) => audienceTag.showInSettings);
  })

  onClickSave = (item: any, type: string, label: string) => {
    if (this.audienceTagControl.invalid) {
      this.message.add({ severity: 'error', summary: 'Error', detail: `Please input ${label}` });
      return
    };
    this.audienceTagService.onSaveAudienceTags(item, type);
    this.audienceTagControl.reset();
  }

  onClickDelete = (event: Event, item: any, type: string) => {
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
        this.audienceTagService.onDeleteAudienceTags(item, type);
        this.message.add({ severity:'success', summary: 'Success', detail: 'Tag deleted successfully!' });
      },
      reject: () => { }
    })
  }

  get audienceTagsLists() { return this.audienceTagService.audienceTagsLists; }
}

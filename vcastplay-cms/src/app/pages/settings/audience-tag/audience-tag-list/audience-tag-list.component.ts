import { Component, computed, inject } from '@angular/core';
import { PrimengUiModule } from '../../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AudienceTagService } from '../../../../core/services/audience-tag.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { FormControl, Validators } from '@angular/forms';

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

  onClickSave = (item: any, type: string) => {
    if (this.audienceTagControl.invalid) return;
    this.audienceTagService.onSaveAudienceTags(item, type);
    this.audienceTagControl.reset();
  }

  onClickDelete = (event: Event, item: any, type: string) => {
    this.audienceTagService.onDeleteAudienceTags(item, type);
  }

  get audienceTagsLists() { return this.audienceTagService.audienceTagsLists; }
}

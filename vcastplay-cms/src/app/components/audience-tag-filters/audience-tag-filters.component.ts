import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TagService } from '../../features/settings/tags/tag.service';

@Component({
  selector: 'app-audience-tag-filters',
  imports: [ PrimengUiModule ],
  templateUrl: './audience-tag-filters.component.html',
  styleUrl: './audience-tag-filters.component.scss'
})
export class AudienceTagFiltersComponent {

  @Input() audienceTagForm!: FormGroup;

  tagService = inject(TagService);

  audienceTags: any[] = [];
  audienceTagInputForm: FormGroup = new FormGroup({
    category: new FormControl(null, [ Validators.required ]),
    name: new FormControl(null, [ Validators.required ]),
  });

  categoryLists = signal<any[]>([]);

  filteredTagLists = computed(() => {
    return this.tagsLists().filter(tags => !['groups', 'subGroups', 'categories', 'subCategories'].includes(tags.id));
  })

  constructor() {
    this.category?.valueChanges.subscribe(value => {
      const lists = this.tagsLists().find((audienceTag: any) => audienceTag.name === value)
      this.categoryLists.set(lists?.data() || []);
    })
  }

  ngOnInit() {    
    this.audienceTags = this.tagService.onGetFilteres(this.audienceTag?.value);
  }

  onClickAddTag() {
    if (this.audienceTagInputForm.invalid) return;
    const tempData = this.audienceTags;
    const value = this.audienceTagInputForm.value;
    const index = tempData.findIndex(data => data.name == value.name && data.category == value.category);
    if (index == -1) tempData.push(value);
    this.audienceTags = [...tempData];
    this.audienceTagInputForm.reset();

    const newFilters = this.tagService.onGenerateFilters(this.audienceTags);
    this.audienceTagForm.patchValue({ audienceTag: newFilters });
  }

  onClickRemoveTag(index: number) {
    const tempData = this.audienceTags;
    tempData.splice(index, 1);
    this.audienceTags = [...tempData];

    const newFilters = this.tagService.onGenerateFilters(this.audienceTags);
    this.audienceTagForm.patchValue({ audienceTag: newFilters });
  }

  get category() {
    return this.audienceTagInputForm.get('category');
  }

  get tagsLists() { return this.tagService.tagsLists; }
  get ageGroups() { return this.tagService.ageGroups; }
  get genders() { return this.tagService.genders; }
  get audienceTag() { return this.audienceTagForm.get('audienceTag'); }
}

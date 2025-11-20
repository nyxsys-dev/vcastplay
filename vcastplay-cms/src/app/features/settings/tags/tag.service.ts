import { Injectable, signal } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'

@Injectable({
  providedIn: 'root',
})
export class TagService {
  // Groups
  groups = signal<any[]>(['Group 1', 'Group 2', 'Group 3'])

  // Sub Group
  subGroups = signal<any[]>(['Sub Group 1', 'Sub Group 2', 'Sub Group 3'])

  // Groups (new)
  group = signal<any[]>([
    {
      name: 'Group 1',
      subGroups: ['Sub Group 1.1', 'Sub Group 1.2', 'Sub Group 1.3'],
    },
    {
      name: 'Group 2',
      subGroups: ['Sub Group 2.1', 'Sub Group 2.2', 'Sub Group 2.3'],
    },
    {
      name: 'Group 3',
      subGroups: ['Sub Group 3.1', 'Sub Group 3.2', 'Sub Group 3.3'],
    },
  ])

  // Category (new)
  category = signal<any[]>([
    {
      name: 'Category 1',
      subCategories: ['Sub Category 1.1', 'Sub Category 1.2', 'Sub Category 1.3'],
    },
    {
      name: 'Category 2',
      subCategories: ['Sub Category 2.1', 'Sub Category 2.2', 'Sub Category 2.3'],
    },
    {
      name: 'Category 3',
      subCategories: ['Sub Category 3.1', 'Sub Category 3.2', 'Sub Category 3.3'],
    },
  ])

  // Category
  categories = signal<any[]>(['Category 1', 'Category 2', 'Category 3'])

  // Sub Category
  subCategories = signal<any[]>(['Sub Category 1', 'Sub Category 2', 'Sub Category 3'])

  // Demographics
  ageGroups = signal<any[]>(['Child', 'Teen', 'Young Adult', 'Adult', 'Middle Age', 'Senior'])
  genders = signal<any[]>(['Male', 'Female'])

  // Temporal
  timeOfDays = signal<any[]>([
    'Morning',
    'Afternoon',
    'Evening',
    'Night', // replaced “Late Night”
  ])

  sesonalities = signal<any[]>([
    'Summer',
    'Winter',
    'Spring', // added based on collected data
  ])

  // Geographics
  locations = signal<any[]>([
    'forest',
    'nature',
    'mountains',
    'beach',
    'tropical',
    'city',
    'hills',
    'countryside',
    'lake',
  ])

  pointOfInterests = signal<any[]>(['eco', 'travel', 'art', 'design', 'urban', 'nature'])

  // Tags
  tags = signal<any[]>([
    'nature',
    'water',
    'calm',
    'trees',
    'jungle',
    'green',
    'abstract',
    'grid',
    'digital',
    'sunrise',
    'mist',
    'mountains',
    'ocean',
    'drone',
    'beach',
    'tropical',
    'waterfall',
    'slow motion',
    'city',
    'lights',
    'timelapse',
    'snow',
    'sunset',
    'leaves',
    'bokeh',
    'aerial',
    'hills',
    'countryside',
    'frozen',
    'lake',
  ])

  audienceTagForm: FormGroup = new FormGroup({
    audienceTag: new FormGroup({
      genders: new FormControl([], { nonNullable: true }),
      ageGroups: new FormControl([], { nonNullable: true }),
      timeOfDays: new FormControl([], { nonNullable: true }),
      seasonalities: new FormControl([], { nonNullable: true }),
      locations: new FormControl([], { nonNullable: true }),
      pointOfInterests: new FormControl([], { nonNullable: true }),
      tags: new FormControl([], { nonNullable: true }),
    }),
  })

  tagsLists = signal<any[]>([
    // { id: 'group', name: 'Groups', data: this.group, formControlName: 'group', showInSettings: true },
    // { id: 'category', name: 'Categories', data: this.category, formControlName: 'category', showInSettings: true },

    {
      id: 'groups',
      name: 'Groups',
      data: this.groups,
      formControlName: 'groups',
      showInSettings: true,
    },
    {
      id: 'subGroups',
      name: 'Sub Groups',
      data: this.subGroups,
      formControlName: 'subGroups',
      showInSettings: true,
    },
    {
      id: 'categories',
      name: 'Categories',
      data: this.categories,
      formControlName: 'categories',
      showInSettings: true,
    },
    {
      id: 'subCategories',
      name: 'Sub Categories',
      data: this.subCategories,
      formControlName: 'subCategories',
      showInSettings: true,
    },

    {
      id: 'genders',
      name: 'Genders',
      data: this.genders,
      formControlName: 'genders',
      showInSettings: false,
    },
    {
      id: 'ageGroups',
      name: 'Age Groups',
      data: this.ageGroups,
      formControlName: 'ageGroups',
      showInSettings: false,
    },
    {
      id: 'timeOfDays',
      name: 'Time of Days',
      data: this.timeOfDays,
      formControlName: 'timeOfDays',
      showInSettings: true,
    },
    {
      id: 'sesonalities',
      name: 'Seasonality',
      data: this.sesonalities,
      formControlName: 'seasonalities',
      showInSettings: true,
    },
    {
      id: 'locations',
      name: 'Locations',
      data: this.locations,
      formControlName: 'locations',
      showInSettings: true,
    },
    {
      id: 'pointOfInterests',
      name: 'Point of Interests',
      data: this.pointOfInterests,
      formControlName: 'pointOfInterests',
      showInSettings: true,
    },
    { id: 'tags', name: 'Tags', data: this.tags, formControlName: 'tags', showInSettings: true },
  ])

  onLoadAudienceTags() {}

  // From table to object
  onGenerateFilters(selectedItems: any[]) {
    const tagDefs = this.tagsLists()

    // Build initial filter object with all formControlNames
    const filters = tagDefs.reduce((acc: any, def: any) => {
      acc[def.formControlName] = []
      return acc
    }, {})

    // Populate filter values from selectedItems
    selectedItems.forEach((item) => {
      const tagDef = tagDefs.find((def) => def.name === item.category)
      if (tagDef) {
        const key = tagDef.formControlName
        if (!filters[key].includes(item.name)) {
          filters[key].push(item.name)
        }
      }
    })

    return filters
  }

  // From object to table
  onGetFilteres(filters: any) {
    const tagDefs = this.tagsLists() // get the signal value

    const selectedItems = Object.entries(filters).flatMap(([key, values]) => {
      if (!Array.isArray(values) || values.length === 0) return []

      const def = tagDefs.find((d) => d.formControlName === key)
      if (!def) return []

      return values.map((val: string) => ({ category: def.name, name: val }))
    })

    return selectedItems
  }

  onSaveAudienceTags(item: string, type: string) {
    const tagData = this.tagsLists()
      .find((tag) => tag.id.includes(type))
      .data()
    const existingIndex = tagData.findIndex((existingItem: any) => existingItem === item)

    if (existingIndex !== -1) {
      tagData[existingIndex] = item
    } else {
      tagData.push(item)
    }

    this.setTagData(type, [...tagData])
  }

  onDeleteAudienceTags(item: string, type: string) {
    const tagData = this.tagsLists()
      .find((tag) => tag.id.includes(type))
      .data()
    const index = tagData.findIndex((data: any) => data === item)

    if (index !== -1) {
      tagData.splice(index, 1)
      this.setTagData(type, [...tagData])
    }
  }

  private setTagData(type: string, data: string[]) {
    switch (type) {
      case 'groups':
        this.groups.set(data)
        break
      case 'subGroups':
        this.subGroups.set(data)
        break
      case 'categories':
        this.categories.set(data)
        break
      case 'subCategories':
        this.subCategories.set(data)
        break
      case 'timeOfDays':
        this.timeOfDays.set(data)
        break
      case 'sesonalities':
        this.sesonalities.set(data)
        break
      case 'locations':
        this.locations.set(data)
        break
      case 'pointOfInterests':
        this.pointOfInterests.set(data)
        break
      default:
        this.tags.set(data)
        break
    }
  }
}

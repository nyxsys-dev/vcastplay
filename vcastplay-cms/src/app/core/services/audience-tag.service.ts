import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudienceTagService {

  // Demographics
  ageGroups = signal<any[]>([ "Child", "Teen", "Young Adult", "Adult", "Middle Age", "Senior" ]);
  genders = signal<any[]>([ "Male", "Female" ]);

  // Temporal
  timeOfDays = signal<any[]>(['Morning', 'Afternoon', 'Evening', 'Late Night']);
  sesonalities = signal<any[]>(['Summer', 'Winter', 'Holiday Periods']);

  // Geographics
  locations = signal<any[]>(['Local', 'Regional', 'National']);
  pointOfInterests = signal<any[]>(['Malls', 'Parks', 'Airport']);

  // Tags
  tags = signal<any[]>([]);
  
  audienceTagsLists = signal<any[]>([
    { id: 'genders', name: 'Genders', data: this.genders, formControlName: 'genders', showInSettings: false },
    { id: 'ageGroups', name: 'Age Groups', data: this.ageGroups, formControlName: 'ageGroups', showInSettings: false },
    { id: 'timeOfDays', name: 'Time of Days', data: this.timeOfDays, formControlName: 'timeOfDays', showInSettings: true },
    { id: 'sesonalities', name: 'Sesonality', data: this.sesonalities, formControlName: 'seasonalities', showInSettings: true },
    { id: 'locations', name: 'Locations', data: this.locations, formControlName: 'locations', showInSettings: true },
    { id: 'pointOfInterests', name: 'Point of Interests', data: this.pointOfInterests, formControlName: 'pointOfInterests', showInSettings: true },
    { id: 'tags', name: 'Tags', data: this.tags, formControlName: 'tags', showInSettings: true },
  ]);

  onLoadAudienceTags() {
    
  }

  // From table to object
  onGenerateFilters(selectedItems: any[]) {
    const tagDefs = this.audienceTagsLists();
    
    // Build initial filter object with all formControlNames
    const filters = tagDefs.reduce((acc: any, def: any) => {
      acc[def.formControlName] = [];
      return acc;
    }, {});

    // Populate filter values from selectedItems
    selectedItems.forEach(item => {
      const tagDef = tagDefs.find(def => def.name === item.category);
      if (tagDef) {
        const key = tagDef.formControlName;
        if (!filters[key].includes(item.name)) {
          filters[key].push(item.name);
        }
      }
    });

    return filters;
  }

  // From object to table
  onGetFilteres(filters: any) {
    const tagDefs = this.audienceTagsLists(); // get the signal value

    const selectedItems = Object.entries(filters).flatMap(([key, values]) => {
      if (!Array.isArray(values) || values.length === 0) return [];

      const def = tagDefs.find(d => d.formControlName === key);
      if (!def) return [];

      return values.map((val: string) => ({ category: def.name, name: val }));
    });

    return selectedItems;
  }

  onSaveAudienceTags(item: any, type: string) {
    let tempData = [];
    let index: number = 0;
    switch(type) {
      case 'timeOfDays':
        tempData = this.timeOfDays();
        index = tempData.findIndex(data => data == item);
        if (index !== -1) tempData[index] = item;
        else tempData.push(item);
        this.timeOfDays.set([...tempData]);
        break;
      case 'sesonalities':
        tempData = this.sesonalities();
        index = tempData.findIndex(data => data == item);
        if (index !== -1) tempData[index] = item;
        else tempData.push(item);
        this.sesonalities.set([...tempData]);
        break;
      case 'locations':
        tempData = this.locations();
        index = tempData.findIndex(data => data == item);
        if (index !== -1) tempData[index] = item;
        else tempData.push(item);
        this.locations.set([...tempData]);
        break;
      case 'pointOfInterests':
        tempData = this.pointOfInterests();
        index = tempData.findIndex(data => data == item);
        if (index !== -1) tempData[index] = item;
        else tempData.push(item);
        this.pointOfInterests.set([...tempData]);
        break;
      default:
        tempData = this.tags();
        index = tempData.findIndex(data => data == item);
        if (index !== -1) tempData[index] = item;
        else tempData.push(item);
        this.tags.set([...tempData]);
        break;
    }
  }
  
  onDeleteAudienceTags(item: any, type: string) {
    let tempData = [];
    let index: number = 0;
    switch(type) {
      case 'timeOfDays':
        tempData = this.timeOfDays();
        index = tempData.findIndex(data => data == item);
        if (index !== -1) tempData.splice(index, 1);
        this.timeOfDays.set([...tempData]);
        break;
      case 'sesonalities':
        tempData = this.sesonalities();
        index = tempData.findIndex(data => data == item);
        if (index !== -1) tempData.splice(index, 1);
        this.sesonalities.set([...tempData]);
        break;
      case 'locations':
        tempData = this.locations();
        index = tempData.findIndex(data => data == item);
        if (index !== -1) tempData.splice(index, 1);
        this.locations.set([...tempData]);
        break;
      case 'pointOfInterests':
        tempData = this.pointOfInterests();
        index = tempData.findIndex(data => data == item);
        if (index !== -1) tempData.splice(index, 1);
        this.pointOfInterests.set([...tempData]);
        break;
      default:
        tempData = this.tags();
        index = tempData.findIndex(data => data == item);
        if (index !== -1) tempData.splice(index, 1);
        this.tags.set([...tempData]);
        break;
    }
  }
}

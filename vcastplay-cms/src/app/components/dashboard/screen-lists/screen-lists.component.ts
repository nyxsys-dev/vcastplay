import { Component, computed, effect, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { Screen } from '../../../core/interfaces/screen';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilityService } from '../../../core/services/utility.service';


@Component({
  selector: 'app-screen-lists',
  imports: [ PrimengUiModule ],
  templateUrl: './screen-lists.component.html',
  styleUrl: './screen-lists.component.scss'
})
export class ScreenListsComponent {

  keywords = signal<string>('');
  status = signal<string>('All');
  statusOptions: any[] =[
    { label: 'All', value: 'All' },
    { label: 'Online', value: 'Online' },
    { label: 'Offline', value: 'Offline' }
  ]

  columnHeaders: string[] = ['Name', 'Resolution', 'Orientation', 'Status', 'Actions'];
  screens = signal<Screen[]>([
    { 
      id: 1, 
      name: "Main Screen", 
      resolution: "1920x1080", 
      layout: "Full Screen", 
      status: "online", 
      geolocation: { latitude: 14.6091, longitude: 121.0223 } // Makati
    },
    { 
      id: 2, 
      name: "Split Screen", 
      resolution: "1920x1080", 
      layout: "2 Zones", 
      status: "offline", 
      geolocation: { latitude: 14.6760, longitude: 121.0437 } // Quezon City
    },
    { 
      id: 3, 
      name: "Vertical Screen", 
      resolution: "1080x1920", 
      layout: "Single Zone", 
      status: "online", 
      geolocation: { latitude: 14.5515, longitude: 121.0207 } // Pasay
    },
    { 
      id: 4, 
      name: "Quad Screen", 
      resolution: "3840x2160", 
      layout: "4 Zones", 
      status: "offline", 
      geolocation: { latitude: 14.5896, longitude: 121.0647 } // Mandaluyong
    },
    { 
      id: 5, 
      name: "Custom Screen", 
      resolution: "1280x720", 
      layout: "Custom Grid", 
      status: "online", 
      geolocation: { latitude: 14.6096, longitude: 120.9870 } // Manila City
    }
  ])

  filterScreens = computed(() => {
    return this.screens().filter(screen =>
      screen.name.toLowerCase().includes(this.keywords().toLowerCase() || '') && (this.status() === 'All' || screen.status.toLowerCase() === this.status().toLowerCase())
    );
  });

  constructor(public utils: UtilityService) { }

  ngOnInit() { }  
}

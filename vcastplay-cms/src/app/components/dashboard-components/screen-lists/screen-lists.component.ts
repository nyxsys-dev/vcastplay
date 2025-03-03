import { Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Screen } from '../../../core/interfaces/screen';


@Component({
  selector: 'app-screen-lists',
  imports: [ PrimengUiModule ],
  templateUrl: './screen-lists.component.html',
  styleUrl: './screen-lists.component.scss'
})
export class ScreenListsComponent {

  filterStatus = signal<string>('online');
  screenStatus: any[] = [
    { label: 'Online', value: 'online' },
    { label: 'Offline', value: 'offline' }
  ]
  screenMap = viewChild.required<ElementRef>('screenMap');
  filteredScreen = computed(() => {
    return this.screens.filter(screen => screen.status == this.filterStatus());
  })

  private map!: L.Map;
  private markerClusterGroup!: L.MarkerClusterGroup; 


  screens: Screen[] = [
    { 
      id: 1, 
      name: "Main Screen", 
      resolution: "1920x1080", 
      layout: "Full Screen", 
      status: "online", 
      geolocation: { latitude: 37.7749, longitude: -122.4194 } // San Francisco, CA
    },
    { 
      id: 2, 
      name: "Split Screen", 
      resolution: "1920x1080", 
      layout: "2 Zones", 
      status: "offline", 
      geolocation: { latitude: 40.7128, longitude: -74.0060 } // New York, NY
    },
    { 
      id: 3, 
      name: "Vertical Screen", 
      resolution: "1080x1920", 
      layout: "Single Zone", 
      status: "online", 
      geolocation: { latitude: 34.0522, longitude: -118.2437 } // Los Angeles, CA
    },
    { 
      id: 4, 
      name: "Quad Screen", 
      resolution: "3840x2160", 
      layout: "4 Zones", 
      status: "offline", 
      geolocation: { latitude: 51.5074, longitude: -0.1278 } // London, UK
    },
    { 
      id: 5, 
      name: "Custom Screen", 
      resolution: "1280x720", 
      layout: "Custom Grid", 
      status: "online", 
      geolocation: { latitude: 48.8566, longitude: 2.3522 } // Paris, France
    }
  ]
  

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    if (this.map) this.map.remove();
    this.map = L.map(this.screenMap().nativeElement, { center: [37.7749, -122.4194], zoom: 13 });    
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: true,
      iconCreateFunction: function (cluster: any) {
        return L.divIcon({
          html: `<div class="circle blue">${cluster.getChildCount()}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [32, 32]
        });
      }
    });
    this.map.addLayer(this.markerClusterGroup);
    this.addMarkers();
  }
  private addMarkers(): void {
    this.filteredScreen().forEach(screen => {
      const marker = L.marker([screen.geolocation.latitude, screen.geolocation.longitude], {
        icon: L.divIcon({
          className: `custom-marker ${screen.status}`,
          html: `<div class="marker-dot"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      }).bindPopup(`
        <strong>${screen.name}</strong><br>
        Resolution: ${screen.resolution}<br>
        Layout: ${screen.layout}<br>
        Status: <span style="color: ${screen.status === 'online' ? 'green' : 'red'}">${screen.status}</span>
      `);

      this.markerClusterGroup.addLayer(marker);
    });
  }

}

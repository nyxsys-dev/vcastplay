import { Component, computed, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Screen } from '../../../core/interfaces/screen';

@Component({
  selector: 'app-screen-map',
  imports: [ PrimengUiModule ],
  templateUrl: './screen-map.component.html',
  styleUrl: './screen-map.component.scss'
})
export class ScreenMapComponent {

  keywords = signal<string>('');
  showFilter = signal<boolean>(false);
  
  private map!: L.Map;
  private markerClusterGroup!: L.MarkerClusterGroup; 

  screens: Screen[] = [
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
  ];
  

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    if (this.map) this.map.remove();
    this.map = L.map('screenMap', { center: [14.6090, 121.0223], zoom: 12, minZoom: 3, maxZoom: 18, zoomControl: false });    
    
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
    this.screens.forEach(screen => {
      const marker = L.marker([screen.geolocation.latitude, screen.geolocation.longitude], {
        icon: L.divIcon({
          className: `custom-marker`,
          html: `<div class="marker-dot flex justify-between items-center rounded-sm text-white p-3">
            <div class="text-center text-sm">${screen.name}</div> <span class=" ${screen.status}"></span>
          </div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      });
      // .bindPopup(`
      //   <strong>${screen.name}</strong><br>
      //   Resolution: ${screen.resolution}<br>
      //   Layout: ${screen.layout}<br>
      //   Status: <span style="color: ${screen.status === 'online' ? 'green' : 'red'}">${screen.status}</span>
      // `);

      this.markerClusterGroup.addLayer(marker);
    });
  }
}

import { Component, computed, effect, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { Screen } from '../../../core/interfaces/screen';
import * as L from 'leaflet';
import 'leaflet';
import 'leaflet.markercluster';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-screen-map',
  imports: [ PrimengUiModule ],
  templateUrl: './screen-map.component.html',
  styleUrl: './screen-map.component.scss'
})
export class ScreenMapComponent {

  keywords = signal<string>('');
  status = signal<string>('All');
  drawerVisible = signal<boolean>(false);
  selectedScreen = signal<Screen | null>(null);

  statusOptions: any[] =[
    { label: 'All', value: 'All' },
    { label: 'Online', value: 'Online' },
    { label: 'Offline', value: 'Offline' }
  ]
  showFilter = signal<boolean>(false);
  
  private map!: L.Map;
  private markerClusterGroup: any; 

  tileLink: string = 'https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=sWmX5SwjXmDHtQNDFmI7CyUgBqUvRzxpT6CM5sSbBLqxd3bpJxNNAZ2O4Rivf1Eo';

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
  ]);
  
  filterScreens = computed(() => {
    return this.screens().filter(screen =>
      screen.name.toLowerCase().includes(this.keywords().toLowerCase() || '') && (this.status() === 'All' || screen.status?.toLowerCase() === this.status().toLowerCase())
    );
  });

  onCreateDivIcon(screen: Screen) {
    return L.divIcon({
      className: `custom-marker`,
      html: `<div class="marker-dot flex flex-col justify-center items-center rounded-sm text-white p-3">
              <div class="flex justify-center items-center gap-3 text-center text-sm w-full">
                <i class="pi pi-desktop"></i>
              </div> 
            </div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  }

  constructor(public utils: UtilityService) {
    effect(() => {
      this.initializeMap();
    })
  }

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.selectedScreen.set(null);
    if (this.map) this.map.remove();
    this.map = L.map('screenMap', { center: [14.6090, 121.0223], zoom: 12, minZoom: 3, zoomControl: false, attributionControl: false });    
    
    L.tileLayer(this.tileLink, { maxZoom: 22 }).addTo(this.map);

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
    this.onAddMarkers();
  }
  onAddMarkers(): void {
    this.filterScreens().forEach(screen => {
      const marker = L.marker([screen.geolocation.latitude, screen.geolocation.longitude], {
        icon: this.onCreateDivIcon(screen)
      }).bindTooltip(screen.name, {
        permanent: false,
        direction: 'top',
        opacity: 0.9
      });

      this.markerClusterGroup.addLayer(marker);
      
      marker.on('click', ({ latlng }: any) => {
        const { lat, lng } = latlng;
        const screen: any = this.filterScreens().find(screen => screen.geolocation.latitude === lat && screen.geolocation.longitude === lng);
        this.selectedScreen.set(screen);
        this.map.flyTo({ lat: lat - 0.00005, lng }, 22);
        this.drawerVisible.set(true);
      })
    });
  }
  onClickScreen(screen: any) {
    this.selectedScreen.set(screen);
    this.map.flyTo({ lat: screen.geolocation.latitude, lng: screen.geolocation.longitude }, 22);
    this.drawerVisible.set(true);
  }

  get isMobile() {
    return this.utils.isMobile();
  }
}

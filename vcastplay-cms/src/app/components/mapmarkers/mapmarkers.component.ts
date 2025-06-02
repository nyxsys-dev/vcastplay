import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet';
import 'leaflet.markercluster';
import { Screen } from '../../core/interfaces/screen';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';

@Component({
  selector: 'app-mapmarkers',
  imports: [ PrimengUiModule ],
  templateUrl: './mapmarkers.component.html',
  styleUrl: './mapmarkers.component.scss'
})
export class MapmarkersComponent {

  @Input() markers: any[] = [];
  @Input() zoom: number = 12;
  @Input() minZoom: number = 3;
  @Input() maxZoom: number = 22;

  @Output() selectedScreen = new EventEmitter<Screen | any>();

  private map!: L.Map;
  private markerClusterGroup: any; 
  private mapDivIcon: L.DivIcon = L.divIcon({
    className: `custom-marker`,
    html: `<div class="marker-dot flex flex-col justify-center items-center rounded-sm text-white p-3">
            <div class="flex justify-center items-center gap-3 text-center text-sm w-full">
              <i class="pi pi-desktop"></i>
            </div> 
          </div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
  tileLink: string = 'https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=sWmX5SwjXmDHtQNDFmI7CyUgBqUvRzxpT6CM5sSbBLqxd3bpJxNNAZ2O4Rivf1Eo';

  ngOnInit() {
    this.initializedMap();
  }

  initializedMap() {
    if (this.map) this.map.remove();
    this.map = L.map('mapMarkers', { center: [14.6090, 121.0223], zoom: this.zoom, minZoom: this.minZoom, zoomControl: false, attributionControl: false });    
    
    L.tileLayer(this.tileLink, { maxZoom: this.maxZoom }).addTo(this.map);

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
    
    if (this.markers.length > 0) this.onAddMarkers();
    else this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.markerClusterGroup.clearLayers();
      const { lat, lng } = e.latlng;
      this.selectedScreen.emit({ geolocation: { latitude: lat, longitude: lng } });
      const marker = L.marker([ lat, lng ], {
        icon: this.mapDivIcon
      });

      this.markerClusterGroup.addLayer(marker);
    });
  }

  onAddMarkers(): void {    
    this.markers.forEach(markerData => {      
      const { geolocation, name }: any = markerData;
      const marker = L.marker([ geolocation.latitude, geolocation.longitude ], {
        icon: this.mapDivIcon
      }).bindTooltip(name, {
        permanent: false,
        direction: 'top',
        opacity: 0.9
      });

      this.map.setView([ geolocation.latitude, geolocation.longitude ], this.maxZoom - 2);

      this.markerClusterGroup.addLayer(marker);
      
      marker.on('click', ({ latlng }: any) => {
        const { lat, lng } = latlng;
        const screen: any = this.markers.find(marker => marker.geolocation.latitude === lat && marker.geolocation.longitude === lng);
        this.selectedScreen.emit(screen);
      })
    });
  }
}

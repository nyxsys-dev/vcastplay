import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet';
import 'leaflet.markercluster';
import { Screen } from '../../features/screens/screen';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { UtilityService } from '../../core/services/utility.service';

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

  utils = inject(UtilityService);

  private map!: L.Map;
  private markerClusterGroup: any;
  private mapIcon: L.Icon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  })
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

    this.onAddMarkers();

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.markerClusterGroup.clearLayers();
      const { lat, lng } = e.latlng;
      this.selectedScreen.emit({ latitude: lat, longitude: lng });
      const marker = L.marker([ lat, lng ], {
        icon: this.mapIcon
      });

      this.markerClusterGroup.addLayer(marker);
    });
  }

  onAddMarkers(): void {   
    this.markers.forEach(markerData => {       
      const { address, name }: any = markerData;
      const marker = L.marker([ address.latitude, address.longitude ], {
        icon: this.mapIcon
      }).bindTooltip(name, {
        permanent: false,
        direction: 'top',
        opacity: 0.9
      });

      this.map.setView([ address.latitude, address.longitude ], this.maxZoom - 2);

      this.markerClusterGroup.addLayer(marker);
      
      marker.on('click', ({ latlng }: any) => {
        const { lat, lng } = latlng;
        const screen: any = this.markers.find(marker => marker.address.latitude === lat && marker.address.longitude === lng);
        this.selectedScreen.emit(screen);
      })
    });
  }
}

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';

@Component({
  selector: 'app-map-manager',
  templateUrl: './map-manager.component.html',
  styleUrls: ['./map-manager.component.css']
})
export class MapManagerComponent implements OnInit {

   map!: L.Map;

  constructor() {}


  ngOnInit(): void {

    this.map = L.map('mapid').setView([41.902782, 12.496366], 11);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGlidXJvbjA3IiwiYSI6ImNramZ2em85NzNwZDQycG52M3NqbTZsbzQifQ.PyUsvBL-12oKzBldB2CPuA', {
      attribution: '',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
    }).addTo(this.map);

    this.locationHome.bind(this)();

   //this.map.locate({ setView: true, maxZoom: 16 });
   //this.map.on('locationfound', this.onLocationFound.bind(this));
   //this.map.on('locationerror', this.onLocationError.bind(this));*/
  }

  locationHome(): void {
    let radius = 5000;
    let icon = {
      icon: L.icon({
        iconSize: [25, 41],
        iconAnchor: [13, 0],
        // specify the path here
        iconUrl: '/assets/img/markers/marker-icon.png',
        shadowUrl: '/assets/img/markers/marker-shadow.png'
      })
    };
    L.marker([41.99232, 12.71876], icon).addTo(this.map);
    L.circle([41.99232, 12.71876], radius).addTo(this.map);
  }

  onLocationFound(e: { accuracy: any; latlng: L.LatLngLiteral | L.LatLngTuple; }): void {
    let radius = e.accuracy;
    let icon = {
      icon: L.icon({
        iconSize: [25, 41],
        iconAnchor: [13, 0],
        // specify the path here
        iconUrl: '/assets/img/markers/marker-icon.png',
        shadowUrl: '/assets/img/markers/marker-shadow.png'
      })
    };
    L.marker(e.latlng, icon).addTo(this.map);
    L.circle(e.latlng, radius).addTo(this.map);
  }

  onLocationError(e: { message: any; }) {
    alert(e.message);
  }

}

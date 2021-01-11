import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map-manager',
  templateUrl: './map-manager.component.html',
  styleUrls: ['./map-manager.component.css']
})
export class MapManagerComponent implements OnInit {

  map!: L.Map;

  private tileLayer = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGlidXJvbjA3IiwiYSI6ImNramZ2em85NzNwZDQycG52M3NqbTZsbzQifQ.PyUsvBL-12oKzBldB2CPuA';

  private mapOptions = {
    //L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: '',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token',
  }

  constructor(private spinner: NgxSpinnerService, private toaster: ToastrService) {}

  ngOnInit(): void {

    this.map = L.map('mapid').setView([41.902782, 12.496366], 11);
    L.tileLayer(this.tileLayer, this.mapOptions).addTo(this.map);
    this.map.removeControl(this.map.zoomControl)

    //this.locationHome.bind(this)();

   //EVENT MAP
   this.map.locate({ setView: true, maxZoom: 16 });
   this.map.on('locationfound', this.onLocationFound.bind(this));
   this.map.on('locationerror', this.onLocationError.bind(this));
   this.map.on('click', this.onMapClick.bind(this));
  }

/*  locationHome(): void {
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
*//*    L.marker([41.99232, 12.71876], icon).addTo(this.map);
    L.circle([41.99232, 12.71876], radius).addTo(this.map);*//*
  }*/

  onLocationFound(e: { accuracy: any; latlng: L.LatLngLiteral | L.LatLngTuple; }): void {

/*    this.toaster.success('geolocalizzaione attiva!');
    $('#back-to-top').removeClass('btn-primary').addClass('btn-success');*/
    let radius = e.accuracy;
    let icon = {
      icon: L.icon({
        iconSize: [25, 41],
        iconAnchor: [13, 40],
        popupAnchor: [0, -28],
        // specify the path here
        iconUrl: '/assets/img/markers/marker-icon.png',
        shadowUrl: '/assets/img/markers/marker-shadow.png'
      })
    };

/*    let icon2 = {
      icon: L.icon({
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        // specify the path here
        iconUrl: '/assets/img/markers/maps-and-flags.png',
        shadowUrl: '/assets/img/markers/marker-shadow.png'
      })
    };*/

    L.marker(e.latlng, icon).addTo(this.map).bindPopup('Sono qui!')//.openPopup(e.latlng);
    //L.marker([e.latlng.lat + 0.001, e.latlng.lng + 0.001], icon2).addTo(this.map).bindPopup('Sono qui!')//.openPopup(e.latlng);
    L.circle(e.latlng, radius).addTo(this.map);
  }

  onLocationError(e: { message: any; }) {
/*    this.toaster.error('Geolocalizzazione non attiva');
    $('#back-to-top').removeClass('btn-success').addClass('btn-primary');*/
    this.toaster.error(e.message);
  }

  onMapClick(e: any) {
    console.log(e);
    //this.map.setView([e.latlng.lat, e.latlng.lng], 12)
    L.popup()
      .setLatLng(e.latlng)
      .setContent(e.latlng.toString())
      .openOn(this.map);
  }
}

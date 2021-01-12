import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { from, fromEvent, of } from 'rxjs';
import { tap, map, switchMap, debounceTime, filter, catchError } from 'rxjs/operators';

interface MunicipoFeature {
  geometry: {
    type: string;
    coordinates: [];
  };
  properties: {};
  type: string;
}

interface MunicipiFeatureCollection {
  type: string;
  features: [];
  crs: {}
}

@Component({
  selector: 'app-map-manager',
  templateUrl: './map-manager.component.html',
  styleUrls: ['./map-manager.component.css']
})
export class MapManagerComponent implements OnInit {

  map!: L.Map;

  private municipiFeature: L.Polygon[] = []

  private tileLayer = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGlidXJvbjA3IiwiYSI6ImNramZ2em85NzNwZDQycG52M3NqbTZsbzQifQ.PyUsvBL-12oKzBldB2CPuA';

  private mapOptions = {
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

   //EVENT MAP
    this.map.locate({ setView: true, maxZoom: 11 });
    this.map.on('locationfound', this.onLocationFound.bind(this));
    this.map.on('locationerror', this.onLocationError.bind(this));
    this.map.on('click', this.onMapClick.bind(this));
    this.municipiMap()
  }

  onLocationFound(e: { accuracy: any; latlng: L.LatLngLiteral | L.LatLngTuple; }): void {
    let radius = e.accuracy;
    let icon = { 
      icon: L.icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        popupAnchor: [0, -28],
        iconUrl: '/assets/img/markers/marker-icon.png',
        shadowUrl: '/assets/img/markers/marker-shadow.png'
      })
    };

    L.marker(e.latlng, icon).addTo(this.map).bindPopup('Sono qui!')
    L.circle(e.latlng, radius).addTo(this.map);
  }

  onLocationError(e: { message: any; }) {
    this.toaster.error(e.message);
  }

  onMapClick(e: any) {
    console.log(e);
    L.popup()
      .setLatLng(e.latlng)
      .setContent(e.latlng.toString())
      .openOn(this.map);
  }

  getMunicipi() {
    return fetch('/assets/geojson/municipi.geojson', {method: 'GET'})
      .then(res => res.json())
      .catch(err => {
        this.toaster.error(err);
      });
  }

  municipiMap() {
    const p = this.getMunicipi()
    from(p).pipe(
      switchMap((data: MunicipiFeatureCollection) => from(data.features) || []),
    ).subscribe((municipioFeature: MunicipoFeature) => {
      this.displayMunicipio(municipioFeature);
    });
  }

  displayMunicipio(municipio: any) {
    L.geoJSON(municipio, {
      style: { fillOpacity: 0, weight: 0.3 },
      onEachFeature: this.onEachFeature
    })
    .addTo(this.map)
      .on('click', function (e) {
        (e.sourceTarget.options.fillOpacity == 0) ? e.target.setStyle({ fillOpacity: 0.3 }) : e.target.setStyle({ fillOpacity: 0});
      })
      //.on('mouseout', function (e) { e.target.setStyle({ fillOpacity: 0 }) })
  }

  onEachFeature(feature:any, layer: any) {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  }
}

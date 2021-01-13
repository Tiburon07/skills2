import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

//Leaflet
import * as L from 'leaflet';
import 'leaflet.heat'
import 'leaflet.markercluster'


//RXJS
import { from, fromEvent, of } from 'rxjs';
import { tap, map, switchMap, debounceTime, filter, catchError, distinct, } from 'rxjs/operators';
import { MapManagerService } from './map-manager-service';

interface MunicipoFeature {
  geometry: {
    type: string;
    coordinates: [];
  };
  properties: {
    com_catasto_code: string;
    com_istat_code: string;
    com_istat_code_num: number;
    minint_elettorale: string;
    name: string;
    op_id: string;
    opdm_id: string;
    prov_acr: string;
    prov_istat_code: string;
    prov_istat_code_num: number;
    prov_name: string;
    reg_istat_code: string
    reg_istat_code_num: number
    reg_name: string
  };
  type: string;
}

interface MunicipiFeatureCollection {
  type: string;
  features: [];
  crs: {}
}

interface Provincia {
  codice: string;
  nome: string
}

@Component({
  selector: 'app-map-manager',
  templateUrl: './map-manager.component.html',
  styleUrls: ['./map-manager.component.css']
})
export class MapManagerComponent implements OnInit {

  private map!: L.Map;
  private markerLoc!: L.Marker
  private circleLoc!: L.Circle

/*  private listaProvice!: MunicipoFeature[];
  private listaComuniByProvinciaSel!: MunicipoFeature[];*/

  private tileLayer = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGlidXJvbjA3IiwiYSI6ImNramZ2em85NzNwZDQycG52M3NqbTZsbzQifQ.PyUsvBL-12oKzBldB2CPuA';

  private mapOptions = {
    attribution: '',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token',
  }

  constructor(private spinner: NgxSpinnerService, private toaster: ToastrService, private service: MapManagerService) { }

  ngOnInit(): void {

    this.map = L.map('mapid').setView([41.902782, 12.496366], 11);
    L.tileLayer(this.tileLayer, this.mapOptions).addTo(this.map);
    this.map.removeControl(this.map.zoomControl)

    //GeoLocation
    this.markerLoc = L.marker([41.902782, 12.496366], { icon: L.icon({ iconSize: [25, 41], iconAnchor: [13, 41], popupAnchor: [0, -28], iconUrl: '/assets/img/markers/marker-icon.png', shadowUrl: '/assets/img/markers/marker-shadow.png' }) }).addTo(this.map)
    this.circleLoc = L.circle([41.902782, 12.496366], 10).addTo(this.map)
    //EVENT GeoLocation
    setInterval(() => {this.map.locate();}, 3000)//{ setView: true, maxZoom: 11 });}, 1000) //Geolocation
    this.map.on('locationfound', this.onLocationFound.bind(this));
    this.map.on('locationerror', this.onLocationError.bind(this));

    //Layers
    this.municipiMap();
    this.clasterMunicipiMap();
  }

  onLocationFound(e:any): void {
    this.markerLoc.setLatLng(e.latlng);
    this.circleLoc.setLatLng(e.latlng)
    this.circleLoc.setRadius(e.accuracy);
  }

  onLocationError(e: { message: any; }) {
    this.toaster.error(e.message);
  }

  municipiMap() {
    const p = this.service.getMunicipi()
    //Carico le features
    from(p).pipe(
      switchMap((data: MunicipiFeatureCollection) => from(data.features) || []),
    ).subscribe((municipioFeature: MunicipoFeature) => {
      this.displayMunicipio(municipioFeature);
    });

    //Imposto la lista delle province filtrando tra i municipi
    from(p).pipe(
      switchMap((data: MunicipiFeatureCollection) => from(data.features) || []),
      distinct((municipioFeature: MunicipoFeature) => municipioFeature.properties.prov_acr)
    ).subscribe(municipio => {$('#map_province').append(new Option(municipio.properties.prov_name, municipio.properties.prov_acr))});
  }

  clasterMunicipiMap() {
    const p = this.service.getCoordMunicipi()
    from(p).subscribe(municipi => { this.displayClaster(municipi) });
  }

  displayClaster(e: any) {
    var markers = L.markerClusterGroup();
    for (let i = 0; i < e.comuni.length - 2; i++)
      markers.addLayer(L.marker([e.comuni[i]['lat'], e.comuni[i]['lng']], { icon: L.icon({ iconSize: [40, 45], iconAnchor: [13, 41], popupAnchor: [0, -28], iconUrl: '/assets/img/markers/location-pin.png', shadowUrl: '/assets/img/markers/marker-shadow.png' }) }));
    this.map.addLayer(markers);
  }

  displayMunicipio(municipio: any) {
    L.geoJSON(municipio, { style: { fillOpacity: 0, weight: 0.3 } })
      .addTo(this.map)
      .on('click', function (e) {
        if (e.sourceTarget.options.fillOpacity == 0) {
          e.target.setStyle({ fillOpacity: 0.3 })
        } else {
          e.target.setStyle({ fillOpacity: 0 })
        }
      });//this.opacityMunicipi.bind(this))
  }

  opacityMunicipi(municipi: any) {
    (municipi.sourceTarget.options.fillOpacity == 0) ? municipi.target.setStyle({ fillOpacity: 0.3 }) : municipi.target.setStyle({ fillOpacity: 0 });
  }

  onClickMapMenu(e: any) {
    this.sortSelect('map_province');
  }

  sortSelect(id:any) {
    var sel = $(`#${id}`);
    var opts_list = sel.find('option');
    (<any>opts_list).sort((a: any, b: any) => { return $(a).text() > $(b).text() ? 1 : -1; });
    sel.empty().append(opts_list).val('');
  }
}

//Click Mappa
/*onMapClick(e: any) {
  console.log(e);
  L.popup()
    .setLatLng(e.latlng)
    .setContent(e.latlng.toString())
    .openOn(this.map);
}*/

//Ciclare le heature del geojson
/*L.geoJSON(municipio, {
  style: { fillOpacity: 0, weight: 0.3 }, //onEachFeature: this.onEachFeature
})
  .addTo(this.map)
  .on('click', this.opacityMunicipi.bind(this))*/

//Pop up click geojson
/*onEachFeature(feature: any, layer: any) {
  if (feature.properties && feature.properties.name) {
    let bodyPopUp = `<strong>Regione: </strong>${feature.properties.reg_name} </br>
                       <strong>Provincia: </strong>${feature.properties.prov_name} (${feature.properties.prov_acr}) </br>
                       <strong>Comune: </strong>${feature.properties.name} (${feature.properties.com_catasto_code})`
    layer.bindPopup(bodyPopUp);
  }
}*/

//heatLayer
/*L.heatLayer(
  [[e.latlng.lat, e.latlng.lng, (radius / 20)]],
  {
    minOpacity: 5,
    radius: 18,
    gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
  }
).addTo(this.map)*/

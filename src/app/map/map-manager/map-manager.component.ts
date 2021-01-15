import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

// Leaflet
import * as L from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';


// RXJS
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
  crs: {};
}

interface Provincia {
  codice: string;
  nome: string;
}

interface PosCurrent {
  lat: number;
  lng: number;
  accuracy: number;
}

@Component({
  selector: 'app-map-manager',
  templateUrl: './map-manager.component.html',
  styleUrls: ['./map-manager.component.css']
})
export class MapManagerComponent implements OnInit {

  //  ********* Map Initialization ****************
  private map!: L.Map;
  private ctlLayers!: any;
  private ctlScale!: any;
  private ctlMeasure!: any;

  public sideBar = 'info';

  //  ********* Layer Initialization ****************
  private lyrStreet = 'https://api.mapbox.com/styles/v1/tiburon07/ckjwqwp000hcv17q7s817olxj/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGlidXJvbjA3IiwiYSI6ImNramZ2em85NzNwZDQycG52M3NqbTZsbzQifQ.PyUsvBL-12oKzBldB2CPuA';
  private lyrSatellite = 'https://api.mapbox.com/styles/v1/tiburon07/ckjwqunda0eyr17o1u589jqro/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGlidXJvbjA3IiwiYSI6ImNramZ2em85NzNwZDQycG52M3NqbTZsbzQifQ.PyUsvBL-12oKzBldB2CPuA';
  private lyrNavigation = 'https://api.mapbox.com/styles/v1/tiburon07/ckjyan9y22jia17pubjlon48a/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGlidXJvbjA3IiwiYSI6ImNramZ2em85NzNwZDQycG52M3NqbTZsbzQifQ.PyUsvBL-12oKzBldB2CPuA';
  private lyrOutdoor = 'https://api.mapbox.com/styles/v1/tiburon07/ckjyaksnf1sk617mvwko9oih3/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGlidXJvbjA3IiwiYSI6ImNramZ2em85NzNwZDQycG52M3NqbTZsbzQifQ.PyUsvBL-12oKzBldB2CPuA';

  //  ********* Setup Layer COntrol****************
  private objBaseMaps!: any;
  private objOverlays!: any;
  private confiniComune!: any;
  private centroComune!: any;
  private lyrBreadcrumbs!: any;

  //  ********* Geolocalizzazione ****************
  private autolocate: any;
  private tracking: any;
  private markerLoc!: L.Marker;
  private circleLoc!: L.Circle;
  public posCurrent: PosCurrent = { lat: 0, lng: 0, accuracy: 0};
  public posLastTime!: any;
  public intervalGeoLoc = 3;
  public intervalTrack = 6;

  private streetMapOptions = { attribution: '', maxZoom: 18, id: 'street', tileSize: 512, zoomOffset: -1, accessToken: 'no-token' };
  private satelliteMapOptions = { attribution: '', maxZoom: 18, id: 'satellite', tileSize: 512, zoomOffset: -1, accessToken: 'no-token' };
  private navigationMapOptions = { attribution: '', maxZoom: 18, minNativeZoom: 1, id: 'navigazione', tileSize: 512, zoomOffset: -1, accessToken: 'no-token' };
  private outdoorsMapOptions = { attribution: '', maxZoom: 18, minNativeZoom: 1, id: 'outdoor', tileSize: 512, zoomOffset: -1, accessToken: 'no-token' };

  constructor(private spinner: NgxSpinnerService, private toaster: ToastrService, private service: MapManagerService) {
    this.confiniComune = L.layerGroup();
    this.centroComune = L.layerGroup();
    this.lyrBreadcrumbs = L.layerGroup();
    this.objOverlays = { 'Confini Comune': this.confiniComune, 'Centro Comune': this.centroComune, Monitoraggio: this.lyrBreadcrumbs};
    this.objBaseMaps = {
      Street: L.tileLayer(this.lyrStreet, this.streetMapOptions),
      Satellite: L.tileLayer(this.lyrSatellite, this.satelliteMapOptions),
      Navigazione: L.tileLayer(this.lyrNavigation, this.navigationMapOptions),
      Outdoors: L.tileLayer(this.lyrOutdoor, this.outdoorsMapOptions)
    };
    this.ctlLayers = L.control.layers(this.objBaseMaps, this.objOverlays);
    this.ctlScale = L.control.scale({ position: 'bottomleft', metric: true, maxWidth: 200, imperial: false });
  }

  ngOnInit(): void {

    // Inizializzo mappa
    this.map = L.map('mapid').setView([41.902782, 12.496366], 11);
    this.map.removeControl(this.map.zoomControl);
    this.map.addControl(this.ctlLayers);
    this.map.addControl(this.ctlScale);
    this.map.addLayer(this.objBaseMaps.Street);
    this.map.addLayer(this.lyrBreadcrumbs);

    // GeoLocation
    this.markerLoc = L.marker([41.902782, 12.496366], { icon: L.divIcon({ iconSize: [24, 12], iconAnchor: [12, 12], html: '<i class="fa fa-crosshairs fa-2x text-danger"></i>', className: 'divCross' })});
    this.circleLoc = L.circle([41.902782, 12.496366], 10);

    // Event GeoLocation
    this.map.on('locationfound', this.onLocationFound.bind(this));
    this.map.on('locationerror', this.onLocationError.bind(this));

    // Layers
    this.municipiMap();
    this.clasterMunicipiMap();
  }

  onLocationFound(e: any): void {
    e = this.randomizePos(e);
    this.markerLoc.setLatLng(e.latlng).remove().addTo(this.map);
    this.circleLoc.setLatLng(e.latlng).remove().addTo(this.map);
    this.circleLoc.setRadius(e.accuracy);
    this.posCurrent = { lat: e.latlng.lat, lng: e.latlng.lng, accuracy: e.accuracy};
    this.posLastTime = new Date();
  }

  onLocationError(e: { message: any; }) {
    this.toaster.error(e.message);
  }

  municipiMap() {
    const p = this.service.getMunicipi();
    // Carico le features
    from(p).pipe(
      switchMap((data: MunicipiFeatureCollection) => from(data.features) || []),
    ).subscribe((municipioFeature: MunicipoFeature) => {
      this.displayMunicipio(municipioFeature);
    });

    // Imposto la lista delle province filtrando tra i municipi
    from(p).pipe(
      switchMap((data: MunicipiFeatureCollection) => from(data.features) || []),
      distinct((municipioFeature: MunicipoFeature) => municipioFeature.properties.prov_acr)
    ).subscribe(municipio => {$('#map_province').append(new Option(municipio.properties.prov_name, municipio.properties.prov_acr)); });
  }

  clasterMunicipiMap() {
    const p = this.service.getCoordMunicipi();
    from(p).subscribe(municipi => { this.displayClaster(municipi); });
  }

  displayClaster(e: any) {
    const markers = L.markerClusterGroup();
    for (let i = 0; i < e.comuni.length - 2; i++) {
      markers.addLayer(L.marker([e.comuni[i].lat, e.comuni[i].lng], { icon: L.icon({ iconSize: [40, 45], iconAnchor: [13, 41], popupAnchor: [0, -28], iconUrl: '/assets/img/markers/location-pin.png', shadowUrl: '/assets/img/markers/marker-shadow.png' }) }));
    }
    this.centroComune.addLayer(markers);
  }

  displayMunicipio(municipio: any) {
    this.confiniComune.addLayer(L.geoJSON(municipio, { style: { fillOpacity: 0, weight: 0.5, color: 'red' }}));
  }

  onChangeGeoloc(e: any) {
    if (e.target.checked) {
      this.autolocate = setInterval(() => { this.map.locate(); }, this.intervalGeoLoc * 1000);
      if ($('#switchTrack').prop('checked')) {
        this.startTracking();
      }
    } else {
      this.map.stopLocate();
      clearInterval(this.autolocate);
      this.markerLoc.remove();
      this.circleLoc.remove();
      this.posCurrent = { lat: 0, lng: 0, accuracy: 0};
      this.posLastTime = null;
    }
  }

  sliderSecondsChange(e: any) {
    this.intervalGeoLoc = e.target.value;
    if ($('#switchLoc').prop('checked')) {
      clearInterval(this.autolocate);
      this.autolocate = setInterval(() => { this.map.locate(); }, this.intervalGeoLoc * 1000);
    }
  }

  onChangeTracking(e: any){
    if (e.target.checked && $('#switchLoc').prop('checked')) { this.startTracking(); }
    else { clearInterval(this.tracking); }
  }

  sliderTrackSecondsChange(e: any) {
    this.intervalTrack = e.target.value;
    if ($('#switchLoc').prop('checked')) {
      clearInterval(this.tracking);
      this.startTracking();
    }
  }

  startTracking() {
    this.tracking = setInterval(() => {
      let radius = Math.min(200, this.posCurrent.accuracy / 2);
      radius = Math.max(10, radius);
      const mrkBreadcrumb = L.circle([this.posCurrent.lat, this.posCurrent.lng], { radius, color: 'green' }).addTo(this.map);
      this.lyrBreadcrumbs.addLayer(mrkBreadcrumb);
    }, this.intervalTrack * 1000);
  }

  onClickMapMenuInfo(e: any) {
    const collInfo = $('.collapseInfo')
    if (collInfo.hasClass('in')) { collInfo.removeClass('in'); }
    else { collInfo.addClass('in'); }
  }


  // *******************UTILITI********************
  randomizePos(e: any) {
    const offsetX = Math.random() * 0.000100 - 0.00025;
    const offsetY = Math.random() * 0.000100 - 0.00025;
    e.latitude = e.latitude + offsetX;
    e.longitude = e.longitude + offsetY;
    e.latlng = L.latLng([e.latitude, e.longitude]);
    return e;
  }

  // randomizePos(e: any) {
  //   return e;
  // }

  sortSelect(id: any) {
    const sel = $(`#${id}`);
    const opts_list = sel.find('option');
    (opts_list as any).sort((a: any, b: any) => $(a).text() > $(b).text() ? 1 : -1);
    sel.empty().append(opts_list).val('');
  }

  opacityMunicipi(municipi: any) {
    (municipi.sourceTarget.options.fillOpacity == 0) ? municipi.target.setStyle({ fillOpacity: 0.3 }) : municipi.target.setStyle({ fillOpacity: 0 });
  }

  onClickMapMenu(e: any) { this.sortSelect('map_province'); }
}


// Click Mappa
/*onMapClick(e: any) {
  console.log(e);
  L.popup()
    .setLatLng(e.latlng)
    .setContent(e.latlng.toString())
    .openOn(this.map);
}*/

// Ciclare le heature del geojson
/*L.geoJSON(municipio, {
  style: { fillOpacity: 0, weight: 0.3 }, //onEachFeature: this.onEachFeature
})
  .addTo(this.map)
  .on('click', this.opacityMunicipi.bind(this))*/

// Pop up click geojson
/*onEachFeature(feature: any, layer: any) {
  if (feature.properties && feature.properties.name) {
    let bodyPopUp = `<strong>Regione: </strong>${feature.properties.reg_name} </br>
                       <strong>Provincia: </strong>${feature.properties.prov_name} (${feature.properties.prov_acr}) </br>
                       <strong>Comune: </strong>${feature.properties.name} (${feature.properties.com_catasto_code})`
    layer.bindPopup(bodyPopUp);
  }
}*/

// heatLayer
/*L.heatLayer(
  [[e.latlng.lat, e.latlng.lng, (radius / 20)]],
  {
    minOpacity: 5,
    radius: 18,
    gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
  }
).addTo(this.map)*/

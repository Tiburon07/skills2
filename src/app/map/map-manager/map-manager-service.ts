import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Injectable()

export class MapManagerService {

  private apiUrl = ""

  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private toaster: ToastrService) { }

  getMunicipi() {
    this.spinner.show();
    return fetch('/assets/geojson/municipi.geojson', { method: 'GET' })
      .then(res => {
        this.spinner.hide();
        return res.json();
      })
      .catch(err => {
        this.spinner.hide();
        this.toaster.error(err);
      });
  }

  getCoordMunicipi() {
    this.spinner.show();
    return fetch('/assets/geojson/coordinateComuni.geojson', { method: 'GET' })
      .then(res => {
        this.spinner.hide();
        return res.json();
      })
      .catch(err => {
        this.spinner.hide();
        this.toaster.error(err);
      });
  }
}

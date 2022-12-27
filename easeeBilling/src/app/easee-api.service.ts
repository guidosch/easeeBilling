import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PowerUsage, Permission } from './Chargers'


const API_CHARGER_CONSUMPTION = "https://api.easee.cloud/api/chargers/{id}/usage/hourly/{from}/{to}";

const API_CHARGER_PERMISSIONS = "https://api.easee.cloud/api/chargers/{id}/permission";

@Injectable({
  providedIn: 'root'
})
export class EaseeApiService {

  constructor(private http: HttpClient) { }

  getChargerConsumption(id: string, from: string, to: string): Observable<PowerUsage[]> {
    let url = API_CHARGER_CONSUMPTION.replace("{id}", id);
    url = url.replace("{from}", from);
    url = url.replace("{to}", to);

    return this.http.get<PowerUsage[]>(url);
  }

  getChargerPermissions(id: string): Observable<Permission[]> {
    let url = API_CHARGER_PERMISSIONS.replace("{id}", id);

    return this.http.get<Permission[]>(url);
  }

}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PowerUsage, Permission } from './Chargers'
import { Products } from './Products';


const API_CHARGER_CONSUMPTION = "https://api.easee.cloud/api/chargers/{id}/usage/hourly/{from}/{to}";

const API_CHARGER_PERMISSIONS = "https://api.easee.cloud/api/chargers/{id}/permission";

const API_PRODUCTS = "https://api.easee.cloud/api/accounts/products";

@Injectable({
  providedIn: 'root'
})
export class EaseeApiService {

  constructor(private http: HttpClient) { }

  getChargerConsumption(id: string, from: string, to: string): Observable<PowerUsage[]> {
    let url = API_CHARGER_CONSUMPTION.replace("{id}", id);
    url = url.replace("{from}", from);
    url = url.replace("{to}", to);

    return this.http.get<PowerUsage[]>(url).pipe(catchError(this.handleError));
  }

  getChargerPermissions(id: string): Observable<Permission[]> {
    let url = API_CHARGER_PERMISSIONS.replace("{id}", id);

    return this.http.get<Permission[]>(url).pipe(catchError(this.handleError));
  }

  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(API_PRODUCTS).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}

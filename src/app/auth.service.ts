import { HttpHeaders, HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, tap, catchError } from 'rxjs';
import { TokenService } from './token.service';
import { Credentials } from './Credentials';
import { LoginResponse } from './LoginResponse'
import { User } from './User'

const API_URL = 'https://api.easee.cloud/api/accounts/';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/*+json',
    'accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl = '';

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned error: ${JSON.stringify(error)}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  private static log(message: string): any {
    console.log(message);
  }
  constructor(private http: HttpClient, private tokenService: TokenService) { }

  login(loginData: any): Observable<any> {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    const body: Credentials = {
      userName: loginData.username,
      password: loginData.password
    }

    return this.http.post<LoginResponse>(API_URL + "login", body, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          this.tokenService.saveToken(res.accessToken);
          this.tokenService.saveRefreshToken(res.refreshToken);
        }),
        catchError(AuthService.handleError)
      );
  }

  refreshToken(refreshData: any): Observable<any> {
    const data = {
      refreshToken: refreshData.refreshToken,
      accessToken: refreshData.accessToken
    }
    return this.http.post<any>(API_URL+"refresh_token", data, HTTP_OPTIONS)
    .pipe(
      tap(res => {
          this.tokenService.removeToken();
          this.tokenService.removeRefreshToken();
          this.tokenService.saveToken(res.accessToken);
          this.tokenService.saveRefreshToken(res.refreshToken);
        }),
        catchError(AuthService.handleError)
      );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
  }

  secured(): Observable<User> {
    return this.http.get<User>(API_URL + 'profile');
  }
}

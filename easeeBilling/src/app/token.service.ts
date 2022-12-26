import { Injectable } from '@angular/core';

const ACCESS_TOKEN: string = 'accessToken';
const REFRESH_TOKEN: string = 'refreshToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN) || "";
  }

  getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN) || "";
  }

  saveToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  saveRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

  removeToken(): void {
    localStorage.removeItem(ACCESS_TOKEN);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN);
  }
}

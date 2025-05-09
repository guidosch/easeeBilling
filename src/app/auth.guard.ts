import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  

  /**
   * Interface that a class can implement to be a guard deciding if a route can be activated.
   * If all guards return true, navigation continues. If any guard returns false, navigation is cancelled.
   * @param next 
   * @param state 
   * @returns 
   */
  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }
  
  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router){}

  checkLogin(url: string): boolean {
    if (this.tokenService.getRefreshToken()) {
      return true;
    }

    this.authService.redirectUrl = url;
    this.router.navigate(['/login']).then(_ => false);
    return false;
  }
  
}

/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockRoute = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['getRefreshToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    authSpy.redirectUrl = '';

    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true when a refresh token exists', () => {
      tokenService.getRefreshToken.and.returnValue('validRefreshToken');

      const result = guard.canActivate(mockRoute, { url: '/secure' } as RouterStateSnapshot);

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should return false when no refresh token is stored', () => {
      tokenService.getRefreshToken.and.returnValue('');

      const result = guard.canActivate(mockRoute, { url: '/secure' } as RouterStateSnapshot);

      expect(result).toBe(false);
    });

    it('should redirect to /login when no refresh token is stored', () => {
      tokenService.getRefreshToken.and.returnValue('');

      guard.canActivate(mockRoute, { url: '/secure' } as RouterStateSnapshot);

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should store the attempted URL on AuthService when redirecting', () => {
      tokenService.getRefreshToken.and.returnValue('');

      guard.canActivate(mockRoute, { url: '/secure' } as RouterStateSnapshot);

      expect(authService.redirectUrl).toBe('/secure');
    });
  });
});

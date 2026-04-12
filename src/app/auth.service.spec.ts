import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

const API_URL = 'https://api.easee.cloud/api/accounts/';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, TokenService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should POST credentials to login endpoint', () => {
      const loginData = { username: 'user@test.com', password: 'secret' };

      service.login(loginData).subscribe();

      const req = httpMock.expectOne(API_URL + 'login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userName: 'user@test.com', password: 'secret' });
      req.flush({ accessToken: 'a', refreshToken: 'r' });
    });

    it('should save access and refresh tokens on successful login', () => {
      service.login({ username: 'u', password: 'p' }).subscribe();

      const req = httpMock.expectOne(API_URL + 'login');
      req.flush({ accessToken: 'access123', refreshToken: 'refresh123' });

      expect(tokenService.getToken()).toBe('access123');
      expect(tokenService.getRefreshToken()).toBe('refresh123');
    });

    it('should remove existing tokens before the HTTP call', () => {
      tokenService.saveToken('oldAccess');
      tokenService.saveRefreshToken('oldRefresh');

      service.login({ username: 'u', password: 'p' }).subscribe();

      // Tokens are removed synchronously before the HTTP call resolves
      expect(tokenService.getToken()).toBe('');
      expect(tokenService.getRefreshToken()).toBe('');

      httpMock.expectOne(API_URL + 'login').flush({ accessToken: 'new', refreshToken: 'newR' });
    });
  });

  describe('refreshToken', () => {
    it('should POST to refresh_token endpoint', () => {
      service.refreshToken({ accessToken: 'old', refreshToken: 'oldR' }).subscribe();

      const req = httpMock.expectOne(API_URL + 'refresh_token');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ accessToken: 'old', refreshToken: 'oldR' });
      req.flush({ accessToken: 'newA', refreshToken: 'newR' });
    });

    it('should replace stored tokens with the refreshed ones', () => {
      tokenService.saveToken('staleAccess');
      tokenService.saveRefreshToken('staleRefresh');

      service.refreshToken({ accessToken: 'staleAccess', refreshToken: 'staleRefresh' }).subscribe();

      const req = httpMock.expectOne(API_URL + 'refresh_token');
      req.flush({ accessToken: 'freshAccess', refreshToken: 'freshRefresh' });

      expect(tokenService.getToken()).toBe('freshAccess');
      expect(tokenService.getRefreshToken()).toBe('freshRefresh');
    });
  });

  describe('logout', () => {
    it('should remove both tokens', () => {
      tokenService.saveToken('access');
      tokenService.saveRefreshToken('refresh');

      service.logout();

      expect(tokenService.getToken()).toBe('');
      expect(tokenService.getRefreshToken()).toBe('');
    });
  });

  describe('secured', () => {
    it('should GET the user profile endpoint', () => {
      const mockUser = { firstName: 'John', lastName: 'Doe' };

      service.secured().subscribe(user => {
        expect(user).toEqual(mockUser as any);
      });

      const req = httpMock.expectOne(API_URL + 'profile');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });
});

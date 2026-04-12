import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { NotificationService } from './NotificationSerivce';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['getToken', 'getRefreshToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authSpy = jasmine.createSpyObj('AuthService', ['refreshToken']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    authSpy.refreshToken.and.returnValue(of({}));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('request headers', () => {
    it('should add Authorization Bearer header when an access token exists', () => {
      tokenService.getToken.and.returnValue('myAccessToken');
      tokenService.getRefreshToken.and.returnValue('');

      httpClient.get('/test').subscribe();

      const req = httpMock.expectOne('/test');
      expect(req.request.headers.get('Authorization')).toBe('Bearer myAccessToken');
      req.flush({});
    });

    it('should not add Authorization header when no token exists', () => {
      tokenService.getToken.and.returnValue('');
      tokenService.getRefreshToken.and.returnValue('');

      httpClient.get('/test').subscribe();

      const req = httpMock.expectOne('/test');
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should add Accept: application/json header', () => {
      tokenService.getToken.and.returnValue('token');
      tokenService.getRefreshToken.and.returnValue('');

      httpClient.get('/test').subscribe();

      const req = httpMock.expectOne('/test');
      expect(req.request.headers.get('Accept')).toBe('application/json');
      req.flush({});
    });

    it('should add content-type header when request has no Content-Type', () => {
      tokenService.getToken.and.returnValue('');
      tokenService.getRefreshToken.and.returnValue('');

      httpClient.get('/test').subscribe();

      const req = httpMock.expectOne('/test');
      expect(req.request.headers.get('content-type')).toBe('application/json');
      req.flush({});
    });
  });

  describe('error handling', () => {
    it('should redirect to /login on 401 with non-OK statusText', () => {
      tokenService.getToken.and.returnValue('token');
      tokenService.getRefreshToken.and.returnValue('refresh');

      httpClient.get('/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/test');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });

    it('should show error notification on 400 with errorCode 100 (wrong credentials)', () => {
      tokenService.getToken.and.returnValue('');
      tokenService.getRefreshToken.and.returnValue('');

      httpClient.get('/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/test');
      req.flush(
        { errorCode: 100, title: 'Wrong username or password' },
        { status: 400, statusText: 'Bad Request' }
      );

      expect(notificationService.showError).toHaveBeenCalledWith('Wrong username or password');
    });

    it('should show error notification on 400 without errorCode 100 (time range too large)', () => {
      tokenService.getToken.and.returnValue('');
      tokenService.getRefreshToken.and.returnValue('');

      httpClient.get('/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/test');
      req.flush(
        { errorCode: 200, message: 'Interval too large' },
        { status: 400, statusText: 'Bad Request' }
      );

      expect(notificationService.showError).toHaveBeenCalled();
    });

    it('should redirect to /login on 500 server error', () => {
      tokenService.getToken.and.returnValue('');
      tokenService.getRefreshToken.and.returnValue('');

      httpClient.get('/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/test');
      req.flush({ title: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });

      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });
  });
});

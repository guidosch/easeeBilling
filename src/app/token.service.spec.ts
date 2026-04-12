import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveToken / getToken', () => {
    it('should save and retrieve the access token', () => {
      service.saveToken('myAccessToken');
      expect(service.getToken()).toBe('myAccessToken');
    });

    it('should return empty string when no access token is stored', () => {
      expect(service.getToken()).toBe('');
    });
  });

  describe('saveRefreshToken / getRefreshToken', () => {
    it('should save and retrieve the refresh token', () => {
      service.saveRefreshToken('myRefreshToken');
      expect(service.getRefreshToken()).toBe('myRefreshToken');
    });

    it('should return empty string when no refresh token is stored', () => {
      expect(service.getRefreshToken()).toBe('');
    });
  });

  describe('removeToken', () => {
    it('should remove the access token', () => {
      service.saveToken('someToken');
      service.removeToken();
      expect(service.getToken()).toBe('');
    });

    it('should not affect the refresh token when removing access token', () => {
      service.saveToken('access');
      service.saveRefreshToken('refresh');
      service.removeToken();
      expect(service.getRefreshToken()).toBe('refresh');
    });
  });

  describe('removeRefreshToken', () => {
    it('should remove the refresh token', () => {
      service.saveRefreshToken('someRefreshToken');
      service.removeRefreshToken();
      expect(service.getRefreshToken()).toBe('');
    });

    it('should not affect the access token when removing refresh token', () => {
      service.saveToken('access');
      service.saveRefreshToken('refresh');
      service.removeRefreshToken();
      expect(service.getToken()).toBe('access');
    });
  });
});

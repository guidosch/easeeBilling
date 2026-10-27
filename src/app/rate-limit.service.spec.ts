import { TestBed } from '@angular/core/testing';
import { formatWait, MAX_REQUESTS, RateLimitService, WINDOW_MS } from './rate-limit.service';

describe('RateLimitService', () => {
  const start = new Date('2026-01-01T10:00:00Z');

  beforeEach(() => {
    localStorage.removeItem('easeeRequestTimestamps');
    localStorage.removeItem('easeeBlockedUntil');
    jasmine.clock().install();
    jasmine.clock().mockDate(start);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    localStorage.removeItem('easeeRequestTimestamps');
    localStorage.removeItem('easeeBlockedUntil');
  });

  function create(): RateLimitService {
    return TestBed.runInInjectionContext(() => new RateLimitService());
  }

  function recordMany(service: RateLimitService, n: number) {
    for (let i = 0; i < n; i++) {
      service.record();
    }
  }

  it('should start with all requests available', () => {
    const service = create();
    expect(service.used()).toBe(0);
    expect(service.remaining()).toBe(MAX_REQUESTS);
    expect(service.msUntilAvailable(15)).toBe(0);
  });

  it('should count recorded requests', () => {
    const service = create();
    recordMany(service, 15);
    expect(service.used()).toBe(15);
    expect(service.remaining()).toBe(MAX_REQUESTS - 15);
  });

  it('should drop requests older than the window', () => {
    const service = create();
    recordMany(service, 10);
    jasmine.clock().tick(WINDOW_MS + 1);
    expect(service.used()).toBe(0);
  });

  it('should compute the wait time until enough requests are free', () => {
    const service = create();
    recordMany(service, MAX_REQUESTS - 50);
    jasmine.clock().tick(60 * 1000);
    recordMany(service, 45);
    //5 left, 15 needed -> wait until the 10th oldest request drops out
    expect(service.msUntilAvailable(15)).toBe(WINDOW_MS - 60 * 1000);
    expect(service.msUntilAvailable(5)).toBe(0);
  });

  it('should persist the counter across instances', () => {
    recordMany(create(), 20);
    expect(create().used()).toBe(20);
  });

  it('should block after a 429 response', () => {
    const service = create();
    service.block(30 * 1000);
    expect(service.msUntilAvailable(1)).toBe(30 * 1000);
    jasmine.clock().tick(30 * 1000);
    expect(service.msUntilAvailable(1)).toBe(0);
  });

  it('should format the wait time as m:ss', () => {
    expect(formatWait(0)).toBe('0:00');
    expect(formatWait(61 * 1000)).toBe('1:01');
    expect(formatWait(4 * 60 * 1000 + 500)).toBe('4:01');
  });
});

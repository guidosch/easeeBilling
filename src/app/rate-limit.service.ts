import { Injectable } from '@angular/core';
import { map, Observable, timer } from 'rxjs';

//Easee allows max. 500 requests in a rolling window of 5 minutes. 500 kicks me out, so trying with 450
export const MAX_REQUESTS = 450;
export const WINDOW_MS = 5 * 60 * 1000;
const STORAGE_KEY = 'easeeRequestTimestamps';
const BLOCKED_UNTIL_KEY = 'easeeBlockedUntil';

export interface RateLimitStatus {
  used: number;
  remaining: number;
  waitMs: number; //time until the requested number of requests can be made again
}

/**
 * Counts the requests to the easee api on the client side. Timestamps are stored in the localStorage
 * as the app reloads the page on some errors which would reset the counter.
 */
@Injectable({
  providedIn: 'root'
})
export class RateLimitService {

  private timestamps: number[] = [];
  private blockedUntil = 0;

  constructor() {
    this.timestamps = readNumbers(STORAGE_KEY);
    this.blockedUntil = Number(readItem(BLOCKED_UNTIL_KEY)) || 0;
  }

  record(): void {
    this.prune();
    this.timestamps.push(Date.now());
    writeItem(STORAGE_KEY, JSON.stringify(this.timestamps));
  }

  used(): number {
    this.prune();
    return this.timestamps.length;
  }

  remaining(): number {
    return Math.max(0, MAX_REQUESTS - this.used());
  }

  /**
   * Milliseconds to wait until n requests can be made without hitting the rate limit.
   */
  msUntilAvailable(n: number): number {
    const now = Date.now();
    const blockedMs = Math.max(0, this.blockedUntil - now);
    const missing = Math.min(n, MAX_REQUESTS) - this.remaining();
    if (missing <= 0) {
      return blockedMs;
    }
    //the oldest requests drop out of the window first
    const freedAt = this.timestamps[missing - 1] + WINDOW_MS;
    return Math.max(blockedMs, freedAt - now);
  }

  /**
   * Called when the api answered with 429 (too many requests).
   */
  block(ms?: number): void {
    this.prune();
    if (ms === undefined || isNaN(ms)) {
      ms = this.timestamps.length > 0 ? this.timestamps[0] + WINDOW_MS - Date.now() : WINDOW_MS;
    }
    this.blockedUntil = Date.now() + ms;
    writeItem(BLOCKED_UNTIL_KEY, String(this.blockedUntil));
  }

  /**
   * Emits the current status every second (for the countdown in the ui).
   * @param requestsPerLoad function returning the number of requests one data load needs
   */
  status(requestsPerLoad: () => number): Observable<RateLimitStatus> {
    return timer(0, 1000).pipe(map(() => ({
      used: this.used(),
      remaining: this.remaining(),
      waitMs: this.msUntilAvailable(requestsPerLoad())
    })));
  }

  private prune(): void {
    const limit = Date.now() - WINDOW_MS;
    const count = this.timestamps.length;
    this.timestamps = this.timestamps.filter(timestamp => timestamp > limit);
    if (count !== this.timestamps.length) {
      writeItem(STORAGE_KEY, JSON.stringify(this.timestamps));
    }
  }
}

export function formatWait(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ':' + String(seconds).padStart(2, '0');
}

function readNumbers(key: string): number[] {
  try {
    const parsed = JSON.parse(readItem(key) || '[]');
    return Array.isArray(parsed) ? parsed.filter(n => typeof n === 'number').sort((a, b) => a - b) : [];
  } catch {
    return [];
  }
}

function readItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    //storage not available, counter works in memory only
  }
}

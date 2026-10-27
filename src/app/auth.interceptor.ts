import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { TokenService } from './token.service';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NotificationService } from "./NotificationSerivce";
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private notification: NotificationService,
    private rateLimit: RateLimitService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): any {

    const token = this.tokenService.getToken();
    const refreshToken = this.tokenService.getRefreshToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json'
        }
      });
    }

    //count requests against the easee rate limit
    if (request.url.startsWith('https://api.easee.cloud/')) {
      this.rateLimit.record();
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        console.log("error.status: "+error.status);
        if (error.status === 429) {
          //too many requests
          const retryAfter = error.headers?.get('Retry-After');
          this.rateLimit.block(retryAfter ? Number(retryAfter) * 1000 : undefined);
          this.notification.showError("Rate Limit der Easee API erreicht. Bitte warten...");
          return throwError(() => new Error("Rate limit reached..."));
        }
        if (error.status === 401) {
          if (error.statusText === 'OK') {
            //handle refresh token expired
            if (error.error && error.error.errorCode === 104) {
              this.router.navigate(['login']).then(_ => console.log('redirect to login'));
              return throwError(() => new Error("Refresh token expired..."));
            }
            this.authService.refreshToken({ refreshToken: refreshToken, accessToken: token })
              .subscribe(() => {
                location.reload();
              });
          } else {
            this.router.navigate(['login']).then(_ => console.log('redirect to login'));
          }
        } else if (error.status === 400) {
          let customError = error as any;
          if (customError.error.errorCode === 100) {
            //wrong username or pw
            console.log(customError.error.title)
            this.notification.showError(customError.error.title)
            return throwError(() => new Error(customError.error.title));
          } else {
            //normally means that the time range is too large
            console.log(error.error)
            this.notification.showError(error.error)
            return throwError(() => new Error("Interval zu gross..."));
          }
        } else if (error.status === 405) {
          // auth calls should be done by now and try to reload.
          location.reload();

        } else if (error.status === 0 || error.status >=500) {  //cors error or server error
          this.router.navigate(['login']).then(_ => console.log('redirect to login'));
          error.error.title = "Something went wrong. Please login again."
        }
        if (error.error && error.error.title){
          this.notification.showError(error.error.title);
        } else {
          this.notification.showError("Request failed...");
        }
        //do not redirect to login page as some unknown errors are caught here
        return throwError(() => new Error("Request failed..."));
      }));
  }

}


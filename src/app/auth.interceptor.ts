import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { TokenService } from './token.service';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NotificationService } from "./NotificationSerivce";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private notification: NotificationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): any {

    const token = this.tokenService.getToken();
    const refreshToken = this.tokenService.getRefreshToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401) {
          if (error.statusText === 'OK') {
            this.authService.refreshToken({ refresh_token: refreshToken })
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
        }
        let msg = error.error.title !== undefined ? error.error.title : "Request failed...";
        this.notification.showError(msg);
        //does not make sense as if one of the requests fails a redirect is done.
        //this.router.navigate(['login']).then(_ => console.log('redirect to login'));
        return throwError(() => new Error("Request failed..."));
      }));
  }

}


import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private cookieService:CookieService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        const error = err.message;
        if (err.status === 401) {
          if (err.error.status === 'UNAUTHORIZED') {
            // this.router.navigate(['/unauthorized-page']);
            this.toastr.error(err?.error?.message);
          } else {
            // auto logout if 401 response returned from api
            this.cookieService.remove('token');
          }
        } else if (err.status === 403) {
          //this.authService.logout();
          // this.router.navigate(['/unauthorized-page']);
        }  else if (err.status === 500) {
          //this.authService.logout();
          // this.router.navigate(['/unauthorized-page']);
          this.toastr.error('Internal Server Error');
        }else {
          this.toastr.error(
            err?.error?.debugMessage
              ? err?.error?.debugMessage
              : err?.error?.result
              ? err?.error?.result
              : err?.error?.message
              ? err?.error?.message
              : 'Something went wrong!'
          );
        }
        return throwError(error);
      })
    );
  }
}

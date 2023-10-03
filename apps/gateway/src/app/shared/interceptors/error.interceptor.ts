import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        const error = err.message;
        if (
          err.error?.debugMessage !== 'User Is Not Found' &&
          err.status !== 503
        ) {
          if (err.status === 401) {
            if (err.error.status === 'UNAUTHORIZED') {
              this.router.navigate(['/unauthorized-page']);
            } else {
              // auto logout if 401 response returned from api
              // this.authService.logout();
            }
          }
          if (err.status === 403) {
            //this.authService.logout();
            this.router.navigate(['/unauthorized-page']);
          }
          this.toastr.error(
            err?.error?.debugMessage
              ? err?.error?.debugMessage
              : err?.error?.result
              ? err?.error?.result
              : 'Something went wrong!'
          );
        }

        return throwError(error);
      })
    );
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(request)
    return next.handle(request).pipe(
      catchError((err) => {
        console.warn('EL ERR', err);
        const error = err.message;
        if (err.status === 401) {
          if (err.error.status === 'UNAUTHORIZED') {
            // this.router.navigate(['/unauthorized-page']);
          } else {
            // auto logout if 401 response returned from api
            this.authService.logout();
          }
        } else if (err.status === 403) {
          //this.authService.logout();
          // this.router.navigate(['/unauthorized-page']);
        } else {
          this.toastr.error(
            err?.error?.debugMessage ? err?.error?.debugMessage : error
          );
        }
        return throwError(error);
      })
    );
  }
}

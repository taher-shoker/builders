import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of, throwError } from 'rxjs';
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
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          if (err.error.status === 'UNAUTHORIZED') {
            // this.router.navigate(['/unauthorized-page']);
          } else {
            // auto logout if 401 response returned from api
            this.authService.logout();
          }
        } else {
          console.log('toatser', err?.error?.errorDetailsMessage);
          if (err.error.message == 'RESOURCE_NOT_FOUND') {
            this.toastr.error('No data for this year or quarter');
          } else {
            this.toastr.error(
              err?.error?.message
                ? err?.error?.message
                : 'Something went wrong!'
            );
          }
        }
        return throwError(err);
      })
    );
  }
}

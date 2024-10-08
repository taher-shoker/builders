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
          console.log('toatser', err?.error?.message);
          this.toastr.error(
            err?.error?.errorDetailsMessage
              ? err?.error?.errorDetailsMessage == 'Resource not found'
                ? 'No data for this year or quarter'
                : err?.error?.errorDetailsMessage
              : 'Something went wrong!'
          );
        }
        return throwError(err);
      })
    );
  }
}

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
import { AuthService } from '../auth.service';

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
          this.toastr.error(
            err.error.errorDetailsMessage
              ? err.error.errorDetailsMessage
              : 'Something went wrong!'
          );
        }
        return throwError(err);
      })
    );
  }
}

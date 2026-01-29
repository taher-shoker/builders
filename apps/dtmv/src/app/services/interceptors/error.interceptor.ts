import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
        console.log(err, 'erorororrr');

        const error = err.message;
        const skipToastr = request.headers.get('X-Skip-Toastr') === 'true';
        if (err.status === 401) {
          if (err.error.status === 'UNAUTHORIZED') {
            this.authService.logout();
          } else {
            // auto logout if 401 response returned from api
            this.authService.logout();
          }
        } else if (err.status === 403) {
          //this.authService.logout();
          // this.router.navigate(['/unauthorized-page']);
        } else {
          const shouldSkip = skipToastr && err.status === 400;
          if (!shouldSkip) {
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
        }
        return throwError(error);
      })
    );
  }
}

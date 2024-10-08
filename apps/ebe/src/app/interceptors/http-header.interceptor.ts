import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.cookieService.get('token') || null;
    const gToken = this.cookieService.get('tokenGenerated') || null;
    const type = this.cookieService.get('tokenType') || '';
    if (token) {
      console.log('found');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Authorization-Generated': `Bearer ${gToken}`,
          'Access-Token-Type': type,
          'System' : 'DI_Milestones'
        },
      });
    } else {
      const defaultToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJidXNpbmVzc19leGNlbGxhbmNlX2FkbWluQHFlZW1hLm5ldCIsImV4cCI6MTcyMzA1MTY3MiwiaWF0IjoxNzIzMDMzNjcyfQ.u4y6w4HCtow8IeNwtEvIoj0xXEqjqGTFxUXHTK_jmi99W_idLnKl9a-EEyRttPLEQHzzeE777QOFCyWkqR0DEA';
      this.cookieService.put('token' , defaultToken);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${defaultToken}`,
          // 'Authorization-Generated': `Bearer ${defaultToken}`,
          'Access-Token-Type': type,
          'System' : 'DI_Milestones'
        },
      });
    }
    return next.handle(request);
  }
}

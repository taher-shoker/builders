import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
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
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Authorization-Generated': `Bearer ${gToken}`,
          'Access-Token-Type': type,
        },
      });
    }

    return next.handle(request);

    //* uncomment to modify the HTTP RESPONSE
    // return next.handle(modifiedReq).pipe(map((event: HttpEvent<any>) => {
    //   if (event instanceof HttpResponse){
    //     event = event.clone({body: this.modifyBody(event.body)})
    //   }

    //   return event
    // }))
  }

  // private modifyBody(body: any){
  //   body = body.data = 'tested in angular, dummy text'
  // }
}

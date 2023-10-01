import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
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
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJidV91c2VyQHFlZW1hLm5ldCIsImV4cCI6MTY5NjcwODMzMCwiaWF0IjoxNjk1NjI4MzMwfQ.UFy_RMiARelNpuF3E9WEcR8IZqphonv5xCPu_Xoez_WX77xD2OJyvMf9XqlrHFqnFL0i6TwcSzIjXLyIcVAX1w`,
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

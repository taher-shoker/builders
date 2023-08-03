

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor{

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJodXNzaWVuLmVzc2FtQHFlZW1hLm5ldCIsImV4cCI6MTY5MTA3MjAxMywiaWF0IjoxNjkxMDU0MDEzfQ.rgJvcgdgJ7kLLjHNKdnCWhy20qJEUQ5bLHx1-tJeriApqo0zcDy_IP7KkcpIjdjFwpkBAZSc58p5Xgy50bYeqA` // change the token with the current one : ${localStorage.getItem("taburJWTToken")}
      }
    })

    return next.handle(modifiedReq)

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

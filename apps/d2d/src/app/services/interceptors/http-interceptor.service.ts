

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor{

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbnRlY2giLCJleHAiOjE2OTQwNjM1OTMsImlhdCI6MTY5MDQ2MzU5M30.v0U-Ir4NKdGyzQdK3LTkKwQYw-3I4XU4Z4iqIpnuTg4AOR89KiCNDubiGaRzY3QnJmJUThQcpm_jHOnCN_N8gw` // change the token with the current one : ${localStorage.getItem("taburJWTToken")}
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

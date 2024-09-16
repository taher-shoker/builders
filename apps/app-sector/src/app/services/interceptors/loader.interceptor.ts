import { Injectable, NgZone } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loaderService: LoaderService, private ngZone: NgZone) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const excludedUrls = ['/api/v2/scrs/notification'];
    const shouldExclude = excludedUrls.some((url) => request.url.includes(url));
    if (!shouldExclude) {
      this.totalRequests++;
      this.loaderService.setLoading(true);
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (!shouldExclude) {
          this.totalRequests--;
          if (this.totalRequests === 0) {
            this.loaderService.setLoading(false);
          }
        }
      })
    );
  }
}

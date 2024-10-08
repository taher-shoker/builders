import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  spinnerService = inject(NgxSpinnerService);
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.spinnerService.show();
      this.totalRequests++;
      return next.handle(request).pipe(
        finalize(() => {
          this.totalRequests--;
          if (this.totalRequests === 0) {
            this.spinnerService.hide();
          }
        })
      );
    // if(request.url.includes('/api/project/attendance') && request.method == 'PUT')
    // {
    //   return next.handle(request)
    // } else {
    //   this.spinnerService.show('httpLoaderSpinner');
    //   this.totalRequests++;
    //   return next.handle(request).pipe(
    //     finalize(() => {
    //       this.totalRequests--;
    //       if (this.totalRequests === 0) {
    //         this.spinnerService.hide('httpLoaderSpinner');
    //       }
    //     })
    //   );
    // }
  }
}

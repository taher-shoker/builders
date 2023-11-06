import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './views/home/home.component';

import { HttpInterceptorService } from './shared/interceptors/http-interceptor.service';
import { CookieModule } from 'ngx-cookie';
import { ReportingService } from './shared/services/reporting.service';
// import { KpisPerformanceModule } from './views/kpis-performance/kpis-performance.module';
// import { KpisTrendModule } from './views/kpis-trend/kpis-trend.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function initializeApp(reportingService: ReportingService) {
  return () => {
    reportingService.postReport('Authenticcation-Done').subscribe(() => {
      console.log('Init Log');
    });
  };
}


@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedUiModule,
    // KpisPerformanceModule,
    // KpisTrendModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: true }),
    CookieModule.withOptions(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeApp,
      deps: [ReportingService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

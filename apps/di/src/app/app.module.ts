import { APP_INITIALIZER, NgModule, importProvidersFrom } from '@angular/core';
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
import { AppInitService } from './shared/services/app-init.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const provideTranslation = () => ({
  defaultLanguage: 'en',
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
});

export function initializeDTApp(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  };
}

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedUiModule,
    TranslateModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: true }),
    CookieModule.withOptions(),
  ],
  providers: [
    ReportingService,
    AppInitService,
    importProvidersFrom([
      HttpClientModule,
      TranslateModule.forRoot(provideTranslation()),
    ]),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeDTApp,
      deps: [AppInitService, ReportingService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

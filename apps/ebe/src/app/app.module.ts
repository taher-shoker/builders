import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
// import { SharedUiModule } from '@stc-apps/shared-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpLoadingInterceptor } from './interceptors/http-loader.interceptor';
import { HttpInterceptorService } from './interceptors/http-header.interceptor';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from './interceptors/errors-handler.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// import { HttpUrlInterceptor } from './interceptors/http.interceptor';
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, environment.languageFilesPath, '.json');
// }
// export const provideTranslation = () => ({
//   defaultLanguage: 'en',
//   loader: {
//     provide: TranslateLoader,
//     useFactory: HttpLoaderFactory,
//     deps: [HttpClient],
//   },
// });
@NgModule({
  declarations: [AppComponent, MainLayoutComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    SharedUiModule,
    NgxSpinnerModule.forRoot({type : "ball-spin"}),
    CookieModule.withOptions(),
    ToastrModule.forRoot()
  ],
  providers: [
    importProvidersFrom([
      HttpClientModule
    ]),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpUrlInterceptor,
    //   multi: true,
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

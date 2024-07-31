import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
// import { SharedUiModule } from '@stc-apps/shared-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpLoadingInterceptor } from './interceptors/http-loader.interceptor';
import { HttpInterceptorService } from './interceptors/http-header.interceptor';
import { CookieModule } from 'ngx-cookie';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.languageFilesPath, '.json');
}
export const provideTranslation = () => ({
  defaultLanguage: 'en',
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
});
@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, MainLayoutComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    SharedUiModule,
    NgxSpinnerModule.forRoot({type : "ball-spin"}),
    CookieModule.withOptions(),
  ],
  providers: [
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
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

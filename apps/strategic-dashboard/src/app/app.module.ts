import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HomeModule } from './views/home/home.module';
import { CookieModule } from 'ngx-cookie';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from './layout/layout.module';
import { HttpInterceptorService } from './services/interceptors/http-interceptor.service';
import { ErrorInterceptor } from './services/interceptors/error.interceptor';
import { LoaderInterceptor } from './services/interceptors/loader.interceptor';

import { ToastrModule } from 'ngx-toastr';
import { HashLocationStrategy,LocationStrategy } from '@angular/common';




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

const components = [AppComponent];
const modules = [
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  HomeModule,
  LayoutModule,
  BrowserAnimationsModule,
  ToastrModule.forRoot(),
  RouterModule.forRoot(appRoutes,{ useHash: true }),
  TranslateModule,
  CookieModule.withOptions(),
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
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
      provide:HTTP_INTERCEPTORS,
      useClass:ErrorInterceptor,
      multi:true
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

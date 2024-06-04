import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { ToastrModule } from 'ngx-toastr';
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
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    SharedUiModule,
    TranslateModule,
    ToastrModule.forRoot(),
    CookieModule.withOptions(),
  ],
    providers: [
      importProvidersFrom([
        HttpClientModule,
        TranslateModule.forRoot(provideTranslation()),
      ]),
     
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}

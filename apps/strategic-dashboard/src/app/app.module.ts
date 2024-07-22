import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HomeModule } from './views/home/home.module';
import { CookieModule } from 'ngx-cookie';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  BrowserAnimationsModule,
  RouterModule.forRoot(appRoutes),
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

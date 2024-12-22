import { importProvidersFrom, NgModule } from '@angular/core';
import {
  CommonModule,
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { AppComponent } from './app.component';
import { ChatViewModule } from './views/chat-view/chat-view.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { StartChatViewModule } from './views/start-chat-view/start-chat-view.module';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { HttpInterceptorService } from './services/interceptors/http-interceptor.service';
import { environment } from '../environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CookieModule } from 'ngx-cookie';
import { ErrorInterceptor } from './services/interceptors/error.interceptor';
import { ToastrModule } from 'ngx-toastr';

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
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    ChatViewModule,
    StartChatViewModule,
    BrowserAnimationsModule,
    CookieModule.withOptions(),
    ToastrModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: true }),
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
      useClass: ErrorInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

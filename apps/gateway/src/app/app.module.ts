import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';

import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { UsersSettingsModule } from './views/users-settings/users-settings.module';
import { CookieModule } from 'ngx-cookie';
import { HttpInterceptorService } from './shared/interceptors/http-interceptor.service';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { environment } from '../environments/environment';
import { DataUploadComponent } from './views/data-upload/data-upload.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { DataUploadModalComponent } from './views/data-upload/data-upload-modal/data-upload-modal.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    window.location.origin + environment.languageFilesPath,
    '.json'
  );
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
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DataUploadComponent,
    DataUploadModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    AppRoutingModule,
    HttpClientModule,
    SharedUiModule,
    UsersSettingsModule,
    TranslateModule,
    ToastrModule.forRoot({ closeButton: true }),
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
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [DataUploadComponent, DataUploadModalComponent],
})
export class AppModule {}

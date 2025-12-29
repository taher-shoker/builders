import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { MainLayoutComponent } from './main-layout/main-layout.component';
// import { SharedUiModule } from '@stc-apps/shared-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpLoadingInterceptor } from './interceptors/http-loader.interceptor';
import { HttpInterceptorService } from './interceptors/http-header.interceptor';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from './interceptors/errors-handler.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { KriDashboardComponent } from './views/kri-dashboard/kri-dashboard.component';
import { ComplianceRegisterComponent } from './views/compliance-register/compliance-register.component';
import { ExecutiveSummaryComponent } from './views/kri-dashboard/components/executive-summary/executive-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusLegendComponent } from './components/status-legend/status-legend.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { FileUploadDialogComponent } from './components/file-upload-dialog/file-upload-dialog.component';
import { A11yModule } from '@angular/cdk/a11y';
import { StackedBarChartComponent } from './components/stacked-bar-chart/stacked-bar-chart.component';
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
    MainLayoutComponent,
    KriDashboardComponent,
    ComplianceRegisterComponent,
    ExecutiveSummaryComponent,
    StatusLegendComponent,
    FileUploadDialogComponent,
    StackedBarChartComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    SharedUiModule,
    NgxSpinnerModule.forRoot({ type: 'ball-spin' }),
    CookieModule.withOptions(),
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    DialogModule,
    FormsModule,
    A11yModule,
  ],
  providers: [
    importProvidersFrom([HttpClientModule]),
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
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

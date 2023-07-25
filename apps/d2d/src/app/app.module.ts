import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';

import { AppComponent } from './app.component';
import { CassesSettingComponent } from './views/casses-setting/casses-setting.component';

import { AppRoutingModule } from './app-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CassesSettingModule } from './views/casses-setting/casses-setting.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [AppComponent, CassesSettingComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedUiModule,
    MatTableModule,
    CassesSettingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [CassesSettingComponent],
})
export class AppModule {}

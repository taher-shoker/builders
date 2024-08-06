import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { TopBannerComponent } from './top-banner/top-banner.component';
import { SharedModule } from '../shared/shared.module';
import { HomeModule } from '../views/home/home.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { appRoutes } from '../app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const components = [LayoutComponent, TopBannerComponent];
const modules = [
  SharedModule,
  HomeModule,
  TranslateModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule.forChild(appRoutes),
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components],
})
export class LayoutModule {}

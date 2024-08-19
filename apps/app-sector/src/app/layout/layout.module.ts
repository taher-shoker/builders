import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';
import { HomeModule } from '../views/home/home.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { appRoutes } from '../app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopBannerComponent } from './components/top-banner/top-banner.component';
import { LoaderComponent } from './components/loader/loader.component';

const components = [LayoutComponent, TopBannerComponent, LoaderComponent];
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

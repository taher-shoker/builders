import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { TopBannerComponent } from './top-banner/top-banner.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from '../app.routes';

const components = [LayoutComponent, TopBannerComponent];
const modules = [SharedModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components],
})
export class LayoutModule {}

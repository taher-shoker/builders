import { NgModule } from '@angular/core';
import { KpiCardHeaderComponent } from './components/kpi-card-header/kpi-card-header.component';

import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './home.routes';

const components = [HomeComponent, KpiCardHeaderComponent];

const modules = [SharedModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components],
})
export class HomeModule {}

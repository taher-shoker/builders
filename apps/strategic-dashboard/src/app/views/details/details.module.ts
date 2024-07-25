import { NgModule } from '@angular/core';
import { DetailsComponent } from './details.component';
import { SharedModule } from '../../shared/shared.module';
import { appRoutes } from './details.routes';
import { RouterModule } from '@angular/router';
import { ProgressCardComponent } from './progress-card/progress-card.component';
import { ChartCardComponent } from './chart-card/chart-card.component';

const components = [
  DetailsComponent,
  ProgressCardComponent,
  ChartCardComponent,
];

const modules = [SharedModule, RouterModule.forChild(appRoutes)];
@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components],
})
export class DetailsModule {}

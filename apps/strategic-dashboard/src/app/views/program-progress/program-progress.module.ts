import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramProgressComponent } from './program-progress.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './program-progress.routes';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';
import { SharedModule } from '../../shared/shared.module';
import { ProgramDetailsCardComponent } from './components/program-details-card/program-details-card.component';
import { DetailsModule } from '../details/details.module';
import { KpisCardComponent } from './components/kpis-card/kpis-card.component';

const components = [
  ProgramProgressComponent,
  ProgramDetailsComponent,
  ProgramDetailsCardComponent,
  KpisCardComponent,
];
const modules = [
  CommonModule,
  SharedModule,
  DetailsModule,
  RouterModule,
  RouterModule.forChild(appRoutes),
];

@NgModule({
  declarations: [components],
  imports: [modules],
})
export class ProgramProgressModule {}

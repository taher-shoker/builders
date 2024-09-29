import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramProgressComponent } from './program-progress.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './program-progress.routes';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';
import { SharedModule } from '../../shared/shared.module';
import { ProgramDetailsCardComponent } from './components/program-details-card/program-details-card.component';
import { KpisCardComponent } from './components/kpis-card/kpis-card.component';
import { ProgramProgressCardComponent } from './components/program-progress-card/program-progress-card.component';
import { AllProgramsComponent } from './components/all-programs/all-programs.component';
import { KpiDetailsComponent } from './components/kpi-details/kpi-details.component';

const components = [
  ProgramProgressComponent,
  ProgramDetailsComponent,
  ProgramDetailsCardComponent,
  KpisCardComponent,
  ProgramProgressComponent,
  ProgramProgressCardComponent,
  AllProgramsComponent,
  KpiDetailsComponent,
];
const modules = [CommonModule, SharedModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [components],
  imports: [modules],
})
export class ProgramProgressModule {}

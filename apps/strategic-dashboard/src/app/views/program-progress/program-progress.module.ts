import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramProgressComponent } from './program-progress.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './program-progress.routes';
import { ProgramProgressCardComponent } from './program-progress-card/program-progress-card.component';
import { SharedModule } from '../../shared/shared.module';
import { AllProgramsComponent } from './all-programs/all-programs.component';

const components = [ProgramProgressComponent, ProgramProgressCardComponent,AllProgramsComponent];
const modules = [CommonModule, SharedModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [components],
  imports: [modules],
})
export class ProgramProgressModule {}

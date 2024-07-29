import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramProgressComponent } from './program-progress.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './program-progress.routes';

const components = [ProgramProgressComponent];
const modules = [CommonModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [components],
  imports: [modules],
})
export class ProgramProgressModule {}

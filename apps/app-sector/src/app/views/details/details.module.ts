import { NgModule } from '@angular/core';

import { appRoutes } from './details.routes';
import { DetailsComponent } from './details.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

const components = [DetailsComponent];
const modules = [SharedModule, RouterModule.forRoot(appRoutes)];

@NgModule({
  declarations: [...components],
  imports: [...modules],
})
export class DetailsModule {}

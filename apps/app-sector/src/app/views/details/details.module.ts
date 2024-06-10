import { NgModule } from '@angular/core';

import { appRoutes } from './details.routes';
import { DetailsComponent } from './details.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DetailsCardComponent } from './components/details-card/details-card.component';
import { CommentsFormComponent } from './components/comments-form/comments-form.component';

const components = [DetailsComponent];
const modules = [SharedModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [...components],
  imports: [...modules],
})
export class DetailsModule {}

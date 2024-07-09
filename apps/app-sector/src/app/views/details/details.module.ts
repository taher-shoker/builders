import { NgModule } from '@angular/core';
import { appRoutes } from './details.routes';
import { DetailsComponent } from './details.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DetailsCardComponent } from './components/details-card/details-card.component';
import { CommentsFormComponent } from './components/comments-form/comments-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepliesSectionComponent } from './components/replies-section/replies-section.component';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

const components = [
  DetailsComponent,
  DetailsCardComponent,
  CommentsFormComponent,
  RepliesSectionComponent,
];
const modules = [
  MatDialogTitle,
  MatDialogClose,
  MatDialogActions,
  MatDialogContent,
  MatButtonModule,
  SharedModule,
  ReactiveFormsModule,
  RouterModule.forChild(appRoutes),
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
})
export class DetailsModule {}

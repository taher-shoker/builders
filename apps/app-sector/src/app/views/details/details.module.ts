import { NgModule } from '@angular/core';
import { appRoutes } from './details.routes';
import { DetailsComponent } from './details.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DetailsCardComponent } from './components/details-card/details-card.component';
import { CommentsFormComponent } from './components/comments-form/comments-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { RepliesSectionComponent } from './components/replies-section/replies-section.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatDialogeComponent } from './components/mat-dialoge/mat-dialoge.component';

const components = [
  DetailsComponent,
  DetailsCardComponent,
  CommentsFormComponent,
  ProfileComponent,
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
  declarations: [...components, MatDialogeComponent],
  imports: [...modules],
})
export class DetailsModule {}

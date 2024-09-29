import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultScoreComponent } from './result-score/result-score.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab/tab.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { CommentEditorComponent } from './comment-editor/comment-editor.component';
import { ProfileComponent } from './profile/profile.component';
import { ConfirmationDialogeComponent } from './confirmation-dialoge/confirmationDialoge.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { MentionModule } from 'angular-mentions';
import { MentionsEditorComponent } from './mentions-editor/mentions-editor.component';

const components = [
  ResultScoreComponent,
  TabsComponent,
  TabComponent,
  CommentEditorComponent,
  ProfileComponent,
  ConfirmationDialogeComponent,
  BreadcrumbsComponent,
  MentionsEditorComponent,
];
const modules = [
  CommonModule,
  SharedUiModule,
  MatDialogTitle,
  MatDialogClose,
  MatDialogActions,
  MatDialogContent,
  RouterModule,
  MentionModule,
  MatTabsModule,
];

@NgModule({
  declarations: [...components, MentionsEditorComponent],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}

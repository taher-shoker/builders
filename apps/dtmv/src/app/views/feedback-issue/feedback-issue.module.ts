import { NgModule } from '@angular/core';
import { FeedbackIssueComponent } from './feedback-issue.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FeedbackIssueLogsComponent } from './feedback-issue-logs/feedback-issue-logs.component';
import { FeedbackIssueRoutingModule } from './feedback-issue-routing.module';
import { FeedbackIssueCardComponent } from './feedback-issue-card/feedback-issue-card.component';
import { CountColorPipe } from './pipes/countcolor.pipe';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LogsExpansionHeaderComponent } from './logs-expansion-header/logs-expansion-header.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FloatingMenuComponent } from './floating-menu/floating-menu.component';
import { LogsExpansionBodyComponent } from './logs-expansion-body/logs-expansion-body.component';
const components = [
  FeedbackIssueComponent,
  FeedbackIssueLogsComponent,
  FeedbackIssueCardComponent,
  CountColorPipe,
  LogsExpansionHeaderComponent,
  FloatingMenuComponent,
];
const modules = [
  CommonModule,
  SharedUiModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  TranslateModule,
  MatDialogModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  FeedbackIssueRoutingModule,
  MatExpansionModule,
];
@NgModule({
  declarations: [...components, LogsExpansionBodyComponent],
  imports: [...modules],
  exports: [CountColorPipe, ...components],
  providers: [],
})
export class FeedBackIssueModule {}

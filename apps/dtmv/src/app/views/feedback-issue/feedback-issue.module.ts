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
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
@NgModule({
  declarations: [FeedbackIssueComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
  exports: [],
  providers: [],
})
export class FeedBackIssueModule {}

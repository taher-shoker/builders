import { RouterModule, Routes } from '@angular/router';
import { FeedbackIssueLogsComponent } from './feedback-issue-logs/feedback-issue-logs.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: FeedbackIssueLogsComponent,
    data: { breadcrumb: 'Feedback/Issue Logs' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackIssueRoutingModule {}

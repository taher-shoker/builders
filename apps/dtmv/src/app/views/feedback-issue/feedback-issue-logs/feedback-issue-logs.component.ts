import { Component, OnInit } from '@angular/core';
import { BannerDataService } from '@stc-apps/shared-ui';
import { FeedbackIssueService } from '../services/feedback-issues.service';
import { ticketCount } from '../models/feedback-issue.model';

@Component({
  selector: 'stc-apps-feedback-issue-logs',
  templateUrl: './feedback-issue-logs.component.html',
  styleUrl: './feedback-issue-logs.component.scss',
})
export class FeedbackIssueLogsComponent implements OnInit {
  selectedTab = 'all';
  panelOpenState = false;
  cards: { title: string; countKey: keyof ticketCount; subtitle: string }[] = [
    {
      title: 'total submissions',
      countKey: 'total',
      subtitle: 'All time submissions',
    },
    {
      title: 'feedback',
      countKey: 'issue',
      subtitle: 'Suggestions & comments',
    },
    { title: 'issues', countKey: 'feedback', subtitle: 'Problems reported' },
  ];
  counts: ticketCount = {} as ticketCount;
  constructor(
    private bannerDataService: BannerDataService,
    private feedbackIssueService: FeedbackIssueService
  ) {}
  ngOnInit(): void {
    this.feedbackIssueService.getTicketCount().subscribe({
      next: (result: ticketCount) => {
        this.counts = result;
        console.log(this.counts, 'counts');
      },
    });
    this.bannerDataService.updateData({
      title: 'Manage feedback and issues',
      text: '',
    });
  }
}

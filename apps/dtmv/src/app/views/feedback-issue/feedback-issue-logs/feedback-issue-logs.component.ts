import { Component, OnInit } from '@angular/core';
import { BannerDataService } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-feedback-issue-logs',
  templateUrl: './feedback-issue-logs.component.html',
  styleUrl: './feedback-issue-logs.component.scss',
})
export class FeedbackIssueLogsComponent implements OnInit {
  selectedTab = 'all';
  panelOpenState = false;
  cards = [
    { title: 'total submissions', count: 5, subtitle: 'All time submissions' },
    { title: 'feedback', count: 3, subtitle: 'Suggestions & comments' },
    { title: 'issues', count: 2, subtitle: 'Problems reported' },
  ];
  constructor(private bannerDataService: BannerDataService) {}
  ngOnInit(): void {
    this.bannerDataService.updateData({
      title: 'Manage feedback and issues',
      text: '',
    });
  }
}

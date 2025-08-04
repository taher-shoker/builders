import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerDataService } from '@stc-apps/shared-ui';
import { FeedbackIssueService } from '../services/feedback-issues.service';
import { logsResponse, ticketCount } from '../models/feedback-issue.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'stc-apps-feedback-issue-logs',
  templateUrl: './feedback-issue-logs.component.html',
  styleUrl: './feedback-issue-logs.component.scss',
})
export class FeedbackIssueLogsComponent implements OnInit {
  selectedTab: string | null = 'ALL';
  panelOpenState = false;
  allLogs: logsResponse = {} as logsResponse;
  totalElements = 0;
  currentPage = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cards: { title: string; countKey: keyof ticketCount; subtitle: string }[] = [
    {
      title: 'total submissions',
      countKey: 'total',
      subtitle: 'All time submissions',
    },
    {
      title: 'feedback',
      countKey: 'feedback',
      subtitle: 'Suggestions & comments',
    },
    { title: 'issues', countKey: 'issue', subtitle: 'Problems reported' },
  ];
  counts: ticketCount = {} as ticketCount;
  constructor(
    private bannerDataService: BannerDataService,
    private feedbackIssueService: FeedbackIssueService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {}
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const filterParam = params.get('filter');
      if (!filterParam) {
        // Redirect to same route with filter=all if missing
        console.log('!filter param');

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { filter: 'ALL' },
          queryParamsHandling: 'merge',
        });
      } else {
        this.selectedTab = params.get('filter');
        this.applyFilter();
      }
    });

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
  applyFilter() {
    this.getAllLogs();
  }
  onFilterChange(filter: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filter },
      queryParamsHandling: 'merge', // keep other query params if needed
    });
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  pagination(event: PageEvent) {
    console.log('event', event);
    if (
      event.previousPageIndex !== undefined &&
      event.previousPageIndex < event.pageIndex
    ) {
      console.log('hey');

      this.currentPage++;
    } else if (
      event.previousPageIndex !== undefined &&
      event.previousPageIndex > event.pageIndex
    ) {
      this.currentPage--;
    }
    this.applyFilter();
  }
  getAllLogs() {
    this.feedbackIssueService
      .getAllLogs(this.currentPage, this.selectedTab)
      .subscribe({
        next: (logs: logsResponse) => {
          this.allLogs = logs;
          this.totalElements = this.allLogs.totalElements;
        },
      });
  }
}

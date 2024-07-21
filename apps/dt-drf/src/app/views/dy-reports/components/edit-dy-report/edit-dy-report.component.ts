/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BannerDataService } from '@stc-apps/shared-ui';
import { ReportsService } from '../../dy-reports.service';

@Component({
  selector: 'stc-apps-edit-dy-report',
  templateUrl: './edit-dy-report.component.html',
  styleUrls: ['./edit-dy-report.component.scss'],
})
export class EditDyReportComponent implements OnInit {
  milestoneId!: string;
  milestoneData!: any;

  constructor(
    private bannerDataService: BannerDataService,
    public reportsService: ReportsService,
    public route: ActivatedRoute
  ) {}
  getMilestone(id: number) {
    this.reportsService.getMilestone(id).subscribe((res: any) => {
      this.milestoneData = res;
    });
  }
  ngOnInit(): void {
    this.milestoneId = this.route.snapshot.params['id'];
    this.getMilestone(+this.milestoneId);
    this.bannerDataService.updateData({
      title: '',
      text: '',
    });
  }
}

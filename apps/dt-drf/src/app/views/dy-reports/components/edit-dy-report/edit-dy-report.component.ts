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
  reportId!: string;
  reportData!: any;

  constructor(
    private bannerDataService: BannerDataService,
    public reportsService: ReportsService,
    public route: ActivatedRoute
  ) {}
  getReport(id: number) {
    this.reportsService.getReport(id).subscribe((res: any) => {
      this.reportData = res;
    });
  }
  ngOnInit(): void {
    this.reportId = this.route.snapshot.params['id'];
    this.getReport(+this.reportId);
    this.bannerDataService.updateData({
      title: '',
      text: '',
    });
  }
}

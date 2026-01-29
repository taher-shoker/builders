/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BannerDataService } from '@stc-apps/shared-ui';
import { ReportDetails, ReportsService } from '../../dy-reports.service';

@Component({
  selector: 'stc-apps-edit-dy-report',
  templateUrl: './edit-dy-report.component.html',
  styleUrls: ['./edit-dy-report.component.scss'],
})
export class EditDyReportComponent implements OnInit {
  reportId!: string;
  reportData: WritableSignal<ReportDetails | null> =
    signal<ReportDetails | null>(null); // ✅ WritableSignal
  constructor(
    private bannerDataService: BannerDataService,
    public reportsService: ReportsService,
    public route: ActivatedRoute
  ) {}
  getReport(id: number) {
    this.reportsService.getReport(id).subscribe((res: ReportDetails) => {
      this.reportData.set(res); // ✅ Correct way to update a signal
    });
  }
  ngOnInit(): void {
    //this.reportId = this.route.snapshot.params['id'];
    //this.getReport(+this.reportId);
    this.bannerDataService.updateData({
      title: '',
      text: '',
    });
  }
}

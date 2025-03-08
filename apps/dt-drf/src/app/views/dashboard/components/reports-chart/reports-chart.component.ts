import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Category,
  DashboardService,
} from '../../../../services/dashboard.service';
import { ReportsService } from '../../../dy-reports/dy-reports.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'stc-apps-reports-chart',
  templateUrl: './reports-chart.component.html',
  styleUrls: ['./reports-chart.component.scss'],
})
export class ReportsChartComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService,
    private reportsService: ReportsService,
    public authService: AuthService
  ) {}
  categories: WritableSignal<Category[]> = signal([]);

  ngOnInit() {
    this.getCategories();
    console.log('fdf');
  }
  private getCategories() {
    this.reportsService.getCategories().subscribe((res) => {
      this.categories.set(res);
    });
  }
}

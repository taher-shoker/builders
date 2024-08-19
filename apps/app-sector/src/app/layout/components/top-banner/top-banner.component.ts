import {
  Component,
  InputSignal,
  OnInit,
  WritableSignal,
  input,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SectorService } from '../../../services/sector.service';
import { SharedFormService } from '../../../views/home/services/shared-form.service';

import { DashboardService } from '../../../views/home/services/dashboard.service';
import { YearQuarterService } from '../../../services/yearQuarter.service';
import { OverallScore, OverallScoreParams } from '../../../views/models/overallScore.model';

@Component({
  selector: 'stc-apps-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss'],
})
export class TopBannerComponent implements OnInit {
  milestoneProgress: WritableSignal<number | null> = signal(74.91);
  userName: InputSignal<string> = input('');

  showScorecard = true;
  title = 'Over all score';
  kpiCode = '';
  currentUrl = '';
  form: FormGroup = new FormGroup({});

  currentDate = new Date();
  currentYear = this.currentDate.getFullYear() - 1;
  currentMonth = this.currentDate.getMonth() + 1; // getMonth() returns 0-based month
  currentQuarter = Math.ceil(this.currentMonth / 3) - 2;
  // the quarter variable gets the actual quarter whe are in which is 3.
  quarter = Math.floor((this.currentMonth + 3) / 3);
  year = this.currentDate.getFullYear();
  overallScore!: OverallScore;
  kpiName = '';

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private sharedFormService: SharedFormService,
    private activatedRoute: ActivatedRoute,
    private sectorService: SectorService,
    private YearQuarterService: YearQuarterService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.kpiName = this.router.url.split('/').pop() || '';
        this.kpiName = this.kpiName.replace(/%20/g, ' ');
        this.activatedRoute.snapshot.paramMap.get('kpiName');
        if (this.router.url.includes('/details')) {
          this.showScorecard = false;
        } else {
          this.showScorecard = true;
        }
      });
  }
  ngOnInit(): void {
    console.log('quarter', this.quarter, this.currentQuarter, this.currentYear);
    this.handleForm();
    this.getOverallScore();
  }

  handleForm() {
    this.form = this.sharedFormService.getForm();
    if (
      this.YearQuarterService.getSelectedQuarter() ||
      this.YearQuarterService.getSelectedYear()
    ) {
      if (this.YearQuarterService.getSelectedYear() !== null) {
        this.year = +this.YearQuarterService.getSelectedYear()!;
      }
      if (this.YearQuarterService.getSelectedQuarter() !== null) {
        this.quarter = +this.YearQuarterService.getSelectedQuarter()!;
      }
    } else {
      console.log('inside else');
      this.quarter = Math.floor((this.currentMonth + 3) / 3);
      this.year = this.currentDate.getFullYear();
    }
    const initialParams = {
      year: this.year.toString(),
      quarter: this.quarter.toString(),
      sectorName: this.sectorService.getSectorName()?.toString() || '',
    };

    this.sharedFormService.initializeForm(initialParams);
  }
  // Years array should contain the current year only
  yearsArray: any = [
    { name: this.currentYear },
    { name: this.currentDate.getFullYear() },
  ];
  quarterArray: any = [{ name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }];
  selectYear(event: any) {
    console.log(event);
    this.YearQuarterService.setYear(event.toString());
    this.getOverallScore();
  }
  selectQuarter(event: any) {
    this.YearQuarterService.setQuarter(event.toString());
    this.getOverallScore();
    console.log(event);
  }
  getOverallScore() {
    const params: OverallScoreParams = { ...this.form.value };

    this.dashboardService.getOverallScore(params).subscribe((result) => {
      if (result) {
        const foundItem = result.find(
          (item) => item.scorecardTitle == 'Overall'
        );
        if (foundItem) {
          this.overallScore = foundItem;
        } else {
          this.overallScore = {} as OverallScore;
        }
      }
    });
  }
}

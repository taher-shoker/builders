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
import { DashboardService } from '../../views/home/services/dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  OverallScore,
  OverallScoreParams,
} from '../../views/models/overallScore.model';

@Component({
  selector: 'stc-apps-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss'],
})
export class TopBannerComponent implements OnInit {
  milestoneProgress: WritableSignal<number | null> = signal(74.91);
  scoreCardName: InputSignal<string> = input('');
  showScorecard= true;
  title = 'Over all score';
  kpiCode = '';
  currentUrl = '';
  userName: InputSignal<string> = input('');
  form: FormGroup = new FormGroup({});

  currentDate = new Date();
  currentYear = this.currentDate.getFullYear() - 1;
  currentMonth = this.currentDate.getMonth() + 1; // getMonth() returns 0-based month
  currentQuarter = Math.ceil(this.currentMonth / 3) - 2;
  overallScore!: OverallScore;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dashboardService: DashboardService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        console.log('Current URL:', this.router.url);
        if (this.router.url.includes('/details')) {
          this.showScorecard = false;
        } else {
          this.showScorecard = true;
        }
      });
  }
  ngOnInit(): void {
    this.handleForm();
    this.getOverallScore();
  }

  handleForm() {
    this.form = this.fb.group({
      year: this.fb.control(this.currentYear),
      quarter: this.fb.control(this.currentQuarter),
      sectorName: this.fb.control('Group Business Unit'),
    });
  }
  yearsArray: any = [
    { name: 2020 },
    { name: 2021 },
    { name: 2022 },
    { name: 2023 },
  ];
  quarterArray: any = [{ name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }];

  getOverallScore() {
    const params: OverallScoreParams = { ...this.form.value };

    this.dashboardService.getOverallScore(params).subscribe((result) => {
      if (result) {
        const foundItem = result.find(
          (item) => item.scorecardTitle == 'Overall'
        );
        if (foundItem) {
          this.overallScore = foundItem;
        }
      }
    });
  }
}

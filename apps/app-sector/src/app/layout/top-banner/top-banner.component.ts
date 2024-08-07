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
import { FormGroup } from '@angular/forms';
import {
  OverallScore,
  OverallScoreParams,
} from '../../views/models/overallScore.model';
import { SharedFormService } from '../../views/home/services/shared-form.service';

@Component({
  selector: 'stc-apps-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss'],
})
export class TopBannerComponent implements OnInit {
  milestoneProgress: WritableSignal<number | null> = signal(74.91);
<<<<<<< HEAD
  userName: InputSignal<string> = input('');

  scoreCardName: string = '';
=======
  scoreCardName: InputSignal<string> = input('');
>>>>>>> 7c1248b66c934786364f136b3406ecc1b93aa587
  showScorecard = true;
  title = 'Over all score';
  kpiCode = '';
  currentUrl = '';
  form: FormGroup = new FormGroup({});

  currentDate = new Date();
  currentYear = this.currentDate.getFullYear() - 1;
  currentMonth = this.currentDate.getMonth() + 1; // getMonth() returns 0-based month
  currentQuarter = Math.ceil(this.currentMonth / 3) - 2;
  overallScore!: OverallScore;
  kpiName = '';

  constructor(
    private router: Router,
<<<<<<< HEAD
    private dashboardService: DashboardService,
    private sharedFormService: SharedFormService
=======
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute
>>>>>>> 7c1248b66c934786364f136b3406ecc1b93aa587
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        console.log('Current URL:', this.router.url),this.activatedRoute.snapshot.paramMap.get('kpiName');
        if (this.router.url.includes('/details')) {
          this.showScorecard = false;
        } else {
          this.showScorecard = true;
        }
      });
  }
  ngOnInit(): void {
    this.scoreCardName = window.history.state.scoreCardName;
    this.handleForm();
    this.getOverallScore();
  }

  handleForm() {
    this.form = this.sharedFormService.getForm();
    const initialParams = {
      year: this.currentYear.toString(),
      quarter: this.currentQuarter.toString(),
      sectorName: this.scoreCardName,
    };
    this.sharedFormService.initializeForm(initialParams);
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

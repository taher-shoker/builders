import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services';
import { AvailablePeriodModel, TapModel } from '../../models';
import { ExecutiveSummaryService } from '../../services/executive-summary.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'stc-apps-kri-dashboard',
  templateUrl: './kri-dashboard.component.html',
  styleUrl: './kri-dashboard.component.scss',
})
export class KriDashboardComponent implements OnInit, OnDestroy {
  userName!: string;
  authService = inject(AuthService);
  kriTaps: TapModel[] = [];
  currentClickedTap!: TapModel;
  executiveSummaryService = inject(ExecutiveSummaryService);
  endSubs$: Subject<void> = new Subject();
  years: number[] = [];
  periods: AvailablePeriodModel[] = [];
  ngOnInit(): void {
    this.authService.loggedUserStream.subscribe((user) => {
      if (user) {
        this.userName = user.name;
      }
    });
    this.getAvailablePeriods();
    this.getTabsData();
  }
  private getAvailablePeriods() {
    this.executiveSummaryService
      .getAvailablePeriod()
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (data: AvailablePeriodModel[]) => {
          // console.log('Available Periods:', data);
          // set years and remove duplicates
          this.years = Array.from(
            new Set(data.map((period) => period.year))
          ).sort((a, b) => b - a);
          // set months and remove months names duplicates
          this.periods = data;
          // console.log('Available Years:', this.years);
        },
        error: (error) => {
          console.error('Error fetching Available Periods:', error);
        },
      });
  }
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  private getTabsData() {
    this.executiveSummaryService
      .getKriDashboardTaps()
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: TapModel[]) => {
          // console.log(res);
          this.kriTaps = res;
          this.currentClickedTap = this.kriTaps[0];
        },
      });
  }
  isUploaded(event: boolean) {
    if (event) {
      this.getTabsData();
    }
  }
  getCurrentTap(tap: TapModel) {
    this.currentClickedTap = tap;
  }
}

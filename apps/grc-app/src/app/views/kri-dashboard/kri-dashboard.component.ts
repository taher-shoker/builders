import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services';
import { TapModel } from '../../models';
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
  ngOnInit(): void {
    this.authService.loggedUserStream.subscribe((user) => {
      if (user) {
        this.userName = user.name;
      }
    });
    this.getTabsData();
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
          this.kriTaps = res;
          this.currentClickedTap = this.kriTaps[0];
        },
      });
  }
  getCurrentTap(tap: TapModel) {
    this.currentClickedTap = tap;
  }
}

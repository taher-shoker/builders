import { Component, inject, input, InputSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { UserModel } from '../../models/scorecard.model';
import { HomePageTap } from '../../models/homepage-mobile';
import { TabCardComponent } from './components/tab-card/tab-card.component';
import { Router, RouterModule } from '@angular/router';
import { ScorecardService } from '../../services/scorecard.service';
import { HomeService } from '../../services/home.service';
import { DashboardData } from '../../models/dashboard';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'stc-apps-homepage-mobile',
  standalone: true,
  imports: [CommonModule, UserInfoComponent, TabCardComponent, RouterModule],
  templateUrl: './homepage-mobile.component.html',
  styleUrl: './homepage-mobile.component.scss',
})
export class HomepageMobileComponent {
  userImage = signal<string>('assets/images/username-logo.svg');
  tapsData = signal<HomePageTap[]>([]);
  router = inject(Router);
  userData!: UserModel;
  scorecardService = inject(ScorecardService);
  homeService = inject(HomeService);
  dashboardData!: DashboardData;
  endSubs$: Subject<any> = new Subject();
  ngOnInit() {
    this.userData = JSON.parse(
      decodeURIComponent(this.scorecardService.getUserGroups())
    );
    this.getDashboardData();
  }
  ngOnDestroy() {
    this.endSubs$.complete();
  }
  private getDashboardData() {
    this.homeService
      .getDashboardData()
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: DashboardData) => {
          this.dashboardData = res;
          const cards = [
            {
              id: 1,
              title: 'sector scorecards',
              subTitle: 'track performance metrices',
              verticalNumber: res.scorecard.numberOfVerticals,
              kpisNumber: res.scorecard.numberOfKPIs,
              image: 'assets/images/mobile/scorecard-icon.svg',
            },
            {
              id: 2,
              title: 'project execution',
              subTitle: 'measures projects progress',
              rNumber: res.psrDetail.numberOfRIndicator,
              aNumber: res.psrDetail.numberOfAIndicator,
              gNumber: res.psrDetail.numberOfGIndicator,
              image: 'assets/images/mobile/project-execution-icon.svg',
            },
            {
              id: 3,
              title: 'financial status',
              subTitle: 'monitor actual spending',
              capexSpend: res.financial.capexSpent,
              opexSpend: res.financial.opexSpent,
              image: 'assets/images/mobile/financial-icon.svg',
            },
            {
              id: 4,
              title: 'digital transformation',
              subTitle: 'monitor digital growth',
              rNumber: res.dtProjectStatistics.filter(
                (v) => v.status === 'delayed'
              )[0].count,
              aNumber: res.dtProjectStatistics.filter(
                (v) => v.status === 'at risk'
              )[0].count,
              gNumber: res.dtProjectStatistics.filter(
                (v) => v.status === 'on track'
              )[0].count,
              cNumber: res.dtProjectStatistics.filter(
                (v) => v.status === 'completed'
              )[0].count,
              image: 'assets/images/mobile/digital-transformation-icon.svg',
            },
          ];
          const allowedCards = cards.filter((card) =>
            this.userData.pageAccess.some(
              (access) => access.name.toLowerCase() === card.title.toLowerCase()
            )
          );

          this.tapsData.set(allowedCards);
          //this.tapsData.set();
        },
      });
  }
  getCurrentTap(tap: HomePageTap) {
    if (tap.id === 1) {
      this.router.navigateByUrl('/sector-scorecards');
    } else if (tap.id === 2) {
      this.router.navigateByUrl('/project-execution');
    } else if (tap.id === 3) {
      this.router.navigateByUrl('/financial-status');
    } else {
      this.router.navigateByUrl('/digital-transformation');
    }
  }
}

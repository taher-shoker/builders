import { Component, inject, input, InputSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { UserModel } from '../../models/scorecard.model';
import { HomePageTap } from '../../models/homepage-mobile';
import { TabCardComponent } from './components/tab-card/tab-card.component';
import { Router, RouterModule } from '@angular/router';
import { ScorecardService } from '../../services/scorecard.service';
@Component({
  selector: 'stc-apps-homepage-mobile',
  standalone: true,
  imports: [CommonModule , UserInfoComponent , TabCardComponent , RouterModule],
  templateUrl: './homepage-mobile.component.html',
  styleUrl: './homepage-mobile.component.scss',
})
export class HomepageMobileComponent {
  userImage = signal<string>('assets/images/username-logo.svg');
  tapsData = signal<HomePageTap[]>([]);
  router = inject(Router);
  userData!: UserModel;
  scorecardService = inject(ScorecardService);
  ngOnInit()
  {
    this.userData = JSON.parse(
      decodeURIComponent(this.scorecardService.getUserGroups())
    );
    this.tapsData.set([
      {
        id : 1,
        title : "sector scorecard",
        subTitle : "track performance metrices",
        verticalNumber : 5,
        kpisNumber : 20,
        image : "assets/images/mobile/scorecard-icon.svg"
      },
      {
        id : 2,
        title : "project execution",
        subTitle : "measures projects progress",
        rNumber : 8,
        aNumber : 3,
        gNumber : 15,
        image : "assets/images/mobile/project-execution-icon.svg"
      },
      {
        id : 3,
        title : "financial status",
        subTitle : "monitor actual spending",
        capexSpend : "459M",
        opexSpend : "24M",
        image : "assets/images/mobile/financial-icon.svg"
      },
    ])
  }
  getCurrentTap(tap:HomePageTap)
  {
    if(tap.id === 1)
    {
      this.router.navigateByUrl("/scorecard");
    }
    else if(tap.id === 2)
    {
      this.router.navigateByUrl("/psr");
    }
    else if(tap.id === 3)
    {
      this.router.navigateByUrl("/financial-reporting");
    }
  }
}

import { Component, inject } from '@angular/core';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
@Component({
  selector: 'stc-apps-deleted-projects-page',
  standalone: true,
  imports: [CommonModule, SharedUiModule, RouterModule],
  templateUrl: './deleted-projects-page.component.html',
  styleUrl: './deleted-projects-page.component.scss',
})
export class DeletedProjectsPageComponent {
  route = inject(Router);
  currentUrl = '';
  userData!: UserModel;
  scorecardService = inject(ScorecardService);
  ngOnInit() {
    if (this.scorecardService.getUserGroups()) {
      this.userData = JSON.parse(
        decodeURIComponent(this.scorecardService.getUserGroups())
      );
    }
    const title = this.route.url.split('/')[2];
    if (title.includes('-')) {
      this.currentUrl = title.split('-')[1];
    } else {
      this.currentUrl = title;
    }
  }
}

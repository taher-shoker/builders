import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActivityLogService } from '../../../services/activity-logs.service';
import { PSRProjectDetailsModel } from '../../../models/psr.model';
import { UserGroup } from '../../../models/scorecard.model';
import { ProjectDetailsCardComponent } from '../../PSR/components/project-details-card/project-details-card.component';
import { ScorecardService } from '../../../services/scorecard.service';

@Component({
  selector: 'stc-apps-deleted-projects',
  standalone: true,
  imports: [CommonModule , ProjectDetailsCardComponent],
  templateUrl: './deleted-psr-projects.component.html',
  styleUrl: './deleted-psr-projects.component.scss',
})
export class DeletedPsrProjectsComponent {
  route = inject(ActivatedRoute);
  activityLogService = inject(ActivityLogService);
  pageTitle = ""
  deletedPSRProject = signal<PSRProjectDetailsModel[]>([]);
  userRoles!: UserGroup;
  scorecardService = inject(ScorecardService);
  sector = '';
  ngOnInit()
  {
    this.userRoles = this.scorecardService.userRoles;
    this.route.paramMap.subscribe((params) => {
      if(params && params.get("title"))
      {
        this.pageTitle = params.get("title")!;
      }
      if(params && params.get("sector"))
      {
        this.sector = params.get("sector")!;
      }
    });
    this.getPSRDeletedProjects("PSR" , true)
  }
  private getPSRDeletedProjects(moduleName:string , isDetails:boolean)
  {
    this.activityLogService.getPSRDeletedProjects(moduleName , this.sector , isDetails).subscribe({
      next : (res:PSRProjectDetailsModel[]) => {
        console.log(res);
        this.deletedPSRProject.set(res);
      }
    })
  }
}

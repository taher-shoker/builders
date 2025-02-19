import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLogService } from '../../../services/activity-logs.service';
import { StrategyProgramKpiDetailsModel, StrategyProgramKpiProjectsDetailsModel } from '../../../models/strategy-program.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ActivityLogData, ColumnsSchema } from '../../../models/activity-logs';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'stc-apps-deleted-cad-project',
  standalone: true,
  imports: [CommonModule , SharedUiModule],
  templateUrl: './deleted-cad-project.component.html',
  styleUrl: './deleted-cad-project.component.scss',
})
export class DeletedCadProjectComponent {
  activityLogService = inject(ActivityLogService);
  cadProjects = signal<StrategyProgramKpiProjectsDetailsModel[]>([]);
  $endScorecardActivityLogsSub:Subject<any> = new Subject();
  projectActivityLogsTableHeader:ColumnsSchema[] = [
    {
      key : "username",
      type : "text",
      label : "User Name"
    },
    {
      key : "type",
      type : "text",
      label : "Activity Type"
    },
    {
      key : "details",
      type : "text",
      label : "Activity Details"
    },
    {
      key : "time",
      type : "text",
      label : "Time Stamp"
    },
    {
      key : "oldValue",
      type : "text",
      label : "Old Value"
    },
    {
      key : "newValue",
      type : "text",
      label : "New Value"
    },
  ];
  projectActivityLogsTableBody = signal<ActivityLogData[]>([]);
  router = inject(ActivatedRoute);
  programTitle = '';
  keyNumber = '';
  ngOnInit()
  {
    this.router.params.subscribe({
      next:(param) => {
        this.programTitle = param['id'];
        this.keyNumber = param['resNum'];
        this.getCADProjects("CAD" , true);
      }
    })
  }
  private getCADProjects(moduleName:string , isDetails:boolean)
  {
    this.activityLogService.getCADDeletedProjects(moduleName , isDetails , this.programTitle , this.keyNumber).subscribe({
      next : (res:StrategyProgramKpiProjectsDetailsModel[]) => {
        this.cadProjects.set(res)
      }
    })
  }
  showProjectLogs(id:any)
  {
    if(id)
    {
      this.getSpecificActivityLog("CAD" , "Add,Edit,Delete" , this.programTitle , this.keyNumber , id.toString());
    }
  }
  private getSpecificActivityLog(moduleName:string , activityType:string , subModule:string , projectName?:string , entity?:string)
  {
    this.activityLogService.getSpecificActivityLog(moduleName , activityType , subModule , projectName , entity).pipe(takeUntil(this.$endScorecardActivityLogsSub)).subscribe({
      next : (activityLogs:ActivityLogData[]) => {
        if(entity)
        {
          this.projectActivityLogsTableBody.set(activityLogs);
        }
      }
    })
  }
}

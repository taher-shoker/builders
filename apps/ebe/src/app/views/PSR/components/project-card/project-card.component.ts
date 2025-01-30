import { Component, EventEmitter, inject, input, InputSignal, OnChanges, OnInit, Output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PSRChartDataModel, PSRDataModel } from '../../../../models/psr.model';
import { SharedUiModule } from "@stc-apps/shared-ui";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ActivityLog , ActivityLogData, ColumnsSchema } from '../../../../models/activity-logs';
import { Subject, takeUntil } from 'rxjs';
import { ActivityLogService } from '../../../../services/activity-logs.service';
@Component({
  selector: 'stc-apps-psr-project-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule , RouterModule , OverlayPanelModule , MenuModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  providers : [ConfirmationService]
})
export class PSRProjectCardComponent implements OnChanges , OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  isAdmin = input<boolean>();
  isDeleted = input<boolean>(false);
  datePipe = inject(DatePipe);
  activityLogsTableHeader = signal<ColumnsSchema[]>([]);
  activityLogsTableBody = signal<ActivityLogData[]>([]);
  @Output() ProgramId:EventEmitter<number> = new EventEmitter();
  months:string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  maxTextLength = 0;
  items:any[] = []
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  @ViewChild('actionsPanel') actionsPanel!: OverlayPanel;
  @ViewChild('overlayPanel2') overlayPanel2!: OverlayPanel;
  project:InputSignal<PSRDataModel> = input.required<PSRDataModel>();
  activityLogService = inject(ActivityLogService)
  colors:string[] = ['#4F008C' , '#B999D1'];
  chartData!:PSRChartDataModel;
  private confirmationService = inject(ConfirmationService);
  ngOnInit(): void {
    this.activityLogsTableHeader.set([
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
    ])
    console.log(this.isAdmin());
    if(this.isAdmin())
    {
      if(this.isDeleted())
      {
        this.items = [
          {
              label: 'Activity Logs',
              icon: 'pi pi-clock'
          }
        ]
      } else {
        this.items = [
          {
              label: 'Edit',
              icon: 'pi pi-pen-to-square'
          },
          {
              label: 'Delete',
              icon: 'pi pi-trash'
          },
          {
              label: 'Activity Logs',
              icon: 'pi pi-clock'
          }
        ]
      }
    } else {
      this.items = [
        {
            label: 'Edit',
            icon: 'pi pi-pen-to-square'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        }
      ]
    }
  }
  showActivityLogsPopup = false;
  $endScorecardActivityLogsSub:Subject<any> = new Subject();
  private getSpecificActivityLog(moduleName:string , subModule?:string , projectName?:string)
  {
    
    this.activityLogService.getSpecificActivityLog(moduleName , this.isDeleted() ? "Add,Edit,Delete" : "Add,Edit" , subModule , projectName).pipe(takeUntil(this.$endScorecardActivityLogsSub)).subscribe({
      next : (activityLogs:ActivityLogData[]) => {
        this.activityLogsTableBody.set(activityLogs);
      }
    })
  }
  showActivityLogs()
  {
    // this.activityLogsPanel.toggle(event);
    this.showActivityLogsPopup = !this.showActivityLogsPopup;
    this.getSpecificActivityLog("PSR" , this.project().sector)
  }
  popupClosed()
  {
    this.showActivityLogsPopup = false;
    this.actionsPanel.hide();
    this.$endScorecardActivityLogsSub.complete();
  }

  ngOnChanges(): void {    
    this.chartData = {
      actual : this.project().actual ? this.project().actual : 0,
      planned : this.project().planned ? this.project().planned : 0
    }
    const textArr:string[] = this.project().details?.trim()?.split(' ') ?? [];
    const filteredArray = textArr.filter(item => item !== '');
    this.maxTextLength = filteredArray.length;
    // console.log(filteredArray);
  }
  openActionsMenu()
  {
    this.actionsPanel.toggle(event);
  }
  formatDate(date:string | null)
  {
    if(date)
    {
      const fullDate = date.split("-");
      const day = fullDate[2];
      const monthName = this.months[+fullDate[1] - 1];
      const year = fullDate[0];
      return `${day} ${monthName}-${year}`;
    }
    return '';
  }
  displayDrilldown()
  {
    this.overlayPanel.toggle(event);
  }
  displayDrilldown2()
  {
    this.overlayPanel2.toggle(event);
  }
  gotoEditPage()
  {
    // this.router.navigateByUrl(`/psr/edit-project/${this.project().sector}`);
    this.router.navigate(['edit-program' , this.project().id] , { relativeTo: this.route })
  }
  showDeleteDialog()
  {
    this.actionsPanel.hide()
    this.confirmationService.confirm({
      key: 'delete-program'
    });
  }
  close()
  {
    this.confirmationService.close()
  }
  deleteProgram()
  {
    console.log(this.project());
    this.ProgramId.emit(this.project().id);
    this.close();
  }
  gotoProjectDetailsPage(){
   localStorage.setItem("sector" , this.project().sector) 
  }
}

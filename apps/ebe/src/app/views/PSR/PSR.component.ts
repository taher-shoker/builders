import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { FileModel, TapModel } from '../../models/scorecard.model';
import { PSRService } from '../../services/psr.service';
import { TabDetailsComponent } from './components/tab-details/tab-details.component';
// import { PSRProjectCardComponent } from './components/project-card/project-card.component';
import { PSRDataModel } from '../../models/psr.model';
import { Subject, takeUntil } from 'rxjs';
import { ScorecardService } from '../../services/scorecard.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'stc-apps-psr',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , TabDetailsComponent],
  templateUrl: './PSR.component.html',
  styleUrl: './PSR.component.scss',
})
export class PSRComponent implements OnInit , OnDestroy {
  @ViewChild(TabDetailsComponent) child?: TabDetailsComponent;
  PSRTaps!:TapModel[];
  psrServices = inject(PSRService);
  toastr = inject(ToastrService);
  currentTab!:TapModel;
  psrData!:PSRDataModel[];
  endSubs$:Subject<PSRDataModel[]> = new Subject();
  scorecardService = inject(ScorecardService);
  ngOnInit(): void {
    this.getExecuteViewData();
  }
  isEmpty!:boolean;
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  getUploadedFile(file:FileModel)
  {
    this.psrServices.uploadFile("executiveView" , file).subscribe({
      next : () => {
        this.getExecuteViewData();
        this.toastr.success("The File is Saved Successfully");
        if(this.child)
        {
          this.child.visible = false;
        }
      },
      error : () => {
        if(this.child)
          {
            this.child.visible = false;
          }
      }
    })
  }
  private getExecuteViewData()
  {
  //   this.psrData = [
  //     {
  //         "id": 1,
  //         "sector": "Advance Analytics",
  //         "actual": 69.0,
  //         "planned": null,
  //         "details": "8 Projects and Initiative Details",
  //         "plannedDate": null
  //     },
  //     {
  //         "id": 2,
  //         "sector": "Analytics Enablement",
  //         "actual": 70.0,
  //         "planned": null,
  //         "details": "25 Projects and Initiative Details",
  //         "plannedDate": null
  //     },
  //     {
  //         "id": 3,
  //         "sector": "Data Governance",
  //         "actual": 91.0,
  //         "planned": null,
  //         "details": "3 Projects and Initiative Details",
  //         "plannedDate": null
  //     }
  // ]
    this.psrServices.getExecuteViewData().pipe(takeUntil(this.endSubs$)).subscribe({
      next : (res:PSRDataModel[]) => {
        if(res.length === 0)
        {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
          this.psrData = res;
        }
      }
    })
  }
  deleteProgram(id:number)
  {
    this.psrServices.deleteProgram(id).subscribe({
      next : () => {
        this.getExecuteViewData();
        this.toastr.success("The Program is Deleted Successfully");
      }
    })
  }
  getClickedTap(tab:TapModel)
  {
    this.currentTab = tab;
    console.log(tab);
  }
}

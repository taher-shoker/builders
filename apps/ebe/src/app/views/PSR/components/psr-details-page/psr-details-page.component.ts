import { Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PSRService } from '../../../../services/psr.service';
import { AddProjectForm, PSRProjectDetailsModel } from '../../../../models/psr.model';
import { ProjectDetailsCardComponent } from '../project-details-card/project-details-card.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EditModeViewComponent } from '../../../scorecard/components/edit-mode-view/edit-mode-view.component';
import { ScorecardService } from '../../../../services/scorecard.service';
import { FileModel, UserGroup } from '../../../../models/scorecard.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'stc-apps-psr-details-page',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , ProjectDetailsCardComponent , EditModeViewComponent , RouterLink],
  templateUrl: './psr-details-page.component.html',
  styleUrl: './psr-details-page.component.scss',
})
export class PsrDetailsPageComponent implements OnInit , OnDestroy {
  @ViewChild(ProjectDetailsCardComponent) child?: ProjectDetailsCardComponent;
  psrServices = inject(PSRService)
  router = inject(ActivatedRoute)
  PSRDetailsData!:PSRProjectDetailsModel[];
  endSubs$:Subject<PSRProjectDetailsModel[]> = new Subject();
  toastr = inject(ToastrService);
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService)
  groupName = "";
  username = "";
  userRoles!:UserGroup;
  ngOnInit(): void {
    // this.toastr.success("The File is Saved Successfully");
    this.username = this.scorecardService.getUsername();
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    this.userRoles = this.scorecardService.userRoles;
    // this.PSRDetailsData = this.psrServices.PSRDetailsData;
    this.router.params.subscribe({
      next : (param) => {
        this.groupName = param['id'];
        if(this.groupName)
        {
          this.getProjectDetails(this.groupName);
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  isEmpty!:boolean;
  private getProjectDetails(group:string)
  {
    this.psrServices.getExecuteProjectDetailsData(group).pipe(takeUntil(this.endSubs$)).subscribe({
      next : (res:PSRProjectDetailsModel[]) => {
        res.forEach(res2 => {
          res2.chartDetails.forEach(res3 => {
            res3.deleteAction = 'delete';
          })
        })
        // this.PSRDetailsData = res.filter(res2 => res2.gd !== null);
        this.PSRDetailsData = res
        if(this.PSRDetailsData.length === 0)
        {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
      }
    })
  }
  values:AddProjectForm[] = [];
  addRecordInTable(values:AddProjectForm)
  {
    this.values.push(values);
    if(this.values.length !== 0)
    {
      // const clickedProj = this.PSRDetailsData.filter(proj => {
      //   proj.chartDetails.filter(proj2 => proj2.id === values.id)[0]
      // })[0];
      // console.log(values);
      // console.log(this.PSRDetailsData);
      // console.log(clickedProj);
      // clickedProj.chartDetails.push(values);
    }
  }
  removeElementsFromArray(array1:AddProjectForm[], array2:AddProjectForm[]) {
    return array2.filter(item => !array1.includes(item));
  }
  closePopup(e:number)
  {
    const clickedProj = this.PSRDetailsData.filter(proj => proj.id === e)[0];
    const result = this.removeElementsFromArray(this.values, clickedProj.chartDetails);
    clickedProj.chartDetails = result;
  }
  visible = false;
  showDialog()
  {
    this.visible = true;
  }
  downloadTemplate()
  {
    // const groupName = this.PSRDetailsData[0].group;
    this.psrServices.downloadProjectDetailsTemplate(this.groupName).subscribe({
      next : (res) => {
        this.downloadFile(res, `${this.groupName}.csv`);
      }
    })
  }
  downloadFile(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  importData(file:FileModel | null)
  {
    this.psrServices.uploadFile("executiveViewData" , file , this.groupName).subscribe({
      next : () => {
        this.getProjectDetails(this.groupName);
        this.toastr.success("The File is Saved Successfully");
        this.visible = false;
      },
      error : () => {
        this.visible = false;
      }
    })
  }
  onHide()
  {
    this.visible = false;
  }
}

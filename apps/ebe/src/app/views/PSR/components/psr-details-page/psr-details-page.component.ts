import { Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PSRService } from '../../../../services/psr.services';
import { AddProjectForm, ChartDetails, PSRProjectDetailsModel } from '../../../../models/psr.model';
import { ProjectDetailsCardComponent } from '../project-details-card/project-details-card.component';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EditModeViewComponent } from '../../../scorecard/components/edit-mode-view/edit-mode-view.component';
import { ScorecardService } from '../../../../services/scorecard.service';
import { DialogModalComponent } from '../../../../components/dialog/dialog.component';
import { FileModel } from '../../../../models/scorecard.model';
@Component({
  selector: 'stc-apps-psr-details-page',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , ProjectDetailsCardComponent , EditModeViewComponent , DialogModalComponent],
  templateUrl: './psr-details-page.component.html',
  styleUrl: './psr-details-page.component.scss',
})
export class PsrDetailsPageComponent implements OnInit , OnDestroy {
  psrServices = inject(PSRService)
  router = inject(ActivatedRoute)
  PSRDetailsData!:PSRProjectDetailsModel[];
  endSubs$:Subject<PSRProjectDetailsModel[]> = new Subject();
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService)
  groupName = "";
  ngOnInit(): void {
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
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
  private getProjectDetails(group:string)
  {
    this.psrServices.getExecuteProjectDetailsData(group).pipe(takeUntil(this.endSubs$)).subscribe({
      next : (res:PSRProjectDetailsModel[]) => {
        res.forEach(res2 => {
          res2.chartDetails.forEach(res3 => {
            res3.deleteAction = 'delete';
          })
        })
        this.PSRDetailsData = res;
        console.log(this.PSRDetailsData);
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
  isAdded = false;
  sendData(data:{id:number , data:ChartDetails[]})
  {
      // console.log(this.PSRDetailsData);
      // console.log(data.id);
      // console.log(data.data);
      const exists = this.PSRDetailsData.filter(val => val.id === data.id)[0];
      // console.log(exists);
      const index = this.PSRDetailsData.indexOf(exists);
      this.psrServices.addNewChartDetails(data.id , data.data).subscribe({
        next : (res) => {
          console.log(res);
          this.PSRDetailsData[index].chartDetails = res;
          this.isAdded = true;
          // this.getProjectDetails(this.groupName)
        }
      })

  }
  visible = false;
  showDialog()
  {
    this.visible = true;
  }
  downloadTemplate()
  {
    const groupName = this.PSRDetailsData[0].group;
    this.psrServices.downloadProjectDetailsTemplate(groupName).subscribe({
      next : (res) => {
        this.downloadFile(res, `${groupName}.csv`);
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
    console.log(file);
  }
  onHide()
  {
    this.visible = false;
  }
}

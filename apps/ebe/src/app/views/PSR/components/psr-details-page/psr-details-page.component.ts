import { Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PSRService } from '../../../../services/psr.services';
import { AddProjectForm, PSRProjectDetailsModel } from '../../../../models/psr.model';
import { ProjectDetailsCardComponent } from '../project-details-card/project-details-card.component';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'stc-apps-psr-details-page',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , ProjectDetailsCardComponent],
  templateUrl: './psr-details-page.component.html',
  styleUrl: './psr-details-page.component.scss',
})
export class PsrDetailsPageComponent implements OnInit , OnDestroy {
  psrServices = inject(PSRService)
  router = inject(ActivatedRoute)
  PSRDetailsData!:PSRProjectDetailsModel[];
  endSubs$:Subject<PSRProjectDetailsModel[]> = new Subject();
  groupName = "";
  ngOnInit(): void {
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
      const clickedProj = this.PSRDetailsData.filter(proj => proj.id === values.id)[0];
      clickedProj.chartDetails.push(values);
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
  sendData(id:number)
  {
    const sentObj = this.PSRDetailsData.filter(d => d.id === id)[0];
    console.log(sentObj.chartDetails);
  }
}

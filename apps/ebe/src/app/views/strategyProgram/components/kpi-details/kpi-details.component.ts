import { StrategyProgramKpiDetailsModel } from '../../../../models/strategy-program.model';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { StrategyProgramService } from '../../../../services/strategy-program.service';
import { SharedUiModule } from "@stc-apps/shared-ui";
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { EditModeViewComponent } from '../../../scorecard/components/edit-mode-view/edit-mode-view.component';
import { ScorecardService } from '../../../../services/scorecard.service';
import { FileModel } from '../../../../models/scorecard.model';
import { ToastrService } from 'ngx-toastr';
export interface KpiProjectsDetailsModel
{
  project:string;
  actual:number;
  planned:number;
}
@Component({
  selector: 'stc-apps-kpi-details.component.ts',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    AccordionModule,
    SharedUiModule,
    ButtonModule,
    DialogModule,
    RouterModule,
    EditModeViewComponent
  ],
  providers : [ConfirmationService],
  templateUrl: './kpi-details.component.html',
  styleUrl: './kpi-details.component.scss',
})
export class KpiDetailsComponentTsComponent implements OnInit {
  currentId!:string;
  currentMode!: 'editMode' | 'viewMode';
  activatedRoute = inject(ActivatedRoute);
  strategyProgramService = inject(StrategyProgramService);
  StrategyProgramData: StrategyProgramKpiDetailsModel[] = [];
  private confirmationService = inject(ConfirmationService);
  private scorecardService = inject(ScorecardService);
  constructor(private router:Router){}
  toastr = inject(ToastrService);
  isEmpty!:boolean;
  ngOnInit(): void {
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    this.activatedRoute.params.subscribe({
      next: (param: Params) => {
        this.currentId = param['kpiId'];
        // this.isEmpty = true;
        this.getStrategyProgramDetails(this.currentId);
      },
    });
  }
  private getStrategyProgramDetails(strategyName:string)
  {
    this.strategyProgramService.getStrategyProgramDetails(strategyName).subscribe({
      next : (res:StrategyProgramKpiDetailsModel[]) => {
        this.StrategyProgramData = res;
        if(this.StrategyProgramData.length === 0)
        {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
      }
    })
  }
  isTapOpened!: boolean;
  currentTabIndex!: number;
  getCurrentIndex(index: boolean) {
    console.log(index);
    this.isTapOpened = index;
  }
  getIndex(index: number | number[]) {
    this.currentTabIndex = typeof index === 'number' ? index : 0;
  }
  showForm(project:StrategyProgramKpiDetailsModel) {
    console.log(project);
    this.router.navigateByUrl(`/strategy-project-form/${project.strategyProjectName}/${project.objective}`);
    this.strategyProgramService.clickedProjects.next(project.projects);
  }
  // editProject(kpi:KpiProjectsDetailsModel , project:StrategyProgramKpiDetailsModel , singleproject:StrategyProgramKpiProjectsDetailsModel)
  // {
  //   // this.router.navigateByUrl(`/strategy-project-form/${project.project}`);
  //   this.router.navigateByUrl(`/strategy-project-form/${project.strategyProjectName}/${project.objective}`);
  //   this.strategyProgramService.clickedProjects.next(project.projects);
  //   this.strategyProgramService.clickedProject.next(singleproject);
  // }
  deletedProject!:KpiProjectsDetailsModel;
  prevProjects!:KpiProjectsDetailsModel[];
  kpi!:StrategyProgramKpiDetailsModel;
  deleteProject(project:KpiProjectsDetailsModel , projects:KpiProjectsDetailsModel[] , kpi:StrategyProgramKpiDetailsModel)
  {
    this.deletedProject = project;
    this.prevProjects = projects;
    this.kpi = kpi;
    this.confirmationService.confirm({
      key: 'delete-project'
    });
  }
  visible!:boolean;
  close()
  {
    this.confirmationService.close()
  }
  deleteProjectItem()
  {
    const deletedData = this.prevProjects.filter(val => val.project !== this.deletedProject.project);
    this.strategyProgramService.updateProjects(this.kpi.strategyProjectName , this.kpi.objective , deletedData).subscribe({
      next : () => {
        this.strategyProgramService.getStrategyProgramDetails(this.currentId).subscribe({
          next : (res:StrategyProgramKpiDetailsModel[]) => {
            this.StrategyProgramData = res;
            this.close();
          }
        })
      }
    })
  }
  showDialog()
  {
    this.visible = true;
  }
  downloadTemplate()
  {
    this.strategyProgramService.downloadStrategyProgramDetails(this.currentId).subscribe({
      next : (response) => {
        this.downloadFile(response, `${this.currentId}.csv`);
      }
    })
  }
  capitalizeSentence(sentence:string) {
    return sentence
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  ImportFile(uploadFile:FileModel | null)
  {
    if(uploadFile)
    {
      this.strategyProgramService.uploadCadSummaryDetailsFile(uploadFile , this.currentId).subscribe({
        next : () => {
          this.getStrategyProgramDetails(this.currentId);
          this.visible = false;
          this.toastr.success("The File is Saved Successfully");
        },
        error : () => {
          this.visible = false;
        }
      })
    }
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
}

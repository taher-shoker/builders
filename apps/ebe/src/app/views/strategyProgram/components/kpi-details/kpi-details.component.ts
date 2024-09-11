import { StrategyProgramKpiDetailsModel } from '../../../../models/strategy-program.model';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { StrategyProgramService } from '../../../../services/strategy-program.service';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
export interface KpiProjectsDetailsModel
{
  id:number;
  title:string;
  actualValue:number;
  plannedValue:number;
  progressValue:number;
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
    RouterModule
  ],
  providers : [ConfirmationService],
  templateUrl: './kpi-details.component.html',
  styleUrl: './kpi-details.component.scss',
})
export class KpiDetailsComponentTsComponent implements OnInit {
  currentId = 0;
  activatedRoute = inject(ActivatedRoute);
  strategyProgramService = inject(StrategyProgramService);
  StrategyProgramData: StrategyProgramKpiDetailsModel[] = [];
  private confirmationService = inject(ConfirmationService);
  constructor(private router:Router){}
  ngOnInit(): void {
    this.StrategyProgramData =
      this.strategyProgramService.getStrategyProgramKpiDetailsModel();
    this.activatedRoute.params.subscribe({
      next: (param: Params) => {
        this.currentId = +param['kpiId'];
      },
    });
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
  showForm() {
    this.router.navigateByUrl('/strategy-project-form');
  }
  editProject(project:KpiProjectsDetailsModel)
  {
    console.log(project);
  }
  deletedProject!:KpiProjectsDetailsModel;
  deleteProject(project:KpiProjectsDetailsModel)
  {
    this.deletedProject = project;
    this.confirmationService.confirm({
      key: 'delete-project'
    });
  }
  close()
  {
    this.confirmationService.close()
  }
  deleteProjectItem()
  {
    console.log(this.deletedProject);
    this.close();
  }
}

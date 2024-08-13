import { StrategyProgramKpiDetailsModel } from './../../../../models/strategy-program.model';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { ActivatedRoute, Params } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { StrategyProgramService } from '../../../../services/strategy-program.service';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'stc-apps-kpi-details.component.ts',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, AccordionModule, SharedUiModule , ButtonModule , DialogModule],
  templateUrl: './kpi-details.component.ts.component.html',
  styleUrl: './kpi-details.component.ts.component.scss',
})
export class KpiDetailsComponentTsComponent implements OnInit{
  currentId = 0;
  activatedRoute = inject(ActivatedRoute)
  strategyProgramService = inject(StrategyProgramService)
  StrategyProgramData:StrategyProgramKpiDetailsModel[] = []
  ngOnInit(): void {
    this.StrategyProgramData = this.strategyProgramService.getStrategyProgramKpiDetailsModel();
    this.activatedRoute.params.subscribe({
      next : (param:Params) => {
        this.currentId = +param['kpiId'];
      }
    })
  }
  visible!:boolean;
  isTapOpened!:boolean;
  currentTabIndex!:number;
  getCurrentIndex(index:boolean)
  {
    console.log(index);
    this.isTapOpened = index;
  }
  getIndex(index:number | number[])
  {
    this.currentTabIndex = typeof index === 'number' ? index : 0;
  }
  showForm()
  {
    this.visible = true;
  }
}

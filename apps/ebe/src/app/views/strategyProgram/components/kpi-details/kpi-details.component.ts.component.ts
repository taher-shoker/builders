import { StrategyProgramKpiDetailsModel } from './../../../../models/strategy-program.model';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { ActivatedRoute, Params } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { StrategyProgramService } from '../../../../services/strategy-program.service';
import { SharedUiModule } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-kpi-details.component.ts',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, AccordionModule, SharedUiModule],
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
}

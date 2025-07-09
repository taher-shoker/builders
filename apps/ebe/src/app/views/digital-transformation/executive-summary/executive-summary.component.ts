import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { StatusCardComponent } from '../status-card/status-card.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ExecutiveSummaryCardComponent } from './executive-summary-card/executive-summary-card.component';
import {
  AddWorkstreamFormModel,
  AIDashboardModel,
  ExecutiveCardModel,
  ExecutiveSummaryDataModel,
} from '../../../models/digital-transformation';
import { SidebarModule } from 'primeng/sidebar';
import { AddWorkstreamFormComponent } from '../add-workstream-form/add-workstream-form.component';

@Component({
  selector: 'stc-apps-executive-summary',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    StatusCardComponent,
    SharedUiModule,
    ExecutiveSummaryCardComponent,
    SidebarModule,
    AddWorkstreamFormComponent,
  ],
  templateUrl: './executive-summary.component.html',
  styleUrl: './executive-summary.component.scss',
})
export class ExecutiveSummaryComponent {
  sidebarVisible1 = false;
  sidebarVisible2 = false;
  showAddWorkstreamSidebar = false;
  currentSideBarTitle = '';
  activeAccordionIndex = 0;
  isWorkstreamSidebarVisible!: boolean;
  isEditWorkStream!: boolean;
  isEditProject!: boolean;
  isAddProject!: boolean;
  toggleAccordion(index: number, event: Event) {
    event.stopPropagation();
    this.activeAccordionIndex =
      this.activeAccordionIndex === index ? -1 : index;
  }
  executiveSummaryData: ExecutiveSummaryDataModel = {
    aiDashboard: [
      {
        title: 'CPU',
        status: 'on track',
        weight: '65%',
        planned: '31.8%',
        actual: '20.7%',
        details: [
          {
            title: 'prepaid O2C',
            status: 'on track',
            actual: 90,
            planned: 95,
          },
          {
            title: 'postpaid & fixed ph1 (FWA) delivery',
            status: 'delayed',
            actual: 15.6,
            planned: 23.8,
          },
        ],
      },
      {
        title: 'EBU',
        status: 'at risk',
        weight: '15%',
        planned: '40.0%',
        actual: '30.0%',
        details: [
          {
            title: 'L2Q - MVP2 Quote and Contract',
            status: 'complete',
            actual: 90,
            planned: 95,
          },
          {
            title: 'Golden Product MVP1',
            status: 'not started/on hold',
            actual: 15.6,
            planned: 23.8,
          },
        ],
      },
    ],
    itPlatforms: [
      {
        title: 'FUs',
        status: 'on track',
        weight: '20%',
        planned: '50.0%',
        actual: '40.0%',
        details: [
          {
            title: 'L2Q - MVP2 Quote and Contract',
            status: 'on track',
            actual: 90,
            planned: 95,
          },
          {
            title: 'Golden Product MVP1',
            status: 'at risk',
            actual: 15.6,
            planned: 23.8,
          },
        ],
      },
      {
        title: 'IT Platforms',
        status: 'at risk',
        weight: '20%',
        planned: '50.0%',
        actual: '40.0%',
        details: [
          {
            title: 'L2Q - MVP2 Quote and Contract',
            status: 'on track',
            actual: 90,
            planned: 95,
          },
          {
            title: 'Golden Product MVP1',
            status: 'at risk',
            actual: 15.6,
            planned: 23.8,
          },
        ],
      },
    ],
  };
  openSidebar1(summaryData: AIDashboardModel) {
    this.sidebarVisible1 = true;
    this.currentSideBarTitle = summaryData.title;
  }
  openSidebar2(summaryData: AIDashboardModel) {
    this.sidebarVisible2 = true;
    this.currentSideBarTitle = summaryData.title;
  }
  openAddWorkstreamSidebar(
    isEditMode: boolean,
    isAddProject: boolean,
    isEditProject: boolean
  ) {
    this.isEditWorkStream = isEditMode;
    this.isAddProject = isAddProject;
    this.isEditProject = isEditProject;
    this.showAddWorkstreamSidebar = true;
    this.isWorkstreamSidebarVisible = true;
  }
  hideAddWorkstreamSidebar() {
    this.isWorkstreamSidebarVisible = false;
  }
  addWorkStream(workStreamData: AddWorkstreamFormModel) {
    console.log('Workstream Data:', workStreamData);
  }
  openProjSidebar(card: ExecutiveCardModel) {
    console.log(card);
  }
}

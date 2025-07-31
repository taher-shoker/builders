import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { StatusCardComponent } from '../status-card/status-card.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ExecutiveSummaryCardComponent } from './executive-summary-card/executive-summary-card.component';
import {
  AddWorkstreamFormModel,
  AIDashboardModel,
  CreateWorkStreamModel,
  ExecutiveCardModel,
  ExecutiveSummaryDataModel,
  pageDetailsModel,
  pageDetailsProjectModel,
  STATUS_STYLE_MAP,
  WorkstreamStatus,
} from '../../../models/digital-transformation';
import { SidebarModule } from 'primeng/sidebar';
import { AddWorkstreamFormComponent } from '../add-workstream-form/add-workstream-form.component';
import { DigitalTransformationService } from '../../../services/digital-transformation.service';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
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
    ConfirmDialogModule,
  ],
  templateUrl: './executive-summary.component.html',
  styleUrl: './executive-summary.component.scss',
  providers: [ConfirmationService],
})
export class ExecutiveSummaryComponent implements OnInit, OnDestroy {
  sidebarVisible1 = false;
  showAddWorkstreamSidebar = false;
  currentSideBarTitle = '';
  activeAccordionIndex = 0;
  isWorkstreamSidebarVisible!: boolean;
  isEditWorkStream!: boolean;
  isEditProject!: boolean;
  isAddProject!: boolean;
  toastr = inject(ToastrService);
  endSubs$: Subject<any> = new Subject();
  isProject = signal(false);
  confirmationService = inject(ConfirmationService);
  digitalTransformationService = inject(DigitalTransformationService);
  mainTitle = input<string[]>([]);
  pageId = input<number>();
  toggleAccordion(index: number, event: Event) {
    event.stopPropagation();
    this.activeAccordionIndex =
      this.activeAccordionIndex === index ? -1 : index;
  }
  dsDashboard: pageDetailsModel[] = [];
  itPlatformDashboard: pageDetailsModel[] = [];
  private getDigitalTransformationDetailsData(pageId: number) {
    this.digitalTransformationService
      .getDigitalTransformationDetailsData(pageId)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: pageDetailsModel[]) => {
          if (pageId === 1) {
            this.dsDashboard = res;
          } else {
            this.itPlatformDashboard = res;
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  ngOnInit(): void {
    this.getDigitalTransformationDetailsData(1);
    this.getDigitalTransformationDetailsData(2);
  }
  sidebarType = '';
  currentSideBarContent = '';
  highlights: { id: number; title: string; value: string }[] = [];
  challenges: { id: number; title: string; value: string }[] = [];
  openSidebar1(summaryData: pageDetailsModel, type: string) {
    this.sidebarType = type;
    this.sidebarVisible1 = true;
    this.highlights = [];
    this.challenges = [];
    this.currentSideBarTitle = summaryData.businessUnit;
    if (
      summaryData.businessUnitHighlights &&
      typeof summaryData.businessUnitHighlights === 'string'
    ) {
      const cleaned = summaryData.businessUnitHighlights.replace(/�/g, ' ');
      if (cleaned.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed)) {
            this.highlights = parsed;
          }
        } catch (error) {
          console.warn(error);
        }
      }
    }
    if (
      summaryData.businessUnitChallenges &&
      typeof summaryData.businessUnitChallenges === 'string'
    ) {
      const cleaned2 = summaryData.businessUnitChallenges.replace(/�/g, ' ');
      if (cleaned2.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(cleaned2);
          if (Array.isArray(parsed)) {
            this.challenges = parsed;
          }
        } catch (error) {
          console.warn(error);
        }
      }
    }
    // if (summaryData.businessUnitChallenges) {
    //   const cleaned2 = summaryData.businessUnitChallenges.replace(/�/g, ' ');
    //   this.challenges = JSON.parse(cleaned2);
    // }
  }
  getStatusStyle(status: string) {
    const normalized = status?.toLowerCase();
    const matchedStatus = Object.values(WorkstreamStatus).find(
      (s) => s === normalized
    ) as WorkstreamStatus;

    return (
      STATUS_STYLE_MAP[matchedStatus] ||
      STATUS_STYLE_MAP[WorkstreamStatus.Complete]
    );
  }
  editedData!: pageDetailsModel | null;
  openAddWorkstreamSidebar(
    isEditMode: boolean,
    isAddProject: boolean,
    isEditProject: boolean,
    summaryData?: pageDetailsModel
  ) {
    this.isEditWorkStream = isEditMode;
    this.isAddProject = isAddProject;
    this.isEditProject = isEditProject;
    this.showAddWorkstreamSidebar = true;
    // this.isWorkstreamSidebarVisible = true;
    this.isWorkstreamSidebarVisible = false;
    this.editedData = null;
    if (summaryData) {
      this.editedData = { ...summaryData };
    }
  }
  hideAddWorkstreamSidebar() {
    this.isWorkstreamSidebarVisible = false;
  }
  convertHeighlights(heighlights: string): string {
    // const lines = heighlights.split('\n');
    const lines = heighlights.split(' ');
    const result = lines.map((line, index) => {
      const parts = line.split(':');
      const title = parts[0].trim();
      const value = parts.length > 1 ? parts[1].trim() : '';
      if (!line.includes(':')) {
        return {
          id: index + 1,
          value: title,
        };
      }
      return {
        id: index + 1,
        title,
        value,
      };
    });
    return JSON.stringify(result);
  }
  clickedWorkstreamId!: number;
  addWorkStream(workStreamData: AddWorkstreamFormModel) {
    const data: CreateWorkStreamModel = {
      pageId: this.pageId() ?? 0,
      businessUnit: workStreamData.title,
      businessUnitStatus: workStreamData.status,
      businessUnitHighlights: workStreamData.heighlights
        ? this.convertHeighlights(workStreamData.heighlights)
        : workStreamData.highlights
        ? this.convertHeighlights(workStreamData.highlights)
        : null,
      businessUnitChallenges: workStreamData.challenges
        ? this.convertHeighlights(workStreamData.challenges)
        : null,
      weight: workStreamData.weight,
      actual: workStreamData.actual,
      planned: workStreamData.planned,
    };
    if (data.weight) {
      if (!this.isEditWorkStream) {
        this.digitalTransformationService.createNewWorkStream(data).subscribe({
          next: (res) => {
            this.getDigitalTransformationDetailsData(1);
            this.getDigitalTransformationDetailsData(2);
            this.toastr.success('The workstream is added successfully');
            this.showAddWorkstreamSidebar = false;
          },
        });
      } else {
        if (this.editedData) {
          this.digitalTransformationService
            .updateWorkstream(this.editedData.businessUnitId, data)
            .subscribe({
              next: (res) => {
                this.getDigitalTransformationDetailsData(1);
                this.getDigitalTransformationDetailsData(2);
                this.toastr.success('The workstream is updated successfully');
                this.showAddWorkstreamSidebar = false;
              },
            });
        }
        // console.log(data);
      }
    } else {
      // console.log(data);
      const addedProject = {
        projectName: data.businessUnit,
        projectStatus: data.businessUnitStatus,
        metrics: [
          {
            name: 'actual',
            value: data.actual,
          },
          {
            name: 'planned',
            value: data.planned,
          },
        ],
      };
      // console.log(this.getStatusStyle(addedProject.projectStatus ?? ''));
      // if (this.activeAccordionIndex) {
      if (!this.isEditProject) {
        this.digitalTransformationService
          .createNewProjectInWorkStream(
            this.activeAccordionIndex + 1,
            this.clickedWorkstreamId,
            addedProject
          )
          .subscribe({
            next: (res) => {
              this.getDigitalTransformationDetailsData(1);
              this.getDigitalTransformationDetailsData(2);
              this.toastr.success('The project is added successfully');
              this.showAddWorkstreamSidebar = false;
            },
          });
      } else {
        // console.log(addedProject);
        // console.log(this.editProjectData?.projectId);
        this.digitalTransformationService
          .updateWorkstreamProject(
            this.editProjectData?.projectId ?? 0,
            addedProject
          )
          .subscribe({
            next: () => {
              this.getDigitalTransformationDetailsData(1);
              this.getDigitalTransformationDetailsData(2);
              this.toastr.success('The project is updated successfully');
              this.showAddWorkstreamSidebar = false;
            },
          });
      }
      // }
    }
  }
  editProjectData!: pageDetailsProjectModel | null;
  isDeleteProject = false;
  openProjSidebar(card: pageDetailsProjectModel) {
    // console.log(card);
    this.editProjectData = { ...card };
  }
  deletedItem: any;
  deleteWorkStream(e: any) {
    this.deletedItem = e;
    this.confirmationService.confirm({});
  }
  closeDialog() {
    this.confirmationService.close();
  }
  deleteChallenge() {
    console.log('deletedItem => ', this.deletedItem);
    if (this.isProject()) {
      this.digitalTransformationService
        .deleteWorkStreamProject(this.deletedItem.projectId)
        .subscribe({
          next: () => {
            this.getDigitalTransformationDetailsData(1);
            this.getDigitalTransformationDetailsData(2);
            this.toastr.success('The project is deleted successfully');
            this.showAddWorkstreamSidebar = false;
            this.closeDialog();
          },
          error: () => {
            this.closeDialog();
            this.showAddWorkstreamSidebar = false;
          },
        });
    } else {
      this.digitalTransformationService
        .deleteWorkStream(this.deletedItem.businessUnitId)
        .subscribe({
          next: () => {
            this.getDigitalTransformationDetailsData(1);
            this.getDigitalTransformationDetailsData(2);
            this.toastr.success('The workstream is deleted successfully');
            this.showAddWorkstreamSidebar = false;
            this.closeDialog();
          },
          error: () => {
            this.closeDialog();
            this.showAddWorkstreamSidebar = false;
          },
        });
    }
  }
}

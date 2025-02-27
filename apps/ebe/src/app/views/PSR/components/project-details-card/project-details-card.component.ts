import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AddProjectForm,
  ChartDetails,
  ColumnsSchema,
  ProgressInfo,
  PSRProjectDetailsModel,
} from '../../../../models/psr.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { AddProjectFormComponent } from '../add-project-form/add-project-form.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PSRService } from '../../../../services/psr.service';
import { UserGroup } from '../../../../models/scorecard.model';
import { MenuModule } from 'primeng/menu';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ActivityLog, ActivityLogData } from '../../../../models/activity-logs';
import { ActivityLogService } from '../../../../services/activity-logs.service';
import { Subject, takeUntil } from 'rxjs';
import { ScorecardService } from '../../../../services/scorecard.service';
@Component({
  selector: 'stc-apps-project-details-card',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    OverlayPanelModule,
    DialogModule,
    AddProjectFormComponent,
    ConfirmDialogModule,
    MenuModule,
  ],
  templateUrl: './project-details-card.component.html',
  styleUrl: './project-details-card.component.scss',
  providers: [ConfirmationService, DatePipe],
})
export class ProjectDetailsCardComponent implements OnInit, OnChanges {
  @Input() isAdded!: boolean;
  @ViewChild('overlayPanel2') overlayPanel2!: OverlayPanel;
  @ViewChild('overlayPanel3') overlayPanel3!: OverlayPanel;
  @ViewChild('overlayPanel4') overlayPanel4!: OverlayPanel;
  projectData: InputSignal<PSRProjectDetailsModel> =
    input.required<PSRProjectDetailsModel>();
  userRoles: InputSignal<UserGroup> = input.required<UserGroup>();
  @Output() addRecordInTable: EventEmitter<AddProjectForm> = new EventEmitter();
  @Output() closePopupEmit: EventEmitter<number> = new EventEmitter();
  router = inject(Router);
  route = inject(ActivatedRoute);
  isAllowed = input<boolean>();
  isPMO = input<boolean>(false);
  isDeleted = input<boolean>(false);
  isAdmin = input<boolean>();
  activityLogsTableHeader = signal<ColumnsSchema[]>([]);
  activityLogsTableBody = signal<ActivityLogData[]>([]);
  @Output() sendData: EventEmitter<{ id: number; data: ChartDetails[] }> =
    new EventEmitter();
  @ViewChild('actionsPanel') actionsPanel!: OverlayPanel;
  data!: ProgressInfo;
  items: any[] = [];
  showActivityLogsPopup = false;
  groupName = input.required<string>();
  activityLogService = inject(ActivityLogService);
  $endScorecardActivityLogsSub: Subject<any> = new Subject();
  scorecardService = inject(ScorecardService);
  showActivityLogs() {
    this.getSpecificActivityLog(
      'PSR',
      'Add,Edit,Delete',
      this.sectorId,
      this.projectData().id.toString(),
      '',
      true
    );
    // this.activityLogsPanel.toggle(event);
    this.showActivityLogsPopup = !this.showActivityLogsPopup;
  }
  private getSpecificActivityLog(
    moduleName: string,
    activityType:string,
    subModule?: string,
    projectName?: string,
    entity?:string,
    showParentData?:boolean
  ) {
    this.activityLogService
      .getSpecificActivityLog(moduleName, activityType , subModule, projectName , entity , showParentData)
      .pipe(takeUntil(this.$endScorecardActivityLogsSub))
      .subscribe({
        next: (activityLogs: ActivityLogData[]) => {
          // console.log(activityLogs);
          
          this.activityLogsTableBody.set(activityLogs);
        },
      });
  }
  popupClosed() {
    this.showActivityLogsPopup = false;
    this.$endScorecardActivityLogsSub.complete();
    this.actionsPanel.hide();
  }
  sectorId:string = ''
  gotoEditPage() {
    this.route.params.subscribe({
      next: (param: Params) => {
        if (param['id']) {
          const program = encodeURIComponent(param['id']);
          this.router.navigateByUrl(
            `/psr/edit-project/${program}/${this.projectData().id}`
          );
        }
      },
    });
    // this.router.navigate(['edit-program' , this.projectData().projectName] , { relativeTo: this.route })
  }
  showDeleteDialog() {
    this.confirmationService.confirm({
      key: 'delete-program',
    });
  }
  toastr = inject(ToastrService);
  showPopover = false;
  tableHeader!: ColumnsSchema[];
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  visible = false;
  isEditMode!: boolean;
  psrServices = inject(PSRService);
  datePipe = inject(DatePipe);
  activeRoute = inject(ActivatedRoute);
  constructor(
    private elementRef: ElementRef,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this.scorecardService.toggleSwitchBtn.subscribe({
      next : (res) => {
        this.showActivityLogsPopup = false;
        this.actionsPanel?.hide();
      }
    })
    this.route.params.subscribe({
      next: (param: Params) => {
        if (param['sectorId']) {
          this.sectorId = param['sectorId'];
        }
      },
    });
    this.activityLogsTableHeader.set([
      {
        key: 'username',
        type: 'text',
        label: 'User Name',
      },
      {
        key: 'type',
        type: 'text',
        label: 'Activity Type',
      },
      {
        key: 'details',
        type: 'text',
        label: 'Activity Details',
      },
      {
        key: 'time',
        type: 'text',
        label: 'Time Stamp',
      },
      {
        key: 'oldValue',
        type: 'text',
        label: 'Old Value',
      },
      {
        key: 'newValue',
        type: 'text',
        label: 'New Value',
      },
    ]);
    if (this.userRoles().roles[0].roleName !== 'BE_VIEWERS') {
      this.tableHeader = this.psrServices.tableHeader;
    } else {
      this.tableHeader = this.psrServices.tableHeader.filter(
        (val) => val.key !== ''
      );
    }
    if (this.isAdmin()) {
      if (this.isDeleted()) {
        this.items = [
          {
            label: 'Activity Logs',
            icon: 'pi pi-clock',
          },
        ];
      } else {
        this.items = [
          {
            label: 'Edit',
            icon: 'pi pi-pen-to-square',
          },
          {
            label: 'Delete',
            icon: 'pi pi-trash',
          },
          {
            label: 'Activity Logs',
            icon: 'pi pi-clock',
          },
        ];
      }
    } else {
      this.items = [
        {
          label: 'Edit',
          icon: 'pi pi-pen-to-square',
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
        },
      ];
    }
    if(this.isPMO())
    {
      this.items = [
        {
          label: 'Edit',
          icon: 'pi pi-pen-to-square',
        }
      ];
    }
  }
  newData!: PSRProjectDetailsModel;
  titleArr: string[] = [];
  // chartData:ChartDetails[] = [];
  ngOnChanges(): void {
    if (this.projectData().projectName) {
      this.titleArr = this.projectData().projectName.split(' ');
    }
    this.newData = JSON.parse(JSON.stringify(this.projectData()));
    const start = this.projectData().startDate;
    const end = this.projectData().endDate;
    // this.newData.chartDetails.forEach(d => {
    //   this.chartData.push({

    //   })
    // })
    if (start && end) {
      if (
        +start.split('-')[2] &&
        this.months[+start.split('-')[1] - 1] &&
        +start.split('-')[0] &&
        +end.split('-')[2] &&
        this.months[+end.split('-')[1] - 1] &&
        +end.split('-')[0]
      ) {
        const sd = `${+start.split('-')[2]}-${
          this.months[+start.split('-')[1] - 1]
        }-${+start.split('-')[0]}`;
        const ed = `${+end.split('-')[2]}-${
          this.months[+end.split('-')[1] - 1]
        }-${+end.split('-')[0]}`;
        this.projectData().startDate = sd;
        this.projectData().endDate = ed;
      }
    }
    // console.log(this.projectData());
    const vactual = this.projectData().vactual;
    const vplanned = this.projectData().vplanned;
    const difference = Math.abs(vplanned - vactual);
    this.data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: vactual,
      barColor:
        (difference >= 0 && difference <= 5) || vactual > vplanned
          ? '#00C48C'
          : difference > 5 && difference <= 10
          ? '#EFC500'
          : '#FF1A1A',
      bgBarColor:
        (difference >= 0 && difference <= 5) || vactual > vplanned
          ? '#00c48c1a'
          : difference > 5 && difference <= 10
          ? 'rgba(239, 197, 0, .2)'
          : 'rgba(255, 26, 26, .2)',
      indexes: [
        {
          caption: 'Actual',
          value: this.projectData().vactual,
          position: 'up',
          actualBarColor:
            (difference >= 0 && difference <= 5) || vactual > vplanned
              ? '#009F71'
              : difference > 5 && difference <= 10
              ? '#D9B301'
              : '#BC0000',
        },
        {
          caption: `Planned`,
          value: this.projectData().vplanned,
          position: 'down',
          actualBarColor: '#000000',
        },
      ],
    };
  }
  displayDrilldown() {
    this.overlayPanel.toggle(event);
  }
  showAddRecordForm() {
    this.visible = true;
  }
  showAddRecordForm2() {
    this.visible = true;
    this.isAddedInTable = false;
  }
  formValues: AddProjectForm[] = [];
  formValues2: AddProjectForm[] = [];
  getFormValues(formValue: AddProjectForm) {
    this.selectedItem = null;
    this.formValues.push(formValue);
    this.formValues2.push(formValue);
    this.addRecordInTable.emit(formValue);
    this.visible = false;
    this.isEditMode = false;
    this.newData.chartDetails.push(formValue);
    if (!this.isAddedInTable) {
      this.saveData();
    }
    // this.newData = JSON.parse(JSON.stringify(this.projectData()));
  }
  deletedData!: ChartDetails;
  deleteRecord(e: ChartDetails) {
    this.showActivityLogsPopup3 = false;
    this.deletedData = e;
    this.confirmationService.confirm({
      key: 'delete-record',
    });
  }
  close() {
    this.confirmationService.close();
  }
  @Output() deleteTableRecord: EventEmitter<boolean> = new EventEmitter();
  deleteRecordRow() {
    // this.newData.chartDetails = this.newData.chartDetails.filter(val => val.major !== this.deletedData.major);
    // this.projectData().chartDetails = this.newData.chartDetails.filter(val => val.major !== this.deletedData.major);
    // this.formValues2 = this.formValues2.filter(val => val.major !== this.deletedData.major);
    // this.formValues = this.newData.chartDetails.filter(val => val.major !== this.deletedData.major);
    const isExists = this.formValues2.filter(
      (val) => val.id === this.deletedData.id
    )[0];
    this.newData.chartDetails = this.newData.chartDetails.filter(
      (val) => val.id !== this.deletedData.id
    );
    if (isExists) {
      this.formValues2 = this.formValues2.filter(
        (val) => val.id !== this.deletedData.id
      );
    } else {
      this.psrServices
        .addNewChartDetails(
          this.projectData().id,
          this.newData.chartDetails,
          this.groupName(),
          this.projectData().projectName
        )
        .subscribe({
          next: (res) => {
            this.toastr.success('The record is deleted Successfully');
            this.deleteTableRecord.emit(true);
            this.newData.chartDetails = res;
            this.projectData().chartDetails = res;
            this.isEditMode = false;
            this.formValues = [];
            this.overlayPanel.hide();
          },
          error: (error) => {
            if (error) {
              const isExists2 = this.newData.chartDetails.filter(
                (val) => val.id === this.deletedData.id
              )[0];
              if (!isExists2) {
                this.newData.chartDetails.push(this.deletedData);
              }
            }
          },
        });
    }
    // console.log(this.deletedData);
    this.close();
  }
  selectedItem!: ChartDetails | null;
  cancel() {
    this.formValues = [];
    this.closePopupEmit.emit(this.projectData().id);
    this.isEditMode = false;
    const filteredArray = this.tableHeader.filter((obj) => obj.key === '');
    if (filteredArray.length === 0) {
      this.tableHeader.push({
        key: '',
        type: 'text',
        label: '',
      });
    }
    this.newData = JSON.parse(JSON.stringify(this.projectData()));
    // console.log(this.newData);
    this.formValues2 = [];
  }
  closePopup() {
    this.overlayPanel.hide();
    this.formValues = [];
    this.isEditMode = false;
    this.closePopupEmit.emit(this.projectData().id);
    const filteredArray = this.tableHeader.filter((obj) => obj.key === '');
    this.formValues2 = [];
    if (filteredArray.length === 0) {
      this.tableHeader.push({
        key: '',
        type: 'text',
        label: '',
      });
    }
    this.newData = JSON.parse(JSON.stringify(this.projectData()));
  }
  isDisabled = false;
  allElementsNotNull(arrayOfObjects: any[]) {
    for (const obj of arrayOfObjects) {
      for (const key in obj) {
        if (
          obj[key] === null ||
          obj[key] === '' ||
          this.parseDate(obj['startDate']) > this.parseDate(obj['endDate'])
        ) {
          return false;
        }
      }
    }

    // If the loop completes without finding a null value, return true
    return true;
  }
  getUpdatedData(e: { items: ChartDetails[]; id: number }) {
    this.selectedItem = e.items.filter((val) => val.id === e.id)[0];
    // console.log(this.allElementsNotNull(e.items));
    if (!this.allElementsNotNull(e.items)) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }
  parseDate(dateString: Date | string) {
    if (typeof dateString !== 'string') {
      // const date:string = this.datePipe.transform(dateString, 'yyyy/MM/dd') ?? ""
      // const [day, month, year] = date.split('/');
      return new Date(dateString);
      // return date;
    } else {
      const [day, month, year] = dateString.split('/');
      return new Date(+year, +month - 1, +day);
    }
  }
  isAddedInTable = false;
  addRecord(e: boolean) {
    this.isAddedInTable = e;
    this.showAddRecordForm();
    this.isDisabled = false;
  }
  @Output() addChartData: EventEmitter<boolean> = new EventEmitter();
  saveData() {
    this.showActivityLogsPopup3 = false;
    const isExists = this.tableHeader.filter((val) => val.key === '')[0];
    if (!isExists) {
      this.tableHeader.push({
        key: '',
        type: 'text',
        label: '',
      });
    }
    this.newData.chartDetails.forEach((data) => {
      if (typeof data.startDate === 'object') {
        data.startDate = this.datePipe.transform(data.startDate, 'dd/MM/yyyy');
      }
      if (typeof data.endDate === 'object') {
        data.endDate = this.datePipe.transform(data.endDate, 'dd/MM/yyyy');
      }
    });
    // console.log(this.groupName());
    this.psrServices
      .addNewChartDetails(
        this.projectData().id,
        this.newData.chartDetails,
        this.groupName(),
        this.projectData().projectName
      )
      .subscribe({
        next: (res) => {
          this.toastr.success('The table is updated Successfully');
          this.addChartData.emit(true);
          this.newData.chartDetails = res;
          this.projectData().chartDetails = res;
          this.isEditMode = false;
          this.formValues = [];
          this.formValues2 = [];
        },
      });
  }
  editMode() {
    // console.log('sfd');
    this.isEditMode = true;
    const filteredArray = this.tableHeader.filter((obj) => obj.key !== '');
    this.tableHeader = filteredArray;
    this.isDisabled = false;
    this.showActivityLogsPopup3 = false;
  }
  @Output() deleteProject: EventEmitter<number> = new EventEmitter();
  deleteProjectData(id: number) {
    this.deleteProject.emit(id);
    this.confirmationService.close();
    // this.psrServices.deleteProject(id).subscribe({
    //   next : () => {

    //   }
    // })
  }
  showActivityLogsPopup3 = false;
  showDeliverablesActivityLogs()
  {
    this.getSpecificActivityLog(
      'PSR',
      'Add,Edit,Delete',
      this.sectorId,
      this.projectData().id.toString(),
      this.projectData().id.toString()
    );
    // console.log("this.projectData().sector => " , this.projectData().sector);
    // console.log("this.projectData().projectName => " , this.projectData().projectName);
    this.showActivityLogsPopup3 = !this.showActivityLogsPopup3;
  }
  popupClosed3()
  {
    this.showActivityLogsPopup3 = false;
  }
}

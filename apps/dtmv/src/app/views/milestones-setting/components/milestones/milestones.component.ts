/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';

import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Subscription, take } from 'rxjs';
import { UtilsService } from '@stc-apps/lng-selector';
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from './../../../../../../../../libs/shared-ui/src/lib/message-dialog/message-dialog.component';
import { MilestonesService, PendingTask } from '../../milestones.service';
import { UtilitiesService } from 'apps/dtmv/src/app/services/utilities.service';
import { PaginationEvent } from 'libs/shared-ui/src/lib/paginator/paginator.component';
import { UpdateProgressDialogComponent } from '../updateProgressDialog/updateProgressDialog.component';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { ConfigService } from 'apps/dtmv/src/app/services/config.service';

export interface Milestone {
  activityName: string;
  milestoneName: string;
  status: string;
  teamName: string;
  completionLevel: string;
  id: number;
}
interface MilestonesParamsFilterration {
  page?: number;
  numberOfElementsToDisplay?: number;
  sortBy?: string;
  sortDirection?: string;
  [key: string]: any; // To accommodate any additional form fields from filteredForm
}

@Component({
  selector: 'stc-apps-casses',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          right: '0',
        })
      ),
      state(
        'out',
        style({
          right: '-500px',
        })
      ),
      transition('out => in', [animate('300ms ease-in')]),
      transition('in => out', [animate('300ms ease-out')]),
    ]),
  ],
})
export class MilestonesComponent
  implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy
{
  @ViewChild('statusCustomTemplate') statusCustomTemplate!: any;
  @ViewChild('validationCustomTemplate') validationCustomTemplate!: any;
  @ViewChild('progressCustomTemplate') progressCustomTemplate!: any;

  form!: FormGroup;
  isLoading = true;
  totalRegisted = 0;
  totalInProgress = 0;
  totalPending = 0;
  totalClosed = 0;

  getMilestonesSub!: Subscription;
  userSub!: Subscription;
  getAssigneeTasks!: Subscription;
  formChangesSub!: Subscription;

  // Props of the paginator :
  milestonesTotalCount!: number;

  types: { statusName: string }[] = [
    { statusName: 'Registered' },
    { statusName: 'Pending' },
    { statusName: 'In Progress' },
    { statusName: 'Closed' },
  ];

  inValidationOption: { name: string; value: string }[] = [
    { name: '-', value: '-' },
    { name: 'In Validation', value: 'In-Validation' },
  ];
  previousParams: MilestonesParamsFilterration = {}; // Store previous parameters
  filterForm: any = {};

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private bannerDataService: BannerDataService,
    public milestonesService: MilestonesService,
    protected dialogService: DialogService,
    public authService: AuthService,
    public utils: UtilsService,
    private matDialog: MatDialog,
    private utilities: UtilitiesService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public configService: ConfigService
  ) {}

  allItems!: PendingTask[];
  addMilestoneNavigate(): void {
    this.router.navigate(['./add_milestone'], { relativeTo: this.route });
  }
  columnsSchema: ColumnsSchema[] = [];

  disabled = false;
  tableData!: any;
  rowData!: any;
  milestoneStatus: { value: string; name: string }[] = [
    { value: 'Planned', name: 'Planned' },
    { value: 'Delayed', name: 'Delayed' },
    { value: 'At_Risk', name: 'At risk' },
    { value: 'On_Track', name: 'On track' },
    { value: 'Completed', name: 'Completed' },
  ];
  monthsArr: any = [];
  yearsArr: any = [];
  allTeams: any = [];

  ngOnInit() {
    this.getMilestones();
    this.getPendingTasks();
    this.bannerDataService.updateData({ title: 'milestones', text: '' });

    this.searchForm();
    this.dialogService.modals = [];
    this.getAllTeams();
    this.monthsArrPopulator();
    this.yearsArrPopulator();
  }

  ngAfterViewInit(): void {
    this.columnsSchema = [
      {
        key: 'teamName',
        type: 'text',
        label: 'Team',
      },
      {
        key: 'workStream',
        type: 'text',
        label: 'Work Stream',
      },
      {
        key: 'activityName',
        type: 'text',
        label: 'Activity Name',
      },
      {
        key: 'milestoneName',
        type: 'text',
        label: 'Milestone Name',
      },
      {
        key: 'completionLevel',
        type: 'text',
        label: 'Completion Level',
      },
      {
        key: 'validationStatus',
        type: 'text',
        label: 'Validation Status',
        complexViewTemp: this.validationCustomTemplate,
      },
      {
        key: 'lastApprovedProgress',
        type: 'text',
        label: 'Progress',
        complexViewTemp: this.progressCustomTemplate,
      },
      {
        key: 'startDate',
        type: 'text',
        label: 'Start Date',
      },
      {
        key: 'endDate',
        type: 'text',
        label: 'End Date',
      },
      {
        key: 'status',
        type: 'text',
        label: 'Status',
        complexViewTemp: this.statusCustomTemplate,
      },

      {
        key: 'actions',
        type: 'actions',
        actions: !this.milestonesService.checkIsAdmin()
          ? this.milestonesService.checkIsBusinessSpoc() ||
            this.milestonesService.checkIsDirector()
            ? ['details']
            : ['edit', 'details']
          : ['edit', 'delete', 'details'],
        label: '',
      },
    ];
  }

  ngAfterContentChecked(): void {
    this.handlePendingActionsList(window.innerWidth);
  }

  getPendingTasks() {
    this.milestonesService.getMilestoneTasks().subscribe((res) => {
      this.allItems = res;
    });
  }

  fetchMilestones(options: any = {}) {
    const filteredForm = this.form.value;
    // Start with previousParams
    let params: MilestonesParamsFilterration = { ...this.previousParams };
    // Override properties in previousParams with filteredForm
    Object.keys(filteredForm).forEach((key) => {
      if (filteredForm[key] === null) {
        // Delete property from params if the value in filteredForm is null
        delete params[key];
      } else {
        // Otherwise, override the previousParam with the value from filteredForm
        params[key] = filteredForm[key];
      }
    });

    // Override with options
    params = { ...params, ...options };
    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== ''
      )
    );

    // Store the latest clean params
    this.previousParams = { ...cleanParams };
    // Convert the value inside activity name to lowercase
    this.previousParams['activityName']
      ? (cleanParams['activityName'] =
          this.previousParams['activityName'].toLowerCase())
      : '';

    // Make the API call with the clean parameters
    this.milestonesService
      .getMilestones(cleanParams)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.populateMilestones(res);
      });
  }

  formatDate(date: Date): string | null {
    if (date == null) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  datePickerChanged(
    event: { start: Date; end: Date },
    formControlType: string
  ) {
    const from = `${formControlType}From`;
    const to = `${formControlType}To`;
    this.form.patchValue({
      [from]: this.formatDate(event.start),
      [to]: this.formatDate(event.end),
    });
  }
  paginate(event: PaginationEvent) {
    this.fetchMilestones({ page: event.currentPage - 1 });
  }

  setPageItemsCount(pageSize: number) {
    this.fetchMilestones({ numberOfElementsToDisplay: pageSize, page: 0 });
  }

  setSorting({ colName, sortType }: { colName: string; sortType: string }) {
    this.filterForm = { ...this.filterForm, colName };
    this.fetchMilestones({ sortBy: colName, sortDirection: sortType, page: 0 });
  }

  populateMilestones(res: any) {
    this.isLoading = false;
    this.milestonesTotalCount = res.totalElements;
    this.tableData = res.content;
  }
  /** 1910 * 1485 */
  searchFilter(input: HTMLInputElement) {
    this.filterString = input.value;
  }

  onSubmit() {
    this.filterForm = this.utilities.filterObject(this.form.value);
    this.fetchMilestones({ page: 0 });
    this.dialogService.close();
  }

  clearFormFilter() {
    this.form.reset();
    this.resetFormFlag = true;
    this.filterForm = {};
    this.fetchMilestones({ page: 0 });
    this.dialogService.close();
  }

  getAllTeams() {
    this.milestonesService.setUserTeams().subscribe((res) => {
      this.allTeams = res;
    });
    if (this.allTeams?.length === 0) {
      this.milestonesService.setSystemTeams().subscribe((res) => {
        this.allTeams = res;
      });
    }
  }

  detailsNavigate(item: any) {
    if (item.flowName === 'DT_VP_Report_Data_Approval') {
      this.router.navigate(['../vp-report/edit'], {
        relativeTo: this.route,
        queryParams: {
          team: item.requestParams.team,
          year: item.requestParams.year,
        },
      });
    } else {
      let id;
      if (item.externalSystemId) {
        id = item.externalSystemId;
      } else {
        id = item;
      }
      this.router.navigate(['./milestone_details', id], {
        relativeTo: this.route,
      });
    }
  }

  tableAction(event: { value: string; dataRow: any }) {
    if (event.value === 'edit') {
      this.router.navigate(['./edit_milestone', event.dataRow.id], {
        relativeTo: this.route,
      });
    } else if (event.value === 'delete') {
      this.makeSureToDelete(event.dataRow.milestoneName).subscribe((res) => {
        if (!res) {
          return;
        }
        this.milestonesService.deleteMilestone(event.dataRow.id).subscribe({
          next: () => {
            this.toastr.success('Deleted successfully');
            this.getMilestones();
          },
          error: () => {
            this.toastr.error('Something went wrong!');
          },
        });
      });
    } else if (event.value === 'details') {
      this.detailsNavigate(event.dataRow.id);
    } else if (event.value === 'updateProgress') {
      this.openProgressUpdateModal(event.dataRow);
    }
  }

  openProgressUpdateModal(rowData: Milestone) {
    const dialogRef = this.matDialog.open(UpdateProgressDialogComponent, {
      data: rowData.milestoneName,
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.spinner.show();

      this.milestonesService
        .updateMilestoneProgress({
          milestoneId: rowData.id,
          deliverable: res.deliverable,
          overallProgress: res.overallProgress,
        })
        .subscribe({
          next: () => {
            this.toastr.success('Progress updated');
            this.spinner.hide();

            this.detailsNavigate(rowData.id);
          },
          error: () => {
            this.toastr.error('Something went wrong!');
          },
        });
    });
  }

  makeSureToDelete(name: string) {
    {
      const dialogRef = this.matDialog.open(MessageDialogComponent, {
        width: '800px',
        data: {
          msg: `You're about to Remove Milestone "${name}" Kindly note you can't roll back this action. Are you sure?`,
        },
        disableClose: true,
      });
      return dialogRef.afterClosed();
    }
  }

  endDate: Date = new Date();
  startDate: Date = new Date(new Date().setDate(new Date().getDate() - 7));

  resetFormFlag = false;

  toggleFilter() {
    this.resetFormFlag = false;
    this.dialogService.open('filter-Modal');
  }

  onExporting() {
    this.milestonesService
      .exportMilestones(this.previousParams)
      .subscribe((buffer) => {
        const data: Blob = new Blob([buffer]);
        saveAs(data, 'milestones.csv');
      });
  }
  searchForm() {
    // Adding nonNullable makes the (.reset() function) return the form to it's initial state rather than NULLS, effective Angular14+ only
    this.form = this.formBuilder.group(
      {
        milestoneName: [null],
        milestoneId: [null],
        teamName: [null],
        status: [null],
        startDateFrom: [null],
        startDateTo: [null],
        endDateFrom: [null],
        endDateTo: [null],
        activityName: [null],
        validationStatus: [null],
      },
      { validators: this.dateRangeValidator }
    );
  }
  get startDateFrom() {
    return this.form.get('startDateFrom');
  }

  get startDateTo() {
    return this.form.get('startDateTo');
  }
  get endDateFrom() {
    return this.form.get('endDateFrom');
  }

  get endDateTo() {
    return this.form.get('endDateTo');
  }
  dateRangeValidator(control: AbstractControl) {
    const startFrom = control.get('startDateFrom')?.value;
    const startTo = control.get('startDateTo')?.value;
    const endFrom = control.get('endDateFrom')?.value;
    const endTo = control.get('endDateTo')?.value;

    if (
      (startFrom && endFrom && new Date(startFrom) > new Date(endFrom)) ||
      (startTo && endTo && new Date(startTo) > new Date(endTo))
    ) {
      return { invalidDateRange: true };
    }

    return null;
  }
  numericDateValidator(control: AbstractControl) {
    const dateValue = control.value;
    return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
      dateValue
    ) || dateValue == null
      ? null
      : { invalidDateFormat: true };
  }

  OnChangesForm() {
    this.formChangesSub = this.form.valueChanges.subscribe((val) => {
      this.disabled = true;
    });
  }

  filterString: string = '';

  monthsArrPopulator() {
    for (let i = 1; this.monthsArr.length < 12; i++) {
      const date = new Date(2000, i - 1, 10); // 2009-11-10
      const month = date.toLocaleString('default', { month: 'long' });

      const monthObject = { name: month, id: i };
      this.monthsArr.push(monthObject);
    }
  }
  yearsArrPopulator() {
    const currentYear = new Date().getFullYear();
    for (
      let i = 2023;
      this.yearsArr[this.yearsArr.length - 1]?.name !== currentYear; // Check if the latest element's value equals the current year's value
      i++
    ) {
      this.yearsArr.push({ name: i, id: i });
    }
  }
  produceDate(month: string, day: string, year: string) {
    let monthNum = 0;
    const monthsList = [
      { name: 'Jan', id: 1 },
      { name: 'Feb', id: 2 },
      { name: 'Mar', id: 3 },
      { name: 'Apr', id: 4 },
      { name: 'May', id: 5 },
      { name: 'Jun', id: 6 },
      { name: 'Jul', id: 7 },
      { name: 'Aug', id: 8 },
      { name: 'Sep', id: 9 },
      { name: 'Oct', id: 10 },
      { name: 'Nov', id: 11 },
      { name: 'Dec', id: 12 },
    ];

    for (const monthObj of monthsList) {
      if (monthObj.name === month) {
        monthNum = monthObj.id;
      }
    }

    const finalDate = `${monthNum}/${day}/${year}`;
    return finalDate;
  }

  getMilestones() {
    this.getMilestonesSub = this.milestonesService
      .getMilestones()
      .subscribe((res: any) => {
        this.populateMilestones(res);
      });
  }

  // resize(event: UIEvent) {
  //   const mutatedEvent = event.target as Window;
  //   this.handlePendingActionsList(mutatedEvent.innerWidth);
  // }

  showPendingActionsBtn: boolean = false;

  pendingActionsShown: 'in' | 'out' = 'in';
  tableCols: number = 8;

  isPendingListClosable: boolean = false;

  toggleAnimation() {
    this.pendingActionsShown =
      this.pendingActionsShown === 'out' ? 'in' : 'out';
  }

  handlePendingActionsList(width: number) {
    if (width < 1630) {
      this.tableCols = 12;
      this.showPendingActionsBtn = true;
      this.isPendingListClosable = true;
    } else if (width > 1630) {
      this.showPendingActionsBtn = false;
      this.isPendingListClosable = false;
      this.tableCols = 8;
    }
  }

  ngOnDestroy(): void {
    this.getMilestonesSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.getAssigneeTasks?.unsubscribe();
    this.formChangesSub?.unsubscribe();
  }
}

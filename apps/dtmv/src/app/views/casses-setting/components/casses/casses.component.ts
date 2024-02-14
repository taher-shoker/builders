/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import {
  CaseStatus,
  CasesService,
  Task,
  TaskCicle,
} from '../../casses.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { CookieService } from 'ngx-cookie';
import { Subscription } from 'rxjs';
import { UtilsService } from '@stc-apps/lng-selector';
import { DashboardService } from '../../../../services/dashboard.service';
import {
  ActionEventData,
  ColumnsSchema,
} from 'libs/shared-ui/src/lib/custom-table/custom-table.component';

export interface PeriodicElement {
  id: string;
  name: string;
  city: string;
  existingServiceOrder: string;
  serviceType: string;
  serviceNumber: string;
  caseSerialNumber: string;
  existingPhoneNumber: string;
}

const COLUMNS_SCHEMA: ColumnsSchema[] = [
  {
    key: 'milestoneName',
    type: 'text',
    label: 'Milestone Name',
  },
  {
    key: 'teamName',
    type: 'text',
    label: 'Team',
  },
  {
    key: 'status',
    type: 'text',
    label: 'Status',
  },
  {
    key: 'activityName',
    type: 'text',
    label: 'Activity',
  },
  {
    key: 'startDate',
    type: 'date',
    dateString: 'longDate',
    label: 'Started at',
  },
  {
    key: 'actions',
    type: 'actions',
    actions: ['edit', 'delete'],
    label: 'actions',
  },
];

@Component({
  selector: 'stc-apps-casses',
  templateUrl: './casses.component.html',
  styleUrls: ['./casses.component.scss'],
})
export class CassesComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading = true;
  totalRegisted = 0;
  totalInProgress = 0;
  totalPending = 0;
  totalClosed = 0;
  readonly CaseStatus = CaseStatus;
  readonly TaskCicle = TaskCicle;

  getMilestonesSub!: Subscription;
  userSub!: Subscription;
  getAssigneeTasks!: Subscription;
  formChangesSub!: Subscription;

  // Props of the paginator :
  casesPagesCount: number = 0;

  types: { statusName: string }[] = [
    { statusName: 'Registered' },
    { statusName: 'Pending' },
    { statusName: 'In Progress' },
    { statusName: 'Closed' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private bannerDataService: BannerDataService,
    public milestonesService: CasesService,
    protected dialogService: DialogService,
    public authService: AuthService,
    private cookieService: CookieService,
    public utils: UtilsService,
    private dashboardService: DashboardService
  ) {}

  allItems!: Task[];
  addCasseNavigate(): void {
    this.router.navigate(['./add_case'], { relativeTo: this.route });
  }
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any[] = COLUMNS_SCHEMA;

  dataSource = new MatTableDataSource<PeriodicElement>();

  disabled = false;
  tableData!: any;
  rowData!: any;
  ngOnInit() {
    // this.populateInsightsCards();
    // this.fetchAssigneeTasks();
    this.getMilestones();

    this.bannerDataService.updateData({ title: 'd2d_fraud_cases', text: '' });

    this.dataSource.filterPredicate = (data, filter) =>
      data.caseSerialNumber == filter;

    this.serchForm();
    this.dialogService.modals = [];
  }

  onPageIndexChange(pageNum: number) {
    if (!this.pagesFetchedIndexes.includes(pageNum)) {
      this.pagesFetchedIndexes.push(pageNum);
      this.getMilestonesSub = this.milestonesService
        .getMilestones()
        .subscribe((res: any) => {
          this.populateMilestones(res);
        });
    }
  }

  // previousPageIndex!: number;
  // nextPageIndex!: number;

  pagesFetchedIndexes: number[] = [0];

  populateMilestones(res: any) {
    console.log('THE RES', res);
    this.isLoading = false;
    this.casesPagesCount = res.totalElements;
    this.tableData = res;

    // if (res.first) {
    //   this.pagesFetchedIndexes = [0];
    // } else {
    //   this.tableData = [...this.dataSource.data, ...res.content];
    // }
  }

  detailsNavigate(id: string | number) {
    this.router.navigate(['./case_details', id], { relativeTo: this.route });
  }

  tableAction(actionData: ActionEventData) {
    if (actionData.actionType === 'edit') {
      this.router.navigate([`./edit-milestone/${actionData.row?.id}`]);
    } else if (actionData.actionType === 'delete') {
      this.rowData = actionData.row;
      this.dialogService.open('delete-modal');
    }
  }

  endDate: Date = new Date();
  startDate: Date = new Date(new Date().setDate(new Date().getDate() - 7));
  populateInsightsCards() {
    this.dashboardService
      .getInsightsCards(
        this.startDate.toLocaleDateString('sv'),
        this.endDate.toLocaleDateString('sv')
      )
      .subscribe((res) => {
        this.totalRegisted = res.data.filter(
          (d: any) => d.caseStatus === CaseStatus.registered
        )[0].caseCount;
        this.totalInProgress = res.data.filter(
          (d: any) => d.caseStatus === CaseStatus.inprogress
        )[0].caseCount;
        this.totalPending = res.data.filter(
          (d: any) => d.caseStatus === CaseStatus.pending
        )[0].caseCount;
      });
  }

  fetchAssigneeTasks() {
    this.userSub = this.authService.user.subscribe((res) => {
      const currentUser = this.cookieService.get('MODERN_SYSTEM_USER')
        ? JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '')
        : this.authService.getLoggedInUser();

      this.getAssigneeTasks = this.milestonesService
        .getAssigneeTasks(currentUser.email)
        .subscribe((res: any) => {
          this.allItems = this.utils.sorter(
            res.data,
            'caseSerialNumber',
            'DESC'
          );
        });
    });
  }

  navigateToTask(caseId: number) {
    this.router.navigate(['./case_details', caseId], {
      relativeTo: this.route,
    });
  }
  toggleFilter() {
    this.dialogService.open('filter-Modal');
  }
  serchForm() {
    // Adding nonNullable makes the (.reset() function) return the form to it's initial state rather than NULLS, effective Angular14+ only
    this.form = this.formBuilder.group({
      customerName: ['', { nonNullable: true }],
      city: ['', { nonNullable: true }],
      existingServiceOrder: ['', { nonNullable: true }],
      serviceType: ['', { nonNullable: true }],
      existingPlate: ['', { nonNullable: true }],
      existingPhoneNumber: ['', { nonNullable: true }],
      activationDate: ['', { nonNullable: true }],
      wfmOrder: ['', { nonNullable: true }],
      newPlate: ['', { nonNullable: true }],
      newServiceOrder: ['', { nonNullable: true }],
      newPhoneNumber: ['', { nonNullable: true }],
      contactNumber: ['', { nonNullable: true }],
      caseLabel: ['', { nonNullable: true }],
      description: ['', { nonNullable: true }],
      status: ['', { nonNullable: true }],
      type: ['', { nonNullable: true }],
    });
  }

  OnChangesForm() {
    this.formChangesSub = this.form.valueChanges.subscribe((val) => {
      this.disabled = true;
    });
  }

  searchFilter(event: Event) {
    const searchVal = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = searchVal;
  }

  onSubmit() {
    const formCopy = this.form.value;
    console.log('THE STAT', this.form.value);

    formCopy.status = formCopy.status.statusName;
    if (formCopy.status === undefined) {
      formCopy.status = '';
    }

    if (formCopy.activationDate == undefined) {
      formCopy.activationDate = '';
    } else if (formCopy.activationDate !== '') {
      formCopy.activationDate = this.form
        .get('activationDate')
        ?.value?.format('DD/MM/YYYY');
    }

    this.getMilestonesSub = this.milestonesService
      .getMilestones()
      .subscribe((res: any) => {
        this.dialogService.close();
        // this.isLoading = false;
        // this.dataSource.data = res.content;
        this.populateMilestones(res);
      });
  }
  clearFormFilter() {
    this.form.reset();
    this.dialogService.close();
    this.getMilestones();
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

  ngOnDestroy(): void {
    this.getMilestonesSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.getAssigneeTasks?.unsubscribe();
    this.formChangesSub?.unsubscribe();
  }
}

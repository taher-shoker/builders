/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';

import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { CookieService } from 'ngx-cookie';
import { Subscription, take } from 'rxjs';
import { UtilsService } from '@stc-apps/lng-selector';
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from './../../../../../../../../libs/shared-ui/src/lib/message-dialog/message-dialog.component';
import {
  CaseStatus,
  TaskCicle,
  Task,
  MilestonesService,
} from '../../milestones.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'apps/dtmv/src/app/services/utilities.service';
import { PaginationEvent } from 'libs/shared-ui/src/lib/paginator/paginator.component';

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
    key: 'activityName',
    type: 'text',
    label: 'Activity',
  },
  {
    key: 'milestoneName',
    type: 'text',
    label: 'Milestone Name',
    // useCustomTemplate: (header?: ColumnsSchema, item?: any) => {
    //   return `
    //   <p>${item[header!.key]}</p>
    //   <p>${item[header!.key]} mixed complex</p>
    //   <p style="color:red"> ${item[header!.key]} mixed complex</p>
    //   `;
    // },
  },
  {
    key: 'status',
    type: 'text',
    label: 'Status',
  },
  {
    key: 'teamName',
    type: 'text',
    label: 'Team',
  },

  {
    key: 'completionLevel',
    type: 'text',
    label: 'Completion Level',
  },
  {
    key: 'actions',
    type: 'actions',
    actions: ['edit', 'delete', 'details'],
    label: 'actions',
  },
];

const data = [
  {
    activityName: 'First activity name',
    milestoneName: 'Milestonah',
    status: 'perfect',
    teamName: 'Real madrid',
    completionLevel: 'Almost done',
  },
  {
    activityName: 'second activity name',
    milestoneName: 'Milestonah 2',
    status: 'well done',
    teamName: 'Blancos',
    completionLevel: 'ferfet',
  },
  {
    activityName: 'fourth',
    milestoneName: 'Milestonah edited',
    status: 'done',
    teamName: 'champs',
    completionLevel: 'undone',
  },
  {
    activityName: 'wild',
    milestoneName: 'Milestonah final',
    status: 'into the net',
    teamName: 'Campione',
    completionLevel: 'starting',
  },
];

@Component({
  selector: 'stc-apps-casses',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.scss'],
})
export class MilestonesComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading = true;
  totalRegisted = 0;
  totalInProgress = 0;
  totalPending = 0;
  totalClosed = 0;
  readonly CaseStatus = CaseStatus;
  readonly TaskCicle = TaskCicle;
  // data = [
  //   {
  //     activityName: 'First activity name',
  //     milestoneName: 'Milestonah',
  //     status: 'perfect',
  //     teamName: 'Real madrid',
  //     completionLevel: 'Almost done',
  //   },
  //   {
  //     activityName: 'second activity name',
  //     milestoneName: 'Milestonah 2',
  //     status: 'well done',
  //     teamName: 'Blancos',
  //     completionLevel: 'ferfet',
  //   },
  //   {
  //     activityName: 'fourth',
  //     milestoneName: 'Milestonah edited',
  //     status: 'done',
  //     teamName: 'champs',
  //     completionLevel: 'undone',
  //   },
  //   {
  //     activityName: 'wild',
  //     milestoneName: 'Milestonah final',
  //     status: 'into the net',
  //     teamName: 'Campione',
  //     completionLevel: 'starting',
  //   },
  // ];

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

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private bannerDataService: BannerDataService,
    public milestonesService: MilestonesService,
    protected dialogService: DialogService,
    public authService: AuthService,
    private cookieService: CookieService,
    public utils: UtilsService,
    private matDialog: MatDialog,
    private translate: TranslateService,
    private utilities: UtilitiesService
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

    this.bannerDataService.updateData({ title: 'milestones', text: '' });

    this.dataSource.filterPredicate = (data, filter) =>
      data.caseSerialNumber == filter;

    this.searchForm();
    this.dialogService.modals = [];
  }

  paginate(paginationEvent: PaginationEvent) {
    const filteredForm = this.utilities.filterObject(this.form.value);

    this.milestonesService
      .getMilestones({
        page: paginationEvent.currentPage,
        ...filteredForm,
      })
      .pipe(take(1))
      .subscribe((res: any) => {
        this.populateMilestones(res);
      });
  }

  // currentPage!: number;
  // onPageIndexChange(pageNum: number) {
  //   const filteredForm = this.utilities.filterObject(this.form.value);
  //   this.currentPage = pageNum;
  //   this.getMilestonesSub = this.milestonesService
  //     .getMilestones({
  //       page: pageNum,
  //       ...filteredForm,
  //     })
  //     .subscribe((res: any) => {
  //       console.log('IN PARENT ID:', pageNum);
  //       console.log('IN this.pagesFetchedIndexes :', this.pagesFetchedIndexes);
  //       this.populateMilestones(res);
  //     });
  // }

  // previousPageIndex!: number;
  // nextPageIndex!: number;

  // pagesFetchedIndexes: number[] = [0];

  populateMilestones(res: any) {
    this.isLoading = false;
    this.milestonesTotalCount = res.totalElements;

    this.tableData = res.content;
    console.warn(this.milestonesTotalCount)

    // if (this.tableData?.length > 0) {
    //   this.tableData = [...this.tableData, ...res.content];
    // } else {
    //   this.tableData = res.content;
    // }

    // if (res.first) {
    //   this.tableData = res.content;
    //   // this.pagesFetchedIndexes = [0];
    // } else {
    //   this.tableData = [...this.tableData, ...res.content];
    // }
  }

  detailsNavigate(id: string | number) {
    this.router.navigate(['./milestone_details', id], {
      relativeTo: this.route,
    });
  }

  tableAction(event: { value: string; dataRow: any }) {
    if (event.value === 'edit') {
      this.router.navigate(['./edit_milestone', event.dataRow.id], {
        relativeTo: this.route,
      });
    } else if (event.value === 'delete') {
      this.MakeSureToDelete(event.dataRow.milestoneName).subscribe((res) => {
        if (!res) {
          return;
        }
        this.milestonesService
          .deleteMilestone(event.dataRow.id)
          .subscribe((deletionRes) => {
            console.log('Deleted :', deletionRes);
          });
      });
    } else if (event.value === 'details') {
      this.detailsNavigate(event.dataRow.id);
    }
  }

  MakeSureToDelete(name: string) {
    {
      const dialogRef = this.matDialog.open(MessageDialogComponent, {
        height: '160px',
        width: '500px',
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

  // fetchAssigneeTasks() {
  //   this.userSub = this.authService.user.subscribe((res) => {
  //     const currentUser = this.cookieService.get('MODERN_SYSTEM_USER')
  //       ? JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '')
  //       : this.authService.getLoggedInUser();

  //     this.getAssigneeTasks = this.milestonesService
  //       .getAssigneeTasks(currentUser.email)
  //       .subscribe((res: any) => {
  //         this.allItems = this.utils.sorter(
  //           res.data,
  //           'caseSerialNumber',
  //           'DESC'
  //         );
  //       });
  //   });
  // }

  navigateToTask(caseId: number) {
    this.router.navigate(['./case_details', caseId], {
      relativeTo: this.route,
    });
  }

  toggleFilter() {
    this.dialogService.open('filter-Modal');
  }

  searchForm() {
    // Adding nonNullable makes the (.reset() function) return the form to it's initial state rather than NULLS, effective Angular14+ only
    this.form = this.formBuilder.group({
      milestoneName: ['', { nonNullable: true }],
      team: ['', { nonNullable: true }],
      status: ['', { nonNullable: true }],
      month: ['', { nonNullable: true }],
      year: ['', { nonNullable: true }],
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
    const filteredForm = this.utilities.filterObject(this.form.value);
    console.log('filteredForm', filteredForm);

    this.getMilestonesSub = this.milestonesService
      .getMilestones(filteredForm)
      .subscribe((res: any) => {
        this.dialogService.close();
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

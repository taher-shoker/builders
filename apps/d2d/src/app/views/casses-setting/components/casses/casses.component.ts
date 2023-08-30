/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  AfterViewInit,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
import { CookieService } from 'ngx-cookie-service';
import { Subscription, tap } from 'rxjs';
import { UtilsService } from '@stc-apps/lng-selector';
import { DashboardService } from '../../../../services/dashboard.service';

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
const COLUMNS_SCHEMA = [
  {
    key: 'customerName',
    type: 'text',
    label: 'Name',
  },

  {
    key: 'city',
    type: 'text',
    label: 'city',
  },
  {
    key: 'existingServiceOrder',
    type: 'text',
    label: 'Existing Service Order',
  },
  // {
  //   key: 'existingPhoneNumber',
  //   type: 'text',
  //   label: 'Existing Phone Number',
  // },
  {
    key: 'caseStatus',
    type: 'text',
    label: 'Case Status',
  },
  {
    key: 'createdDate',
    type: 'text',
    label: 'created_at',
  },
  {
    key: 'actions',
    type: 'actions',
    label: '',
  },
];

@Component({
  selector: 'stc-apps-casses',
  templateUrl: './casses.component.html',
  styleUrls: ['./casses.component.scss'],
})
export class CassesComponent implements OnInit, AfterViewInit, OnDestroy {
  form!: FormGroup;
  isLoading = true;
  totalRegisted = 0;
  totalInProgress = 0;
  totalPending = 0;
  totalClosed = 0;
  readonly CaseStatus = CaseStatus;
  readonly TaskCicle = TaskCicle;

  getCasesSub!: Subscription;
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
    public CasesService: CasesService,
    protected dialogService: DialogService,
    public authService: AuthService,
    private cookieService: CookieService,
    public utils: UtilsService,
    private dashboardService: DashboardService
  ) {}

  allItems!: Task[];
  addCasseNavigate(): void {
    this.router.navigate(['./add-case'], { relativeTo: this.route });
  }
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any[] = COLUMNS_SCHEMA;

  dataSource = new MatTableDataSource<PeriodicElement>();

  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  disabled = false;

  ngOnInit() {
    this.populateInsightsCards();
    this.getCassesListing();
    this.fetchAssigneeTasks();
    this.bannerDataService.updateData({ title: 'd2d_fraud_cases', text: '' });
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data, filter) =>
      data.caseSerialNumber == filter;

    this.serchForm();
    this.dialogService.modals = [];
  }

  // previousPageIndex!: number;
  // nextPageIndex!: number;
  pagesFetchedIndexes: number[] = [0];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe((pageRes) => {
      const formCopy = this.form.value;

      console.log('THE STAT', this.form.value);
      // formCopy.status ? formCopy.status = formCopy.status.statusName : formCopy.status == undefined ? formCopy.status = '' : formCopy.status = ''

      console.log('page res is :', pageRes);

      if (!this.pagesFetchedIndexes.includes(pageRes.pageIndex)) {
        this.pagesFetchedIndexes.push(pageRes.pageIndex);
        this.getCasesSub = this.CasesService.getCases({
          page: pageRes.pageIndex,
          ...formCopy,
        }).subscribe((res: any) => {
          this.populateCases(res);
        });
      }
    });
  }

  detailsNavigate(id: string | number) {
    this.router.navigate(['./case-details', id], { relativeTo: this.route });
  }
  getCassesListing() {
    this.getCasesSub = this.CasesService.getCases().subscribe((res: any) => {
      this.populateCases(res);
    });
  }

  populateCases(res: any) {
    console.log('THE RES', res);
    this.isLoading = false;
    this.casesPagesCount = res.totalElements;

    if (res.first) {
      this.dataSource.data = res.content;
      this.pagesFetchedIndexes = [0];
    } else {
      this.dataSource.data = [...this.dataSource.data, ...res.content];
    }

    // this.totalRegisted = res.content.filter(
    //   (d: any) => d.caseStatus === CaseStatus.registered
    // ).length;
    // this.totalInProgress = res.content.filter(
    //   (d: any) => d.caseStatus === CaseStatus.inprogress
    // ).length;
    // this.totalPending = res.content.filter(
    //   (d: any) => d.caseStatus === CaseStatus.pending
    // ).length;
    // this.totalClosed = res.content.filter(
    //   (d: any) => d.caseStatus === CaseStatus.closed
    // ).length;
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
      let username = res?.userName;
      if (!res) {
        username = JSON.parse(this.cookieService.get('fraud-user'));
      }

      this.getAssigneeTasks = this.CasesService.getAssigneeTasks(
        username
      ).subscribe((res: any) => {
        this.allItems = this.utils.sorter(res.data, 'caseSerialNumber', 'DESC');
      });
    });
  }

  navigateToTask(caseId: number) {
    this.router.navigate(['./case-details', caseId], {
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

    this.getCasesSub = this.CasesService.getCases(formCopy).subscribe(
      (res: any) => {
        this.dialogService.close();
        // this.isLoading = false;
        // this.dataSource.data = res.content;
        this.populateCases(res);
      }
    );
  }
  clearFormFilter() {
    this.form.reset();
    this.dialogService.close();
    this.getCassesListing();
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

  ngOnDestroy(): void {
    this.getCasesSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.getAssigneeTasks?.unsubscribe();
    this.formChangesSub?.unsubscribe();
  }
}

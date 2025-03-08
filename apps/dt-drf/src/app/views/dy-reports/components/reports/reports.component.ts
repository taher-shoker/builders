/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '@stc-apps/lng-selector';
import { saveAs } from 'file-saver';
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { PaginationEvent } from 'libs/shared-ui/src/lib/paginator/paginator.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription, take } from 'rxjs';
import { MessageDialogComponent } from '../../../../../../../../libs/shared-ui/src/lib/message-dialog/message-dialog.component';
import { AuthService } from '../../../../services/auth.service';
import {
  ReportsService,
  PendingTask,
  Category,
  ReportDetails,
} from '../../dy-reports.service';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { UtilitiesService } from '../../../../../../../../libs/shared-ui/src/lib/services/utilities.service';

export interface Milestone {
  activityName: string;
  milestoneName: string;
  status: string;
  teamName: string;
  completionLevel: string;
  id: number;
}

@Component({
  selector: 'stc-apps-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('statusCustomTemplate') statusCustomTemplate!: any;
  @ViewChild('actionsCustomTemplate') actionsCustomTemplate!: any;

  form!: FormGroup;
  isLoading = true;

  getMilestonesSub!: Subscription;
  userSub!: Subscription;
  getAssigneeTasks!: Subscription;
  formChangesSub!: Subscription;

  reportsTotalCount!: number;

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
    protected reportsService: ReportsService,
    protected dialogService: DialogService,
    public authService: AuthService,
    public utils: UtilsService,
    private matDialog: MatDialog,
    private utilities: UtilitiesService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  allItems!: PendingTask[];
  addReportNavigate(): void {
    this.router.navigate(['./add_report'], { relativeTo: this.route });
  }

  disabled = false;
  tableData!: any;
  rowData!: any;

  monthsArr: any = [];
  yearsArr: any = [];
  columnsSchema?: ColumnsSchema[] = undefined;

  ngOnInit() {
    this.getReports();
    this.getPendingTasks();
    this.getCategories();
    this.bannerDataService.updateData({ title: 'Dynamic Reports', text: '' });

    this.searchForm();
    this.dialogService.modals = [];
    this.monthsArrPopulator();
    this.yearsArrPopulator();
    this.handleDeleteFilter();
  }

  handleDeleteFilter() {
    if (!this.reportsService.userInGroup('System_Process_Admin')) {
      this.authService.reportStatus.length = 2;
    }
  }

  ngAfterViewInit(): void {
    this.columnsSchema = [
      {
        key: 'reportName',
        type: 'text',
        label: 'Name',
      },
      {
        key: 'requestCategoryName',
        type: 'text',
        label: 'Category',
      },
      {
        key: 'reportSlaDuration',
        type: 'text',
        label: 'With SLA/Not',
      },
      {
        key: 'remainingSteps',
        type: 'text',
        label: 'No of Remaining Approvals',
      },
      {
        key: 'initiatorDisplayName',
        type: 'text',
        label: 'Initiator Name',
      },
      {
        key: 'lastModifiedDate',
        type: 'date',
        label: 'Last Action Date',
      },
      {
        key: 'reportFlowStatus',
        type: 'text',
        label: 'Status',
        complexViewTemp: this.statusCustomTemplate,
      },
      {
        key: 'actions',
        type: 'actions',
        actions: ['details', 'edit', 'delete'],
        label: '',
        complexViewTemp: this.actionsCustomTemplate,
      },
    ];
  }

  getPendingTasks() {
    this.reportsService.getMilestoneTasks().subscribe((res) => {
      this.allItems = res;
    });
  }

  paginate(paginationEvent: PaginationEvent) {
    const filteredForm = this.utilities.filterObject(this.form.value);

    this.reportsService
      .getReports({
        page: paginationEvent.currentPage - 1,
        ...filteredForm,
      })
      .pipe(take(1))
      .subscribe((res: any) => {
        this.populateReports(res);
      });
  }

  populateReports(res: any) {
    this.isLoading = false;
    this.reportsTotalCount = res.totalElements;

    this.tableData = res.content;
  }

  detailsNavigate(item: PendingTask) {
    const id = item.externalSystemId ? item.externalSystemId : item.id;
    this.router.navigate(['./report_details', id], {
      relativeTo: this.route,
    });
  }

  handelEditReport(id: number) {
    this.router.navigate(['./edit_report', id], {
      relativeTo: this.route,
    });
  }
  handelDeletReport(dataRow: ReportDetails) {
    this.makeSureToDelete(dataRow.reportName).subscribe((res) => {
      if (!res) {
        return;
      }
      this.reportsService.deleteReport(dataRow.id).subscribe({
        next: () => {
          this.toastr.success('Deleted successfully');
          this.getReports();
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
          msg: `You're about to Remove Report "${name}" Kindly note you can't roll back this action. Are you sure?`,
          isLoading: true,
        },
        disableClose: true,
      });
      return dialogRef.afterClosed();
    }
  }

  endDate: Date = new Date();
  startDate: Date = new Date(new Date().setDate(new Date().getDate() - 7));

  categories!: Category[];

  toggleFilter() {
    this.dialogService.open('filter-Modal');
  }

  onExporting() {
    this.openDialogExportation().subscribe((res) => {
      if (res) {
        const { from, to } = res;
        console.log('exp res :', from, to);

        this.reportsService.exportReports({ from, to }).subscribe({
          next: (buffer) => {
            const data: Blob = new Blob([buffer]);
            saveAs(data, 'reports.csv');
          },
          error: (error) => {
            console.log('Error in exportation', error);
          },
        });
      }
    });
  }

  openDialogExportation() {
    const dialogRef = this.matDialog.open(ExportDialogComponent, {
      width: '800px',
    });
    return dialogRef.afterClosed();
  }

  searchForm() {
    // Adding nonNullable makes the (.reset() function) return the form to it's initial state rather than NULLS, effective Angular14+ only
    this.form = this.formBuilder.group({
      requestStatus: ['', { nonNullable: true }],
      categoryId: ['', { nonNullable: true }],
    });
  }

  OnChangesForm() {
    this.formChangesSub = this.form.valueChanges.subscribe((val) => {
      this.disabled = true;
    });
  }

  filterObj: { reportName: string; requestStatus: string; categoryId: string } =
    { reportName: '', requestStatus: '', categoryId: '' };
  searchFilter(inp: HTMLInputElement) {
    this.filterObj.reportName = inp.value;
    this.getMilestonesSub = this.reportsService
      .getReports(this.filterObj)
      .subscribe((res: any) => {
        this.dialogService.close();
        this.populateReports(res);
      });
  }

  onSubmit() {
    this.filterObj.categoryId = this.form.get('categoryId')?.value || '';
    this.filterObj.requestStatus = this.form.get('requestStatus')?.value || '';
    this.getMilestonesSub = this.reportsService
      .getReports(this.filterObj)
      .subscribe((res: any) => {
        this.dialogService.close();
        this.populateReports(res);
      });
  }

  clearFormFilter() {
    this.form.reset();
    this.filterObj.categoryId = this.form.get('categoryId')?.value || '';
    this.filterObj.requestStatus = this.form.get('requestStatus')?.value || '';
    this.dialogService.close();
    this.getReports(this.filterObj);
  }

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

  getReports(filterData?: any) {
    this.getMilestonesSub = this.reportsService
      .getReports(filterData)
      .subscribe((res: any) => {
        this.populateReports(res);
      });
  }
  getCategories() {
    this.reportsService.getCategories().subscribe((res) => {
      this.categories = res;
    });
  }
  ngOnDestroy(): void {
    this.getMilestonesSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.getAssigneeTasks?.unsubscribe();
    this.formChangesSub?.unsubscribe();
  }
}

/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';

import { FormBuilder, FormGroup } from '@angular/forms';
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

export interface Milestone {
  activityName: string;
  milestoneName: string;
  status: string;
  teamName: string;
  completionLevel: string;
  id: number;
}

@Component({
  selector: 'stc-apps-casses',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.scss'],
})
export class MilestonesComponent implements OnInit, OnDestroy {
  @ViewChild('customTemplate') customTemplate!: any;

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
    private spinner: NgxSpinnerService
  ) {}

  allItems!: PendingTask[];
  addMilestoneNavigate(): void {
    this.router.navigate(['./add_milestone'], { relativeTo: this.route });
  }
  columnsSchema: ColumnsSchema[] = [
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
      complexView: true,
      // complexViewTemp: this.customTemplate
    },
    {
      key: 'completionLevel',
      type: 'text',
      label: 'Completion Level',
    },
    {
      key: 'latestWorkflowId',
      type: 'custom',
      label: 'Validation Status',
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
      complexView: true,
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
  allTeams: any;

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

  getPendingTasks() {
    this.milestonesService.getMilestoneTasks().subscribe((res) => {
      this.allItems = res;
    });
  }

  paginate(paginationEvent: PaginationEvent) {
    const filteredForm = this.utilities.filterObject(this.form.value);

    this.milestonesService
      .getMilestones({
        page: paginationEvent.currentPage - 1,
        ...filteredForm,
      })
      .pipe(take(1))
      .subscribe((res: any) => {
        this.populateMilestones(res);
      });
  }

  populateMilestones(res: any) {
    this.isLoading = false;
    this.milestonesTotalCount = res.totalElements;

    this.tableData = res.content;
  }

  getAllTeams() {
    this.allTeams = this.milestonesService.setUserTeams();
    if (this.allTeams.length === 0) {
      this.milestonesService.setSystemTeams().subscribe((res) => {
        this.allTeams = res;
      });
    }
  }

  detailsNavigate(item: any) {
    if (item.flowName === 'DT_VP_Report_Data_Approval') {
      this.router.navigate(['../vp-report/edit'], {
        relativeTo: this.route,
      });
    } else {
      const id = item.externalSystemId;
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

  toggleFilter() {
    this.dialogService.open('filter-Modal');
  }

  onExporting() {
    const filteredForm = this.utilities.filterObject(this.form.value);
    this.milestonesService
      .exportMilestones(filteredForm)
      .subscribe((buffer) => {
        const data: Blob = new Blob([buffer]);
        saveAs(data, 'milestones.csv');
      });
  }

  searchForm() {
    // Adding nonNullable makes the (.reset() function) return the form to it's initial state rather than NULLS, effective Angular14+ only
    this.form = this.formBuilder.group({
      milestoneName: ['', { nonNullable: true }],
      milestoneId: ['', { nonNullable: true }],
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

  filterString: string = '';
  searchFilter(inp: HTMLInputElement) {
    this.filterString = inp.value;
  }

  onSubmit() {
    const filteredForm = this.utilities.filterObject(this.form.value);
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

  ngOnDestroy(): void {
    this.getMilestonesSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.getAssigneeTasks?.unsubscribe();
    this.formChangesSub?.unsubscribe();
  }
}

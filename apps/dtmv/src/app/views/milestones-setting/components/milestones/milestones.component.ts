/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  PendingTask,
} from '../../milestones.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'apps/dtmv/src/app/services/utilities.service';
import { PaginationEvent } from 'libs/shared-ui/src/lib/paginator/paginator.component';
import { UpdateProgressDialogComponent } from '../updateProgressDialog/updateProgressDialog.component';

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
    public utils: UtilsService,
    private matDialog: MatDialog,
    private utilities: UtilitiesService
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
      key: 'status',
      type: 'text',
      label: 'Status',
      complexView: true,
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
      actions: ['edit', 'delete', 'details', 'updateProgress'],
      label: 'actions',
    },
  ];

  disabled = false;
  tableData!: any;
  rowData!: any;
  ngOnInit() {
    // this.populateInsightsCards();
    // this.fetchAssigneeTasks();

    this.getMilestones();
    this.getPendingTasks();

    this.bannerDataService.updateData({ title: 'milestones', text: '' });

    this.searchForm();
    this.dialogService.modals = [];
  }

  getPendingTasks(){
    this.milestonesService.getMilestoneTasks().subscribe(res => {
      this.allItems = res
    })
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

  populateMilestones(res: any) {
    this.isLoading = false;
    this.milestonesTotalCount = res.totalElements;

    this.tableData = res.content;
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
      this.makeSureToDelete(event.dataRow.milestoneName).subscribe((res) => {
        if (!res) {
          return;
        }
        this.milestonesService
          .deleteMilestone(event.dataRow.id)
          .subscribe((deletionRes) => {
            //comment
          });
      });
    } else if (event.value === 'details') {
      this.detailsNavigate(event.dataRow.id);
    } else if (event.value === 'updateProgress') {
      this.openProgressUpdateModal(event.dataRow.id);
    }
  }

  openProgressUpdateModal(rowId: Milestone['id']) {
    const dialogRef = this.matDialog.open(UpdateProgressDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.milestonesService
        .updateMilestoneProgress({
          milestoneId: rowId,
          deliverable: res.deliverable,
          overallProgress: res.overallProgress,
        })
        .subscribe((res) => {
          console.log('Got a res for updating progress: ', res);
        });
    });
  }

  makeSureToDelete(name: string) {
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

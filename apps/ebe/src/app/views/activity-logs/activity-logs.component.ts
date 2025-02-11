import {
  Component,
  effect,
  ElementRef,
  inject,
  Renderer2,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TapModel } from '../../models/scorecard.model';
import { KeyResult, KeyResultProject, Program } from '../../models/activity-logs';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ActivityLog, ActivityLogRes } from '../../models/activity-logs';
import { ActivityLogService } from '../../services/activity-logs.service';
import { PaginatorModule } from 'primeng/paginator';
import { concat, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
interface ActionType {
  id: string;
  name: string;
}
@Component({
  selector: 'stc-apps-activity-logs',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SharedUiModule,
    DropdownModule,
    FormsModule,
    CalendarModule,
    TableModule,
    OverlayPanelModule,
    PaginatorModule,
  ],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ActivityLogsComponent {
  currentTap = signal<TapModel>({} as TapModel);
  scorecardsTaps = signal<TapModel[]>([]);

  selectedType!: ActionType | null;
  activityLogDate: Date[] | null = null;
  searchKeyword: any;
  router = inject(ActivatedRoute);
  first = signal(0);
  rows = signal(10);
  currentPage = signal(0);
  activityLogsResponse = signal<ActivityLogRes>({} as ActivityLogRes);
  datePipe = inject(DatePipe);
  activityLogsServices = inject(ActivityLogService);
  activityLogsData: ActivityLog[] = [];
  activityLogsHeader: string[] = [];
  endSubs$: Subject<any> = new Subject();
  previousDate: Date[] | null = null;
  actionTypes: ActionType[] = [
    {
      name: 'All',
      id: 'All',
    },
    {
      name: 'Import',
      id: 'Import',
    },
    {
      name: 'Export',
      id: 'Export',
    }
  ];
  programsData = signal<Program[]>([]);
  keyResultsData = signal<KeyResult[]>([]);
  keyResultProjectsData = signal<KeyResultProject[]>([]);
  selectedProgram:number | null = null;
  selectedKeyResult:string | null= null;
  selectedKeyResultProject:string | null= null;
  constructor(private renderer: Renderer2) {}
  tapIndex = 0;
  ngOnInit() {
    this.scorecardsTaps.set([
      {
        id: 1,
        name: 'Sector Scorecard',
        value: 'Scorecard',
      },
      {
        id: 2,
        name: 'CAD Strategy Program',
        value: 'CAD',
      },
      // {
      //   id : 3,
      //   name : 'Raqami',
      //   value : 'raqami'
      // },
      {
        id: 4,
        name: 'Project Execution',
        value: 'PSR',
      },
      {
        id: 5,
        name: 'Financial Reporting',
        value: 'Financial',
      },
    ]);
    this.router.params.subscribe({
      next: (param) => {
        let title = param['title'];
        if (title === 'scorecard') {
          this.currentTap.set(this.scorecardsTaps()[0]);
          this.activityLogsHeader = ['user name', 'activity type', 'time stamp'];
          this.tapIndex = 0;
        } else if (title === 'cad') {
          this.currentTap.set(this.scorecardsTaps()[1]);
          this.activityLogsHeader = ['user name','activity type', 'activity program' , 'activity key result' , 'activity project' , 'activity details','time stamp','old value','new value'];
          this.tapIndex = 1;
        } else if (title === 'psr') {
          this.currentTap.set(this.scorecardsTaps()[2]);
          this.activityLogsHeader = ['user name','activity type', 'activity program' , 'activity project' , 'activity details','time stamp','old value','new value'];
          this.tapIndex = 2;
        } else if(title === 'financial') {
          this.tapIndex = 3;
          this.currentTap.set(this.scorecardsTaps()[3]);
          this.activityLogsHeader = ['user name', 'activity type', 'time stamp'];
        } else {
          this.currentTap.set(this.scorecardsTaps()[0]);
          this.activityLogsHeader = ['user name', 'activity type', 'time stamp'];
          this.tapIndex = 0;
        }
      },
    });
    this.getAllActivityLogs(this.currentTap().value, 0, 10);
  }
  loading = false;
  private getAllActivityLogs(
    moduleName: string,
    page: number,
    pageSize: number,
    username?: string,
    activityType?: string,
    startDate?: string,
    endDate?: string,
    programName?:number | null,
    keyResult?:string | null,
    projectName?:string | null
  ) {
    this.activityLogsResponse().data = [];
    this.activityLogsServices
      .getActivityLogsData(
        moduleName,
        page,
        pageSize,
        username,
        activityType,
        startDate,
        endDate,
        programName,
        keyResult,
        projectName
      )
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: ActivityLogRes) => {
          console.log(res);
          this.activityLogsResponse.set(res);
          if (res.data.length === 0) {
            this.loading = false;
          } else {
            this.loading = true;
          }
        },
      });
  }
  getProjectFilterData()
  {
    let tap = this.currentTap().value.toLowerCase();
    if(tap === 'psr' || tap === 'cad')
    {
      this.programsData.set([
        {
          id : -1000,
          strategyProjectName : "All",
          sector : 'All'
        }
      ])
      this.activityLogsServices.getProgramsData(tap).subscribe({
        next : (res) => {
          this.programsData.update(v => v.concat(res));
        }
      })
    }
  }
  getKeyResultFilterData()
  {
    this.keyResultsData.set([
      {
        keyResultNumber : -1000,
        keyResultName : "All"
      }
    ])
    this.activityLogsServices.getKeyResultsData().subscribe({
      next : (res) => {
        this.keyResultsData.update(v => v.concat(res));
      }
    })
  }
  getKeyResultprojectsFilterData()
  {
    let tap = this.currentTap().value.toLowerCase();
    if(tap === 'psr' || tap === 'cad')
    {
      this.keyResultProjectsData.set([
        {
          id : -1000,
          name : "All",
          projectName : 'All'
        }
      ])
      this.activityLogsServices.getKeyResultProjectsData(tap).subscribe({
        next : (res) => {
          this.keyResultProjectsData.update(v => v.concat(res));
        }
      })
    }
  }
  ngOnDestroy() {
    this.endSubs$.complete();
  }
  getCurrentTap(clickedTap: TapModel) {
    this.currentTap.set(clickedTap);
    this.getProjectFilterData();
    this.getKeyResultFilterData();
    this.getKeyResultprojectsFilterData();
    if(clickedTap.value === 'CAD' || clickedTap.value === 'PSR')
    {
      this.actionTypes = [
        {
          name: 'All',
          id: 'All',
        },
        {
          name: 'Import',
          id: 'Import',
        },
        {
          name: 'Export',
          id: 'Export',
        },
        {
          name: 'Add',
          id: 'Add',
        },
        {
          name: 'Edit',
          id: 'Edit',
        },
        {
          name: 'Delete',
          id: 'Delete',
        },
      ];
    } else {
      this.actionTypes = [
        {
          name: 'All',
          id: 'All',
        },
        {
          name: 'Import',
          id: 'Import',
        },
        {
          name: 'Export',
          id: 'Export',
        }
      ];
    }
    this.currentPage.set(0);
    this.selectedType = null;
    this.startDate = "";
    this.endDate = "";
    this.searchKeyword = "";
    this.activityLogDate = null;
    this.selectedProgram = null;
    this.selectedKeyResult = null;
    this.selectedKeyResultProject = null;
    if (clickedTap.value === 'Scorecard' || clickedTap.value === 'Financial') {
      this.activityLogsHeader = ['user name', 'activity type', 'time stamp'];
    } else {
      if(clickedTap.value === 'CAD')
      {
        this.activityLogsHeader = ['user name','activity type', 'activity program' , 'activity key result' , 'activity project' , 'activity details','time stamp','old value','new value'];
      } else {
        this.activityLogsHeader = ['user name','activity type', 'activity program' , 'activity project' ,'activity details','time stamp','old value','new value'];
      }
    }
    this.first.set(0);
    // this.getAllActivityLogs(clickedTap.value , 0 , 10);
    this.getAllActivityLogs(
      this.currentTap().value,
      this.currentPage(),
      10,
      this.searchKeyword,
      '',
      this.startDate,
      this.endDate
    );
  }
  transformDate(date: string):string {
    return this.datePipe.transform(date, "dd MMM yyyy 'at' hh:mm a")!;
  }
  startDate = '';
  endDate = '';
  changePage(e: any) {
    this.first.set(e.first);
    this.rows.set(e.rows);
    this.currentPage.set(e.page);
    this.getAllActivityLogs(
      this.currentTap().value,
      this.currentPage(),
      10,
      this.searchKeyword,
      this.selectedType?.name !== 'All' ? this.selectedType?.name : '',
      this.startDate,
      this.endDate
    );
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  applyFilters() {
    this.first.set(0);
    this.startDate = '';
    this.endDate = '';
    this.currentPage.set(0);
    if (this.activityLogDate) {
      if (this.activityLogDate[0]) {
        this.startDate = this.formatDate(this.activityLogDate[0]);
      }
      if (this.activityLogDate[1]) {
        this.endDate = this.formatDate(this.activityLogDate[1]);
      }
    }
    // console.log(this.selectedProgram);
    // console.log(this.selectedKeyResult);
    // console.log(this.selectedKeyResultProject);
    let id = -1000;
    if (this.selectedType?.id !== 'All') {
      if(this.currentTap().value === 'PSR')
      {
        console.log('sdf');
        console.log(this.selectedKeyResultProject);
        
        this.getAllActivityLogs(
          this.currentTap().value,
          this.currentPage(),
          10,
          this.searchKeyword,
          this.selectedType?.name,
          this.startDate,
          this.endDate,
          this.selectedProgram && this.selectedProgram !== id ? this.selectedProgram : null,
          this.selectedKeyResultProject && this.selectedKeyResultProject.toString() !== id.toString() ? this.selectedKeyResultProject : null,
          null
        );
      } else {
        this.getAllActivityLogs(
          this.currentTap().value,
          this.currentPage(),
          10,
          this.searchKeyword,
          this.selectedType?.name,
          this.startDate,
          this.endDate,
          this.selectedProgram && this.selectedProgram !== id? this.selectedProgram : null,
          this.selectedKeyResult && +this.selectedKeyResult !== id ? this.selectedKeyResult : null,
          this.selectedKeyResultProject && this.selectedKeyResultProject !== id.toString()? this.selectedKeyResultProject : null
        );
      }
    } else {
      this.getAllActivityLogs(
        this.currentTap().value,
        this.currentPage(),
        10,
        this.searchKeyword,
        '',
        this.startDate,
        this.endDate,
        this.selectedProgram  && this.selectedProgram !== id? this.selectedProgram : null,
        this.selectedKeyResult && +this.selectedKeyResult !== id? this.selectedKeyResult : null,
        this.selectedKeyResultProject && this.selectedKeyResultProject !== id.toString()? this.selectedKeyResultProject : null
      );
    }
  }
  selectProgramType()
  {
    this.applyFilters();
  }
  selectKeyResultType()
  {
    this.applyFilters();
  }
  selectKeyResultProjectType()
  {
    this.applyFilters();
  }
  selectDate() {
    if (this.previousDate !== this.activityLogDate) {
      this.previousDate = this.activityLogDate;
      this.applyFilters();
    }
  }
  filterByName() {
    // if(this.searchKeyword)
    // {
    this.applyFilters();
    // }
  }
  selectActionType() {
    this.applyFilters();
  }
  onDateChange(newDate: Date[] | null) {
    this.activityLogDate = newDate;
  }
  exportActivityLogsData()
  {
    this.activityLogsServices.downloadActivityLogsData();
  }
}

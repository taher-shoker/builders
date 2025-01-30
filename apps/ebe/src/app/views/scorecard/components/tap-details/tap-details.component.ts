import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
  WritableSignal,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  FileModel,
  ScorecardModel,
  TapModel,
} from '../../../../models/scorecard.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedUiModule } from "@stc-apps/shared-ui";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ScorecardService } from '../../../../services/scorecard.service';
// import { DialogModule } from 'primeng/dialog';
// import { FileUploadInputComponent } from '../../../../components/file-upload-input/file-upload-input.component';
import { EditModeViewComponent } from '../edit-mode-view/edit-mode-view.component';
import { Subject, takeUntil } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { DatePipe } from '@angular/common';
import { ActivityLog, ActivityLogData } from '../../../../models/activity-logs';
import { AuthService } from 'apps/ebe/src/app/services/auth.service';
import { ActivityLogService } from 'apps/ebe/src/app/services/activity-logs.service';
interface filterOption
{
  month:number;
  year:number;
}
@Component({
  selector: 'stc-apps-tap-details',
  standalone: true,
  imports: [
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    EditModeViewComponent,
    OverlayPanelModule
],
  templateUrl: './tap-details.component.html',
  styleUrl: './tap-details.component.scss',
})
export class TapDetailsComponent implements OnInit {
  @ViewChild('overlayPanel2') overlayPanel2!: OverlayPanel;
  scorcardData: InputSignal<ScorecardModel[]> = input.required<ScorecardModel[]>();
  currentMode: InputSignal<'editMode' | 'viewMode'> = input.required<'editMode' | 'viewMode'>();
  visible = false;
  endSubs$:Subject<ScorecardModel[]> = new Subject();
  activityLogsTableHeader!:ColumnsSchema[];
  activityLogsTableBody = signal<ActivityLogData[]>([]);
  selectedFile!:FileModel | null;
  activityLogServices = inject(ActivityLogService);
  currentClickedTap: InputSignal<TapModel> = input.required<TapModel>();
  isEmpty: InputSignal<boolean> = input.required<boolean>();
  monthsArr: { name: string; id: number }[] = [];
  years: WritableSignal<{ name: string; id: number }[]> = signal<{ name: string; id: number }[]>([]);
  filtersForm: FormGroup = new FormGroup({
    month: new FormControl(new Date().getMonth() + 1),
    year: new FormControl(new Date().getFullYear()),
  });
  @Output() filterOptions:EventEmitter<filterOption> = new EventEmitter();
  @Output() ImportedFile:EventEmitter<FileModel> = new EventEmitter();
  scorecardService = inject(ScorecardService);
  isAdmin = false;
  authServices = inject(AuthService);
  monthsArrPopulator() {
    for (let i = 1; this.monthsArr.length < 12; i++) {
      const date = new Date(2000, i - 1, 10); // 2009-11-10
      const month = date.toLocaleString('default', { month: 'short' });
      const monthObject = { name: month, id: i, selected: false };
      this.monthsArr.push(monthObject);
    }
  }
  constructor(private datePipe: DatePipe){}
  ngOnInit(): void {    
    this.authServices.userRoles.subscribe({
      next : (role) => {
        this.isAdmin = role.roles.some(
          (role) => role.roleName === 'BE_EDITORS' || role.roleName === 'ADMINS'
        );
      }
    })
    console.log(window.innerWidth);
    this.activityLogsTableHeader = [
      {
        key : "username",
        type : "text",
        label : "User Name"
      },
      {
        key : "type",
        type : "text",
        label : "Activity Type"
      },
      // {
      //   key : "details",
      //   type : "text",
      //   label : "Activity Details"
      // },
      {
        key : "time",
        type : "text",
        label : "Time Stamp"
      },
    ]
    const yearsArr: { name: string; id: number }[] = [];
    const currYear: number = new Date().getFullYear();
    for (let index = 2024; index <= currYear; index++) {
      yearsArr.push({ name: index.toString(), id: index });
    }
    this.years.set(yearsArr);
    this.monthsArrPopulator();
    // this.filterOptions.emit(this.filtersForm.value);
  }
  get monthValue() {
    return this.filtersForm.get('month');
  }
  get yearValue() {
    return this.filtersForm.get('year');
  }
  selectYear() {
    console.log('month value => ', this.monthValue?.value);
    console.log('year value => ', this.yearValue?.value);
    this.filterOptions.emit(this.filtersForm.value);
  }
  selectMonth() {
    console.log('month value => ', this.monthValue?.value);
    console.log('year value => ', this.yearValue?.value);
    this.filterOptions.emit(this.filtersForm.value);
  }
  showDialog()
  {
    this.visible = true;
  }
  importData(e:FileModel)
  {
    if(e)
    {
      this.ImportedFile.emit(e);
    }
  }
  downloadTemplate()
  {
    this.scorecardService.downloadTemplate().subscribe({
      next : (response) => {
        this.downloadFile(response, `scorecards.csv`);
      }
    })
  }
  text()
  {
    this.overlayPanel2.toggle(event);
  }
  downloadFile(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  onHide()
  {
    this.visible = false;
  }
  hoverTitle!:string;
  showPopup(title:string)
  {
    if(title.trim().length > 95){
      this.hoverTitle = title;
      this.overlayPanel2.show(event)
    }
  }
  showActivityLogsPopup = false;
  showActivityLogs()
  {
    // this.activityLogsPanel.toggle(event);
    this.getScorecardActivityLogs("Scorecard");
    this.showActivityLogsPopup = !this.showActivityLogsPopup;
  }
  $endScorecardActivityLogsSub:Subject<any> = new Subject();
  private getScorecardActivityLogs(moduleName:string)
  {
    this.activityLogServices.getSpecificActivityLog(moduleName , "Import,Export").pipe(takeUntil(this.$endScorecardActivityLogsSub)).subscribe({
      next : (activityLogs:ActivityLogData[]) => {
        console.log(activityLogs);
        this.activityLogsTableBody.set(activityLogs);
      }
    })
  }
  popupClosed()
  {
    this.showActivityLogsPopup = false;
    this.$endScorecardActivityLogsSub.complete();    
  }
}

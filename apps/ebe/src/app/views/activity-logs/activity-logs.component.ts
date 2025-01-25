import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PageHeaderComponent } from "../../components/pageHeader/page-header.component";
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TapModel } from '../../models/scorecard.model';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
interface ActionType {
  id:string;
  name:string;
}
@Component({
  selector: 'stc-apps-activity-logs',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SharedUiModule , DropdownModule , FormsModule , CalendarModule , TableModule],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss',
  providers : [DatePipe],
  encapsulation:ViewEncapsulation.Emulated
})
export class ActivityLogsComponent {
  currentTap = signal<TapModel>({} as TapModel);
  scorecardsTaps = signal<TapModel[]>([]);

  selectedType!:ActionType;
  activityLogDate:Date | null = null;
  searchKeyword:any;

  datePipe = inject(DatePipe);
  activityLogsData:any[] = [];
  activityLogsHeader:string[] = [];
  actionTypes:ActionType[] = [
    {
      name:"test",
      id:'test'
    },
    {
      name:"test2",
      id:'test2'
    },
    {
      name:"test3",
      id:'test3'
    },
  ]
  ngOnInit()
  {
    this.scorecardsTaps.set([
      {
        id : 1,
        name : 'Sector Scorecard',
        value : 'scorecard'
      },
      {
        id : 2,
        name : 'CAD Strategy Program',
        value : 'strategy'
      },
      // {
      //   id : 3,
      //   name : 'Raqami',
      //   value : 'raqami'
      // },
      {
        id : 4,
        name : 'Project Execution',
        value : 'project-execution'
      },
      {
        id : 5,
        name : 'Financial Reporting',
        value : 'financial'
      }
    ])
    this.currentTap.set(this.scorecardsTaps()[0]);
    this.activityLogsData = [
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"newValue",
        oldValue:"oldValue"
      },
      {
        username:"hamed rashed",
        activityType:"import",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"",
        oldValue:""
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"newValue",
        oldValue:"oldValue"
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"",
        oldValue:""
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"newValue",
        oldValue:"oldValue"
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"",
        oldValue:""
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"newValue",
        oldValue:"oldValue"
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"",
        oldValue:""
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"newValue",
        oldValue:"oldValue"
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"",
        oldValue:""
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"newValue",
        oldValue:"oldValue"
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"",
        oldValue:""
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"newValue",
        oldValue:"oldValue"
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"",
        oldValue:""
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"newValue",
        oldValue:"oldValue"
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"",
        oldValue:""
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"newValue",
        oldValue:"oldValue"
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"",
        oldValue:""
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"newValue",
        oldValue:"oldValue"
      },
      {
        username:"hamed rashed",
        activityType:"export",
        activityDetails:"scorecards",
        timeStamp:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        newValue:"",
        oldValue:""
      },
    ];
    this.activityLogsHeader = ["user name" , "activity type" , "activity details" , "time stamp"]
  }
  getCurrentTap(clickedTap: TapModel) {
    console.log(clickedTap);
    if(clickedTap.value === 'scorecard' || clickedTap.value === 'financial')
    {
      this.activityLogsHeader = ["user name" , "activity type" , "activity details" , "time stamp"]
    } else {
      this.activityLogsHeader = ["user name" , "activity type" , "activity details" , "time stamp" , "old value" , "new value"]
    }
  } 
  changePage(e:any)
  {
    console.log(e);
  }
  selectActionType(type:ActionType)
  {
    console.log(this.selectedType);
    console.log(this.searchKeyword);
    console.log(this.activityLogDate);
  }
  
}

import { Component, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PageHeaderComponent } from "../../components/pageHeader/page-header.component";
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TapModel } from '../../models/scorecard.model';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
interface ActionType {
  id:string;
  name:string;
}
@Component({
  selector: 'stc-apps-activity-logs',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SharedUiModule , DropdownModule , FormsModule , CalendarModule],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss',
  providers : [DatePipe],
  encapsulation:ViewEncapsulation.Emulated
})
export class ActivityLogsComponent {
  currentTap = signal<TapModel>({} as TapModel);
  scorecardsTaps = signal<TapModel[]>([]);

  selectedType!:ActionType;
  activityLogDate:Date = new Date();
  searchKeyword:any;

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
  }
  getCurrentTap(clickedTap: TapModel) {
    console.log(clickedTap);
  } 
  selectActionType(type:ActionType)
  {
    console.log(this.selectedType);
    console.log(this.searchKeyword);
    console.log(this.activityLogDate);
  }
  
}

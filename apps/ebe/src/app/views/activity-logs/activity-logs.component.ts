import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PageHeaderComponent } from "../../components/pageHeader/page-header.component";
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TapModel } from '../../models/scorecard.model';
import { ColumnsSchema } from '../../models/psr.model';
import { LogModel } from '../../models/logs.model';

@Component({
  selector: 'stc-apps-activity-logs',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SharedUiModule],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss',
  providers : [DatePipe]
})
export class ActivityLogsComponent {
  scorecardsTaps: TapModel[]=[{
    id : 1,
    name : 'Scorecard',
    value : 'scorecard'
  },{
    id : 2,
    name : 'CAD Strategy Program',
    value : 'strategy'
  },{
    id : 3,
    name : 'Raqami',
    value : 'raqami'
  },{
    id : 4,
    name : 'PSR',
    value : 'pSR'
  },
  {
    id : 5,
    name : 'Financial Reporting',
    value : 'financial'
  }];
tableHeader:ColumnsSchema[]=[
  {
      "key": "user",
      "type": "text",
      "label": "userName"
  },
  {
      "key": "type",
      "type": "text",
      "label": "Activity Type"
  },
  {
      "key": "details",
      "type": "text",
      "label": "Activity Details"
  },
  {
      "key": "time",
      "type": "text",
      "label": "Time Stamp"
  },
  
];
tableData:any[]=[
  {
      "user": "rana",
      "type": "Export",
      "details": "Financial Reporting",
      "time": "15 Oct 2024 at 05:23 PM",
  },
  {
      "user": "test",
      "type": "Export",
      "details": "Financial Reporting",
      "time": "15 Oct 2024 at 05:23 PM",
  },
  {
    "user": "rana",
    "type": "Export",
    "details": "Financial Reporting",
    "time": "15 Oct 2024 at 05:23 PM",
},
{
    "user": "test",
    "type": "Export",
    "details": "Financial Reporting",
    "time": "15 Oct 2024 at 05:23 PM",
},
{
  "user": "rana",
  "type": "Export",
  "details": "Financial Reporting",
  "time": "15 Oct 2024 at 05:23 PM",
}
];
  getClickedTap(clickedTap: TapModel) {
      
    }

    
}

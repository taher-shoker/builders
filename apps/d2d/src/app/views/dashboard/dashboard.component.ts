import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProgressCircleData } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  filterType = [
    {name: "User", value: 0},
    {name: "Team", value: 1},
  ]

  users = [
    {name: "User 1", value: 0},
    {name: "User 22", value: 1},
  ]

  teams = [
    {name: "Team 1", value: 0},
    {name: "Team 22", value: 1},
  ]


  filterValueForm: FormGroup = new FormGroup({
    filterType: new FormControl(this.filterType[0]),
    filterValue: new FormControl({})

  })

  progressCircleData: ProgressCircleData[] = [
    {
      category: "219 Approved",
      value: 80,
      full: 100
    },
    {
      category: "120 Rejected",
      value: 70,
      full: 100
    },
    {
      category: "76 Closed",
      value: 75,
      full: 100
    },
    {
      category: "23 Not Approved Yet",
      value: 66,
      full: 100
    },
    {
      category: "21 Escalation 1 Already sent",
      value: 90,
      full: 100
    },
    {
      category: "12 Escalation 2 Already sent",
      value: 90,
      full: 100
    },
  ]
}

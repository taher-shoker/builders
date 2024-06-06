import { Component } from '@angular/core';
import { departmentModel } from '../../../../shared/models/deparatment.model';

@Component({
  selector: 'stc-apps-result-weight-card',
  templateUrl: './result-weight-card.component.html',
  styleUrl: './result-weight-card.component.scss',
})
export class ResultWeightCardComponent {
  departments:departmentModel[]=[];
  constructor(){
    this.departments=[
      {
        departmentHeader:'Application Sector',
        departmentResult:44.91,
        departmentWeight:20
      },
      {
        departmentHeader:'Corporate shared priorities',
        departmentResult:30,
        departmentWeight:45
      },

    ]
  }
}

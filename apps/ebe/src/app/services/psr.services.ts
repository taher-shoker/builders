import { Injectable } from '@angular/core';
import { PSRDataModel } from '../models/psr.model';
@Injectable({ providedIn: 'root' })
export class PSRService {
  private readonly PSRData:PSRDataModel[] = [
    {
      id : 1,
      title : 'DG',
      chartData : {
        actual : 65,
        planned : 50
      },
      description : "enhance DPP program by assessing stc subsidiaries maturity and DPP framework"
    },
    {
      id : 2,
      title : 'AA',
      chartData : {
        actual : 21,
        planned : 72
      },
      description : "project for stc analytics labs and enhance 360 view was impacted due to multiple deliverables delays"
    },
    {
      id : 3,
      title : 'AE',
      chartData : {
        actual : 32,
        planned : 29
      },
      description : "north star capability has deployed to enhance CAD eco system. market place demo was presented to have unified demand managment for CAD"
    },
  ];
  getPSRData():PSRDataModel[]
  {
    return this.PSRData;
  }
}

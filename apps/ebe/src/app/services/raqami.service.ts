import { Injectable } from '@angular/core';
import { TapModel } from '../models/scorecard.model';
import { RaqamiKpiData } from '../models/raqami.model';
@Injectable({ providedIn: 'root' })
export class RaqamiService {

  private raqamiTaps:TapModel[] = [
        {
          id : 1,
          name : "A1",
          value : "A1"
        },
        {
          id : 2,
          name : "A2",
          value : "A2"
        },
        {
          id : 3,
          name : "A3",
          value : "A3"
        }
  ];
  raqamiKpiData:RaqamiKpiData[] = [
    {
      kpiName : "%of analytics capabilities implemented in alignment with northstar to-be architecture analytics roadmap",
      actual : 81,
      status : "output",
      theme : "D",
      weight : 20,
      unit : "%",
      baseline : {
        year : 2024,
        value : 54
      },
      targets : [
        {
          year : 2024,
          value : 96
        },
        {
          year : 2025,
          value : 100
        },
        {
          year : 2026,
          value : null
        }
      ]
    },
    {
      kpiName : "#of developed advanced analytics use cases",
      actual : 124,
      status : "output",
      theme : "D",
      weight : 20,
      unit : "#",
      baseline : {
        year : 2024,
        value : 130
      },
      targets : [
        {
          year : 2024,
          value : 154
        },
        {
          year : 2025,
          value : 178
        },
        {
          year : 2026,
          value : 202
        }
      ]
    },
    {
      kpiName : "#self-service capability enabled for BU/FU",
      actual : 35,
      status : "output",
      theme : "D",
      weight : 20,
      unit : "#",
      baseline : {
        year : 2024,
        value : 36
      },
      targets : [
        {
          year : 2024,
          value : 41
        },
        {
          year : 2025,
          value : 46
        },
        {
          year : 2026,
          value : 51
        }
      ]
    },
  ]
  getRaqamiTaps():TapModel[]
  {
    return this.raqamiTaps;
  }
}

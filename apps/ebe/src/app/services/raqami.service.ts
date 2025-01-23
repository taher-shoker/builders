import { Injectable } from '@angular/core';
import { TapModel } from '../models/scorecard.model';
import { A2TapData, A3TapData, RaqamiKpiData } from '../models/raqami.model';
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
  raqamiA2Data:A2TapData[] = [
    {
      title : "(AA2-1) MSAR Potential value creation via analytics based use cases",
      owner : "Nabeel M.Alhaider",
      project : "Cumulative YTD",
      kpiWeight : 20,
      UoM : "%",
      baseLine : {
        year : 2024,
        val : 15
      },
      targets : [
        {
          year : 2023,
          val : "1186"
        },
        {
          year : 2024,
          val : "TED"
        },
        {
          year : 2025,
          val : "TED"
        },
      ],
      chartData : [
        {
          month: 'Jan',
          value1: 1000,
          value2: 4128,
        },
        {
          month: 'Feb',
          value1: 3224,
          value2: 2224,
        },
        {
          month: 'Mar',
          value1: 1234,
          value2: 4221,
        },
        {
          month: 'Apr',
          value1: 5000,
          value2: 2500,
        },
        {
          month: 'May',
          value1: 1323,
          value2: 4400,
        },
        {
          month: 'Jun',
          value1: 4775,
          value2: 6433,
        },
        {
          month: 'Jul',
          value1: 3234,
          value2: 5598,
        },
        {
          month: 'Aug',
          value1: 2342,
          value2: 6756,
        },
        {
          month: 'Sep',
          value1: 1000,
          value2: 1700,
        },
        {
          month: 'Oct',
          value1: 5745,
          value2: 2345,
        },
        {
          month: 'Nov',
          value1: 5452,
          value2: 2443,
        },
        {
          month: 'Dec',
          value1: 7545,
          value2: 4563,
        },
      ]
    },
    {
      title : "(AA2-2) # of analytics partners/vendors managed & assessed for R&D",
      owner : "Nabeel M.Alhaider",
      project : "Cumulative YTD",
      kpiWeight : 15,
      UoM : "%",
      baseLine : {
        year : 2023,
        val : 15
      },
      targets : [
        {
          year : 2023,
          val : "20"
        },
        {
          year : 2024,
          val : "25"
        },
        {
          year : 2025,
          val : "TBD"
        },
      ],
      chartData : [
        {
          month: 'Jan',
          value1: 1000000,
          value2: 2000000,
        },
        {
          month: 'Feb',
          value1: 65000000,
          value2: 34000000,
        },
        {
          month: 'Mar',
          value1: 25000000,
          value2: 11000000,
        },
        {
          month: 'Apr',
          value1: 60000000,
          value2: 30000000,
        },
        {
          month: 'May',
          value1: 13456345,
          value2: 73452344,
        },
        {
          month: 'Jun',
          value1: 121423551,
          value2: 174353455,
        },
        {
          month: 'Jul',
          value1: 765435345,
          value2: 233456434,
        },
        {
          month: 'Aug',
          value1: 642344436,
          value2: 433446342,
        },
        {
          month: 'Sep',
          value1: 232342525,
          value2: 983453234,
        },
        {
          month: 'Oct',
          value1: 94534528,
          value2: 78453245,
        },
        {
          month: 'Nov',
          value1: 54234523,
          value2: 35452344,
        },
        {
          month: 'Dec',
          value1: 86234344,
          value2: 23452342,
        },
      ]
    },
    {
      title : "(AA2-3) # of productionized AI/ML models through MLOps",
      owner : "Nabeel M.Alhaider",
      project : "Cumulative YTD",
      kpiWeight : 15,
      UoM : "%",
      baseLine : {
        year : 2023,
        val : 15
      },
      targets : [
        {
          year : 2023,
          val : "20"
        },
        {
          year : 2024,
          val : "25"
        },
        {
          year : 2025,
          val : "TBD"
        },
      ],
      chartData : [
        {
          month: 'Jan',
          value1: 200,
          value2: 123,
        },
        {
          month: 'Feb',
          value1: 345,
          value2: 534,
        },
        {
          month: 'Mar',
          value1: 123,
          value2: 455,
        },
        {
          month: 'Apr',
          value1: 324,
          value2: 111,
        },
        {
          month: 'May',
          value1: 113,
          value2: 645,
        },
        {
          month: 'Jun',
          value1: 345,
          value2: 245,
        },
        {
          month: 'Jul',
          value1: 345,
          value2: 978,
        },
        {
          month: 'Aug',
          value1: 646,
          value2: 345,
        },
        {
          month: 'Sep',
          value1: 456,
          value2: 234,
        },
        {
          month: 'Oct',
          value1: 788,
          value2: 866,
        },
        {
          month: 'Nov',
          value1: 567,
          value2: 345,
        },
        {
          month: 'Dec',
          value1: 765,
          value2: 453,
        },
      ]
    }
  ]
  raqamiA3Data:A3TapData[] = [
    {
      title : "(AA2-1) MSAR Potential value creation via analytics based use cases",
      project : "Cumulative YTD",
      kpiWeight : 20,
      UoM : "%",
      baseLine : {
        year : 2024,
        val : 15
      },
      target:new Date(),
      chartData : [
        {
          month: 'Jan',
          value1: 10,
        },
        {
          month: 'Feb',
          value1: 20,
        },
        {
          month: 'Mar',
          value1: 25,
        },
        {
          month: 'Apr',
          value1: 17,
        },
        {
          month: 'May',
          value1: 30,
        },
        {
          month: 'Jun',
          value1: 25,
        },
        {
          month: 'Jul',
          value1: 21,
        },
        {
          month: 'Aug',
          value1: 13,
        },
        {
          month: 'Sep',
          value1: 50,
        },
        {
          month: 'Oct',
          value1: 33,
        },
        {
          month: 'Nov',
          value1: 21,
        },
        {
          month: 'Dec',
          value1: 34,
        },
      ]
    },
    {
      title : "(AA2-2) # of analytics partners/vendors managed & assessed for R&D",
      project : "Cumulative YTD",
      kpiWeight : 15,
      UoM : "%",
      baseLine : {
        year : 2023,
        val : 15
      },
      target:new Date(),
      chartData : [
        {
          month: 'Jan',
          value1: 20,
        },
        {
          month: 'Feb',
          value1: 65,
        },
        {
          month: 'Mar',
          value1: 25,
        },
        {
          month: 'Apr',
          value1: 60,
        },
        {
          month: 'May',
          value1: 13,
        },
        {
          month: 'Jun',
          value1: 12,
        },
        {
          month: 'Jul',
          value1: 76,
        },
        {
          month: 'Aug',
          value1: 64,
        },
        {
          month: 'Sep',
          value1: 23,
        },
        {
          month: 'Oct',
          value1: 98,
        },
        {
          month: 'Nov',
          value1: 54,
        },
        {
          month: 'Dec',
          value1: 86,
        },
      ]
    },
    {
      title : "(AA2-3) # of productionized AI/ML models through MLOps",
      project : "Cumulative YTD",
      kpiWeight : 15,
      UoM : "%",
      baseLine : {
        year : 2023,
        val : 15
      },
      target:new Date(),
      chartData : [
        {
          month: 'Jan',
          value1: 200,
        },
        {
          month: 'Feb',
          value1: 345,
        },
        {
          month: 'Mar',
          value1: 123,
        },
        {
          month: 'Apr',
          value1: 324,
        },
        {
          month: 'May',
          value1: 113,
        },
        {
          month: 'Jun',
          value1: 345,
        },
        {
          month: 'Jul',
          value1: 345,
        },
        {
          month: 'Aug',
          value1: 646,
        },
        {
          month: 'Sep',
          value1: 456,
        },
        {
          month: 'Oct',
          value1: 788,
        },
        {
          month: 'Nov',
          value1: 567,
        },
        {
          month: 'Dec',
          value1: 765,
        },
      ]
    }
  ]
}

import { Injectable } from '@angular/core';
import { StrategyProgramKpiDetailsModel, StrategyProgramModel } from '../models/strategy-program.model';
@Injectable({ providedIn: 'root' })
export class StrategyProgramService {
  private StrategyProgramDaya:StrategyProgramModel = {
    title : "execution status",
    overallProgress : 75,
    totalInvestments : 25342342,
    strategyProgramKpiModel : [
      {
        id : 1,
        title : "accelerated AI adoption",
        currentProgress : 4,
        totalWeight : 30,
        totalInvestments : 6000000,
        description : "build centralized layer of enterprise AI for rapid development of business use cases"
      },
      {
        id : 2,
        title : "analytics products democratization",
        currentProgress : 8,
        totalWeight : 25,
        totalInvestments : 56435547,
        description : "offer simplified, high quality, secure, protected & governed analytic products for data monetization"
      },
      {
        id : 3,
        title : "scalable system of insights",
        currentProgress : 17,
        totalWeight : 25,
        totalInvestments : 183000000,
        description : "offer simplified, high quality, secure, protected & governed analytic products for data monetization"
      },
      {
        id : 4,
        title : "talent growth & digital culture",
        currentProgress : 6,
        totalWeight : 20,
        totalInvestments : 23534,
        description : "improve end-to-end customer experience with a collaborated op.model & nWOW"
      },
    ]

  };
  private strategyProgramKpiDetailsModel:StrategyProgramKpiDetailsModel[] = [
    {
      id:1,
      description:'introduce stc brain as an innovation hub to act as accelerator of new businesses and partnerships',
      weight:10,
      formula:'in progress',
      actualStatus:3.5,
      projects : [
        {
          id:1,
          title : "ML-Ops activation plan maturity level",
          actualValue : 20,
          plannedValue : 100
        },
        {
          id:2,
          title : "ML-Ops activation plan maturity level",
          actualValue : 50,
          plannedValue : 100
        },
        {
          id:3,
          title : "ML-Ops activation plan maturity level",
          actualValue : 50,
          plannedValue : 100
        },
      ]
    },
    {
      id:2,
      description:'introduce stc brain as an innovation hub to act as accelerator of new businesses and partnerships',
      weight:10,
      formula:'in progress',
      actualStatus:3.5,
      projects : [
        {
          id:1,
          title : "ML-Ops activation plan maturity level",
          actualValue : 20,
          plannedValue : 100
        }
      ]
    },
    {
      id:3,
      description:'introduce stc brain as an innovation hub to act as accelerator of new businesses and partnerships',
      weight:10,
      formula:'in progress',
      actualStatus:3.5,
      projects : []
    },
  ]
  getStrategyProgramDaya():StrategyProgramModel
  {
    return this.StrategyProgramDaya;
  }
  getStrategyProgramKpiDetailsModel():StrategyProgramKpiDetailsModel[]
  {
    return this.strategyProgramKpiDetailsModel;
  }
}

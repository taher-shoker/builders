import { Injectable } from '@angular/core';
import { FinancialScorecardModel, OperationalScorecardModel, PrioritiesScorecardModel, RelationalScorecardModel, StrategicScorecardModel } from '../models/scorecard.model';
@Injectable({ providedIn: 'root' })
export class ScorecardService {
  financialScorcardData!:FinancialScorecardModel;
  strategicScorcardData!:StrategicScorecardModel;
  rationalScorcardData!:RelationalScorecardModel;
  operationalScorcardData!:OperationalScorecardModel;
  prioritieslScorcardData!:PrioritiesScorecardModel;
  constructor() {
    this.financialScorcardData = {
      title : "transforming costs to maximize value",
      costsData : [
        {
          id:1,
          title : "stc KSA EBIT",
          costStatus : [
            {
              id : "achieved",
              title : "over achieved"
            },
            {
              id : "not-achieved",
              title : "linear"
            },
            {
              id : "actual",
              title : "Actual",
              value : "99.89%"
            },
          ],
          weight:'5%',
          unit:'SR Bn',
          baseline:'12738',
          target:'12537',
          ceiling:'110%',
          threshold:'85%'
        },
        {
          id:2,
          title : "CAD business efficiency OPEX savings",
          costStatus : [
            {
              id : "achieved",
              title : "over achieved"
            },
            {
              id : "not-achieved",
              title : "linear"
            }
          ],
          weight:'20%',
          unit:'%',
          baseline:'145.68%',
          target:'100%',
          ceiling:'110%',
          threshold:'85%'
        },
      ]
    }
    this.strategicScorcardData = {
      title : "execute strategy right"
    }
    this.rationalScorcardData = {
      title : "delivered unparalleled CEX"
    }
    this.operationalScorcardData = {
      title : "unlock analytics capabilities"
    }
    this.prioritieslScorcardData = {
      title : "corporate priorities"
    }
  }
}

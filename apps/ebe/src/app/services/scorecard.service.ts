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
          weight:5,
          unit:'SR Bn',
          baseline:null,
          target:12537,
          ceiling:110,
          threshold:85
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
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
        {
          id:3,
          title : "CAD business 123",
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
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
        {
          id:4,
          title : "CAD business test",
          costStatus : [
            {
              id : "achieved",
              title : "over achieved"
            },
            {
              id : "actual",
              title : "Actual",
              value : "50%"
            },
          ],
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
      ]
    }
    this.strategicScorcardData = {
      title : "execute strategy right",
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
          weight:5,
          unit:'SR Bn',
          baseline:12738,
          target:12537,
          ceiling:110,
          threshold:85
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
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
        {
          id:3,
          title : "CAD business 123",
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
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        }
      ]
    }
    this.rationalScorcardData = {
      title : "delivered unparalleled CEX",
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
          weight:5,
          unit:'SR Bn',
          baseline:12738,
          target:12537,
          ceiling:110,
          threshold:85
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
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
        {
          id:3,
          title : "CAD business 123",
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
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
        {
          id:4,
          title : "CAD business test",
          costStatus : [
            {
              id : "achieved",
              title : "over achieved"
            },
            {
              id : "actual",
              title : "Actual",
              value : "50%"
            },
          ],
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
      ]
    }
    this.operationalScorcardData = {
      title : "unlock analytics capabilities",
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
          weight:5,
          unit:'SR Bn',
          baseline:12738,
          target:12537,
          ceiling:110,
          threshold:85
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
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
        {
          id:3,
          title : "CAD business 123",
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
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
        {
          id:4,
          title : "CAD business test",
          costStatus : [
            {
              id : "achieved",
              title : "over achieved"
            },
            {
              id : "actual",
              title : "Actual",
              value : "50%"
            },
          ],
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
      ]
    }
    this.prioritieslScorcardData = {
      title : "corporate priorities",
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
          weight:5,
          unit:'SR Bn',
          baseline:12738,
          target:12537,
          ceiling:110,
          threshold:85
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
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
        {
          id:3,
          title : "CAD business 123",
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
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
        {
          id:4,
          title : "CAD business test",
          costStatus : [
            {
              id : "achieved",
              title : "over achieved"
            },
            {
              id : "actual",
              title : "Actual",
              value : "50%"
            },
          ],
          weight:20,
          unit:'%',
          baseline:145.68,
          target:100,
          ceiling:90,
          threshold:55
        },
      ]
    }
  }
}

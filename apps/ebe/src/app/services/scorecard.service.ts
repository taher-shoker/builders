import { Injectable } from '@angular/core';
import { FinancialScorecardModel } from '../models/scorecard.model';
@Injectable({ providedIn: 'root' })
export class ScorecardService {
  financialScorcardData!:FinancialScorecardModel;
  constructor() {
    this.financialScorcardData = {
      title : "transforming costs to maximize value"
    }
  }
}

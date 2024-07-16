import { Injectable } from '@angular/core';
import { StrategyProgramModel } from '../models/strategy-program.model';
@Injectable({ providedIn: 'root' })
export class StrategyProgramService {
  private StrategyProgramDaya:StrategyProgramModel = {
    title : "execution status"
  };
  getStrategyProgramDaya():StrategyProgramModel
  {
    return this.StrategyProgramDaya;
  }
}

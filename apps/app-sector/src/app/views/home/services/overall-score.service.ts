import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverallScore } from '../../models/overallScore.model';


@Injectable({
  providedIn: 'root',
})
export class OverallScoreService {
  private overallScoreSubject = new BehaviorSubject<OverallScore[] | null>(
    null
  );
  overallScore$ = this.overallScoreSubject.asObservable();

  setOverallScore(overallScore: OverallScore[]) {
    this.overallScoreSubject.next(overallScore);
  }

  getOverallScore() {
    return this.overallScoreSubject.value;
  }
}

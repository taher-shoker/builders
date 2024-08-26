import { Component, input, InputSignal, OnInit } from '@angular/core';
import { OverallScoreService } from '../../services/overall-score.service';
import { OverallScore } from '../../../models/overallScore.model';

@Component({
  selector: 'stc-apps-result-weight-card',
  templateUrl: './result-weight-card.component.html',
  styleUrl: './result-weight-card.component.scss',
})
export class ResultWeightCardComponent implements OnInit {
  scores: OverallScore[] = [];
  scoreCardName: InputSignal<string> = input('');
  constructor(private overallScoreService: OverallScoreService) {}

  ngOnInit(): void {
    this.getOverallScore();
    console.log('scores', this.scores);
  }

  getOverallScore() {
    this.overallScoreService.overallScore$.subscribe((result) => {
      if (result) {
        this.scores = result.filter(
          (item) => item.scorecardTitle !== 'Overall'
        );
      } else {
        this.scores = [];
      }
    });
  }
}

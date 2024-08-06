import { Component, OnInit } from '@angular/core';
import { OverallScoreService } from '../../services/overall-score.service';
import { OverallScore } from '../../../models/overallScore.model';

@Component({
  selector: 'stc-apps-result-weight-card',
  templateUrl: './result-weight-card.component.html',
  styleUrl: './result-weight-card.component.scss',
})
export class ResultWeightCardComponent implements OnInit {
  scores: OverallScore[] = [];

  constructor(private overallScoreService: OverallScoreService) {}

  ngOnInit(): void {
    this.getOverallScore();
  }

  getOverallScore() {
    this.overallScoreService.overallScore$.subscribe((result) => {
      if (result) {
        this.scores = result.filter(
          (item) => item.scorecardTitle !== 'Overall'
        );
      }
    });
  }
}

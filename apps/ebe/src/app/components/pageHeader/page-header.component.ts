import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScorecardService } from '../../services/scorecard.service';

@Component({
  selector: 'stc-apps-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent implements OnInit {
  mainTitle = input.required<string>();
  username = "";
  secondaryTitle = input<string>();
  scorecardService = inject(ScorecardService)
  ngOnInit(): void {
    this.username = this.scorecardService.getUsername();
  }
}

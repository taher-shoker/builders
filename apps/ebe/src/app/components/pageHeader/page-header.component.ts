import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScorecardService } from '../../services/scorecard.service';
import { Location } from '@angular/common';
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
  isDeletedProject = input<boolean>(false)
  constructor(private location: Location) {}
  ngOnInit(): void {
    this.username = this.scorecardService.getUsername();
  }
  returnBack()
  {
    this.location.back();
  }
}

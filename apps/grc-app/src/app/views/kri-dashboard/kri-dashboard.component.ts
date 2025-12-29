import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services';
import { TapModel } from '../../models';

@Component({
  selector: 'stc-apps-kri-dashboard',
  templateUrl: './kri-dashboard.component.html',
  styleUrl: './kri-dashboard.component.scss',
})
export class KriDashboardComponent implements OnInit {
  userName!: string;
  authService = inject(AuthService);
  kriTaps: TapModel[] = [];
  currentClickedTap!: TapModel;
  ngOnInit(): void {
    this.authService.loggedUserStream.subscribe((user) => {
      if (user) {
        this.userName = user.name;
      }
    });
    this.kriTaps = [
      {
        id: 1,
        name: 'Executive Summary',
        value: 'executive-summary',
      },
      {
        id: 2,
        name: 'DP',
        value: 'db',
      },
      {
        id: 3,
        name: 'Execellence',
        value: 'excellence',
      },
      {
        id: 4,
        name: 'AI',
        value: 'ai',
      },
      {
        id: 5,
        name: 'Jawwy',
        value: 'jawwy',
      },
      {
        id: 6,
        name: 'EBU',
        value: 'ebu',
      },
      {
        id: 7,
        name: 'CPU',
        value: 'cpu',
      },
    ];
    this.currentClickedTap = this.kriTaps[0];
  }
  getCurrentTap(tap: TapModel) {
    this.currentClickedTap = tap;
  }
}

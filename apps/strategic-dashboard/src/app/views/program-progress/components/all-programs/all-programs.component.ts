import { Component, computed } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProgressInfo } from 'libs/shared-ui/src/lib/progress-bar/progress-bar.component';

@Component({
  selector: 'stc-apps-all-programs',
  templateUrl: './all-programs.component.html',
  styleUrl: './all-programs.component.scss',
})
export class AllProgramsComponent {
  searchTerm = '';
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = '';
  navItems = [
    {
      name: 'home',
      url: '/home',
      icon: 'fa-home',
      roles: ['APPROVERS,CREATORS'],
      urlHome: '/home',
    },
  ];
  progarmsProgress = [
    {
      programName: 'STC group EBTDA',
      barData: {
        prefixText: '',
        prefixValue: 0,
        suffixText: '',
        suffixValue: 0,
        progressValue: 89.0,
        indexes: [
          {
            caption: 'Actual',
            value: 9.0,
            position: 'up',
          },
          {
            caption: 'Planned',
            value: 89.0,
            position: 'down',
          },
        ],
        barColor: '#c82a27',
        bgBarColor: '#c82a271a',
      },
    },
    {
      programName: '% Next-Gen teck roll-out',
      barData: {
        prefixText: '',
        prefixValue: 0,
        suffixText: '',
        suffixValue: 0,
        progressValue: 89.0,
        indexes: [
          {
            caption: 'Actual',
            value: 33.0,
            position: 'up',
          },
          {
            caption: 'Planned',
            value: 89.0,
            position: 'down',
          },
        ],
        barColor: '#00C48C',
        bgBarColor: '#00C48C1A',
      },
    },
    {
      programName: 'Sustainability score',
      barData: {
        prefixText: '',
        prefixValue: 0,
        suffixText: '',
        suffixValue: 0,
        progressValue: 60.0,
        indexes: [
          {
            caption: 'Actual',
            value: 55.0,
            position: 'up',
          },
          {
            caption: 'Planned',
            value: 60.0,
            position: 'down',
          },
        ],
        barColor: '#FF6A39',
        bgBarColor: '#FF6A391A',
      },
    },
    {
      programName: 'STC group ROCE',
      barData: {
        prefixText: '',
        prefixValue: 0,
        suffixText: '',
        suffixValue: 0,
        progressValue: 70.0,
        indexes: [
          {
            caption: 'Actual',
            value: 23.0,
            position: 'up',
          },
          {
            caption: 'Planned',
            value: 70.0,
            position: 'down',
          },
        ],
        barColor: '#1BCED8',
        bgBarColor: '#1BCED81A',
      },
    },
  ];
  filteredItems: any[] = [];

  constructor() {
    this.filteredItems = this.progarmsProgress;
  }
  search(value: string) {
    this.filteredItems = this.progarmsProgress.filter((progarm) =>
      progarm.programName.toLowerCase().includes(value.toLowerCase())
    );
  }
}

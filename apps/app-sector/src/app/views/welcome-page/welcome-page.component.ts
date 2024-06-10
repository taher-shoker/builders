import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent {
  constructor(private router: Router) {}
  showItemDesc = false;
  hoverIndex = -1;
  listItems = [
    {
      scoreBoardIconPath: '/assets/images/app-sector-icon.svg',
      scoreBoardTitle: 'Application Sector',
      scoreBoardDesc: 'Here’s of scorecard report Dashboard ',
    },
    {
      scoreBoardIconPath: '/assets/images/HR-icon.svg',
      scoreBoardTitle: 'HR Sector',
      scoreBoardDesc: '',
    },
    {
      scoreBoardIconPath: '/assets/images/TO-icon.svg',
      scoreBoardTitle: 'T/O Sector',
      scoreBoardDesc: '',
    },
  ];
  onHover(i: number) {
    this.hoverIndex = i;
    if (i == -1) {
      this.showItemDesc = false;
    } else {
      this.showItemDesc = true;
    }
  }
  navigate(title: string) {
    if (title == 'Application Sector') {
      this.router.navigate(['/']);
    }
  }
}

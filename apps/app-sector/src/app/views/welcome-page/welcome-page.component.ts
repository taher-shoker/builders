import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WelcomePageService } from './services/welcomePage.service';
import { take } from 'rxjs';
import { sectorsList, userSector } from './models/userSector.model';

@Component({
  selector: 'stc-apps-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent implements OnInit {
  constructor(
    private router: Router,
    private welcomePageService: WelcomePageService
  ) {}

  showItemDesc = false;
  hoverIndex = -1;
  listItems = [
    {
      scoreBoardIconPath: 'assets/images/app-sector-icon.svg',
      scoreBoardTitle: 'Application Sector',
      scoreBoardDesc: 'Here’s of scorecard report Dashboard ',
    },
    {
      scoreBoardIconPath: 'assets/images/HR-icon.svg',
      scoreBoardTitle: 'HR Sector',
      scoreBoardDesc: '',
    },
    {
      scoreBoardIconPath: 'assets/images/TO-icon.svg',
      scoreBoardTitle: 'T/O Sector',
      scoreBoardDesc: '',
    },
  ];
  sectors: userSector[] = [];

  ngOnInit(): void {
    this.getUserSectors();
  }
  getUserSectors() {
    this.welcomePageService
      .getUserSectors()
      .pipe(take(1))
      .subscribe((response: sectorsList) => {
        this.sectors = response.sectorsList;
      });
  }

  onHover(i: number) {
    this.hoverIndex = i;
    if (i == -1) {
      this.showItemDesc = false;
    } else {
      this.showItemDesc = true;
    }
  }
}

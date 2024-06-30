/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  InputSignal,
  WritableSignal,
  input,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'stc-apps-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss'],
})
export class TopBannerComponent {
  milestoneProgress: WritableSignal<number | null> = signal(74.91);
  showScorecard: boolean = true;
  title = 'Over all score';
  kpiCode = '';
  currentUrl = '';
  userName: InputSignal<string> = input('');
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        console.log('Current URL:', this.router.url);
        if (this.router.url.includes('/details')) {
          this.showScorecard = false;
        }
        else{
          this.showScorecard=true;
        }
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yearsArray: any = [
    { name: 2020 },
    { name: 2021 },
    { name: 2022 },
    { name: 2023 },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quarterArray: any = [
    { name: 'Quarter 1' },
    { name: 'Quarter 2' },
    { name: 'Quarter 3' },
    { name: 'Quarter 4' },
  ];
}

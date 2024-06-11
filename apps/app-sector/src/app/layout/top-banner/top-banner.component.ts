import { Component, InputSignal, WritableSignal, input, signal } from '@angular/core';

@Component({
  selector: 'stc-apps-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss'],
})
export class TopBannerComponent {
  milestoneProgress: WritableSignal<number | null> = signal(74.91);
  title = 'Over all score';
  userName: InputSignal<string> = input('');

  yearsArray: any = [
    { name: 2020 },
    { name: 2021 },
    { name: 2022 },
    { name: 2023 },
  ];
  quarterArray: any = [
    { name: 'Quarter 1' },
    { name: 'Quarter 2' },
    { name: 'Quarter 3' },
    { name: 'Quarter 4' },
  ];
}

import { Component, InputSignal, WritableSignal, input, signal } from '@angular/core';

@Component({
  selector: 'stc-apps-score-card-tabs',
  templateUrl: './score-card-tabs.component.html',
  styleUrls: ['./score-card-tabs.component.scss'],
})
export class ScoreCardTabsComponent {

  selectedTab: WritableSignal<string> = signal('ApplicationSector');
  scoreCardName: InputSignal<string> = input('');
  handleChangeTab(value: any) {
    this.selectedTab.set(value);
  }
}

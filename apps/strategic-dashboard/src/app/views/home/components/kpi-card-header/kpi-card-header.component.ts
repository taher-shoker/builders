import { Component, effect, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-kpi-card-header',
  templateUrl: './kpi-card-header.component.html',
  styleUrl: './kpi-card-header.component.scss',
})
export class KpiCardHeaderComponent {
  kpiTitle: InputSignal<string> = input('');
  iconPath: InputSignal<string> = input('');
  firstPartTitle = '';
  secondPartTitle = '';
  firstLetter = '';
  constructor() {
    effect(() => {
      if (this.kpiTitle()) {
        this.firstPartTitle = this.kpiTitle().split(' ')[0];
        this.secondPartTitle = this.kpiTitle().split(' ')[1];
        this.firstLetter = Array.from(this.firstPartTitle)[0];
      }
    });
  }
}

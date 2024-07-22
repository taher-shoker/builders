import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  kpis = [
    {
      title: 'Digitize STC',
      iconPath: 'assets/images/interaction-icon.svg',
    },
    {
      title: 'Accelerate Performance',
      iconPath: 'assets/images/performance-icon.svg',
    },
    {
      title: 'Reinvent Experience',
      iconPath: 'assets/images/management-icon.svg',
    },
    {
      title: 'Expand Scale',
      iconPath: 'assets/images/scale-icon.svg',
    },
  ];
  title = 'Digitize STC';
  iconPath = 'assets/images/interaction-icon.svg';
}

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
      details: [
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
        'Transform into agile technology company and embrace new ways of working',
      ],
    },
    {
      title: 'Accelerate Performance',
      iconPath: 'assets/images/performance-icon.svg',
      details: [
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
      ],
    },
    {
      title: 'Reinvent Experience',
      iconPath: 'assets/images/management-icon.svg',
      details: [
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
        'Transform into agile technology company and embrace new ways of working',
      ],
    },
    {
      title: 'Expand Scale',
      iconPath: 'assets/images/scale-icon.svg',
      details: [
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
        'Transform into agile technology company and embrace new ways of working',
      ],
    },
  ];
  details=[
    'Instill digital mindset and unlock the potential of digital and analytics capabilities',
    'Transform into agile technology company and embrace new ways of working',
  ];
  title = 'Digitize STC';
  iconPath = 'assets/images/interaction-icon.svg';
}

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
      firstContents: [
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
        'Transform into agile technology company and embrace new ways of working',
      ],
      secondContents: [
        {
          title: 'STC Group EBTDA',
          percentage: '130 %',
        },
        {
          title: '% Next-Gen Teck Roll-Out',
          percentage: '121 %',
        },
        {
          title: 'STC Group ROCE',
          percentage: '120 %',
        },
        {
          title: 'Sustainability Score',
          percentage: '23 %',
        },
        {
          title: '% of Strategic Roles and Capabilities Filled',
          percentage: '23 %',
        },
        {
          title: 'Employee Experience Score',
          percentage: '92 %',
        },
      ],
    },
    {
      title: 'Accelerate Performance',
      iconPath: 'assets/images/performance-icon.svg',
      firstContents: [
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
        'Transform into agile technology company and embrace new ways of working',
      ],
      secondContents: [
        {
          title: 'STC Group EBTDA',
          percentage: '130 %',
        },
        {
          title: '% Next-Gen Teck Roll-Out',
          percentage: '121 %',
        },
        {
          title: 'STC Group ROCE',
          percentage: '120 %',
        },
      ],
    },
    {
      title: 'Reinvent Experience',
      iconPath: 'assets/images/management-icon.svg',
      firstContents: [
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
        'Transform into agile technology company and embrace new ways of working',
      ],
      secondContents: [
        {
          title: 'STC Group EBTDA',
          percentage: '130 %',
        },
        {
          title: '% Next-Gen Teck Roll-Out',
          percentage: '121 %',
        },
        {
          title: 'STC Group ROCE',
          percentage: '120 %',
        },
      ],
    },
    {
      title: 'Expand Scale',
      iconPath: 'assets/images/scale-icon.svg',
      firstContents: [
        'Instill digital mindset and unlock the potential of digital and analytics capabilities',
        'Transform into agile technology company and embrace new ways of working',
      ],
      secondContents: [
        {
          title: 'STC Group EBTDA',
          percentage: '130 %',
        },
        {
          title: '% Next-Gen Teck Roll-Out',
          percentage: '121 %',
        },
        {
          title: 'STC Group ROCE',
          percentage: '120 %',
        },
      ],
    },
  ];
  title = 'Digitize STC';
  iconPath = 'assets/images/interaction-icon.svg';
  currentKpi = this.kpis[0];
  activeIndex: number | null = null;

  getCurrentContents(index: number) {
    const kpi = this.kpis[index];
    return this.activeIndex === index ? kpi.secondContents : kpi.firstContents;
  }

  onCardHover(index: number) {
    this.activeIndex = index;
  }

  onCardLeave() {
    this.activeIndex = null;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'stc-apps-executive-summary',
  standalone: true,
  imports: [CommonModule, AccordionModule],
  templateUrl: './executive-summary.component.html',
  styleUrl: './executive-summary.component.scss',
})
export class ExecutiveSummaryComponent {
  data = [
    {
      title: 'prepaid O2C',
      status: 'on track',
      actual: 90,
      planned: 95,
    },
    {
      title: 'postpaid & fixed ph1 (FWA) delivery',
      status: 'at risk',
      actual: 15.6,
      planned: 23.8,
    },
  ];
}

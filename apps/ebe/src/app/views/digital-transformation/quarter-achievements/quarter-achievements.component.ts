import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalTransformationTapModel } from '../../../models/digital-transformation';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'stc-apps-quarter-achievements',
  standalone: true,
  imports: [CommonModule, AccordionModule],
  templateUrl: './quarter-achievements.component.html',
  styleUrl: './quarter-achievements.component.scss',
})
export class QuarterAchievementsComponent {
  currentTab = input.required<DigitalTransformationTapModel>();
  activeAccordionIndex = 0;
  toggleAccordion(index: number, event: Event) {
    event.stopPropagation();
    this.activeAccordionIndex =
      this.activeAccordionIndex === index ? -1 : index;
  }
  data = [
    {
      title:
        'MAY 25 - Postpaid O2C - Release 1 for New Connection TAWASOL Digital pilot closure & final business acceptance for release 1 New Connection of Postpaid',
      description: [
        'New UX/UI in TAWASOL digital enhances the agent experience by offering faster, smoother, and more user-friendly interactions for postpaid',
        'The production deployment of the Postpaid New Connection covering O2C journey requirements including retrofit CRs',
        'The Postpaid New Connection is available for both new and existing customers, and applies to Voice and Data for both Physical SIMs and eSIMs',
      ],
    },
    {
      title:
        'MAY 25 - Postpaid C2M - Release 1 for New Connection TAWASOL Digital pilot closure & final business acceptance for release 1 New Connection of Postpaid',
      description: [
        'Better Time to Market (Enhanced New Products and creation lifecycle)',
        'The migrated postpaid products to DT stack includes Mofawter postpaid plans',
      ],
    },
  ];
}

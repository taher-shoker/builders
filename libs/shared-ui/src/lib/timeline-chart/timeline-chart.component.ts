/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */

import { trigger, transition, style, animate } from '@angular/animations';
import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  input,
  signal,
  computed,
} from '@angular/core';
import { DTStream } from 'apps/dtmv/src/app/views/milestones-setting/milestones.service';

@Component({
  selector: 'stc-apps-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ left: '0' }),
        animate('{{ duration }}ms ease-in-out', style({ left: '{{ timeSpan }}%' })),
      ]),
    ]),
  ],
})
export class TimelineChartComponent implements OnInit {
  dtStream = input.required<DTStream>();
  animateMilestones = input.required<boolean>();

  todayDate: WritableSignal<number | null> = signal(null);

  dtStreamMutated: Signal<DTStream> = computed(() => {

    const copiedStream = this.dtStream();
    
    for (const act of copiedStream.activities) {
      for (const milestone of act.milestones) {
        milestone['timeSpan'] = this.calculatePercentageOfDate(
          milestone.endDate
        );
      }
    }

    return copiedStream;
  });

  ngOnInit(): void {
    this.todayDate.set(this.calculatePercentageOfDate(this.getTodayDate()));
  }

  getTodayDate() {
    const today = new Date();

    // Extract year, month, and day
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is zero-indexed, so we add 1
    const day = today.getDate();

    // Format the date with leading zeros if needed
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${
      day < 10 ? '0' : ''
    }${day}`;

    return formattedDate;
  }

  calculatePercentageOfDate(dateString: string): number {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = date.getFullYear();

    // Calculate the total number of days in the year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDaysInYear = isLeapYear ? 366 : 365;

    // Calculate the total number of days from the beginning of the year to the given date
    let totalDaysToDate = 0;
    const daysInMonth = [
      31,
      isLeapYear ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    for (let i = 0; i < month - 1; i++) {
      totalDaysToDate += daysInMonth[i];
    }
    totalDaysToDate += day;

    // Calculate the percentage
    const percentage = (totalDaysToDate / totalDaysInYear) * 100;
    return percentage;
  }
}

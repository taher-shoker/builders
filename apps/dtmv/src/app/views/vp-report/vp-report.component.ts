import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DTStream,
  MilestonesService,
} from '../milestones-setting/milestones.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'stc-apps-vp-report',
  templateUrl: './vp-report.component.html',
  styleUrls: ['./vp-report.component.scss'],
})
export class VpReportComponent implements OnInit {
  allTeams: any[] = [];
  filterSelect!: FormGroup;

  currentParams: any;

  // months = [
  //   { id: 1, startDate: '', endDate: '', label: '' },
  //   { id: 2, startDate: '', endDate: '', label: '' },
  //   { id: 3, startDate: '', endDate: '', label: '' },
  //   { id: 4, startDate: '', endDate: '', label: '' },
  //   { id: 5, startDate: '', endDate: '', label: '' },
  //   { id: 6, startDate: '', endDate: '', label: '' },
  //   { id: 7, startDate: '', endDate: '', label: '' },
  //   { id: 8, startDate: '', endDate: '', label: '' },
  //   { id: 9, startDate: '', endDate: '', label: '' },
  //   { id: 10, startDate: '', endDate: '', label: '' },
  //   { id: 11, startDate: '', endDate: '', label: '' },
  //   { id: 12, startDate: '', endDate: '', label: '' },
  // ];

  dtStreams: WritableSignal<DTStream[]> = signal([]);
  // dtStreamsMutated: Signal<DTStream[]> = computed(() => {
  //   const copiedStreams = this.dtStreams();
  //   for (const stream of copiedStreams) {
  //     for (const act of stream.activities) {
  //       for (const milestone of act.milestones) {
  //         milestone['timeSpan'] = this.calculatePercentageOfDate(
  //           milestone.endDate
  //         );
  //       }
  //     }
  //   }
  //   return copiedStreams;
  // });

  constructor(
    public milestonesService: MilestonesService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAllTeams();
    this.getDTStreams();


    this.filterSelect = new FormGroup({
      dateType: new FormControl(''),
    });
  }

  getAllTeams() {
    this.milestonesService.setSystemTeams().subscribe((res) => {
      this.allTeams = res;
    });
  }

  getDTStreams() {
    this.milestonesService.getDTStreams().subscribe((res) => {
      this.dtStreams.set(res);
    });
  }

  toggleTeam(value: string) {
    console.log(value);
    this.navigateWithQueryParam(value);
  }

  navigateWithQueryParam(query: string) {
    // Define your query parameters
    this.currentParams = { ...this.route.snapshot.queryParams };
    // Check if the 'team' parameter already exists
    if (this.currentParams.team === query) {
      // If it exists and matches the provided value, remove it
      this.currentParams = {};
      this.router.navigate([], {
        relativeTo: this.route,
      });
    } else {
      // If it doesn't exist or doesn't match, add it
      this.currentParams.team = query;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.currentParams,
        queryParamsHandling: 'merge', // Merge with existing query parameters
      });
    }
  }

  handleSelectChange(value: string) {
    console.log(value);
  }

  calculatePercentageOfDate(dateString: string): number {
    // Convert the date string to a Date object
    const date = new Date(dateString);

    // Get the day, month, and year from the date
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

    // Return the percentage
    return percentage;
  }


}

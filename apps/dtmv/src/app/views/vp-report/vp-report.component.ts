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
  yearsArr: any = [];

  filterSelect!: FormGroup;
  currentParams: any;

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
    this.yearsArrPopulator();

    this.filterSelect = new FormGroup({
      dateType: new FormControl(''),
    });
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.filterSelect.get('dateType')?.setValue(new Date().getFullYear());
    this.navigateWithQueryParams({
      year: this.filterSelect.get('dateType')?.value,
    });
  }
  getAllTeams() {
    this.milestonesService.setSystemTeams().subscribe((res) => {
      this.allTeams = res;
      this.navigateWithQueryParams({ team: res[0].name });
    });
  }

  getDTStreams() {
    this.milestonesService.getDTStreams().subscribe((res) => {
      this.dtStreams.set(res);
    });
  }

  toggleTeam(value: string) {
    if (this.currentParams?.team === value) {
      this.navigateWithQueryParams({ team: null });
    } else {
      this.navigateWithQueryParams({ team: value });
    }
  }

  // navigateWithQueryParam(query: string) {
  //   // Define your query parameters
  //   this.currentParams = { ...this.route.snapshot.queryParams };
  //   // Check if the 'team' parameter already exists
  //   if (this.currentParams.team === query) {
  //     // If it exists and matches the provided value, remove it
  //     this.currentParams = {};
  //     this.router.navigate([], {
  //       relativeTo: this.route,
  //     });
  //   } else {
  //     // If it doesn't exist or doesn't match, add it
  //     this.currentParams.team = query;
  //     this.router.navigate([], {
  //       relativeTo: this.route,
  //       queryParams: this.currentParams,
  //       queryParamsHandling: 'merge', // Merge with existing query parameters
  //     });
  //   }
  // }
  // navigateWithQueryParams(queryParams: { [key: string]: any }) {
  //   // Define your current query parameters
  //   const currentParams = { ...this.route.snapshot.queryParams };

  //   // Remove 'team' parameter if it exists
  //   console.log(currentParams, queryParams);

  //   console.log(currentParams);
  //   // Update the current query parameters with the provided ones

  //   if (currentParams['team'] === queryParams['team']) {
  //     delete currentParams['team'];
  //     this.router.navigate([], {
  //       relativeTo: this.route,
  //     });
  //   } else {
  //     Object.keys(queryParams).forEach((key) => {
  //       const value = queryParams[key];
  //       if (value !== undefined && value !== null) {
  //         currentParams[key] = value;
  //       } else {
  //         delete currentParams[key];
  //       }
  //     });
  //     console.log(currentParams);

  //     // Navigate to the current route with updated query parameters
  //     this.router.navigate([], {
  //       relativeTo: this.route,
  //       queryParams: currentParams,
  //       queryParamsHandling: 'merge', // Merge with existing query parameters
  //     });
  //   }
  // }
  navigateWithQueryParams(queryParams: { [key: string]: any }) {
    // Define your current query parameters
    this.currentParams = { ...this.route.snapshot.queryParams };
    // Update the current query parameters with the provided ones
    Object.keys(queryParams).forEach((key) => {
      const value = queryParams[key];
      if (value !== undefined && value !== null) {
        this.currentParams[key] = value;
      } else {
        delete this.currentParams[key];
      }
    });

    // Navigate to the current route with updated query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.currentParams,
    });
  }
  yearsArrPopulator() {
    const currentYear = new Date().getFullYear();
    for (
      let i = 2020;
      this.yearsArr[this.yearsArr.length - 1]?.name !== currentYear; // Check if the latest element's value equals the current year's value
      i++
    ) {
      this.yearsArr.push({ name: i, id: i });
    }
  }

  handleSelectChange(value: string) {
    this.navigateWithQueryParams({
      year: value,
    });
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

import { Component, OnInit, WritableSignal, signal } from '@angular/core';
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

  dtStreams: WritableSignal<DTStream[]> = signal([]);
  streamsYear: WritableSignal<number> = signal(0);
  milestoneProgress: WritableSignal<number | null> = signal(null);

  selectedYear: WritableSignal<number> = signal(0);
  selectedTeam: WritableSignal<string> = signal('');

  constructor(
    public milestonesService: MilestonesService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.yearsArrPopulator();
    this.filterSelect = new FormGroup({
      dateType: new FormControl(''),
    });
    this.setDateInitiallyToCurrentYear();
    this.getAllTeams();
  }

  watchRoute() {
    this.route.queryParams.subscribe((params) => {
      this.selectedYear.set(params['year']);
      this.selectedTeam.set(params['team']);

      const currentYear = new Date().getFullYear();

      if (!params['year']) {
        this.selectedYear.set(currentYear);
        this.updateRoute(this.allTeams[0].name, currentYear);
      }

      if (!params['team']) {
        this.selectedTeam.set(this.allTeams[0].name);
        this.updateRoute(this.allTeams[0].name, currentYear);
      }

      this.getDTStreams();
    });
  }

  setDateInitiallyToCurrentYear() {
    const currentYear = new Date().getFullYear();
    this.filterSelect.get('dateType')?.setValue(currentYear);
  }

  getAllTeams() {
    if (this.milestonesService.checkIsDirector()) {
      this.milestonesService.setSystemTeams().subscribe((res) => {
        this.allTeams = res;
        this.watchRoute();
        this.selectedTeam.set(this.allTeams[0].name);
      });
    } else {
      this.allTeams = this.milestonesService.setUserTeams();
      this.watchRoute();
      this.selectedTeam.set(this.allTeams[0].name);
    }
  }

  getDTStreams() {
    this.milestonesService
      .getDTStreams(this.selectedTeam(), this.selectedYear())
      .subscribe((res) => {
        this.dtStreams.set(res.streams);
        this.streamsYear.set(res.year);
        this.milestoneProgress.set(res.workStreamScore);
      });
  }

  selectTeam(value: string) {
    if (this.selectedTeam() !== value) {
      this.selectedTeam.set(value);
      this.updateRoute(value, this.selectedYear());
    }
  }

  updateRoute(team: string, year: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { team, year },
      queryParamsHandling: 'merge', // Merge with existing query parameters
    });
  }

  handleSelectChange(value: string) {
    this.selectedYear.set(Number(value));
    this.updateRoute(this.selectedTeam(), Number(value));
  }

  yearsArrPopulator() {
    const currentYear = new Date().getFullYear();
    for (
      let i = 2024;
      this.yearsArr[this.yearsArr.length - 1]?.name !== currentYear; // Check if the latest element's value equals the current year's value
      i++
    ) {
      this.yearsArr.push({ name: i, id: i });
    }
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

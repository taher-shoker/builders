import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgramKPIService } from '../../services/program-kpi.service';
import { ProgramKPIDetails } from '../../models/program-kpi-details.model';
import { ProgramProgress } from '../../models/program-progress.model';
import { SharedFormService } from '../../../../shared/services/shared-form.service';
import { YearService } from '../../../../shared/services/year.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'stc-apps-all-programs',
  templateUrl: './all-programs.component.html',
  styleUrl: './all-programs.component.scss',
})
export class AllProgramsComponent implements OnInit, OnDestroy {
  searchTerm = '';
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = '';
  navItems = [
    {
      name: 'home',
      url: '/home',
      icon: 'fa-home',
      roles: ['APPROVERS,CREATORS'],
      urlHome: '/home',
    },
  ];

  programsProgress: ProgramProgress[] = [];
  filteredItems: ProgramProgress[] = [];
  yearChangeSubscription: Subscription | undefined;
  quarterChangeSubscription: Subscription | undefined;
  constructor(
    private router: Router,
    private programKPIService: ProgramKPIService,
    private sharedForm: SharedFormService,
    private yearService: YearService
  ) {}
  ngOnDestroy(): void {
    this.yearChangeSubscription?.unsubscribe();

    this.quarterChangeSubscription?.unsubscribe();
  }
  ngOnInit(): void {
    const savedYear = this.yearService.getSelectedYear();
    const savedQuarter = this.yearService.getSelectedQuarter();

    if (savedYear && savedQuarter) {
      const year = `${savedYear}`;
      this.sharedForm.getForm().patchValue({ year });
      this.getAllStrategicPrograms();
    }
    this.yearChangeSubscription = this.yearService
      .getYearChangeObservable()
      .subscribe((year: number) => {
        this.getAllStrategicPrograms();
      });
    this.quarterChangeSubscription = this.yearService
      .getQuarterChangeObservable()
      .subscribe((quarter: string) => {
        this.getAllStrategicPrograms();
      });
  }

  search(value: string) {
    if (!value) {
      this.filteredItems = [...this.programsProgress];
    } else {
      this.filteredItems = this.programsProgress.filter((program) =>
        program.programName.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  navigateToProgramDetails(program: any): void {
    this.router.navigate(['/home/programs', program.programName], {
      state: { program: program },
    });
  }

  getAllStrategicPrograms() {
    const year: string = this.sharedForm.getForm().controls['year'].value;
    const quarter: string = this.sharedForm.getForm().controls['quarter'].value;
    const params = {
      quarter: quarter,
      year: year,
    };
    this.programKPIService
      .getAllStrategicPrograms(params)
      .subscribe((result: ProgramKPIDetails[]) => {
        this.programsProgress = this.transformToProgramProgress(result);
        this.filteredItems = [...this.programsProgress];
      });
  }

  transformToProgramProgress(apiData: ProgramKPIDetails[]): ProgramProgress[] {
    return apiData.map((item) => ({
      programName: item.programName,
      barData: {
        prefixText: '',
        prefixValue: 0,
        suffixText: '',
        suffixValue: 0,
        progressValue: +(item.actualValue * 100).toFixed(2),
        indexes: [
          {
            caption: 'Actual',
            value: +(item.actualValue * 100).toFixed(2),
            position: 'up',
          },
          {
            caption: 'Planned',
            value: +(item.target * 100).toFixed(2),
            position: 'down',
          },
        ],
        barColor: this.getColorBasedOnPerformance(
          item.actualValue,
          item.greenThreshold,
          item.redThreshold
        ),
        bgBarColor: this.getColorBasedOnPerformance(
          item.actualValue,
          item.greenThreshold,
          item.redThreshold,
          true
        ),
      },
    }));
  }

  getColorBasedOnPerformance(
    actualValue: number,
    greenThreshold: number,
    redThreshold: number,
    isBackground = false
  ): string {
    if (actualValue >= greenThreshold) {
      return isBackground ? '#00C48C1A' : '#00C48C'; // Green
    } else if (actualValue < redThreshold) {
      return isBackground ? '#c82a271a' : '#c82a27'; // Red
    } else {
      return isBackground ? '#FF6A391A' : '#FF6A39'; // Orange
    }
  }
}

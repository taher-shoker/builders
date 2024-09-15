import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgramKPIService } from '../../services/program-kpi.service';
import { ProgramKPIDetails } from '../../models/program-kpi-details.model';
import { ProgramProgress } from '../../models/program-progress.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
@Component({
  selector: 'stc-apps-all-programs',
  templateUrl: './all-programs.component.html',
  styleUrl: './all-programs.component.scss',
})
export class AllProgramsComponent implements OnInit {
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

  constructor(
    private router: Router,
    private programKPIService: ProgramKPIService
  ) {}
  ngOnInit(): void {
    this.getAllStrategicPrograms();
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
    this.programKPIService
      .getAllStrategicPrograms()
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
    isBackground: boolean = false
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

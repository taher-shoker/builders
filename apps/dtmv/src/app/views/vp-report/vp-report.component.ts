/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MilestonesService,
} from '../milestones-setting/milestones.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DTStream, ReportData } from '../../services/models/milestones.models';

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

  reportData: WritableSignal<ReportData | undefined> = signal(undefined);
  editorContent: string = '<p>This is the content you want to display.</p>';


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

  private watchRoute() {
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

  private setDateInitiallyToCurrentYear() {
    const currentYear = new Date().getFullYear();
    this.filterSelect.get('dateType')?.setValue(currentYear);
  }

  private getAllTeams() {
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

  private getDTStreams() {
    this.milestonesService
      .getDTStreams(this.selectedTeam(), this.selectedYear())
      .subscribe((res) => {
        this.dtStreams.set(res.streams);
        this.streamsYear.set(res.year);
        this.milestoneProgress.set(res.workStreamScore);
        this.reportData.set(res.reportData);
      });
  }

  protected selectTeam(value: string) {
    if (this.selectedTeam() !== value) {
      this.selectedTeam.set(value);
      this.updateRoute(value, this.selectedYear());
    }
  }

  private updateRoute(team: string, year: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { team, year },
      queryParamsHandling: 'merge', // Merge with existing query parameters,
      replaceUrl: true
    });
  }

  protected handleSelectChange(value: string) {
    this.selectedYear.set(Number(value));
    this.updateRoute(this.selectedTeam(), Number(value));
  }

  private yearsArrPopulator() {
    const currentYear = new Date().getFullYear();
    for (
      let i = 2024;
      this.yearsArr[this.yearsArr.length - 1]?.name !== currentYear; // Check if the latest element's value equals the current year's value
      i++
    ) {
      this.yearsArr.push({ name: i, id: i });
    }
  }

  protected goEditPage(){
    // this.router.navigate(["vp-report/edit"], {queryParams: {his: "wefwef"}})
    this.router.navigate(["vp-report/edit"])
  }
}

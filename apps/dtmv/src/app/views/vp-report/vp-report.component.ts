import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MilestonesService } from '../milestones-setting/milestones.service';
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

  months = [
    { id: 1, startDate: '', endDate: '', label: '' },
    { id: 2, startDate: '', endDate: '', label: '' },
    { id: 3, startDate: '', endDate: '', label: '' },
    { id: 4, startDate: '', endDate: '', label: '' },
    { id: 5, startDate: '', endDate: '', label: '' },
    { id: 6, startDate: '', endDate: '', label: '' },
    { id: 7, startDate: '', endDate: '', label: '' },
    { id: 8, startDate: '', endDate: '', label: '' },
    { id: 9, startDate: '', endDate: '', label: '' },
    { id: 10, startDate: '', endDate: '', label: '' },
    { id: 11, startDate: '', endDate: '', label: '' },
    { id: 12, startDate: '', endDate: '', label: '' },
  ];
  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    public milestonesService: MilestonesService,
    public router: Router,
    public route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getAllTeams();
    this.filterSelect = new FormGroup({
      dateType: new FormControl(''),
    });
  }
  getAllTeams() {
    this.milestonesService.setSystemTeams().subscribe((res) => {
      this.allTeams = res;
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
}

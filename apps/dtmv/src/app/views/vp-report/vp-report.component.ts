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
    const currentParams: any = { ...this.route.snapshot.queryParams };
    // Check if the 'team' parameter already exists
    if (currentParams.team === query) {
      // If it exists and matches the provided value, remove it
      delete currentParams.team;
    } else {
      // If it doesn't exist or doesn't match, add it
      currentParams.team = query;
    }
    console.log(currentParams);

    // Update the query parameters of the current URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
      queryParamsHandling: 'merge', // Merge with existing query parameters
    });
  }
  handleSelectChange(value: string) {
    console.log(value);
  }
}

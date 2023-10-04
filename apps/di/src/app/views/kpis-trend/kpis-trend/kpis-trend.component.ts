/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { ProgressCircleData } from '@stc-apps/shared-ui';
import {
  TrendCard,
  UnitSectorGroup,
} from '../../../shared/models/http-response.model';
import { Observable } from 'rxjs';
import { UserRole, UserRoles } from '../../../shared/models/role.model';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'stc-apps-kpis-trend',
  templateUrl: './kpis-trend.component.html',
  styleUrls: ['./kpis-trend.component.scss'],
})
export class KpisTrendComponent implements OnInit {
  @ViewChild('tabz') tabz!: ElementRef;

  dataService = inject(DataService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  data: ProgressCircleData[] = [
    { category: 'TECHNOLOGY DI ', value: 20 },
    { category: 'FU DI', value: 50 },
    { category: 'CLUSTER DI', value: 90 },
  ];

  tabs: string[] = [];
  activeTab: string = '';

  trendCards$!: Observable<TrendCard[]>;
  firstCard?: TrendCard;

  userRoles!: UserRole[];

  ngOnInit(): void {
    this.route.data.subscribe(({roles}) => {

      const userRoles : UserRoles = roles
      this.authService.setUserRoles(userRoles.userGroups[0].roles)

      if (userRoles.userGroups[0].roles[0].roleName === 'ALL') {
        this.tabs = ['BUs', 'FUs', 'Technology'];
      } else {
        this.tabs.push(userRoles.userGroups[0].roles[0].roleName);
      }

      this.activateTab(this.tabs[0]);
    });
  }

  fetchCards() {
    this.firstCard = undefined;

    this.trendCards$ = this.dataService.getLevelOneData(
      this.activeTab as UnitSectorGroup
    );
    this.trendCards$.subscribe((res) => {
      this.firstCard = { ...res[0] };
    });
  }

  activateTab(tabName: string) {
      if (tabName !== this.activeTab) {
      this.activeTab = tabName;
      this.fetchCards();
    }
  }

}

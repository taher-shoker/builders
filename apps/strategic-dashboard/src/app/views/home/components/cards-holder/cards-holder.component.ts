import { YearService } from './../../../../shared/services/year.service';
import { Component, OnInit } from '@angular/core';
import { StrategicGroupsService } from '../../services/strategic-groups.service';
import { StrategicGroup } from '../../models/strategic-group.model';
import { SharedFormService } from '../../../../shared/services/shared-form.service';
import { forkJoin, map, Subject } from 'rxjs';

@Component({
  selector: 'stc-apps-cards-holder',
  templateUrl: './cards-holder.component.html',
  styleUrls: ['./cards-holder.component.scss'],
})
export class CardsHolderComponent implements OnInit {
  activeIndex: number | null = null;
  kpis: any = {};
  strategicGroups: StrategicGroup[] = [];

  constructor(
    private strategicGroupsService: StrategicGroupsService,
    private sharedFormService: SharedFormService,
    private yearService: YearService
  ) {}

  ngOnInit(): void {
    this.getAllStrategicGroups();
    this.yearService.getYearChangeObservable().subscribe((year: number) => {
      this.getAllStrategicGroups();
    });
  }
  getAllStrategicGroups() {
    const params = {
      year: this.sharedFormService.getForm().controls['year'].value,
    };
    this.strategicGroupsService.getAllStrategicGroups(params).subscribe(
      (result: StrategicGroup[]) => {
        this.strategicGroups = result;
      },
      (error) => {
        console.error('Error fetching strategic groups:', error);
      }
    );
  }

  getCurrentContents(index: number): any[] {
    let allContents: any[] = [];

    for (let i = 0; i <= index; i++) {
      const kpi = this.strategicGroups[i];
      if (kpi) {
        if (Array.isArray(kpi)) {
          allContents.push(...kpi);
        } else {
          allContents.push(kpi);
        }
      }
    }
    return allContents;
  }

  onCardHover(index: number) {
    this.activeIndex = index;
  }

  onCardLeave() {
    this.activeIndex = null;
  }
}

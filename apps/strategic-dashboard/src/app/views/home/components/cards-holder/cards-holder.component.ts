import { YearService } from './../../../../shared/services/year.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { StrategicGroupsService } from '../../services/strategic-groups.service';
import { StrategicGroup } from '../../models/strategic-group.model';
import { SharedFormService } from '../../../../shared/services/shared-form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'stc-apps-cards-holder',
  templateUrl: './cards-holder.component.html',
  styleUrls: ['./cards-holder.component.scss'],
})
export class CardsHolderComponent implements OnInit, OnDestroy {
  activeIndex: number | null = null;
  kpis: any = {};
  strategicGroups: StrategicGroup[] = [];
  yearChangeSubscription: Subscription | undefined;

  constructor(
    private strategicGroupsService: StrategicGroupsService,
    private sharedFormService: SharedFormService,
    private yearService: YearService
  ) {}

  ngOnDestroy(): void {
    if (this.yearChangeSubscription) {
      this.yearChangeSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    const savedYear = this.yearService.getSelectedYear();
    const savedQuarter = this.yearService.getSelectedQuarter();

    // // if (savedYear) {
    const year = `${savedYear}-${savedQuarter}`;
    this.sharedFormService.getForm().patchValue({ year });
    this.getAllStrategicGroups();
    // }
    this.yearChangeSubscription = this.yearService
      .getYearChangeObservable()
      .subscribe((year: number) => {
        this.getAllStrategicGroups();
      });
  }

  getAllStrategicGroups() {
    const year: string =
      this.sharedFormService.getForm().controls['year'].value;

    // console.log(year.split('-')[0], 'year');

    const params = {
      year: year.split('-')[0],
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
    // eslint-disable-next-line prefer-const
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

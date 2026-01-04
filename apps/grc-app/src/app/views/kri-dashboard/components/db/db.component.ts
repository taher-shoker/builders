import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DbDataModel, IStatusSummary } from '../../../../models/db';
import { AvailablePeriodModel } from '../../../../models/executive-summary';
import { DbService } from '../../../../services/db.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'stc-apps-db',
  standalone: false,
  templateUrl: './db.component.html',
  styleUrl: './db.component.scss',
})
export class DbComponent implements OnInit, OnDestroy {
  periods = input.required<AvailablePeriodModel[]>();
  years = input.required<number[]>();
  gd = input.required<string>();
  quarters: { name: string; id: number | string }[] = [];
  quarterTypes: { name: string; id: number }[] = [];
  yearsdata: { name: string; id: number }[] = [];
  unacceptableData: { name: string; value: string }[] = [];
  statusLegends: { name: string; color: string }[] = [];
  dbService = inject(DbService);
  dbKRIsData!: DbDataModel;
  endSubs$: Subject<void> = new Subject<void>();
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  overallStatuses: {
    name: string;
    acceptable: number;
    tolerable: number;
    unacceptable: number;
    unclassified: number;
  }[] = [];
  statisticsData!: {
    totalKRIs: number;
    acceptableKRIs: number;
    tolerableKRIs: number;
    unacceptableKRIs: number;
  };
  filtersForm: FormGroup = new FormGroup({
    quarter: new FormControl('Q1'),
    quarterType: new FormControl('Quarter'),
    year: new FormControl(new Date().getFullYear()),
    unacceptable: new FormControl('Acceptable'),
  });
  isQuarterTypeMonth = false;
  onChangeValue() {
    const quarterTypeVal = this.filtersForm.get('quarterType')?.value;
    const quarter = this.filtersForm.get('quarter')?.value;
    if (quarterTypeVal === 'Month') {
      this.quarters = [];
      const filteredPeriod = this.periods().filter(
        (p) => p.year === this.filtersForm.get('year')?.value
      );
      filteredPeriod.forEach((period) => {
        this.quarters.push({
          name: period.month.slice(0, 3),
          id: period.month,
        });
      });
      const isCurrentValueValid = this.quarters.some((q) => q.name === quarter);
      if (!isCurrentValueValid) {
        this.filtersForm.get('quarter')?.setValue('Jan');
      }
      this.isQuarterTypeMonth = true;
    } else {
      this.quarters = [];
      const filteredPeriod = this.periods().filter(
        (p) => p.year === this.filtersForm.get('year')?.value
      );
      const seen = new Set<string>();
      filteredPeriod.forEach((period) => {
        if (!seen.has(period.quarter)) {
          seen.add(period.quarter);
          this.quarters.push({
            name: period.quarter,
            id: this.quarters.length + 1,
          });
        }
      });
      const isCurrentValueValid = this.quarters.some((q) => q.name === quarter);
      if (!isCurrentValueValid) {
        this.filtersForm.get('quarter')?.setValue('Q1');
      }
      this.isQuarterTypeMonth = false;
    }
    this.getDPData();
  }
  ngOnInit(): void {
    this.quarters = [
      { name: 'Q1', id: 1 },
      { name: 'Q2', id: 2 },
      { name: 'Q3', id: 3 },
      { name: 'Q4', id: 4 },
    ];
    this.quarterTypes = [
      { name: 'Quarter', id: 1 },
      { name: 'Month', id: 2 },
    ];
    this.unacceptableData = [
      { name: 'Acceptable First', value: 'Acceptable' },
      { name: 'Unacceptable First', value: 'Unacceptable' },
      { name: 'Tolerable First', value: 'Tolerable' },
      { name: 'Unclassified First', value: 'Unclassified' },
    ];
    this.statusLegends = [
      {
        name: 'Acceptable',
        color: '#22C55E',
      },
      {
        name: 'tolerable',
        color: '#EAB308',
      },
      {
        name: 'Unclassified',
        color: '#64748B',
      },
      {
        name: 'unacceptable',
        color: '#EF4444',
      },
    ];
    this.statisticsData = {
      totalKRIs: 100,
      acceptableKRIs: 65,
      tolerableKRIs: 25,
      unacceptableKRIs: 10,
    };
    if (this.years().length !== 0) {
      this.years().forEach((year) => {
        this.yearsdata.push({ name: year.toString(), id: year });
      });
      if (this.yearsdata.length > 0) {
        this.filtersForm.get('year')?.setValue(this.yearsdata[0].id);
      }
    }
    if (this.periods().length > 0) {
      this.quarters = [];
      const filteredPeriod = this.periods().filter(
        (p) => p.year === this.filtersForm.get('year')?.value
      );
      const seen = new Set<string>();
      filteredPeriod.forEach((period) => {
        if (!seen.has(period.quarter)) {
          seen.add(period.quarter);
          this.quarters.push({
            name: period.quarter,
            id: this.quarters.length + 1,
          });
        }
      });
    }
    this.getDPData();
  }
  totalKRIs = 0;
  totalUnacceptable = 0;
  totalTolerable = 0;
  totalAcceptable = 0;
  totalUnclassified = 0;
  private getDPData(): void {
    const year = this.filtersForm.get('year')?.value;
    const period = this.filtersForm.get('quarter')?.value;
    const gd = this.gd();
    const sort = this.filtersForm.get('unacceptable')?.value;
    console.log(year, period, gd);
    this.overallStatuses = [];
    this.dbService
      .getKriTapsDetails(year, period, gd, sort, 'quarterly')
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (response: DbDataModel) => {
          console.log('KRI Status Summary Response:', response);
          this.dbKRIsData = response;
          this.dbKRIsData.statusSummary.forEach((status) => {
            if (status.status.toLowerCase() === 'acceptable') {
              this.overallStatuses[0] = {
                ...this.overallStatuses[0],
                acceptable: status.count,
                name: '',
              };
            } else if (status.status.toLowerCase() === 'tolerable') {
              this.overallStatuses[0] = {
                ...this.overallStatuses[0],
                tolerable: status.count,
                name: '',
              };
            } else if (status.status.toLowerCase() === 'unacceptable') {
              this.overallStatuses[0] = {
                ...this.overallStatuses[0],
                unacceptable: status.count,
                name: '',
              };
            } else {
              this.overallStatuses[0] = {
                ...this.overallStatuses[0],
                unclassified: status.count,
                name: '',
              };
            }
          });
          this.totalKRIs = response.statusSummary[0].total;
          this.totalAcceptable = response.statusSummary.find(
            (s) => s.status.toLowerCase() === 'acceptable'
          )?.count as number;
          this.totalTolerable = response.statusSummary.find(
            (s) => s.status.toLowerCase() === 'tolerable'
          )?.count as number;
          this.totalUnacceptable = response.statusSummary.find(
            (s) => s.status.toLowerCase() === 'unacceptable'
          )?.count as number;
          this.totalUnclassified = response.statusSummary.find(
            (s) => s.status.toLowerCase() === 'unclassified'
          )?.count as number;
        },
        error: (error) => {
          console.error('Error fetching KRI Status Summary:', error);
        },
      });
  }
}

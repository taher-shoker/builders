import {
  Component,
  computed,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { LineChartData } from '@stc-apps/shared-ui';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'stc-apps-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent implements OnInit {
  selectedTab: WritableSignal<string> = signal('ColumnChart');
  title: InputSignal<string> = input('');
  unit: WritableSignal<string> = signal('');
  selectedYearRange: InputSignal<{ start: number; end: number }> = input({
    start: 2000,
    end: 2024,
  });
  strategicGroup: InputSignal<
    { values: { year: number; actualValue: number; target: number }[] } | any
  > = input([]);
  actualValue = '';
  thresholds = {
    green: 0,
    orange: 0,
    red: 0,
  };
  constructor(private cookieService: CookieService) {}
  ngOnInit(): void {
    //console.log('strategic group', this.strategicGroup());
    const selcetedYear = this.cookieService.get('selectedYear');
    const firstOccurrence = this.strategicGroup().values.filter(
      (obj: any) => obj.year === +selcetedYear!
    )[0];
    console.log(firstOccurrence, selcetedYear);
    if (firstOccurrence !== undefined) {
      this.actualValue = firstOccurrence.actualValue as string;
      this.thresholds = {
        green: firstOccurrence.greenThreshold,
        orange: firstOccurrence.orangeThreshold,
        red: firstOccurrence.redThreshold,
      };
    }

    this.extractUnit();
  }

  handleChangeTab(value: any) {
    this.selectedTab.set(value);
  }

  extractUnit() {
    const values = this.strategicGroup().values;
    if (values.length > 0) {
      this.unit.set(values[0].unit);
    }
  }

  //Hold the line of the data
  lineChartData = computed(() => {
    const strategicGroupData = this.strategicGroup();
    const { start, end } = this.selectedYearRange();
    let processedData: { name: string; data: LineChartData[] }[] = [];

    if (strategicGroupData && Array.isArray(strategicGroupData.values)) {
      const filteredValues = strategicGroupData.values.filter(
        (value: any) => value.year >= start && value.year <= end
      );

      const groupedData = filteredValues.reduce(
        (
          acc: { [key: number]: { target: number[]; actualValue: number[] } },
          value: any
        ) => {
          if (!acc[value.year]) {
            acc[value.year] = { target: [], actualValue: [] };
          }
          acc[value.year].target.push(value.target || 0);
          acc[value.year].actualValue.push(value.actualValue || 0);
          return acc;
        },
        {}
      );

      const targetSeries: LineChartData[] = [];
      const actualSeries: LineChartData[] = [];

      Object.keys(groupedData).forEach((yearStr: string) => {
        const year = parseInt(yearStr);
        const targetValues = groupedData[year].target;
        const actualValues = groupedData[year].actualValue;

        if (targetValues.length > 0 || actualValues.length > 0) {
          targetValues.forEach((targetValue: any) => {
            targetSeries.push({
              category: new Date(year, 0, 1),
              value: targetValue,
            });
          });

          actualValues.forEach((actualValue: any) => {
            actualSeries.push({
              category: new Date(year, 0, 1),
              value: actualValue,
            });
          });
        }
      });

      processedData = [
        { name: `Actual ${this.unit()}`, data: actualSeries },
        { name: `Target ${this.unit()}`, data: targetSeries },
       
      ];
    }

    return processedData;
  });

  columnChartData = computed(() => {
    const strategicGroupData = this.strategicGroup();
    const { start, end } = this.selectedYearRange();
    let processedData: { year: number; Actual: number; Target: number }[] = [];

    if (strategicGroupData && Array.isArray(strategicGroupData.values)) {
      const filteredValues = strategicGroupData.values.filter(
        (value: any) => value.year >= start && value.year <= end
      );

      processedData = filteredValues.map((value: any) => ({
        year: value.year,
        Actual: value.actualValue,
        Target: value.target,
      }));
    }

    return processedData;
  });
  colors=['#45006F','#D2D7D9']
  lineChartColors = ['#D2D7D9', '#45006F'];
}

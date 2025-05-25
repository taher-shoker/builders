import { Component, effect, input, InputSignal } from '@angular/core';
import { sqlData } from '../../views/chat-view/models/chat-view.model';

@Component({
  selector: 'app-chart-controller',
  templateUrl: './chartController.component.html',
  styleUrl: './chartController.component.scss',
})
export class ChartControllerComponent {
  showType: InputSignal<string> = input('');
  sqlData: InputSignal<sqlData> = input({} as sqlData);
  chartData: any[] = [];
  pieChartData: any[] | undefined = [];
  indicators: any[] = [];
  popUpClick: InputSignal<boolean> = input(false);
  constructor() {
    effect(() => {
      if (!this.sqlData()) {
        return;
      }

      if (this.showType() == 'pie') {
        this.pieChartData = this.handlePieChartData();
      } else if (this.showType() == 'bar') {
        this.chartData = this.handleBarChartData();
        this.sqlData()?.yList.map((item) => {
          if (item.indicatorName !== 'state date')
            this.indicators.push({
              indicatorName: item.indicatorName,
              unit: item.unit,
            });
        });
      } else if (this.showType() == 'table') {
        this.chartData = this.handleTableData();
      } else if (this.showType() == 'line') {
        console.log('line', this.handleLineChartData());

        this.chartData = this.handleLineChartData();
      }
    });
  }
  handleBarChartData(): any[] {
    const combined = this.sqlData()?.xList.map((x, index) => {
      const entry: any = { xaxis: x };
      const yIndex = this.sqlData().yList[index];
      if (yIndex.indicatorName !== 'state date') {
        entry[yIndex.indicatorName.replace(/\s+/g, '')] = +yIndex.data;
      }

      return entry;
    });
    return combined;
  }
  handleTableData(): any[] {
    const data: any = this.sqlData().rows?.map((row) => {
      const transformedRow: any = {};
      for (const key in row) {
        // const newKey = key.replace(/ /g, '_');
        transformedRow[key] = row[key];
      }
      return transformedRow;
    });
    return data;
  }
  handleLineChartData(): any[] {
    const values = this.sqlData().xList.map((date, index) => {
      const entry: any = {
        x: date,
      };
      console.log(this.sqlData().xListKey);

      const yItem = this.sqlData().yList.find(
        (y) => y[this.sqlData().xListKey ?? ''] === date
      );
      if (yItem) {
        entry['value'] = yItem.value;
        entry['indicatorName'] = yItem.indicatorName;
      }
      return entry;
    });

    return values;
  }
  handlePieChartData(): any[] | undefined {
    const chartArray = this.sqlData()?.data?.map((listItem) => {
      return {
        value: listItem.value,
        category: listItem.indicatorName,
      };
    });
    return chartArray;
  }
}

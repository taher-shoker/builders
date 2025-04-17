import { Component, effect, input, InputSignal } from '@angular/core';
import { sqlData } from '../../views/chat-view/models/chatModel';

@Component({
  selector: 'stc-apps-chart-controller',
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
        console.log('pie', this.sqlData(), this.pieChartData);
      } else if (this.showType() == 'bar') {
        console.log('bar');
        this.chartData = this.handleBarChartData();
        this.sqlData()?.yList.map((item) => {
          if (item.indicatorName !== 'state date')
            this.indicators.push({
              indicatorName: item.indicatorName,
              unit: item.unit,
            });
        });
      } else if (this.showType() == 'table') {
        console.log('table', this.handleTableData());

        this.chartData = this.handleTableData();
      } else if (this.showType() == 'line') {
        this.chartData = this.handleLineChartData();
      }
    });
  }
  handlePieChartData(): any[] | undefined {
    console.log(this.sqlData().data);

    const chartArray = this.sqlData()?.data?.map((listItem) => {
      return {
        value: listItem.value,
        category: listItem.indicatorName,
      };
    });
    return chartArray;
  }
  handleBarChartData(): any[] {
    const combined = this.sqlData()?.xList.map((x, index) => {
      const entry: any = { xaxis: x };
      this.sqlData()?.yList.forEach(({ indicatorName, data }) => {
        if (indicatorName !== 'state date') {
          entry[indicatorName.replace(/\s+/g, '')] = +data[index];
        }
      });

      return entry;
    });
    return combined;
  }
  handleLineChartData(): any[] {
    const values = this.sqlData().xList.map((date, index) => {
      // const fullDate = `${date}`;
      // const yListKey = this.sqlData()?.yListKey ?? 'time';
      // const entry = this.sqlData().yList.find(
      //   (item) => item[yListKey] === fullDate
      // );

      return {
        x: date,
        value: +this.sqlData().yList[0].data[index],
      };
    });
    return values;
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
}

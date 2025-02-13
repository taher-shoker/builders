import {
  Component,
  effect,
  HostListener,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'stc-apps-table-chart',
  templateUrl: './tableChart.component.html',
  styleUrl: './tableChart.component.scss',
})
export class TableChartComponent implements OnInit {
  tableData: InputSignal<any[]> = input([{}]);
  chartTitle: InputSignal<string> = input('');
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  isMobileScreen = false;
  constructor() {
    effect(() => {
      if (this.tableData() && this.tableData().length > 0) {
        this.dataSource = this.tableData();
        this.displayedColumns = Object.keys(this.dataSource[0]);
      }
    });
  }
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }
  ngOnInit() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileScreen = window.innerWidth <= 768;
  }
}
